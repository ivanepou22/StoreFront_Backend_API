import { UserStore, User } from '../user.model';
import app from '../../server';
import dotenv from 'dotenv';
import request from 'supertest';

dotenv.config();
const store = new UserStore();
let test_pass: string;
if (process.env.TEST_PASSWORD) {
  test_pass = process.env.TEST_PASSWORD;
}
describe('1.0 Tests on User model and Endpoints', () => {
  describe('1.10 Testing the user model Methods', () => {
    it('1.11 should have a create()', async (): Promise<void> => {
      expect(store.create).toBeDefined();
    });
    it('1.12 should have an index()', async (): Promise<void> => {
      expect(store.index).toBeDefined();
    });
    it('1.13 should have a show()', async (): Promise<void> => {
      expect(store.show).toBeDefined();
    });

    it('1.14 create method should add a user', async (): Promise<void> => {
      const user: User = {
        first_name: 'Ivan',
        last_name: 'Epou',
        username: 'ivanepou',
        email: 'ivanepou@gmail.com',
        role: 'user',
        password: test_pass
      };
      const result = await store.create(user);
      expect(result.email).toEqual('ivanepou@gmail.com');
    });

    it('1.15 index method should return a list of users', async (): Promise<void> => {
      const result = await store.index();
      expect(result[0].username).toEqual('ivanepou');
    });

    it('1.16 show method should return the correct user', async (): Promise<void> => {
      const result = await store.show('1');
      expect(result.username).toEqual('ivanepou');
    });

    it('1.17 update method should return the updated user', async (): Promise<void> => {
      const result = await store.update('1', { last_name: 'Jobs' });
      expect(result.last_name).toEqual('Jobs');
    });

    it('1.18 authenticate method should be true', async (): Promise<void> => {
      const result = await store.authenticate('ivanepou', test_pass);
      if (result) {
        expect(result.username).toEqual('ivanepou');
      }
    });
  });

  describe('1.2_ Testing the user Endpoints', () => {
    let userToken: string;
    var originalTimeout: number;

    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    });

    it('1.21 Authenticate user and return token from this endpoint /api/v1/users/login', async (): Promise<void> => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({ username: 'ivanepou', password: test_pass })
        .set('Accept', 'application/json');

      userToken = response.body.token;
      expect(userToken).toBeTruthy();
      expect(response.status).toEqual(200);
    });

    it('1.22 Create a user: /api/v1/users', async (): Promise<void> => {
      const user: User = {
        first_name: 'Dyron',
        last_name: 'Epou',
        username: 'dyronepou',
        email: 'dyronepou@gmail.com',
        role: 'admin',
        password: test_pass
      };
      const response = await request(app)
        .post('/api/v1/users')
        .send(user)
        .set('Authorization', `Basic ${userToken}`);
      expect(response.status).toEqual(200);
    });

    it('1.23 Get all the users from Endpoint /api/v1/users', async (): Promise<void> => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Basic ${userToken}`);
      expect(response.status).toEqual(200);
    });

    it('1.24 Get a user by id from /api/v1/users/:id endpoint', async (): Promise<void> => {
      const response = await request(app)
        .get('/api/v1/users/1')
        .set('Authorization', `Basic ${userToken}`);
      expect(response.status).toEqual(200);
    });

    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
  });
});
