import type { Page } from '@playwright/test';

/** Vehicle search combobox and the options it lists. */
export const vehicleSearchLocators = (page: Page) => {
  const optionsList = page.getByRole('listbox', { name: 'menu-options' });

  return {
    searchInput: page.getByRole('combobox', { name: 'Ingresa Marca Año Modelo Submarca y Versión' }),
    options: optionsList.getByRole('option'),
  };
};
