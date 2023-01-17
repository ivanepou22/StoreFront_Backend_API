import express from 'express';
import users from './user';
import products from './product';

const routes = express.Router();

routes.use(users);
routes.use(products);
export default routes;
