CREATE TABLE clearly_booking (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES clearly_user(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily','deep','reno')),
  area INTEGER NOT NULL CHECK (area BETWEEN 20 AND 300),
  extras TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('GEL','USD')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  total_gel INTEGER NOT NULL CHECK (total_gel >= 0),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','completed','cancelled')),
  created_at INTEGER NOT NULL,
  UNIQUE (user_id, request_id)
);
CREATE INDEX clearly_booking_user_date ON clearly_booking(user_id, created_at DESC);
CREATE INDEX clearly_booking_date ON clearly_booking(created_at DESC);
