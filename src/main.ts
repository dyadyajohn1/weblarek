import './scss/styles.scss';

import Catalog from './components/base/models/Catalog';
import Cart from './components/base/models/Cart';
import Buyer from './components/base/models/Buyer';
import WebLarekApi from './components/base/WebLarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

// catalog.setItems(apiProducts.items);

// console.log('Массив товаров из каталога: ', catalog.getItems());

// Проверка catalog моковыми данными
console.log('{ Проверяем каталог }');
catalog.setItems(apiProducts.items);
console.log('Список всех товаров:', catalog.getItems());
console.log('Товар по id:', catalog.getProductById(apiProducts.items[0].id));
catalog.saveSelectedItem(apiProducts.items[0]);
console.log('Выбранный товар:', catalog.getSelectedItem());

// Проверка cart моковыми данными
console.log('{ Проверяем корзину }');
cart.addProduct(apiProducts.items[0]);
cart.addProduct(apiProducts.items[1]);
cart.addProduct(apiProducts.items[2]);
console.log('Товары, попавшие в корзину:', cart.getItems());
console.log('Количество товаров:', cart.getCount());
cart.removeProduct(apiProducts.items[2]);
console.log('Проверка удаления:', cart.getItems());
console.log('Сумма всех товаров в корзине:', cart.getTotal());
console.log('Есть ли конкретный товар в корзине:', cart.contains(apiProducts.items[1].id));
cart.clear();
console.log('Тут ничего не должно быть больше:', cart.getItems());


// Проверка buyer моковыми данными

console.log('{ Проверяем модель покупателя }');
buyer.setData({ email: 'practicum@yandex.ru' });
buyer.setData({ phone: '+88005553535' });
console.log('Данные покупателя не должны затираться, тут должна быть почта и телефон:', buyer.getData());
console.log('Проверка валидности, должен быть не валидным адрес и оплата:', buyer.validate());
buyer.setData({ address: 'Пермь', payment: 'card' });
console.log('Если ничего не вернулось, то тут будет пустой объект:', buyer.validate());
buyer.clear();
console.log('Сброс:', buyer.getData());

const api = new Api(API_URL);

const weblarekApi = new WebLarekApi(api);

weblarekApi.getProducts()
  .then((data) => {
    catalog.setItems(data.items);
    console.log('Каталог товаров:', catalog.getItems());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });

console.log('API_URL:', API_URL); // при проверке у меня перестал отвечать сервер, выписал в консоль какая ссылка формируется, чтобы понять, что все ок