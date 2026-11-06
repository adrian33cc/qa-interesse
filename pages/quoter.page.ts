import type { Page } from '@playwright/test';
import { vehicleSearchLocators } from '../locators/locator';

const QUOTER_PATH = '/autocotiza/interesse';
const CONFIG_ENDPOINT = '/autocotiza/loadconfig/';

/** Quoter landing page: vehicle search. Actions only, assertions live in the tests. */
export class QuoterPage {
  readonly locators;

  constructor(private readonly page: Page) {
    this.locators = vehicleSearchLocators(page);
  }

  /** Opens the quoter and waits for its config; the search input ignores typing until then. */
  async open(): Promise<void> {
    const configLoaded = this.page.waitForResponse((response) => response.url().includes(CONFIG_ENDPOINT));
    await this.page.goto(QUOTER_PATH);
    await configLoaded;
  }

  async searchVehicle(term: string): Promise<void> {
    await this.locators.searchInput.fill(term);
  }
}
