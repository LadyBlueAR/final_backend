export const generateProductErrorInfo = (product) => {
    return  `Una o más propiedades están incompletas o son inválidas
    Lista de propiedades requeridas:
    * title: debe ser un string y es de carácter obligatorio, se recibió: ${product.title}}
    * description: debe ser un string y es de carácter obligatorio, se recibió: ${product.description}
    * code: debe ser un string, no puede repetirse y es de carácter obligatorio, se recibió: ${product.code}
    * price: debe ser un número entero y es de carácter obligatorio, se recibió: ${product.price}
    * stock: debe ser un número entero y es de carácter obligatorio, se recibió: ${product.stock}
    * category: debe ser un string y es de carácter obligatorio, se recibió: ${product.category}`
}