import { productModel } from "../dao/mongo/models/products.model.js";
import { userModel } from "../dao/mongo/models/user.model.js";
import ProductsService from "../services/products.service.js";
import MailingService from "../services/mailing.service.js";
import CustomError from "../utils/errors/custom.errors.js";
import EErrors from "../utils/errors/enum.errors.js";
import { generateProductErrorInfo } from "../utils/errors/info.errors.js";

const ps = new ProductsService();
const ms = new MailingService();

export default class ProductsController {
    static async getProducts(req, res) {
        try {
            let filter = {};
            let sort = {};
    
            const limit = req.query.limit || 10;
            const page = req.query.page || 1;
            const category = req.query.category;
            const disponible = req.query.disponible;
            const sortOpt = req.query.sort;
    
            if (category) filter = { category };
            if (disponible === 'si') filter = { stock: { $gt: 0 } };
            if (disponible === 'no') filter = { stock: 0 };
            if (sortOpt === 'asc') sort = { price: 1 };
            if (sortOpt === 'desc') sort = { price: -1 };
    
            const catQuery = category ? `&category=${category}` : '';
            const productsData = await ps.getProducts(
                filter,
                sort,
                limit,
                page
            );
    
            const response = {
                status: 'success',
                payload: productsData.products,
                totalPages: productsData.totalPages,
                prevPage: productsData.prevPage,
                nextPage: productsData.nextPage,
                page: productsData.page,
                hasPrevPage: productsData.hasPrevPage,
                hasNextPage: productsData.hasNextPage,
            };
    
            if (productsData.hasPrevPage) {
                response.prevLink = `https://ecommerce-coder-guet.onrender.com/api/products?limit=${limit}&page=${productsData.prevPage}&disponible=${disponible}&sort=${sortOpt}${catQuery}`;
            }
    
            if (productsData.hasNextPage) {
                response.nextLink = `https://ecommerce-coder-guet.onrender.com/api/products?limit=${limit}&page=${productsData.nextPage}&disponible=${disponible}&sort=${sortOpt}${catQuery}`;
            }
    
            res.json(response);

        } catch (error) {
            req.logger.error("Error al obtener los productos");
            res.status(500).json({ error: `Error al obtener los productos: ${error.message}` });
        }
    }

    static async getProductById(req, res) {
        const { pid } = req.params;
        try {
            const product = await ps.getProductById(pid);
            res.status(200).json({ status: 'success', payload: product });
        } catch (error) {
            req.logger.error("Producto no encontrado");
            res.status(404).json({ error: `Producto no encontrado: ${error.message}` });
        }
    }
    static async createProduct(req, res) {
        const productData = req.body;
        const user = req.session.user;
        try {
            await ps.createProduct(productData);
            if (user.rol === "premium") {
                const product = await productModel.findOne({ code: productData.code});
                await ps.updateProduct(product._id, { owner: user.email});
            }
            res.status(201).json({ message: 'Producto Creado'});
        } catch (error) {
            console.log(error);
            CustomError.createError({
                name: "Error de creación de producto",
                cause: generateProductErrorInfo(productData),
                message: "Error al tratar de crear el producto",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
    }

    static async updateProduct(req, res) {
        const { pid } = req.params;
        const newProductData = req.body;
        try {
            const result = await ps.updateProduct(pid, newProductData);
            req.logger.info("Producto Actualizado");
            res.json({ message: 'Producto Actualizado', payload: result });
        } catch (error) {
            req.logger.error("Error al actualizar el producto");
            res.status(500).json({ error: `Error al actualizar el producto: ${error.message}` });
        }
    }

    static async deleteProduct(req, res) {
        const { pid } = req.params;
        const user = req.session.user;
        const product = await ps.getProductById(pid);
        let ownerPremium = false;
        if ( product.owner != "admin") {
            const productOwner = await userModel.findOne({ email: product.owner});
            if (productOwner.rol === "premium") {
                ownerPremium = true;
            }
        }        
        try {
            if (user.rol === "admin" || user.email === product.owner) {
                const result = await ps.deleteProduct(pid);
                req.logger.info("Producto Eliminado");
                if (ownerPremium === true) {
                    ms.sendSimpleMail({
                        from: 'anabelag1991@gmail.com',
                        to: product.owner,
                        subject: 'Aviso de Producto Eliminado',
                        html: `
                        <h1>Su Producto Fue Eliminado</h1>
              <p>Este es un aviso de que su producto ${product.title} fue eliminado de nuestra base de datos.</p>
            `,
                    attachments: []
                    })
                }            
                res.status(204).json({ message: 'Producto Eliminado', payload: result });
            } else {
                res.status(404).json("No tiene permisos para eliminar este producto");
            }            
        } catch (error) {
            req.logger.error("Error al eliminar el producto");
            res.status(500).json({ error: `Error al eliminar el producto: ${error.message}` });
        }
    }
}
