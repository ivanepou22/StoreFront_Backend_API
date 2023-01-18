import client from '../providers/database.provider';
import { OrderStore } from './order.model';

export type OrderProduct = {
  id?: number;
  quantity: number;
  order_id: number;
  product_id: number;
};

const orderStor = new OrderStore();

export class OrderProductStore {
  async addProduct(
    quantity: number,
    orderId: number,
    productId: number
  ): Promise<OrderProduct> {
    try {
      const order = await orderStor.show(orderId as unknown as string);

      if (order.status == 'complete')
        throw new Error(
          `Could not add product ${productId} to a completed order ${orderId}.`
        );

      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';

      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);
      const order_result = result.rows[0];

      conn.release();

      return order_result;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}. Error: ${err}`
      );
    }
  }
}
