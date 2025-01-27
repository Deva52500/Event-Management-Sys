import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { EventProvider } from './EventContext';
import Layout from "./components/Layout";
import Home from './components/Home';
import EventDetails from './components/EventDetails';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Login from './components/Login';
import Register from './components/Register';


function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          </Layout>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}


export default App;
