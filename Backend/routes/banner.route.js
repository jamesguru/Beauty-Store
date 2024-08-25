import express from "express";
const router = express.Router();
import {
  createBanner,
  getAllBanners,
  getRandomBanner,
  deleteBanner,
} from "../controller/banner.controller.js";

// CREATE BANNER ROUTE
router.post("/", createBanner);

// GET ALL BANNERS ROUTE
router.get("/", getAllBanners);

// DELETE BANNER ROUTE

router.delete("/:id", deleteBanner);

// GET RANDOM BANNER ROUTE
router.get("/random", getRandomBanner);

export default router;
