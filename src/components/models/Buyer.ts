import { IBuyer, TPayment, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    Object.assign(this, data);
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:changed');
  }
  
  validate(): ValidationErrors  {
    const errors: ValidationErrors = {};

    if (this.payment === '') {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (this.address.trim() === '') {
      errors.address = 'Необходимо указать адрес';
    }

    if (this.phone.trim() === '') {
      errors.phone = 'Укажите номер телефона';
    }
    
    if (this.email.trim() === '') {
      errors.email = 'Введите email';
    }

    return errors;
  }
}

export default Buyer;
