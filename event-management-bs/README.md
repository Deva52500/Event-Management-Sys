# The backend of Event Management System is built using Node.js, Express.js, and Prisma ORM

# Prerequisites

Node.js (>= 16.x)

npm or yarn

MySQL Database

# Installation

git clone <repository-url>

cd event-management-bs

Install dependencies:

### `npm install`

## Configuration

Create a .env file with the following details.

DATABASE_URL="mysql://User:Password@localhost:3306/ database name"

JWT_SECRET="SECREt KEY"

## Database Setup

`npx prisma generate`

`npx prisma migrate dev --name init`

## Available Scripts

In the project directory, you can run:

### `node app.js`

