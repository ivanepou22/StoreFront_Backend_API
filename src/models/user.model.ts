import client from '../providers/database.provider';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds: string = process.env.SALT_ROUNDS || '10';
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
};

export type UserUpdate = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const sql =
        'SELECT id,first_name, last_name, username,email,role,created_at,updated_at FROM users';
      const result = await client.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Users ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql =
        'SELECT id,first_name, last_name, username,email,role,created_at,updated_at FROM users WHERE id=($1)';
      const result = await client.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find the user ${id} Error: ${err}`);
    }
  }

  async showByUsername(username: string): Promise<User> {
    try {
      const sql =
        'SELECT first_name, last_name, username,email,role,created_at,updated_at FROM users WHERE username=($1)';
      const result = await client.query(sql, [username]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find the user ${username} Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(
        u.password + pepper,
        parseInt(saltRounds)
      );
      const sql =
        'INSERT INTO users (first_name, last_name, username, password,email,role) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *';
      const result = await client.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hashedPassword,
        u.email,
        u.role
      ]);
      const newUser = result.rows[0];
      return newUser;
    } catch (err) {
      throw new Error(`Could not create new user. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const result = await client.query(sql, [id]);
      const user = result.rows[0];
      return user;
    } catch (err) {
      throw new Error(`Could not delete the user ${id}. Error: ${err}`);
    }
  }

  async update(id: string, u: UserUpdate): Promise<UserUpdate> {
    try {
      let updates: string[] = [];
      let values: (string | number)[] = [];

      if (u.first_name) {
        updates.push(`first_name = $${values.length + 1}`);
        values.push(u.first_name);
      }
      if (u.last_name) {
        updates.push(`last_name = $${values.length + 1}`);
        values.push(u.last_name);
      }
      if (u.username) {
        updates.push(`username = $${values.length + 1}`);
        values.push(u.username);
      }
      if (u.email) {
        updates.push(`email = $${values.length + 1}`);
        values.push(u.email);
      }
      if (u.role) {
        updates.push(`role = $${values.length + 1}`);
        values.push(u.role);
      }

      values.push(id);

      const sql = `UPDATE users
                   SET ${updates.join(', ')}
                   WHERE id = $${values.length}
                   RETURNING *`;
      const result = await client.query(sql, values);
      const updatedUser: UserUpdate = result.rows[0];
      return updatedUser;
    } catch (err) {
      throw new Error(`Could not update user ${u.id}. Error: ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE username=($1)';
    const result = await client.query(sql, [username]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
    }
    return null;
  }
}
