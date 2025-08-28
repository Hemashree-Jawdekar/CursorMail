-- Create the database
CREATE DATABASE cursor_mail;

-- Use the new database
USE cursor_mail;

-- Create the users table with email support
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  app_password VARCHAR(255) NOT NULL,
  profile_photo_path VARCHAR(500),
  profile_photo_filename VARCHAR(255)
);