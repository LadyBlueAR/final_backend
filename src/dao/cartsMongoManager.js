import { cartModel } from '../dao/mongo/models/carts.model.js';
import { productModel } from './mongo/models/products.model.js';

export default class CartsMongoManager {
  async findAll() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      throw new Error(`Error al buscar los carritos en la base de datos: ${error}`);
    }
  }

  async findById(cartId) {
    try {
      const cart = await cartModel.findById(cartId).populate('products.product');
      if (!cart) {
        throw new Error('Carrito inexistente');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error}`);
    }
  }

  async create() {
    try {
      const newCart = await cartModel.create({
        products: [],
      });
  
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error}`);
    }
  }
  

  async addProduct(cartId, productId) {
    try {
      const product = await productModel.findById(productId);
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito inexistente');
      }
      if (!product) {
        throw new Error('Producto inexistente');
      }
  
      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
        cart.products[productIndex].subtotal = cart.products[productIndex].quantity * product.price;
      } else {
        cart.products.push({ product: productId, quantity: 1, subtotal: product.price });
      }
  
      cart.total = cart.products.reduce((acc, item) => acc + item.subtotal, 0);
  
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error}`);
    }
  } 

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito inexistente');
      }
  
      const product = await productModel.findById(productId);
      if (!product) {
        throw new Error('Producto inexistente');
      }
  
      const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        cart.products[productIndex].subtotal = newQuantity * product.price;
  
        cart.total = cart.products.reduce((acc, item) => acc + item.subtotal, 0);
      }
  
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error}`);
    }
  } 

  async deleteProduct(cartId, productId) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error('Carrito inexistente');
      }

      return updatedCart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error}`);
    }
  }

  async delete(cartId) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });

      if (!updatedCart) {
        throw new Error('Carrito inexistente');
      }

      return updatedCart;
    } catch (error) {
      throw new Error(`Error al eliminar los productos del carrito: ${error}`);
    }
  }
}
