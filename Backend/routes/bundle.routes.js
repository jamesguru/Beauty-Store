import {
  createBundle,
  updateBundle,
  deleteBundle,
  getBundle,
  getAllBundles,
  createCustomBundle,
  getUserCustomBundles,
  addProductToBundle,
  removeProductFromBundle
} from "../controller/bundle.controller.js";
import express from "express";


const router = express.Router();

// Public routes
router.get("/", getAllBundles);
router.get("/:id", getBundle);

// Protected routes (Admin for prebuilt bundles)
router.post("/",  createBundle);
router.put("/:id",updateBundle);
router.delete("/:id", deleteBundle);

// Custom bundle routes
router.post("/custom/create", createCustomBundle);
router.get("/user/custom", getUserCustomBundles);
router.post("/:bundleId/products/:productId", addProductToBundle);
router.delete("/:bundleId/products/:productId",  removeProductFromBundle);

export default router;