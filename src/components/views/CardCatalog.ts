/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { ensureElement } from '../../utils/utils'; 
import { Card } from './Card'; 
import { IProduct, ICardActions } from '../../types';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      '.card__category',
      this.container
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container
    );

    if (actions?.onClick) {
      this.container.addEventListener('click', (event) => {
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
}