CREATE TYPE Status AS ENUM ('pending', 'completed');
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status Status,
    user_id BIGINT REFERENCES users(id)
);