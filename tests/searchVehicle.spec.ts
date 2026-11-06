import { test, expect } from '@playwright/test';
import { searchVehicleData } from '../data/search.data';
import { QuoterPage } from '../pages/quoter.page';

test.describe(
  'REQ-01 Vehicle search',
  {
    tag: '@REQ-01',
    annotation: {
      type: 'description',
      description:
        '**Objective:** validate that the options for the vehicle brand and model entered are displayed.\n\n' +
        '**Expected result:** the options defined in the requirement are displayed.',
    },
  },
  () => {
    for (const { id, vehicleTerm, expectedVehicleOptions } of searchVehicleData) {
      test(`${id} lists the options for "${vehicleTerm}"`, async ({ page }) => {
        const quoter = new QuoterPage(page);

        await quoter.open();
        await quoter.searchVehicle(vehicleTerm);

        await expect(quoter.locators.options).toHaveText([...expectedVehicleOptions]);
      });
    }
  },
);
