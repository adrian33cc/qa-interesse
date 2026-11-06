# Interesse QA — E2E tests

End-to-end test suite for the Interesse car insurance quoter, built with Playwright + TypeScript and reported with Allure. Tests run against the UAT environment (`https://i365-uat.interesse.com.mx`) on Chromium.

📊 **Latest test report (Allure):** [adrian33cc.github.io/qa-interesse](https://adrian33cc.github.io/qa-interesse/)

## Quick start

Requirements: Node.js LTS and pnpm.

```bash
pnpm install
```

```bash
pnpm exec playwright install --with-deps chromium
```

```bash
pnpm test
```

Every test runs even if another one fails — the goal is to surface all defects in a single run.

## What is tested

| Requirement | Spec | Checks |
|-------------|------|--------|
| REQ-01 | `tests/searchVehicle.spec.ts` | Searching a brand/model lists the expected vehicle options. |
| REQ-02 | `tests/insurerResponseStatus.spec.ts` | Nissan Versa 2023 (Amplia, Contado): every expected insurer returns a quote. |
| REQ-03 | `tests/insurerResponseStatus.spec.ts` | Mazda CX-30 2026, brand-new with invoice value: every expected insurer returns a quote. |
| REQ-04 | `tests/optionalCoverages.spec.ts` | Qualitas: add optional coverages and re-quote; the premium updates. |
| REQ-05 | `tests/optionalCoverages.spec.ts` | ANA: add optional coverages and re-quote; the premium updates. |

Expected insurers: Qualitas, Momento, ANA, GNP, Chubb, Atlas, HDI and Axa.

## Run a subset

Each test is tagged with its requirement ID.

```bash
pnpm test --grep @REQ-01
```

```bash
pnpm test --grep-invert @flaky
```

## Reports

| Where | How |
|-------|-----|
| Local | `pnpm report` opens the Allure report from `allure-results/`. |
| Local (single HTML file) | `pnpm exec allure awesome allure-results --single-file --output allure-report` |
| CI (public) | Latest `main` report on GitHub Pages: <https://adrian33cc.github.io/qa-interesse/> |
| CI (signed in) | Download the `allure-report` artifact from the workflow run, or read the job summary. |

Failed tests attach a screenshot. On CI, failed tests retry and record a trace on the first retry.

## Project structure

| Folder | Purpose |
|--------|---------|
| `tests/` | Specs, one per requirement group. |
| `pages/` | Page objects (quoter, contact form, quote results, optional coverages). |
| `locators/` | Selectors, kept apart from page logic. |
| `data/` | Test data and scenarios (vehicles, insurers, quotes, coverages, contact). |
| `scripts/` | `github-summary.mjs` builds the GitHub Actions job summary. |

## CI

`.github/workflows/playwright.yml` runs on every push and pull request to `main`:

1. Install dependencies and Chromium.
2. Run the suite (2 retries, 1 worker).
3. Generate a single-file Allure report and upload it as an artifact (30 days).
4. On pushes, deploy that report to GitHub Pages, even when tests fail. Each push replaces the previous report.
5. Publish a results summary on the job page.

Artifacts and job summaries require a GitHub login, even on a public repository. The GitHub Pages URL does not.

## Known issues

REQ-04/05 are tagged `@flaky`. In UAT the "Añadir coberturas" button stays disabled at random because the quoter does not always count every insurer answer as completed. ANA enabled it in about half of the runs; Qualitas was never seen enabled. These specs retry up to 2 times.
