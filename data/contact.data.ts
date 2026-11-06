export interface ContactData {
  readonly email: string;
  /** 10 digits, typed into the masked phone input. */
  readonly phone: string;
  readonly firstName: string;
  readonly paternalSurname: string;
  readonly maternalSurname: string;
}

/**
 * Fake contact with a unique e-mail per test. Re-using an e-mail can turn it into a
 * "registered user" and the portal then asks for a password before quoting.
 */
export const createContact = (): ContactData => ({
  email: `qa.automation.${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
  phone: '5512345678',
  firstName: 'Prueba',
  paternalSurname: 'Automatizacion',
  maternalSurname: 'QA',
});
