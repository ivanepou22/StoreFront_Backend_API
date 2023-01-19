# Storefront Backend Project

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. I have been tasked with building the API that will support this application, and your coworker is building the frontend.

## Project setup

First, clone this repo:

```bash
git clone https://github.com/ivanepou22/StoreFront_Backend_API.git
```

### Ports

Our database will be running on the default port 5432 and our webServer will be running on port 3000

## 1. DB Creation and Migrations

### (i) Dev Database

#### In a terminal tab, create and run the database:

1. switch to the postgres user

```bash
su postgres
```

2. start psql

```bash
psql postgres
```

3. in psql run the following:
   ```sql
   CREATE USER udacity WITH PASSWORD '1234udacity';
   ```
   ```sql
   CREATE DATABASE store_front;
   ```
   ```sql
   \c store_front
   ```
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE store_front TO udacity;
   ```

### () Test Database

#### In a terminal tab, create and run the database:

1. switch to the postgres database

```bash
\c postgres
```

2. run the following:
   ```sql
   CREATE DATABASE store_front_test;
   ```
   ```sql
   \c store_front_test
   ```
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE store_front_test TO udacity;
   ```

## (ii) Now you need to install the dependencies for the project.

### Set up the dependencies

```bash
npm install
```

### Lint the code using Eslint

```bash
npm run lint
```

### Format the code using Prettier

```bash
npm run format
```

### Install DB Migrate

Make sure you exit psql and run this command

```bash
npm install -g db-migrate
```

```bash
npm install -g db-migrate-pg
```

### () Run DB Migrate

Run the following command

```bash
db-migrate up
```

### () Run DB Migrate down

Run the following command to reverse the migrations above.

```bash
    db-migrate down
```

### () Run Unit Tests

Run the following command

```
npm run test
```

### () Startup the server

Run the following command

```
npm run start
```

### () Add environment variables

1. Create the .env file:

```env
#Dev Database
PORT = 3000
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_front
POSTGRES_USER=udacity
POSTGRES_PASSWORD=Vision2301
TEST_PASSWORD=1234ivan

#Test Database
POSTGRES_TEST_DB=store_front_test

#environment
ENV=test

#Secrets
BCRYPT_PASSWORD=5425785wue44r15e8
SALT_ROUNDS=10
TOKEN_SECRET=dhd93hd9d89d12d2f3
```
