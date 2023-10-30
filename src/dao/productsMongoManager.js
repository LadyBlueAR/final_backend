import { productModel } from '../dao/mongo/models/products.model.js';

export default class ProductsMongoManager {
    async find (filter, sort, limit, page, disponible, sortOpt, catQuery) {
        try {
          const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
            await productModel.paginate(filter, { limit, page, lean: true, sort });
    
          const products = docs;
          const prevLink = hasPrevPage
            ? `http://localhost:8080/api/products?limit=${limit}&page=${parseInt(page) - 1}&disponible=${disponible}&sort=${sortOpt}${catQuery}`
            : null;
          const nextLink = hasNextPage
            ? `http://localhost:8080/api/products?limit=${limit}&page=${parseInt(page) + 1}&disponible=${disponible}&sort=${sortOpt}${catQuery}`
            : null;
    
          return {
            products,
            totalPages: rest.totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
          };
        } catch (error) {
          throw new Error(`Error al obtener los productos: ${error}`);
        }
    }

    async findById(productId) {
        try {
            const product = await productModel.findById(productId).lean();
            if (product) {
                return product;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error(`Error al buscar el producto: ${error}`);
        }
    }

    async create(productData) {
        try {
            const result = await productModel.create(productData);
            return result;
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error}`);
        }
    }

    async update(productId, newProductData) {
        try {
            const result = await productModel.findByIdAndUpdate(productId, newProductData, { new: true }).lean();
            if (result) {
                return result;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error}`);
        }
    }

    async delete(productId) {
        try {
            const result = await productModel.findByIdAndDelete(productId).lean();
            if (result) {
                return result;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error}`);
        }
    }
}
