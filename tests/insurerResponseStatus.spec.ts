import { test, expect } from '@playwright/test';
import { createContact } from '../data/contact.data';
import { INSURER_STATUS_SCENARIOS } from '../data/quotes.data';
import { ContactFormPage } from '../pages/contact-form.page';
import { QuoteResultsPage, type InsurerStatus } from '../pages/quote-results.page';
import { QuoterPage } from '../pages/quoter.page';

test.describe(
  'REQ-02/03 Insurer response status (quoted / not quoted)',
  {
    annotation: {
      type: 'description',
      description:
        '**Objective:** validate which insurers are displayed in the quote ' +
        '(REQ-03 uses a brand-new vehicle with an invoice value).\n\n' +
        '**Expected result:** a report of which insurers responded. All of them should quote: ' +
        'Qualitas, Momento, ANA, GNP, Chubb, Atlas, HDI and Axa.',
    },
  },
  () => {
    for (const scenario of INSURER_STATUS_SCENARIOS) {
      const { id, title, vehicle, postalCode, invoiceValue, coverage, payment, expectedInsurers } = scenario;

      test(`${id} ${title}`, { tag: `@${id}` }, async ({ page }, testInfo) => {
        test.slow(); // A quote waits for every insurer to answer.

        const quoter = new QuoterPage(page);
        const contactForm = new ContactFormPage(page);
        const results = new QuoteResultsPage(page);

        await quoter.open();
        await quoter.searchVehicle(vehicle.searchTerm);
        await quoter.selectFirstVehicle();

        await contactForm.fill(createContact(), postalCode, invoiceValue);
        await contactForm.submit();

        await results.selectCoverage(coverage);
        await results.selectPayment(payment);
        const insurers = await results.readInsurerStatus(expectedInsurers);

        await testInfo.attach('insurer-report.md', { body: toMarkdownTable(insurers), contentType: 'text/markdown' });

        for (const { insurer, premium } of insurers) {
          expect.soft(premium, `${insurer} should be displayed in the quote`).not.toBeNull();
        }
      });
    }
  },
);

/** Report of which insurers quoted, attached to the test so it shows up in Allure. */
function toMarkdownTable(insurers: InsurerStatus[]): string {
  return [
    '| Insurer | Quoted | Premium |',
    '| --- | --- | --- |',
    ...insurers.map(({ insurer, premium }) => `| ${insurer} | ${premium ? 'Yes' : 'No'} | ${premium ?? '-'} |`),
  ].join('\n');
}
