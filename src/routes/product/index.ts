import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct
} from '../../handlers/product.controller';
import { verifyJWTToken } from '../../middleware/jwt.middleware';

const products = express.Router();

products.get('/products', getProducts);
products.get('/products/:id', getProductById);
products.delete('/products/:id', verifyJWTToken, deleteProduct);
products.patch('/products/:id', verifyJWTToken, updateProduct);
products.post('/products', verifyJWTToken, createProduct);

export default products;
