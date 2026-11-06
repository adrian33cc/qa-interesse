import { test, expect } from '@playwright/test';
import { searchVehicleData } from '../data/search.data';
import { QuoterPage } from '../pages/quoter.page';

test.describe('Vehicle search', () => {
  for (const { id, vehicleTerm, expectedVehicleOptions } of searchVehicleData) {
    test(`${id} lists the options for "${vehicleTerm}"`, async ({ page }) => {
      const quoter = new QuoterPage(page);

      await quoter.open();
      await quoter.searchVehicle(vehicleTerm);

      await expect(quoter.locators.options).toHaveText([...expectedVehicleOptions]);
    });
  }
});
