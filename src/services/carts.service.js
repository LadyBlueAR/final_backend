import CartsMongoManager from '../dao/cartsMongoManager.js';

export default class CartsService {
    constructor() {
        this.dao = new CartsMongoManager();
    }
  
  async getAllCarts() {
    try {
      return await this.dao.findAll();
    } catch (error) {
      throw new Error(`Error al buscar los carritos en la base de datos: ${error}`);
    }
  }

  async getCartById(cartId) {
    try {
      return await this.dao.findById(cartId);
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error}`);
    }
  }

  async createCart(userId) {
    try {
      const newCart = await this.dao.create(userId);
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error}`);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      return await this.dao.addProduct(cartId, productId);
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error}`);
    }
  }

  async updateProductInCart(cartId, productId, newQuantity) {
    try {
      return await this.dao.updateProductQuantity(cartId, productId, newQuantity);
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error}`);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await this.dao.deleteProduct(cartId, productId);
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error}`);
    }
  }

  async deleteCart(cartId) {
    try {
      return await this.dao.delete(cartId);
    } catch (error) {
      throw new Error(`Error al eliminar los productos del carrito: ${error}`);
    }
  }
}
   

