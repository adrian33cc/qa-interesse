import { test, expect } from '@playwright/test';
import { createContact } from '../data/contact.data';
import { OPTIONAL_COVERAGE_SCENARIOS } from '../data/coverage.data';
import { ContactFormPage } from '../pages/contact-form.page';
import { OptionalCoveragesPage } from '../pages/optional-coverages.page';
import { QuoteResultsPage } from '../pages/quote-results.page';
import { QuoterPage } from '../pages/quoter.page';

test.describe(
  'REQ-04/05 Optional coverages and premium recalculation',
  {
    tag: '@flaky',
    annotation: {
      type: 'description',
      description:
        '**Objective:** validate that optional coverages can be added, selected and re-quoted.\n\n' +
        '**Expected result:** the updated premium is displayed after clicking "Recotizar".\n\n' +
        '**Known issue (flaky):** in UAT "Añadir coberturas" stays disabled at random, because the quoter ' +
        'does not always count every insurer answer as completed. ANA enabled it in about half of the runs; ' +
        'Qualitas was never seen enabled.',
    },
  },
  () => {
    // A run where "Añadir coberturas" stays disabled is retried; passing on a retry reports the test as flaky.
    test.describe.configure({ retries: 2 });

    for (const scenario of OPTIONAL_COVERAGE_SCENARIOS) {
      const { id, title, vehicle, postalCode, coverage, payment, insurer, optionalCoverages } = scenario;

      test(`${id} ${title}`, { tag: `@${id}` }, async ({ page }, testInfo) => {
        test.slow(); // A quote waits for every insurer to answer.

        const quoter = new QuoterPage(page);
        const contactForm = new ContactFormPage(page);
        const results = new QuoteResultsPage(page);
        const coveragesPanel = new OptionalCoveragesPage(page);
        const { premiumWithCoverages, optionalCoveragesCost } = coveragesPanel.locators;

        await quoter.open();
        await quoter.searchVehicle(vehicle.searchTerm);
        await quoter.selectFirstVehicle();

        await contactForm.fill(createContact(), postalCode);
        await contactForm.submit();

        await results.selectCoverage(coverage);
        await results.selectPayment(payment);

        // The button stays disabled until the quoter has counted the answer of every insurer.
        await expect(
          results.locators.addCoveragesButton(insurer.logoId),
          `"Añadir coberturas" for ${insurer.name} should become enabled once quoting finishes`,
        ).toBeEnabled({ timeout: 45_000 });
        const basePremium = await results.locators.insurerPremium(insurer.logoId).innerText();

        await results.openOptionalCoverages(insurer.logoId);
        await coveragesPanel.select(optionalCoverages);
        await coveragesPanel.recalculate();

        await expect(
          premiumWithCoverages,
          `${insurer.name} should display the premium with coverages after "Recotizar"`,
        ).toHaveText(/\$\s?[\d,]+/, { timeout: 30_000 });
        await expect(
          premiumWithCoverages,
          `${insurer.name} premium with coverages should be updated (base premium ${basePremium})`,
        ).not.toHaveText(basePremium);

        await testInfo.attach('premium-recalculation.md', {
          body: [
            '| Base premium | Optional coverages | Premium with coverages |',
            '| --- | --- | --- |',
            `| ${basePremium} | ${await optionalCoveragesCost.innerText()} | ${await premiumWithCoverages.innerText()} |`,
          ].join('\n'),
          contentType: 'text/markdown',
        });
      });
    }
  },
);
