import { Card } from './Card';
import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';

interface ICardBasket {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index', 
      this.container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete', 
      this.container
    );

    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', (event) => {
        actions.onClick!(event as MouseEvent);
      });
    }
  }

  protected set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}