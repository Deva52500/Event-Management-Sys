import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <header style={{ padding: "10px", backgroundColor: "#f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      
      <div>
      <h1>Event Management System</h1><br/>
      </div>
      <button onClick={handleLogout} >
        Logout
      </button>
    </header>
  );
};

export default Header;
