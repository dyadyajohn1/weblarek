import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

interface IBasketActions {
  onSubmit: () => void;
}

export class Basket extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    
    if (actions?.onSubmit) {
      this.submitButton.addEventListener('click', () => {
        actions.onSubmit();
      });
    }
  }

  protected set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  protected set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  protected set disabled(value: boolean) {
    this.submitButton.disabled = value;
  }
}