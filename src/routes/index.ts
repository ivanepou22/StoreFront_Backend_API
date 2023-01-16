import express from 'express';
import users from './users';

const routes = express.Router();

routes.use(users);
export default routes;
