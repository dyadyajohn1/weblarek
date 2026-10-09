import { IProduct } from '../../types';

class Catalog {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id)
  }

  saveSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem
  }
}

export default Catalog;
