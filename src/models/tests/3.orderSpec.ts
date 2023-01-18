import app from '../../server';
import dotenv from 'dotenv';
import request from 'supertest';
import { OrderStore, Order } from '../order.model';
import { OrderProductStore, OrderProduct } from '../order.products.model';

dotenv.config();

const ordStore = new OrderStore();
const orderProdStore = new OrderProductStore();
let orderNo: number;
let orderNum: number;
let test_pass: string;
if (process.env.TEST_PASSWORD) {
  test_pass = process.env.TEST_PASSWORD;
}

describe('3.0 Tests on Order and OrderProducts models and Endpoints', () => {
  describe('3.10 Test order and orderProducts model tests', () => {
    it('3.11 should have an index()', (): void => {
      expect(ordStore.index).toBeDefined();
    });
    it('3.12 should have a show()', async (): Promise<void> => {
      expect(ordStore.show).toBeDefined();
    });
    it('3.13 should have a create()', async (): Promise<void> => {
      expect(ordStore.create).toBeDefined();
    });
    it('3.14 should have an update()', async (): Promise<void> => {
      expect(ordStore.update).toBeDefined();
    });
    it('3.15 should have an addProduct()', async (): Promise<void> => {
      expect(orderProdStore.addProduct).toBeDefined();
    });
    it('3.16 Should create an Order', async (): Promise<void> => {
      const order: Order = {
        status: 'active',
        user_id: 1
      };
      const result = await ordStore.create(order);
      if (result.id) {
        orderNo = result.id;
      }
      expect(result).toBeTruthy();
    });
    it('3.17 Index(): Should return a list of orders', async () => {
      const result = await ordStore.index();
      expect(result).not.toBe([]);
    });
    it('3.18 show(): Should return the correct Order', async (): Promise<void> => {
      const result = await ordStore.show(orderNo as unknown as string);
      expect(result).toBeTruthy();
    });
    it('3.19 AddProduct(): should add a product to the order', async () => {
      const order: OrderProduct = {
        quantity: 12,
        order_id: orderNo,
        product_id: 1
      };

      const result = await orderProdStore.addProduct(
        order.quantity,
        order.order_id,
        order.product_id
      );

      expect(result.quantity).toEqual(12);
    });
    it('3.20 update(): Should return the updated Order', async (): Promise<void> => {
      const result = await ordStore.update(orderNo as unknown as string, {
        status: 'complete'
      });
      expect(result.status).toEqual('complete');
    });
  });

  describe('3.20_ Tests for Order and OrderProducts Endpoints', () => {
    let userToken: string;
    var originalTimeout: number;

    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    });

    it('3.21 Authenticate user and return token from this endpoint /api/v1/users/login', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ username: 'ivanepou', password: test_pass })
        .set('Accept', 'application/json');

      userToken = response.body.token;
      expect(userToken).toBeTruthy();
      expect(response.status).toEqual(200);
    });
    it('3.22 Create an Order from Endpoint: /api/v1/orders', async (): Promise<void> => {
      const order: Order = {
        status: 'active',
        user_id: 1
      };
      const response = await request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', `Basic ${userToken}`);
      orderNum = response.body.id;
      expect(response.status).toEqual(200);
    });
    it('3.23 Get all the Orders from Endpoint: /api/v1/orders', async (): Promise<void> => {
      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Basic ${userToken}`);
      expect(response.status).toEqual(200);
    });

    it('3.24 Get an Order by id from endpoint: /api/v1/orders/:id', async (): Promise<void> => {
      const response = await request(app)
        .get(`/api/v1/orders/${orderNum}`)
        .set('Authorization', `Basic ${userToken}`);
      expect(response.status).toEqual(200);
    });

    it('3.25 Create the order products from endpoint: /api/v1/orders/:id/products', async (): Promise<void> => {
      const response = await request(app)
        .post(`/api/v1/orders/${orderNum}/products`)
        .send({ quantity: 5, order_id: orderNum, product_id: 1 })
        .set('Authorization', `Basic ${userToken}`);
      expect(response.status).toEqual(200);
    });

    it('3.26 Update the order from endpoint: /api/v1/orders/:id', async (): Promise<void> => {
      const response = await request(app)
        .patch(`/api/v1/orders/${orderNum}`)
        .send({ status: 'complete' })
        .set('Authorization', `Basic ${userToken}`);

      expect(response.status).toEqual(200);
    });
  });
});
