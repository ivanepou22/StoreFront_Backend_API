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

describe('1. Testing the user model Methods', () => {
  it('1.1 should have a create()', function (): void {
    expect(store.create).toBeDefined();
  });
  it('1.2 should have an index()', function (): void {
    expect(store.index).toBeDefined();
  });
  it('1.3 should have a show()', function (): void {
    expect(store.show).toBeDefined();
  });
  it('1.4 should have an update()', function (): void {
    expect(store.update).toBeDefined();
  });
  it('1.5 should have an delete()', function (): void {
    expect(store.delete).toBeDefined();
  });

  it('1.6 create method should add a user', async function (): Promise<void> {
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

  it('1.7 index method should return a list of users', async function (): Promise<void> {
    const result = await store.index();

    expect(result[0].username).toEqual('ivanepou');
  });

  it('1.8 show method should return the correct user', async function (): Promise<void> {
    const result = await store.show('1');

    expect(result.username).toEqual('ivanepou');
  });

  it('1.9 authenticate method should be true', async function (): Promise<void> {
    const result = await store.authenticate('ivanepou', test_pass);
    if (result) {
      expect(result.username).toEqual('ivanepou');
    }
  });
});

describe('2.0 Testing the user Endpoints', (): void => {
  let userToken: string;

  var originalTimeout: number;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
  });

  it('2.1 Authenticate user and return token from this endpoint /api/v1/users/login', async (): Promise<void> => {
    const response = await request(app)
      .post('/api/v1/users/login')
      .send({ username: 'ivanepou', password: test_pass })
      .set('Accept', 'application/json');

    userToken = response.body.token;

    expect(userToken).toBeTruthy();
    expect(response.status).toEqual(200);
  });

  it('2.2 Create a user: /api/v1/users', async (): Promise<void> => {
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

  it('2.3 Get all the users from Endpoint /api/v1/users', async (): Promise<void> => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Basic ${userToken}`);

    expect(response.status).toEqual(200);
  });

  it('2.4 Get a user by id from /api/v1/users/:id endpoint', async (): Promise<void> => {
    const response = await request(app)
      .get('/api/v1/users/1')
      .set('Authorization', `Basic ${userToken}`);

    expect(response.status).toEqual(200);
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
