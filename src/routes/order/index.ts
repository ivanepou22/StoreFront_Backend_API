import express from 'express';
import {
  getOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder
} from '../../handlers/order.controller';

const orders = express.Router();

orders.get('/orders', getOrders);
orders.get('/order/:id', getOrderById);
orders.delete('/order/:id', deleteOrder);
orders.patch('/order/:id', updateOrder);
orders.post('/order', createOrder);

export default orders;
