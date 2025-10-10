import express from "express";
const router = express.Router();
import {
  createPayment,
  getAllPayments,
  deletePayment,
  getPaymentById,
  updatePayment,
  getPaymentsByStatus
} from "../controller/payment.controller.js";

// CREATE PAYMENT ROUTE
router.post("/", createPayment);

// GET ALL PAYMENTS ROUTE
router.get("/", getAllPayments);

// GET PAYMENT BY ID ROUTE
router.get("/:id", getPaymentById);

// UPDATE PAYMENT ROUTE
router.put("/:id", updatePayment);

// DELETE PAYMENT ROUTE
router.delete("/:id", deletePayment);

// GET PAYMENTS BY STATUS ROUTE
router.get("/status/:status", getPaymentsByStatus);

export default router;