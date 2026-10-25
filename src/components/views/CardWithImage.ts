import { Card } from './Card';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export abstract class CardWithImage<T = object> extends Card<Pick<IProduct, 'image' | 'category'> & T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
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

  // Картинка теперь берется из памяти, а не из разметки
  protected set image(value: string) {
    this.setImage(this.imageElement, value, this._title);
  }
}