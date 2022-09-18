CREATE SCHEMA IF NOT EXISTS notcord;

CREATE TABLE IF NOT EXISTS notcord.users (
    id VARCHAR(70) PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notcord.oauth2_credentials (
    client_id VARCHAR(70) PRIMARY KEY,
    client_secret VARCHAR(32) NOT NULL,
    redirect_uri TEXT NOT NULL,
    owner_id VARCHAR(70) NOT NULL
);