import Order from "../models/banner.model.js";
import asyncHandler from "express-async-handler";

// CREATE ORDER
const createOrder = asyncHandler(async (req, res) => {
  const newOrder = Order(req.body);
  const savedOrder = await newOrder.save();
  if (!savedOrder) {
    res.status(400);
    throw new Error("Order was not created");
  } else {
    res.status(201).json(savedOrder);
  }
});

// UPDATE ORDER
const updateOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.paramas.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedOrder) {
    res.status(400);
    throw new Error("Order was not updated");
  } else {
    res.status(201).json(updatedOrder);
  }
});

// DELETE ORDER
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    res.status(400);
    throw new Error("order was not deleted successfully");
  } else {
    res.status(200).json(order);
  }
});

// GET USER ORDER
const getUserOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.id }).reverse();
  if (!orders) {
    res.status(400);
    throw new Error("No order was found or something went wrong");
  } else {
    res.status(200).json(orders);
  }
});

// GET ALL ORDERS
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  if (!orders) {
    res.status(400);
    throw new Error("No order was found or something went wrong");
  } else {
    res.status(200).json(orders);
  }
});

export { getAllOrders, getUserOrder, deleteOrder, createOrder, updateOrder };
