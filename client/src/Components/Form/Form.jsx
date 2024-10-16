import React, { useState } from "react";
import axios from "axios";

const AuthForm = () => {
  // State for login form
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // State for signup form
  const [signupData, setSignupData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null
  });
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Handle input changes for login
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/login", loginData, {
        withCredentials: true
      });
      if (response.status === 200) {
        setLoginData({ username: "", password: "" });
        setLoginError(null);
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login failed!");
    }
  };

  // Handle input changes for signup
  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;
    setSignupData({
      ...signupData,
      [name]: files ? files[0] : value
    });
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);
    const formData = new FormData();

    Object.keys(signupData).forEach((key) => {
      formData.append(key, signupData[key]);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/v1/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.status === 201) {
        setSignupSuccess(true);
        setSignupData({
          fullname: "",
          username: "",
          email: "",
          password: "",
          avatar: null,
          coverImage: null
        });
      }
    } catch (error) {
      setSignupError(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8">
      {/* Login Form */}
      <div className="p-8 bg-[#001925] border-l-4 border-[#caf438] mb-8">
        <h2 className="text-white text-xl font-extrabold mb-5">Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={loginData.username}
            onChange={handleLoginChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#caf438] hover:text-[#ff7a01]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {loginError && <p className="text-red-500 mb-5">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-[#caf438] text-[#001925] font-bold py-3 text-center border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#ff7a01] transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>

      {/* Signup Form */}
      <div className="p-8 bg-[#001925] border-l-4 border-[#caf438]">
        <h2 className="text-white text-xl font-extrabold mb-5">Signup</h2>
        <form onSubmit={handleSignupSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={signupData.fullname}
            onChange={handleSignupChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={signupData.username}
            onChange={handleSignupChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupData.email}
            onChange={handleSignupChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupData.password}
            onChange={handleSignupChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
          />
          <input
            type="file"
            name="avatar"
            onChange={handleSignupChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
            accept="image/*"
          />
          <input
            type="file"
            name="coverImage"
            onChange={handleSignupChange}
            className="w-full p-3 mb-5 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
            accept="image/*"
          />
          {signupError && <p className="text-red-500 mb-5">{signupError}</p>}
          {signupSuccess && <p className="text-green-500 mb-5">Signup successful!</p>}
          <button
            type="submit"
            className="w-full bg-[#caf438] text-[#001925] font-bold py-3 text-center border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#ff7a01] transition-all duration-200"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
