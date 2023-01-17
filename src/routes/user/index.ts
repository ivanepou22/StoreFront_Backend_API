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
import { verifyJWTToken } from '../../middleware/jwt.middleware';

const users = express.Router();

users.get('/users', verifyJWTToken, getUsers);
users.get('/users/:id', verifyJWTToken, getUserById);
users.get('/users/username/:username', verifyJWTToken, getUserByUsername);
users.delete('/users/:id', verifyJWTToken, deleteUser);
users.patch('/users/:id', verifyJWTToken, updateUser);
users.post('/users', createUser);
users.post('/users/login', authenticate);

export default users;
