import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Data", data);
      if (response.ok) {
        console.log(localStorage.getItem('token'));
        //login(localStorage.getItem('token'));
        login(data.token);
        navigate('/home');
      } else {
        alert(data.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const toRegister = ()=>{
  navigate('/register')
}
  return (
     <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
      <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required class="form-control" id="exampleInputPassword1" placeholder="Password"/>
        </div>


        <button type="submit">Login</button>
        <button onClick={toRegister}>Register</button>
      </form>
    </div>
  );
}

export default Login;
