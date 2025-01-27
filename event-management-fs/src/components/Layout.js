import React, { useContext } from "react";
import Header from "./Header";
import { AuthContext } from "../AuthContext";


const Layout = ({ children }) => {
const { user } = useContext(AuthContext);
  return (
    <div>
      {user && <Header />}
      <main>{children}</main>   
    </div>
  );
};

export default Layout;
