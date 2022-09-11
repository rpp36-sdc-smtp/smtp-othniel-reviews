DROP DATABASE IF EXISTS sdc;
CREATE DATABASE sdc;

\c sdc
DROP SCHEMA IF EXISTS sdc;
CREATE SCHEMA sdc;

CREATE TABLE products (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "slogan" TEXT,
  "description" TEXT,
  "category" TEXT,
  "default_price" TEXT
);

CREATE TABLE characteristics (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "value_total" INT DEFAULT 0,
  "value_count" INT DEFAULT 0,
  "product_id" INT references products,
  UNIQUE (id, product_id)
);

CREATE TABLE reviews (
  "id" SERIAL PRIMARY KEY,
  "reviewer_name" TEXT,
  "reviewer_email" TEXT,
  "rating" INT,
  "summary" TEXT,
  "recommend" boolean,
  "body" TEXT,
  "date" numeric,
  "response" TEXT NULL,
  "helpfulness" INT DEFAULT 0,
  "reported" BOOLEAN DEFAULT FALSE,
  "product_id" INT references products,
  UNIQUE (id, product_id)
);

CREATE TABLE photos (
  "id" SERIAL PRIMARY KEY,
  "url" TEXT,
  "review_id" INT references reviews(id),
  UNIQUE (id, review_id)
);

CREATE TABLE characteristicreview (
  "id" SERIAL PRIMARY KEY,
  "characteristic_id" INT references characteristics(id),
  "review_id" INT references reviews(id),
  "value" INT
);

-- CREATE INDEX review_product ON reviews(product_id);
-- CREATE INDEX char_product ON characteristics(product_id);
-- CREATE INDEX char_index ON characteristicreview(characteristic_id);
-- CREATE INDEX review_index ON characteristicreview(review_id);
-- CREATE INDEX photo_reviews ON photos(review_id);