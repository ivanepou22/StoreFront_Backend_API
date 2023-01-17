import express from 'express';
import { addProduct } from '../../handlers/order.products.controller';
import { verifyJWTToken } from '../../middleware/jwt.middleware';

const orderProducts = express.Router();

orderProducts.post('/orders/:id/products', verifyJWTToken, addProduct);

export default orderProducts;
