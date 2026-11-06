import type { Page } from '@playwright/test';
import type { ContactData } from '../data/contact.data';
import { contactFormLocators } from '../locators/locator';

/** "Ingresa tus Datos" form. Actions only, assertions live in the tests. */
export class ContactFormPage {
  readonly locators;

  constructor(page: Page) {
    this.locators = contactFormLocators(page);
  }

  async fill(contact: ContactData, postalCode: string): Promise<void> {
    await this.locators.postalCode.fill(postalCode);
    await this.locators.email.fill(contact.email);
    await this.locators.firstName.fill(contact.firstName);
    await this.locators.paternalSurname.fill(contact.paternalSurname);
    await this.locators.maternalSurname.fill(contact.maternalSurname);

    // Typed last: the name fields re-render the form and reset the masked phone input,
    // which also needs real keystrokes instead of fill().
    await this.locators.mobilePhone.pressSequentially(contact.phone, { delay: 60 });
  }

  async submit(): Promise<void> {
    await this.locators.submitButton.click();
  }
}
