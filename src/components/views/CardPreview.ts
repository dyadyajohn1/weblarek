/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Card } from './Card';
import { IProduct, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export interface ICardPreview extends Pick<IProduct, 'image' | 'category'> {
  text: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected textElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', (event) => {
        actions.onClick!(event as MouseEvent);
      });
    }
  }

  protected set category(value: string) {
    this.categoryElement.textContent = value;
    (Object.keys(categoryMap) as CategoryKey[]).forEach((key) => {
      this.categoryElement.classList.toggle(
        categoryMap[key],
        key === value
      );
    });
  }

  protected set image(value: string) {
    const altText = this.titleElement.textContent || '';
    this.setImage(this.imageElement, value, altText);
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