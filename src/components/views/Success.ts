/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ISuccess {
  totalAmount: number;
}

export interface ISuccessActions {
  onClose: () => void;
}

export class Success extends Component<ISuccess> {
  protected totalDescriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this.totalDescriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    // Клик по кнопке "За новыми покупками!"
    if (actions?.onClose) {
      this.closeButton.addEventListener('click', () => {
        actions.onClose();
      });
    }
  }

  protected set totalAmount(value: number) {
    // Форматируем число с пробелами как в макете (153 250)
    const formattedValue = new Intl.NumberFormat('ru-RU').format(value);
    this.totalDescriptionElement.textContent = `Списано ${formattedValue} синапсов`;
  }
}