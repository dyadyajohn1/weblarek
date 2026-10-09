import { IBuyer, TPayment, ValidationErrors } from '../../types';

class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  setData(data: Partial<IBuyer>): void {
    Object.assign(this, data);
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
  }
  
  validate(): ValidationErrors  {
    const errors: ValidationErrors = {};

    if (this.payment === '') {
      errors.payment = 'Не выбран спобособ оплаты';
    }

    if (this.address.trim() === '') {
      errors.address = 'Необходимо указать адресс';
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
