const { faker } = require("@faker-js/faker");

type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.food.dish(),
    quantity: faker.number.int({ min: 1, max: 30 }),
    price: parseFloat(faker.commerce.price({ min: 10, max: 50 })),
  }));
}
module.exports = { generateProducts };
