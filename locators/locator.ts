import type { Page } from '@playwright/test';

/** Vehicle search combobox and the options it lists. */
export const vehicleSearchLocators = (page: Page) => {
  const optionsList = page.getByRole('listbox', { name: 'menu-options' });

  return {
    searchInput: page.getByRole('combobox', { name: 'Ingresa Marca Año Modelo Submarca y Versión' }),
    options: optionsList.getByRole('option'),
  };
};

/** "Ingresa tus Datos" form shown once a vehicle is selected. */
export const contactFormLocators = (page: Page) => ({
  postalCode: page.getByRole('textbox', { name: 'Código Postal *' }),
  email: page.getByRole('textbox', { name: 'Correo electrónico' }),
  firstName: page.getByRole('textbox', { name: 'Nombre', exact: true }),
  paternalSurname: page.getByRole('textbox', { name: 'Apellido paterno' }),
  maternalSurname: page.getByRole('textbox', { name: 'Apellido materno' }),
  mobilePhone: page.getByRole('textbox', { name: 'Teléfono móvil *' }),
  // Only rendered for brand-new vehicles; the input has no accessible name, only a placeholder.
  invoiceValue: page.getByPlaceholder('Valor Factura', { exact: true }),
  submitButton: page.getByRole('button', { name: 'Cotizar', exact: true }),
});

/**
 * Quote results page. Every insurer card is rendered twice (mobile and desktop layouts), so only
 * visible cards count. Cards have no accessible name: the logo (inline SVG `<g id>`) identifies them.
 */
export const quoteResultsLocators = (page: Page) => {
  const main = page.getByRole('main');
  const insurerCard = (logoId: string) =>
    main.locator('table').filter({ visible: true }).filter({ has: page.locator(`svg g[id="${logoId}"]`) });

  return {
    coverageSelect: main.getByText('Selecciona una Cobertura', { exact: true }).locator('xpath=following::select[1]'),
    paymentSelect: main.getByText('Selecciona la Forma de Pago', { exact: true }).locator('xpath=following::select[1]'),
    insurerPremium: (logoId: string) => insurerCard(logoId).getByRole('heading', { level: 1 }),
  };
};
