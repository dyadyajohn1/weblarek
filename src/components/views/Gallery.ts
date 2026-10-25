/**
 * СТАТУС: РЕАЛИЗОВАНО
 */

import { Component } from '../base/Component';

export interface IGallery {
  items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    // Обновляем карточки, если были другие
    this.container.replaceChildren(...items);
  }
}