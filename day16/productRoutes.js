// backend/productRoutes.js
import express from "express";
import Product from "./product.model.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a product
router.post("/", async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const product = new Product({ name, price, image });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
