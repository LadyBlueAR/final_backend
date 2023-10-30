import ProductsMongoManager from "../dao/productsMongoManager.js";

export default class ProductsService {
    constructor() {
        this.dao = new ProductsMongoManager();
    }

    async getProducts(filter, sort, limit, page) {
        try {
            return await this.dao.find(filter, sort, limit, page);
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error}`);
        }
    }

    async getProductById(productId) {
        try {
            return await this.dao.findById(productId);
        } catch (error) {
            throw new Error(`Error al buscar el producto: ${error}`);
        }
    }

    async createProduct(productData) {
        try {
            return await this.dao.create(productData);
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error}`);
        }
    }

    async updateProduct(productId, newProductData) {
        try {
            return await this.dao.update(productId, newProductData);
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error}`);
        }
    }

    async deleteProduct(productId) {
        try {
            return await this.dao.delete(productId);
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error}`);
        }
    } 

    async checkStock(productId, quantity) {
        try {
          const product = await this.getProductById(productId);
          if (!product) {
            throw new Error('Producto no encontrado');
          }

          if (product.stock >= quantity) {
            return true;
          } 
          return false;
        } catch (error) {
          throw new Error(`Error al verificar el stock del producto: ${error.message}`);
        }
      }
      
      async subtractStock(productId, quantity) {
        try {
          const product = await this.getProductById(productId);
          if (!product) {
            throw new Error('Producto no encontrado');
          }                  
    
          if (product.stock >= quantity) {
            await this.dao.update (
                { _id: productId, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } }
              );
            return true; 
          } else {
            throw new Error('Stock insuficiente');
          }
        } catch (error) {
          throw new Error(`Error al restar el stock del producto: ${error.message}`);
        }
      }
    
}
