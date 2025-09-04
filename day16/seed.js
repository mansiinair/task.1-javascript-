import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();

const products = [
  {
    name: "iPhone 15",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15",
    description: "The latest Apple iPhone with A16 Bionic chip.",
    price: 999,
  },
  {
    name: "Samsung Galaxy S23",
    image: "https://images.samsung.com/galaxy-s23",
    description: "Samsung’s flagship phone with Snapdragon 8 Gen 2.",
    price: 899,
  },
  {
    name: "Sony WH-1000XM5",
    image: "https://m.media-amazon.com/images/I/sony-headphones.jpg",
    description: "Industry-leading noise-cancelling headphones.",
    price: 399,
  },
];

const seedDB = async () => {
  try {
    console.log("Connecting to DB:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected...");

    // Remove old products
    await Product.deleteMany();
    console.log("🗑️ Old products removed");

    // Insert new products
    await Product.insertMany(products);
    console.log("✅ Sample products added");

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    process.exit(1);
  }
};

seedDB();
