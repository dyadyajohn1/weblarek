import { CardWithImage } from './CardWithImage';
import { ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';

interface ICardPreview {
  text: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends CardWithImage<ICardPreview> {
  protected textElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', (event) => {
        actions.onClick!(event as MouseEvent);
      });
    }
  }

  protected set text(value: string) {
    this.textElement.textContent = value;
  }

  protected set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  protected set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}