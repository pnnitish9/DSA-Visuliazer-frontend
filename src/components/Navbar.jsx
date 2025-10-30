import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../context/AuthContext";
import { User } from "lucide-react"; //Import person icon

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header>
      <nav className="navbar">
        <div className="nav-left">
          <Link className="nav-link" to={"/"}>
            Home
          </Link>
        </div>
        <h1>DSA Visualizer</h1>
        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <Link className="nav-link" to={"/login"}>
                login
              </Link>
              <Link className="nav-link" to={"/register"}>
                register
              </Link>
            </>
          ) : (
            <>
              <Link to="/useraccount" className="nav-link" title="User Account">
                <User size={24} />
              </Link>
              <span className="nav-user">{user?.name || "User"}</span>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
