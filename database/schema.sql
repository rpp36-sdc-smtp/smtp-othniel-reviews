DROP SCHEMA IF EXISTS sdc;
CREATE SCHEMA sdc;

CREATE TABLE sdc.products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price TEXT
);

CRATE TABLE sdc.characteristics (
  id SERIAL PRIMARY KEY,
  name TEXT,
  value_total INT DEFAULT 0,
  value_count INT DEFAULT 0,
  product_id INT references sdc.products,
  UNIQUE (id, product_id)
);

CREATE TABLE sdc.reviews (
  id SERIAL PRIMARY KEY,
  reviewer_name TEXT,
  reviewer_email TEXT,
  rating INT,
  summary TEXT,
  recommend boolean,
  body TEXT,
  date BIGINT,
  response TEXT NULL,
  helpfulness INT DEFAULT 0,
  reported BOOLEAN DEFAULT FALSE,
  product_id INT references sdc.products,
  UNIQUE (id, product_id)
);

CREATE TABLE sdc.photos (
  id SERIAL PRIMARY KEY,
  url TEXT,
  review_id INT references sdc.reviews(id),
  UNIQUE (id, review_id)
);