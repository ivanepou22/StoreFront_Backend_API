import client from '../providers/database.provider';

export type Product = {
  id?: number;
  name: string;
  price: number;
};

export type ProductUpdate = {
  id?: number;
  name?: string;
  price?: number;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products';
      const result = await client.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get Products ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await client.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find the product ${id} Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql = 'INSERT INTO products (name,price) VALUES($1,$2) RETURNING *';
      const result = await client.query(sql, [p.name, p.price]);
      const newProduct = result.rows[0];
      return newProduct;
    } catch (err) {
      throw new Error(`Could not create new product. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const result = await client.query(sql, [id]);
      const product = result.rows[0];
      return product;
    } catch (err) {
      throw new Error(`Could not delete the product ${id}. Error: ${err}`);
    }
  }

  async update(id: string, p: ProductUpdate): Promise<ProductUpdate> {
    try {
      const updates: string[] = [];
      const values: (string | number)[] = [];

      if (p.name) {
        updates.push(`name = $${values.length + 1}`);
        values.push(p.name);
      }
      if (p.price) {
        updates.push(`price = $${values.length + 1}`);
        values.push(p.price);
      }

      values.push(id);

      const sql = `UPDATE products
                   SET ${updates.join(', ')}
                   WHERE id = $${values.length}
                   RETURNING *`;
      const result = await client.query(sql, values);
      const updatedProduct: ProductUpdate = result.rows[0];
      return updatedProduct;
    } catch (err) {
      throw new Error(`Could not update Product: ${p.id}. Error: ${err}`);
    }
  }
}
