import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        setLoginOpen(false);
        toast.success("Login Successful!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration Successful!");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    toast.success("Logged Out!");
  };

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] gray-800">
        <div className="logo mt-[20px]">
          <h3 className="text-[25px] font-[700] sp-text">GenUI</h3>
        </div>

        <div className="icons flex items-center gap-[15px]">
          <div className="icon cursor-pointer" title="Support">
            <RiCustomerService2Fill />
          </div>

          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user.name}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              className="icon cursor-pointer flex items-center gap-2"
              onClick={() => setLoginOpen(true)}
            >
              <FaUser />
            </div>
          )}
        </div>
      </div>

      
      {loginOpen &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-xl w-[400px] h-[450px]">
              <h2 className="text-xl font-bold">Login</h2>

              <input
                className="border p-2 w-full mt-3 rounded"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="border p-2 w-full mt-3 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border p-2 w-full mt-3 rounded"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="bg-green-600 text-white w-full mt-4 p-2 rounded hover:bg-green-700"
                onClick={handleRegister}
              >
                Register
              </button>

              <button
                className="bg-black text-white w-full mt-4 p-2 rounded hover:bg-gray-800"
                onClick={handleLogin}
              >
                Login
              </button>

              <button
                className="mt-2 text-red-500"
                onClick={() => setLoginOpen(false)}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Navbar;
