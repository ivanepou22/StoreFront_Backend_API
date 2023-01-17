import client from '../providers/database.provider';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

export type OrderUpdate = {
  id?: number;
  status?: string;
  user_id?: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      const result = await client.query(sql);
      const orders = result.rows;
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Orders ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await client.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find the Order ${id} Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status,user_id) VALUES($1,$2) RETURNING *';
      const result = await client.query(sql, [o.status, o.user_id]);
      const newOrder = result.rows[0];
      return newOrder;
    } catch (err) {
      throw new Error(`Could not create new Order. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const result = await client.query(sql, [id]);
      const order = result.rows[0];
      return order;
    } catch (err) {
      throw new Error(`Could not delete the Order ${id}. Error: ${err}`);
    }
  }

  async update(id: string, o: OrderUpdate): Promise<OrderUpdate> {
    try {
      let updates: string[] = [];
      let values: (string | number)[] = [];

      if (o.status) {
        updates.push(`status = $${values.length + 1}`);
        values.push(o.status);
      }
      values.push(id);

      const sql = `UPDATE orders
                   SET ${updates.join(', ')}
                   WHERE id = $${values.length}
                   RETURNING *`;
      const result = await client.query(sql, values);
      const updatedOrder: OrderUpdate = result.rows[0];
      return updatedOrder;
    } catch (err) {
      throw new Error(`Could not update Order: ${o.id}. Error: ${err}`);
    }
  }
}
