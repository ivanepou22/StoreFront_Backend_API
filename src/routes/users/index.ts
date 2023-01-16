import express from 'express';
import {
  getUsers,
  getUserById,
  getUserByUsername,
  deleteUser,
  updateUser,
  createUser,
  authenticate
} from '../../handlers/user.controller';

const users = express.Router();

users.get('/users', getUsers);
users.get('/user/:id', getUserById);
users.get('/user/username/:username', getUserByUsername);
users.delete('/user/:id', deleteUser);
users.patch('/user/:id', updateUser);
users.post('/user', createUser);
users.post('/login', authenticate);

export default users;
