import type { Locator, Page } from '@playwright/test';
import type { InsurerDefinition } from '../data/insurers.data';
import type { CoveragePackage, PaymentMethod } from '../data/quotes.data';
import { quoteResultsLocators } from '../locators/locator';

export interface InsurerStatus {
  readonly insurer: string;
  /** Premium shown on the insurer card, or null when the insurer did not quote. */
  readonly premium: string | null;
}

/** Results page with one card per insurer that quoted. Actions and reads only, assertions live in the tests. */
export class QuoteResultsPage {
  readonly locators;

  constructor(page: Page) {
    this.locators = quoteResultsLocators(page);
  }

  async selectCoverage(coverage: CoveragePackage): Promise<void> {
    await this.selectIfChanged(this.locators.coverageSelect, coverage);
  }

  async selectPayment(payment: PaymentMethod): Promise<void> {
    await this.selectIfChanged(this.locators.paymentSelect, payment);
  }

  /** Reads every insurer card in parallel. A card that does not show up in time means "not quoted". */
  async readInsurerStatus(insurers: readonly InsurerDefinition[], timeout = 30_000): Promise<InsurerStatus[]> {
    return Promise.all(
      insurers.map(async ({ name, logoId }) => ({ insurer: name, premium: await this.readPremium(logoId, timeout) })),
    );
  }

  /** Selecting any option, even the current one, re-quotes every insurer, so it only changes when needed. */
  private async selectIfChanged(select: Locator, label: string): Promise<void> {
    const current = await select.locator('option:checked').textContent();
    if (current?.trim() !== label) {
      await select.selectOption({ label });
    }
  }

  private async readPremium(logoId: string, timeout: number): Promise<string | null> {
    const premium = this.locators.insurerPremium(logoId);
    try {
      await premium.waitFor({ timeout });
      return (await premium.innerText()).trim();
    } catch {
      return null;
    }
  }
}
