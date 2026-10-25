import { CardWithImage } from './CardWithImage';
import { ICardActions } from '../../types';

export class CardCatalog extends CardWithImage<object> {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    if (actions?.onClick) {
      this.container.addEventListener('click', (event) => {
        actions.onClick!(event as MouseEvent);
      });
    }
  }
}