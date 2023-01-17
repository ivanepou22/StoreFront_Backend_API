import { Request, Response } from 'express';
import {
  OrderProduct,
  OrderProductStore
} from '../models/order.products.model';

const store = new OrderProductStore();

export const addProduct = async (req: Request, res: Response) => {
  const order: OrderProduct = {
    quantity: parseInt(req.body.quantity),
    order_id: parseInt(req.params.id),
    product_id: parseInt(req.body.product_id)
  };

  try {
    const order_details = await store.addProduct(
      order.quantity,
      order.order_id,
      order.product_id
    );
    res.json(order_details);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
