# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `route: './api/v1/products' [GET]`
- Show (args:id) `route: './api/v1/products/:id' [GET]`
- Create (args: Product)[token required] `route: './api/v1/products' [POST]`
- Delete (args:id)[token required] `route: './products/:id' [DELETE]`
- Update (args:id)[token required] `route: './products/:id' [PATCH]`

#### Users

- Index [token required] `route: './api/v1/users' [GET]`
- Show (args: id)[token required] `route: './api/v1/users/:id' [GET]`
- Create (args: User)[token required] `route: './api/v1/users' [POST]`
- Delete (args: id)[token required] `route: './api/v1/users/:id' [DELETE]`
- Update (args: id)[token required] `route: './api/v1/users/:id' [PATCH]`
- Login (args: username, password) `route: './api/v1/users/login' [POST]`

#### Orders

- Index [token required] `route: './api/v1/orders' [GET]`
- Show (args: id)[token required] `route: './api/v1/orders/:id' [GET]`
- Create (args: Order)[token required] `route: './api/v1/orders' [POST]`
- Delete (args: id)[token required] `route: './api/v1/orders/:id' [DELETE]`
- Update (args: id)[token required] `route: './api/v1/orders/:id' [PATCH]`
- Add Product to Order (args: id)[token required] `route: './orders/:id/products' [POST]`

## Database Tables

#### Products

```sql
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    price DECIMAL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Users

```sql
CREATE TYPE roles AS ENUM ('user', 'admin');
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50),
    role roles,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders

```sql
CREATE TYPE Status AS ENUM ('active', 'complete');
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status Status,
    user_id BIGINT REFERENCES users(id)
);
```

#### Order Products

```sql
CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id)
);
```
