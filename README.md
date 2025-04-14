# Task Management App

A simple Task Management application built with **React**, **Node.js**, **Express**, and **MongoDB**.  
Users can register, log in, create tasks, filter tasks (completed/incomplete), and manage them efficiently.


## Tech Stack

- Frontend: **React.js**, **Bootstrap**
- Backend: **Node.js**, **Express.js**
- Database: **MongoDB**
- Authentication: **JWT**
- Styling: Bootstrap 5
- Environment Variables: dotenv


## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2. Set up backend
cd backend
npm install

Create a .env file in the backend folder and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

### 3. Set up the frontend
cd frontend
npm install

Browser opens at http://localhost:3000/login
