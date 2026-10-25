import './scss/styles.scss';

// Базовые утилиты
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';

// Импорт типов
import { IProduct, IOrderRequest } from './types';

// Модели данных
import Catalog from './components/models/Catalog';
import Basket from './components/models/Basket';
import Buyer from './components/models/Buyer';
import WebLarekApi from './components/WebLarekApi';

// Слой View
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { Basket as BasketView } from './components/views/Basket';
import { FormOrder } from './components/views/FormOrder';
import { FormContacts } from './components/views/FormContacts';
import { Success } from './components/views/Success';

const events = new EventEmitter();

// Модели
const catalogModel = new Catalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// API
const api = new Api(API_URL);
const weblarekApi = new WebLarekApi(api);

// Статичные View-компоненты
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const header = new Header(ensureElement<HTMLElement>('.header'), {
  onClick: () => {
    // Клик по иконке корзины
    const cards = basketModel.getItems().map((item, index) => {
      return new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
        onClick: () => events.emit('basket:remove', item)
      }).render({
        title: item.title,
        price: item.price,
        index: index + 1
      });
    });
    
    const basketElement = basketView.render({
      items: cards,
      total: basketModel.getTotal(),
      disabled: basketModel.getCount() === 0
    });

    modal.render({ content: basketElement });
    modal.open();
  }
});

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), {
  onClose: () => modal.close()
});

// Шаблоны
const previewTemplate = cloneTemplate<HTMLElement>('#card-preview');
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const orderTemplate = cloneTemplate<HTMLFormElement>('#order');
const contactsTemplate = cloneTemplate<HTMLFormElement>('#contacts');
const successTemplate = cloneTemplate<HTMLElement>('#success');

// Создание экземпляров View
const basketView = new BasketView(basketTemplate, {
  onSubmit: () => events.emit('order:open')
});

const formOrder = new FormOrder(orderTemplate, {
  onInput: (field, value) => {
    buyerModel.setData({ [field]: value });
  },
  onSubmit: () => events.emit('order:next')
});

const formContacts = new FormContacts(contactsTemplate, {
  onInput: (field, value) => {
    buyerModel.setData({ [field]: value });
  },
  onSubmit: () => events.emit('order:submit')
});

// Обработчики событий

// Каталог
events.on('catalog:changed', () => {
  const items = catalogModel.getItems();
  
  const cards = items.map((item) => {
    const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
      onClick: () => catalogModel.saveSelectedItem(item)
    });
    
    return card.render({
      title: item.title,
      price: item.price,
      image: `${CDN_URL}${item.image}`, 
      category: item.category
    });
  });
  
  gallery.render({ items: cards });
});

// Показываем превью
events.on('item:selected', () => {
  const item = catalogModel.getSelectedItem();
  if (!item) return;

  const isInBasket = basketModel.contains(item.id);
  const isUnavailable = item.price === null;

  const preview = new CardPreview(previewTemplate.cloneNode(true) as HTMLElement, {
    onClick: () => {
      if (isInBasket) {
        basketModel.removeProduct(item);
      } else {
        basketModel.addProduct(item);
      }
      modal.close();
    }
  });

  modal.render({
    content: preview.render({
      title: item.title,
      price: item.price,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      text: item.description,
      buttonText: isUnavailable ? 'Недоступно' : (isInBasket ? 'Удалить из корзины' : 'Купить'),
      buttonDisabled: isUnavailable
    })
  });
  modal.open();
});

// Корзина

// Изменилось содержимое корзины
events.on('basket:changed', () => {
  header.render({ counter: basketModel.getCount() });
  
  const cards = basketModel.getItems().map((item, index) => {
    return new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
      onClick: () => events.emit('basket:remove', item)
    }).render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  });
  
  basketView.render({
    items: cards,
    total: basketModel.getTotal(),
    disabled: basketModel.getCount() === 0
  });
});

// Удаление товара из корзины
events.on('basket:remove', (item: IProduct) => {
  basketModel.removeProduct(item);
});

// Открытие формы заказа
events.on('order:open', () => {
  const data = buyerModel.getData();
  modal.render({
    content: formOrder.render({
      payment: data.payment,
      address: data.address,
      valid: false,
      errors: ''
    })
  });
  modal.open();
});

// Валидация форм
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const data = buyerModel.getData();

  // Обновляем первую форму (Оплата + Адрес)
  const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
  formOrder.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    errors: orderErrors
  });
  
  // Обновляем вторую форму (Контакты)
  const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
  formContacts.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: contactsErrors
  });
});

// Переход на второй шаг (форма контактов)
events.on('order:next', () => {
  modal.render({
    content: formContacts.render({
      email: buyerModel.getData().email,
      phone: buyerModel.getData().phone,
      valid: false,
      errors: ''
    })
  });
});

// Отправка заказа на сервер
events.on('order:submit', () => {
  const buyerData = buyerModel.getData();
  
  // Формируем запрос IOrderRequest
  const orderData: IOrderRequest = {
    ...buyerData,
    total: basketModel.getTotal(),
    items: basketModel.getItems().map(item => item.id)
  };

  weblarekApi.postOrder(orderData)
    .then((res) => {
      // Отрисовываем экран успеха
      const success = new Success(successTemplate, {
        onClose: () => modal.close()
      });
      
      modal.render({
        content: success.render({ totalAmount: res.total })
      });

      // Очищаем корзину и данные покупателя
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error('Ошибка оформления заказа:', err);
    });
});

// Загружаем товары с сервера
weblarekApi.getProducts()
  .then((data) => {
    catalogModel.setItems(data.items);
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });