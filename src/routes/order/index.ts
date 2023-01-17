import express from 'express';
import {
  getOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder
} from '../../handlers/order.controller';
import { verifyJWTToken } from '../../middleware/jwt.middleware';

const orders = express.Router();

orders.get('/orders', verifyJWTToken, getOrders);
orders.get('/orders/:id', verifyJWTToken, getOrderById);
orders.delete('/orders/:id', verifyJWTToken, deleteOrder);
orders.patch('/orders/:id', verifyJWTToken, updateOrder);
orders.post('/orders', verifyJWTToken, createOrder);

export default orders;
