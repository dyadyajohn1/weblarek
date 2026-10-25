/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Card } from './Card';
import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';

// title и price придут из базового класса Card, поэтому только порядковый номер.
export interface ICardBasket {
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
    // клик на кнопку 
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