import { cartModel } from '../dao/mongo/models/carts.model.js';
import { productModel } from './mongo/models/products.model.js';
import { userModel } from './mongo/models/user.model.js';

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

  async create(userId) {
    try {
      const newCart = await cartModel.create({
        products: [],
      });

      const cartId = newCart._id;

      const updatedUser = await userModel.findByIdAndUpdate(
        {_id: userId },
        { $set: { 'cart': cartId}},
        {new: true}
      );
      
      if (!updatedUser) {
        throw new Error(`Usuario no entocontrado con id ${userId}`);
      }
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
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error}`);
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cartId, 'products.product': productId },
        { $set: { 'products.$.quantity': newQuantity } },
        { new: true }
      );

      if (!updatedCart) {
        throw new Error('Carrito o producto no encontrado');
      }

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
