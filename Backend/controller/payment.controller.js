import Payment from "../models/payment.model.js";
import asyncHandler from "express-async-handler";

// CREATE PAYMENT
const createPayment = asyncHandler(async (req, res) => {
  const newPayment = new Payment(req.body);
  const savedPayment = await newPayment.save();

  if (!savedPayment) {
    res.status(400);
    throw new Error("Payment was not created");
  } else {
    res.status(200).json(savedPayment);
  }
});

// DELETE PAYMENT
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) {
    res.status(400);
    throw new Error("Payment was not deleted");
  } else {
    res.status(200).json({ message: "Payment was deleted successfully" });
  }
});

// GET ALL PAYMENTS
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('orderId', 'name email total status');
  if (!payments) {
    res.status(400);
    throw new Error("Payments were not fetched or something went wrong");
  } else {
    res.status(200).json(payments);
  }
});

// GET PAYMENT BY ID
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('orderId');
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  } else {
    res.status(200).json(payment);
  }
});

// UPDATE PAYMENT
const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).populate('orderId', 'name email total status');

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  } else {
    res.status(200).json(payment);
  }
});

// GET PAYMENTS BY STATUS
const getPaymentsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const payments = await Payment.find({ status }).populate('orderId', 'name email total status');
  
  if (!payments) {
    res.status(400);
    throw new Error("Payments were not fetched or something went wrong");
  } else {
    res.status(200).json(payments);
  }
});

export {
  getAllPayments,
  createPayment,
  deletePayment,
  getPaymentById,
  updatePayment,
  getPaymentsByStatus
};