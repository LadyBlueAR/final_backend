import CartsService from '../services/carts.service.js';
import ProductsService from '../services/products.service.js';
import TicketsService from '../services/tickets.service.js';
import { userModel } from '../dao/mongo/models/user.model.js';
import { cartModel } from '../dao/mongo/models/carts.model.js';

const cs = new CartsService();
const ps = new ProductsService();
const ts = new TicketsService();

export default class CartsController {
  static async getAllCarts(req, res) {
    try {
      const carts = await cs.getAllCarts();
      res.status(200).json({ message: 'Success', payload: carts });
    } catch (error) {
      res.status(500).json({ error: `Error al buscar los carritos en la base de datos: ${error.message}` });
    }
  }

  static async getCartById(req, res) {
    const { cid } = req.params;
    try {
      const cart = await cs.getCartById(cid);
      res.status(200).json({ payload: cart });
    } catch (error) {
      res.status(500).json({ error: `Error al obtener el carrito: ${error.message}` });
    }
  }

  static async createCart(req, res) {
    try {
      const result = await cs.createCart();
      res.status(201).json({ message: 'Success', payload: result });
    } catch (error) {
      res.status(500).json({ error: `Error al crear el carrito: ${error.message}` });
    }
  }

 static async addProductToCart(req, res) {
    const { pid } = req.params;
    const cid = req.session.user.cart;
    const email = req.session.user.email;
    try {
        const product = await ps.getProductById(pid);
        if (!cid) {
            const newCart = await cs.createCart(); 
            req.session.user.cart = newCart._id;
            await userModel.findOneAndUpdate({ _id: req.session.user._id }, { cart: newCart._id });
        }
        if ( email === product.owner) {
          res.status(400).json({ message: "No puede agregar al carrito un producto propio"});
        } else if ( req.session.user.rol === "admin") {
          res.status(403).json({message: "El admin no puede agregar productos al carrito"});
        }  
        else {
          const updatedCart = await cs.addProductToCart(cid, pid);
          res.status(200).json({ message: 'Producto agregado correctamente', payload: updatedCart });
        }
        
    } catch (error) {
        res.status(500).json({ error: `Error al agregar el producto al carrito: ${error.message}` });
    }
  }

  static async updateProductInCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const updatedCart = await cs.updateProductInCart(cid, pid, quantity);
      res.status(200).json({ message: 'Cantidad del producto actualizada correctamente', payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: `Error al actualizar la cantidad del producto: ${error.message}` });
    }
  }

  static async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const updatedCart = await cs.deleteProductFromCart(cid, pid);
      res.status(200).json({ message: 'Producto eliminado correctamente', payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: `Error al eliminar el producto del carrito: ${error.message}` });
    }
  }

  static async deleteCart(req, res) {
    const { cid } = req.params;
    try {
      const updatedCart = await cs.deleteCart(cid);
      await cartModel.findByIdAndUpdate(cid, {total : 0} );
      res.status(204).json({ message: 'Todos los productos del carrito han sido eliminados', payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: `Error al eliminar los productos del carrito: ${error.message}` });
    }
  }

  static async purchaseCart(req, res) {
    const cid = req.session.user.cart;
    const purchaser = req.session.user.email;
    let amount = 0;
    let insufficientStock = false;
    try {
      const cart = await cs.getCartById(cid);
      if (!cart) {
        res.status(400).json({ error: 'Carrito inexistente' });
        return;
      }
        
      const insufficientStockProducts = [];
  
      for (const item of cart.products) {
        const hasSufficientStock = await ps.checkStock(item.product._id, item.quantity);
  
        if (hasSufficientStock) {
          await ps.subtractStock(item.product._id, item.quantity);
          await cs.deleteProductFromCart(cid, item.product._id);
          amount += item.subtotal;
        } else {
          insufficientStockProducts.push({
            productId: item.product._id,
            quantity: item.quantity
          });
          insufficientStock = true;
        }
      }
      if (cart.products.length === 0) {
        return res.status(200).json({message: 'No hay ningún producto en el carrito'});
      } else if (insufficientStockProducts.length === cart.products.length) {
        return res.status(200).json({ message: 'No hay stock de ninguno de los productos que desea comprar' });
      }  
      const now = new Date();
      var purchase_datetime = now.toLocaleTimeString('es-Latn');
      const newTicket = await ts.createTicket(purchase_datetime, amount, purchaser);
  
      if (insufficientStock) {
        res.render('ticket', { ticket: { purchase_datetime, amount, purchaser, code: newTicket.code, insufficientStockProducts }, user: req.session.user});
      } else {
        res.render('ticket', { ticket: { purchase_datetime, amount, purchaser, code: newTicket.code }, user: req.session.user });
      }
    } catch (error) {
      res.status(500).json({ error: `Error al finalizar la compra: ${error.message}` });
    }
  }
  
}
