import { Request, Response } from 'express';
import { Order, OrderUpdate, OrderStore } from '../models/order.model';

const store = new OrderStore();

//Show all the Orders
export const getOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//show order by id
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

//delete a order
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedOrder = await store.delete(req.params.id);
    res.json(deletedOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//create a order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order: Order = {
      status: req.body.status,
      user_id: req.body.user_id
    };
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

//edit/update order
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order: OrderUpdate = {};
    if (req.body.status) {
      order.status = req.body.status;
    }

    const updatedOrder = await store.update(req.params.id, order);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
