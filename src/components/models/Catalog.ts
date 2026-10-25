import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

class Catalog {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    //Изменение каталога
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id)
  }

  saveSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    // Товар выбрали
    this.events.emit('item:selected');
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem
  }
}

export default Catalog;
