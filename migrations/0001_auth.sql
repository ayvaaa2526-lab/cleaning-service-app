create table "clearly_user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" integer not null, "image" text, "createdAt" date not null, "updatedAt" date not null);

create table "clearly_session" ("id" text not null primary key, "expiresAt" date not null, "token" text not null unique, "createdAt" date not null, "updatedAt" date not null, "ipAddress" text, "userAgent" text, "userId" text not null references "clearly_user" ("id") on delete cascade);

create table "clearly_account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "clearly_user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" date, "refreshTokenExpiresAt" date, "scope" text, "password" text, "createdAt" date not null, "updatedAt" date not null);

create table "clearly_verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" date not null, "createdAt" date not null, "updatedAt" date not null);

create table "clearly_rate_limit" ("id" text not null primary key, "key" text not null unique, "count" integer not null, "lastRequest" bigint not null);

create index "clearly_session_userId_idx" on "clearly_session" ("userId");

create index "clearly_account_userId_idx" on "clearly_account" ("userId");

create index "clearly_verification_identifier_idx" on "clearly_verification" ("identifier");
