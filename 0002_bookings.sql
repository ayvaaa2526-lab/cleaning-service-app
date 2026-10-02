PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS clearly_booking (
  id TEXT PRIMARY KEY NOT NULL,
  request_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'deep', 'reno')),
  area REAL NOT NULL CHECK (area >= 10 AND area <= 300),
  extras TEXT NOT NULL DEFAULT '[]',
  currency TEXT NOT NULL CHECK (currency IN ('GEL', 'USD')),
  amount REAL NOT NULL CHECK (amount >= 0),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES clearly_user(id) ON DELETE CASCADE,
  UNIQUE (user_id, request_id)
);
CREATE INDEX IF NOT EXISTS clearly_booking_user_created_idx ON clearly_booking(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS clearly_booking_created_idx ON clearly_booking(created_at DESC);
