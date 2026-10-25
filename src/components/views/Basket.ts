/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IBasketView {
  items: HTMLElement[]; // Массив готовых карточек
  total: number;       // Общая стоимость
  disabled: boolean; // Состояние, когда товаров нет в корзине
}

export interface IBasketActions {
  onSubmit: () => void; // Клик по кнопке "Оформить"
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

  // Сеттер для обновления списка карточек
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