import { ProductStore, Product } from '../product.model';
import app from '../../server';
import dotenv from 'dotenv';
import request from 'supertest';

dotenv.config();

const store = new ProductStore();
let test_pass: string;
if (process.env.TEST_PASSWORD) {
  test_pass = process.env.TEST_PASSWORD;
}

describe('2.0 Tests on Product model and Endpoints', () => {
  describe('2.10 Test product model tests', () => {
    it('2.11 should have an index()', (): void => {
      expect(store.index).toBeDefined();
    });
    it('2.12 should have a show()', async (): Promise<void> => {
      expect(store.show).toBeDefined();
    });
    it('2.13 should have a create()', async (): Promise<void> => {
      expect(store.create).toBeDefined();
    });
    it('2.14 should have an update()', async (): Promise<void> => {
      expect(store.update).toBeDefined();
    });

    it('2.15 Should create a product', async (): Promise<void> => {
      const product: Product = {
        name: 'Adidas 280',
        price: 250
      };
      const result = await store.create(product);
      expect(result.name).toEqual(product.name);
    });

    it('2.16 Should return a list of Products', async (): Promise<void> => {
      const result = await store.index();
      expect(result).toBeTruthy();
    });

    it('2.17 Should return the correct Product', async (): Promise<void> => {
      const result = await store.show('1');
      expect(result).toBeTruthy();
    });
    it('2.18 update method should return the updated product', async (): Promise<void> => {
      const result = await store.update('1', { name: 'Nike 485' });
      expect(result.name).toEqual('Nike 485');
    });
  });

  describe('2.20_ Test the product Endpoints', () => {
    let userToken: string;
    var originalTimeout: number;

    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    });

    it('2.21 Authenticate user and return token from this endpoint /api/v1/users/login', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ username: 'ivanepou', password: test_pass })
        .set('Accept', 'application/json');

      userToken = response.body.token;
      expect(userToken).toBeTruthy();
      expect(response.status).toEqual(200);
    });

    it('2.22 Create a product from endpoint: /api/v1/products', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/products')
        .send({ name: 'Jordan 234', price: '502' })
        .set('Authorization', `Basic ${userToken}`);

      expect(response.status).toEqual(200);
    });

    it('2.23 Gets the products from endpoint: /api/v1/products', async (): Promise<void> => {
      const response = await request(app).get('/api/v1/products');
      expect(response.status).toEqual(200);
    });

    it('2.24 Gets a product from endpoint: /api/v1/products/:id', async (): Promise<void> => {
      const response = await request(app).get('/api/v1/products/1');
      expect(response.status).toEqual(200);
    });

    it('2.25 Update a product from endpoint: /api/v1/products/:id', async (): Promise<void> => {
      const response = await request(app)
        .patch('/api/v1/products/1')
        .send({ price: '60' })
        .set('Authorization', `Basic ${userToken}`);

      expect(response.status).toEqual(200);
    });
  });
});
