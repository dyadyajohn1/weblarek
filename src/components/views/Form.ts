/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
  valid: boolean;
  errors: string;
}

export interface IFormActions {
  onSubmit: () => void;
  // Универсальный обработчик ввода для всех полей (если нужно)
  onInput?: (fieldName: string, value: string) => void;
}

export abstract class Form<T> extends Component<T & IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, actions: IFormActions) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault(); // Убираем перезагрузку
      actions.onSubmit();
    });

    if (actions.onInput) {
      this.container.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;

        if (target.tagName === 'INPUT') {
          actions.onInput!(target.name, target.value);
        }
      });
    }
  }

  // Сеттер для блокировки/разблокировки кнопки
  protected set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  // Сеттер для текста ошибок
  protected set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}