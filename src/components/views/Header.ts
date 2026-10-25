import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ICardActions } from '../../types'; 

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    if (actions?.onClick) {
      this.basketButton.addEventListener('click', (event) => {
        actions.onClick!(event as MouseEvent);
      });
    }
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}