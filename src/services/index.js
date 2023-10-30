import ProductsService from './products.service.js';
import ProductsMongoManager from '../dao/productsMongoManager.js';

import CartsService from './carts.service.js';
import CartsMongoManager from '../dao/cartsMongoManager.js';

export const productsService = new ProductsService(new ProductsMongoManager());
export const cartsService = new CartsService(new CartsMongoManager());
