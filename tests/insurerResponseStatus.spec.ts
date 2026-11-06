import { test, expect } from '@playwright/test';
import { createContact } from '../data/contact.data';
import { INSURER_STATUS_SCENARIOS } from '../data/quotes.data';
import { ContactFormPage } from '../pages/contact-form.page';
import { QuoteResultsPage, type InsurerStatus } from '../pages/quote-results.page';
import { QuoterPage } from '../pages/quoter.page';

// Requirement 2 only. REQ-03 (brand-new car with invoice value) is not covered yet.
const scenarios = INSURER_STATUS_SCENARIOS.filter(({ id }) => id === 'REQ-02');

test.describe('Insurer response status', () => {
  for (const { id, title, vehicle, postalCode, coverage, payment, expectedInsurers } of scenarios) {
    test(`${id} ${title}`, async ({ page }, testInfo) => {
      test.slow(); // A quote waits for every insurer to answer.

      const quoter = new QuoterPage(page);
      const contactForm = new ContactFormPage(page);
      const results = new QuoteResultsPage(page);

      await quoter.open();
      await quoter.searchVehicle(vehicle.searchTerm);
      await quoter.selectFirstVehicle();

      await contactForm.fill(createContact(), postalCode);
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
});

/** Report of which insurers quoted, attached to the test so it shows up in Allure. */
function toMarkdownTable(insurers: InsurerStatus[]): string {
  return [
    '| Insurer | Quoted | Premium |',
    '| --- | --- | --- |',
    ...insurers.map(({ insurer, premium }) => `| ${insurer} | ${premium ? 'Yes' : 'No'} | ${premium ?? '-'} |`),
  ].join('\n');
}
