import './scss/styles.scss';

import Catalog from './components/base/models/Catalog';
// import Cart from './components/base/models/Cart';
// import Buyer from './components/base/models/Buyer';
import WebLarekApi from './components/base/WebLarekApi';
import { Api } from './components/base/Api';
// import { apiProducts } from './utils/data'; для второй части задания, теперь отпровляем запрос на список товаров

const catalog = new Catalog();

// const cart = new Cart();

// const buyer = new Buyer();

// catalog.setItems(apiProducts.items);

// console.log('Массив товаров из каталога: ', catalog.getItems());

const api = new Api(import.meta.env.VITE_API_ORIGIN);

const weblarekApi = new WebLarekApi(api);

weblarekApi.getProducts()
  .then((data) => {
    catalog.setItems(data.items);
    console.log('Каталог товаров:', catalog.getItems());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });