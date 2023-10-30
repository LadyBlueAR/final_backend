import chai from "chai";
import supertest from "supertest";
import { generateProduct } from "../src/mocks/products.mock.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testeando Ecommerce", () => {
    describe("Testeando Products", () => {
        
        const mockProduct = generateProduct();
        let pid;

        it("El endpoint de tipo POST /api/products debe crear satisfactoriamente un producto", async () => {
            const { _body } = await requester.post("/api/products").send(mockProduct);
            expect(_body.payload).to.have.property("_id");
            pid = _body.payload._id;
        })

        it("El endpoint de tipo GET /api/products/:pid debe retortar el producto según su id", async () => {
            const response = await requester.get(`/api/products/${pid}`);
            expect(response.status).to.equal(200);
        })

        it("El endpoint de tipo DELETE /api/products/:pid debe eliminar satisfactoriamente un producto", async () => {
            const response = await requester.delete(`/api/products/${pid}`);
            expect(response.status).to.equal(204);
        })
    })
    
    describe("Testeando Carts", () => {

        const cid = "650cf5537069f2a2db065ac9";

        it("El endpoint de tipo GET /api/carts debe retornar todos los carts", async () => {
            const response = await requester.get(`/api/carts`);
            expect(response.status).to.equal(200);
        })

        it("El endpoint de tipo GET /api/carts/:cid debe retornar el cart según su id", async () => {
            const response = await requester.get(`/api/carts/${cid}`);
            expect(response.status).to.equal(200);
        })      

        it("El endpoint de tipo DELETE /api/carts/:cid debe vaciar el cart de productos", async () => {
            const response = await requester.delete(`/api/carts/${cid}`);
            expect(response.status).to.equal(204);
        })
    })

    describe("Testeando Sessions", () => {

        it("Debe registrarse correctamente un usuario", async () => {
            const user = {
                first_name: "Juan",
                last_name: "Perez",
                email: "jperez@prueba.com",
                edad: 30,
                password: "juan123"
            }

            const { _body } = await requester.post("/register").send(user);
            expect(_body.payload).to.be.ok;
        })     
    })
})