import type { Page } from '@playwright/test';
import type { OptionalCoverage } from '../data/coverage.data';
import { optionalCoveragesLocators } from '../locators/locator';

/** "Añadir coberturas" panel: pick optional coverages and re-quote. Actions only, assertions live in the tests. */
export class OptionalCoveragesPage {
  readonly locators;

  constructor(page: Page) {
    this.locators = optionalCoveragesLocators(page);
  }

  /** Checks the coverages in order: a "Robo Parcial" checkbox is what enables its amount radios. */
  async select(coverages: readonly OptionalCoverage[]): Promise<void> {
    for (const { kind, label } of coverages) {
      const control = kind === 'radio' ? this.locators.radio(label) : this.locators.checkbox(label);
      await control.check();
    }
  }

  async recalculate(): Promise<void> {
    await this.locators.recalculateButton.click();
  }
}
