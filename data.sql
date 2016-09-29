DROP TABLE IF EXISTS users;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR,
  role INTEGER
);

INSERT INTO users (username, password, role)
  VALUES ('admin', 'test123', 1);
