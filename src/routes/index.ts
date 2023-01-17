import express from 'express';
import users from './user';
import products from './product';
import orders from './order';

const routes = express.Router();

routes.use(users);
routes.use(products);
routes.use(orders);

export default routes;
