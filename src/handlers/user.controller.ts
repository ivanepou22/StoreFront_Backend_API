import { Request, Response } from 'express';
import { User, UserUpdate, UserStore } from '../models/user.model';
import { generateJWT } from '../middleware/jwt.middleware';
import dotenv from 'dotenv';

dotenv.config();

const store = new UserStore();

//Show all the users
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//show user by id
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//show user by username
export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await store.showByUsername(req.params.username);
    res.json(user);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//delete a user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedUser = await store.delete(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//edit/update
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: UserUpdate = {};
    if (req.body.first_name) {
      user.first_name = req.body.first_name;
    }
    if (req.body.last_name) {
      user.last_name = req.body.last_name;
    }
    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.role) {
      user.role = req.body.role;
    }

    const updatedUser = await store.update(req.params.id, user);
    res.json({
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      updated_at: updatedUser.updated_at
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//create a user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password
    };

    const newUser = await store.create(user);
    const payload: UserUpdate = {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send('Missing TOKEN_SECRET env variable');
      return;
    }
    // Generate a JWT token for the user
    const token = generateJWT(payload, process.env.TOKEN_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// Authenticate a user
export const authenticate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await store.authenticate(username, password);
    if (user) {
      if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Missing TOKEN_SECRET env variable');
        return;
      }

      const payload: UserUpdate = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        role: user.role
      };

      // Generate a JWT token for the user
      const token = generateJWT(payload, process.env.TOKEN_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};
