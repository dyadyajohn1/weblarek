import './scss/styles.scss';

// Базовые утилиты
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';

// Импорт типов
import { IProduct, IOrderRequest, IFormChangeEvent } from './types';

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

// Шаблоны
const previewTemplate = cloneTemplate<HTMLElement>('#card-preview');
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const orderTemplate = cloneTemplate<HTMLFormElement>('#order');
const contactsTemplate = cloneTemplate<HTMLFormElement>('#contacts');
const successTemplate = cloneTemplate<HTMLElement>('#success');

// Статичные View-компоненты, создаются один раз

// Каталог карточек
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

// Превью товара
const preview = new CardPreview(previewTemplate, {
  onClick: () => events.emit('product:toggle')
});

// Модальное окно самостоятельно обрабатывает закрытие окна
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

// Иконка корзины
const header = new Header(ensureElement<HTMLElement>('.header'), {
  onClick: () => events.emit('basket:open')
});

// Кнопка "Оформить" в корзине
const basketView = new BasketView(basketTemplate, {
  onSubmit: () => events.emit('order:open')
});

// Кнопка оформления заказа, указывается адрес покупателя и способ оплаты
const formOrder = new FormOrder(orderTemplate, {
  onInput: (field, value) => events.emit('form:changed', { field, value }),
  onSubmit: () => events.emit('order:next')
});

// Кнопка дооформления заказа, указывается email покупателя и номер телефона, форма отправляется
const formContacts = new FormContacts(contactsTemplate, {
  onInput: (field, value) => events.emit('form:changed', { field, value }),
  onSubmit: () => events.emit('order:submit')
});

// Кнопка закрытия окна успешного оформления заказа
const success = new Success(successTemplate, {
  onClose: () => events.emit('modal:close')
});

// Обработчики событий, презентер

// Каталог
events.on('catalog:changed', () => {
  const cards = catalogModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
      onClick: () => events.emit('item:select', item)
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

// Кликнули на карточку -> сохраняем выбранный товар в модель
events.on('item:select', (item: IProduct) => {
  catalogModel.saveSelectedItem(item);
});

// Модель сохранила выбранный товар -> показываем превью
events.on('item:selected', () => {
  const item = catalogModel.getSelectedItem();
  if (!item) return;

  const isInBasket = basketModel.contains(item.id);
  const isUnavailable = item.price === null;

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

// Добавление товара в корзину
events.on('product:toggle', () => {
  const item = catalogModel.getSelectedItem();
  if (!item) return;
  
  if (basketModel.contains(item.id)) {
    basketModel.removeProduct(item);
  } else {
    basketModel.addProduct(item);
  }
  modal.close();
});

// Корзина

// Если корзина меняется, то перерисовываем ее
events.on('basket:changed', () => {
  // счетчик в хедере
  header.render({ counter: basketModel.getCount() });

  // Обновляем карточки в корзине
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

// Открытие корзины, не рендерим
events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

// Убрать товар из корзины
events.on('basket:remove', (item: IProduct) => {
  basketModel.removeProduct(item);
});

// Закрытие модального окна с экрана успешного оформления заказа
// Само модальное окно обрабатывает закрытие самостоятельно
events.on('modal:close', () => {
  modal.close();
});

// Форма для оформления заказа

// Ввод в форме
events.on<IFormChangeEvent>('form:changed', ({ field, value }) => {
  buyerModel.setData({ [field]: value });
});

// Валидация форм
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const data = buyerModel.getData();

  // Обновляем форму Order
  formOrder.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join('; ')
  });
  
  // Обновляем форму контактов
  formContacts.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join('; ')
  });
});

// Открытие первой формы заказа
events.on('order:open', () => {
  modal.render({ content: formOrder.render() });
  modal.open();
});

// Переход на вторую форму
events.on('order:next', () => {
  modal.render({ content: formContacts.render() });
});

// Отправка заказа на сервер
events.on('order:submit', () => {
  const orderData: IOrderRequest = {
    ...buyerModel.getData(),
    total: basketModel.getTotal(),
    items: basketModel.getItems().map(item => item.id)
  };

  weblarekApi.postOrder(orderData)
    .then((res) => {
      // Окно успешного оформления заказа
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

// Инициализация
basketModel.clear();
buyerModel.clear();

// Загружаем товары с сервера
weblarekApi.getProducts()
  .then((data) => {
    catalogModel.setItems(data.items);
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });