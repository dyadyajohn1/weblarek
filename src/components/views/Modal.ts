import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
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