import express from 'express';
import users from './user';
import products from './product';
import orders from './order';
import orderProducts from './orderProducts';

const routes = express.Router();

routes.use(users);
routes.use(products);
routes.use(orders);
routes.use(orderProducts);
export default routes;
