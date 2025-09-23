-- Initialize the database for Architech SaaS platform
-- This file is executed when the PostgreSQL container starts

-- Create the main database if it doesn't exist
-- (Note: The database is already created by POSTGRES_DB env var)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create any additional users or permissions if needed
-- For development, we'll use the default postgres user

-- Set up proper timezone
SET timezone = 'UTC'; 