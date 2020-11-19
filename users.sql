DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    id SERIAL   PRIMARY KEY,
    first       VARCHAR(255) NOT NULL,
    last        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    bio         VARCHAR (255),
    url         VARCHAR (255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

      CREATE TABLE reset_codes(
    id SERIAL   PRIMARY KEY,
    email       VARCHAR NOT NULL,
    code        VARCHAR NOT NULL,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

   CREATE TABLE friendships(
   id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id) NOT NULL,
   recipient_id INT REFERENCES users(id) NOT NULL,
   accepted BOOLEAN DEFAULT false
 );

 DROP TABLE IF EXISTS chat CASCADE;
CREATE TABLE chat(
  id SERIAL PRIMARY KEY,
  message TEXT,
  user_id INT REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );