/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IModal {
  content: HTMLElement;
}

// Отдельный интерфейс для модалки
export interface IModalActions {
  onClose: () => void;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, actions?: IModalActions) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);

    if (actions?.onClose) {
      this.closeButton.addEventListener('click', () => {
        actions.onClose();
      });

      this.container.addEventListener('click', (event) => {
        if (event.target === this.container) {
          actions.onClose();
        }
      });
    }
  }

  // Сеттер для замены содержимого модального окна
  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  // Методы для управления видимостью
  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
  }
}