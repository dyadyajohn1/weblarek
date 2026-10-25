import { Form } from './Form';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IFormState, IFormActions } from '../../types';

interface IFormOrder extends IFormState {
  payment: TPayment;
  address: string;
}

export class FormOrder extends Form<IFormOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions: IFormActions) {
    super(container, actions);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardButton.addEventListener('click', () => {
      actions.onInput?.('payment', 'card');
    });

    this.cashButton.addEventListener('click', () => {
      actions.onInput?.('payment', 'cash');
    });
  }

  protected set payment(value: TPayment) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  protected set address(value: string) {
    this.addressInput.value = value;
  }
}