CREATE DATABASE skillsDB;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  skill VARCHAR(255) NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced'))
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL CHECK (duration > 0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);