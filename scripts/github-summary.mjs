// Writes a Markdown test summary to the GitHub Actions job summary page.
// Input: the Playwright JSON reporter output (see playwright.config.ts).
// Usage: node scripts/github-summary.mjs [path/to/playwright-results.json]
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const reportPath = process.argv[2] ?? 'reports/playwright-results.json';
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const allureReportUrl = process.env.ALLURE_REPORT_URL;

const STATUS_LABEL = {
  expected: '✅ Passed',
  unexpected: '❌ Failed',
  flaky: '⚠️ Flaky',
  skipped: '⏭️ Skipped',
};

if (!summaryPath) {
  console.log('GITHUB_STEP_SUMMARY is not set; skipping job summary.');
  process.exit(0);
}

const write = (markdown) => appendFileSync(summaryPath, `${markdown}\n`);

if (!existsSync(reportPath)) {
  write(`## Playwright results\n\n⚠️ No Playwright report found at \`${reportPath}\`.`);
  process.exit(0);
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'));

function* collectTests(suite, parentTitles = []) {
  const titles = suite.title ? [...parentTitles, suite.title] : parentTitles;
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      yield { title: [...titles, spec.title].join(' › '), file: spec.file, line: spec.line, test };
    }
  }
  for (const child of suite.suites ?? []) {
    yield* collectTests(child, titles);
  }
}

const firstErrorLine = (test) => {
  const message = test.results.at(-1)?.error?.message ?? '';
  // Strip ANSI colors and keep table cells on a single line.
  const line = message.replace(/\u001b\[[0-9;]*m/g, '').split('\n').find(Boolean) ?? '';
  return line.replaceAll('|', '\\|').slice(0, 200);
};

const formatDuration = (ms) => `${(ms / 1000).toFixed(1)}s`;

// Root suites are titled after the spec file, which the Location column already shows.
const tests = report.suites.flatMap((fileSuite) => [...collectTests({ ...fileSuite, title: '' })]);
const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = report.stats;
const total = expected + unexpected + flaky + skipped;
const headline = unexpected > 0 ? '❌ Some tests failed' : '✅ All tests passed';

const lines = [
  '## Playwright results',
  '',
  `**${headline}** · ${total} tests · ${formatDuration(duration)}`,
  '',
  '| Passed | Failed | Flaky | Skipped |',
  '| :---: | :---: | :---: | :---: |',
  `| ${expected} | ${unexpected} | ${flaky} | ${skipped} |`,
];

if (allureReportUrl) {
  lines.push('', `📊 [Allure HTML report](${allureReportUrl})`);
}

const problems = tests.filter(({ test }) => test.status === 'unexpected' || test.status === 'flaky');
if (problems.length > 0) {
  lines.push(
    '',
    '### Failed and flaky tests',
    '',
    '| Status | Project | Test | Location | Error |',
    '| --- | --- | --- | --- | --- |',
    ...problems.map(
      ({ title, file, line, test }) =>
        `| ${STATUS_LABEL[test.status]} | ${test.projectName} | ${title} | \`${file}:${line}\` | ${firstErrorLine(test)} |`,
    ),
  );
}

write(lines.join('\n'));
