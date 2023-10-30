import { faker } from '@faker-js/faker/locale/es';

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric({ length: 5}),
        price: faker.commerce.price(),
        status: true,
        stock: faker.number.int(300),
        category: faker.commerce.department(),
        thumbnails: [],
    };
}