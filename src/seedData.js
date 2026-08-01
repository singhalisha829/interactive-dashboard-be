import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Sales from "./models/Sales.js";

const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'];
const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
const paymentMethods = ['Credit Card', 'PayPal', 'UPI', 'Crypto'];
const statuses = ['Completed', 'Pending', 'Refunded'];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Clearing existing Products and Sales data...");
    await Product.deleteMany({});
    await Sales.deleteMany({});

    console.log("Generating 50 Products...");
    const productsToInsert = [];
    for (let i = 0; i < 50; i++) {
      productsToInsert.push({
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        stock: faker.number.int({ min: 0, max: 500 }),
        createdAt: faker.date.past({ years: 1 })
      });
    }

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`Successfully created ${insertedProducts.length} products.`);

    console.log("Generating 300 Sales records...");
    const salesToInsert = [];
    for (let i = 0; i < 300; i++) {
      const randomProduct = faker.helpers.arrayElement(insertedProducts);
      
      salesToInsert.push({
        orderId: `ORD-${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
        customerName: faker.person.fullName(),
        customerEmail: faker.internet.email(),
        productId: randomProduct._id.toString(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        region: faker.helpers.arrayElement(regions),
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        status: faker.helpers.arrayElement(statuses),
        createdAt: faker.date.past({ years: 1 })
      });
    }

    const insertedSales = await Sales.insertMany(salesToInsert);
    console.log(`Successfully created ${insertedSales.length} sales records.`);

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
