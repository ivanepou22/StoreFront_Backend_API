import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct
} from '../../handlers/product.controller';

const products = express.Router();

products.get('/products', getProducts);
products.get('/product/:id', getProductById);
products.delete('/product/:id', deleteProduct);
products.patch('/product/:id', updateProduct);
products.post('/product', createProduct);

export default products;
