const express = require("express");
const router = express.Router();
const upload = require("../../../config/multerConfig");
const productModel = require("../../Model/ProductModel/productSchema");
const verifyToken = require("../../auth/authToken");

// Upload single image
router.post(
  "/single",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading image", error });
    }
  },
);

// Upload multiple images
router.post(
  "/multiple",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      res.status(200).json({
        message: "Images uploaded successfully",
        imageUrls,
        count: req.files.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading images", error });
    }
  },
);

// Add images to product
router.put(
  "/product/:productId",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await productModel.Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => `/uploads/${file.filename}`);
        product.images = [...(product.images || []), ...newImages];

        // Set first image as main if not set
        if (!product.image && newImages.length > 0) {
          product.image = newImages[0];
        }

        await product.save();
      }

      res.status(200).json({
        message: "Images added to product",
        images: product.images,
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding images", error });
    }
  },
);

module.exports = router;
