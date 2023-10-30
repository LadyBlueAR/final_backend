import CartsService from '../services/carts.service.js';
import ProductsService from '../services/products.service.js';
import TicketsService from '../services/tickets.service.js';

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
      const userId = req.session.user._id;
      const result = await cs.createCart(userId);
      res.status(201).json({ message: 'Success', payload: result });
    } catch (error) {
      res.status(500).json({ error: `Error al crear el carrito: ${error.message}` });
    }
  }

  static async addProductToCart(req, res) {
    const { pid } = req.params;
    const cid = req.session.user.cart;
    try {
      const updatedCart = await cs.addProductToCart(cid, pid);
      res.status(200).json({ message: 'Producto agregado correctamente', payload: updatedCart });
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
      res.status(204).json({ message: 'Todos los productos del carrito han sido eliminados', payload: updatedCart });
    } catch (error) {
      res.status(500).json({ error: `Error al eliminar los productos del carrito: ${error.message}` });
    }
  }

  static async purchaseCart (req, res) {
    const { cid } = req.params;
    const user = req.session.user;
    const purchaser = user.email;
    const purchase_datetime = new Date();
    const code = "codigo01";

    try {
      const cart = await cs.getCartById(cid);
      let amount = 0;
      if (!cart || cart.products.length === 0) {
        req.logger.error('Carrito inexistente o vacío');
        res.status(400).json({error: "Carrito inexistente o vacío"});
      } 
      for (const product of cart.products) {
        const name = product.product.title;
        const pid = product.product.id;
        const quantity = product.quantity;
        const price = product.product.price;

        const hasStock = await ps.checkStock(pid, quantity);

        if (hasStock) {
          console.log(`Stock disponible del producto ${name}`);
          amount += (price * quantity );
          await cs.deleteProductFromCart(cid, pid);
          await ps.subtractStock(pid, quantity);
        } else if (!hasStock) {
          req.logger.error(`Stock Insuficiente del producto : ${name}`);
          return res.status(400).json({error: `Stock Insuficiente del producto: ${name}`});
        }
      }
      //Datos para el ticket
      const newTicket = await ts.createTicket(code, purchase_datetime, amount, purchaser);
      return res.status(201).json({
        status: "Success",
        message: "Compra realizada con éxito y ticket creado con éxito",
        ticket: newTicket
      });
    } catch (error) {
      req.logger.error(error);
      return res.status(400).json({ error: "Error al crear el ticket" });
    }
  }
}
