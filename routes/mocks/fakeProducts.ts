const { faker } = require("@faker-js/faker");

function generateProducts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 30 }),
    price: Number(faker.commerce.price({ min: 10, max: 500 })),
  }));
}

module.exports = { generateProducts };
