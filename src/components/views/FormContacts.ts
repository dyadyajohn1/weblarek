/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Form, IFormState, IFormActions } from './Form';
import { ensureElement } from '../../utils/utils';

export interface IFormContacts extends IFormState {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions: IFormActions) {
    super(container, actions);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }

  protected set email(value: string) {
    this.emailInput.value = value;
  }

  protected set phone(value: string) {
    this.phoneInput.value = value;
  }
}