import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { motion ,useAnimation } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import UploadedAudio from "../UploadedAudio/UploadedAudio";
import { MdUpload, MdLogout } from "react-icons/md";
import { LuMusic2 } from "react-icons/lu";

const AuthForm = () => {
  const [formType, setFormType] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });
  const [audioFile, setAudioFile] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [signupSuccessModal, setSignupSuccessModal] = useState(false);
  const [showUploadedAudio, setShowUploadedAudio] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUploadedAudio(true);
    }, 3000); // Show after 2 seconds
  
    return () => clearTimeout(timer);
  }, []);
  
  // Create animation controls for the UploadedAudio component
  const controls = useAnimation();
  
  // Use an effect to start the animation when it becomes visible
  useEffect(() => {
    if (showUploadedAudio) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [showUploadedAudio, controls]);
  

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("/api/v1/users/me", {
          withCredentials: true,
        });
        if (res.data.user) {
          setIsLoggedIn(true);
          setLoggedInUser(res.data.user);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  // Handle Login Form Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("/api/v1/users/login", loginData, {
        withCredentials: true,
      });
      setMessage("Login successful!");
      setIsLoggedIn(true);
      setLoggedInUser(response.data.user);
      window.location.reload();
    } catch (error) {
      setMessage(
        "Login failed: " +
          (error.response?.data?.message || "Invalid username or password")
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Form Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // Validate required fields
      if (
        !signupData.fullname ||
        !signupData.username ||
        !signupData.email ||
        !signupData.password ||
        !signupData.avatar
      ) {
        setMessage("All fields are required except cover image.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fullname", signupData.fullname);
      formData.append("username", signupData.username);
      formData.append("email", signupData.email);
      formData.append("password", signupData.password);
      formData.append("avatar", signupData.avatar);
      if (signupData.coverImage) {
        formData.append("coverImage", signupData.coverImage);
      }

      await axios.post("/api/v1/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage("Signup successful! You can now log in.");
      setShowForms(true);
      setSignupSuccessModal(true);
      setSignupData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        avatar: null,
        coverImage: null,
      });

      setTimeout(() => setFormType("login"), 3000);
    } catch (error) {
      setMessage(
        "Signup failed: " +
          (error.response?.data?.message || "User already exists.")
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Changes for Login Form
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle Input Changes for Signup Form
  const handleSignupChange = (e) => {
    if (e.target.name === "avatar" || e.target.name === "coverImage") {
      setSignupData({ ...signupData, [e.target.name]: e.target.files[0] });
    } else {
      setSignupData({ ...signupData, [e.target.name]: e.target.value });
    }
  };

  // Handle Audio Change
  const handleAudioChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  // Handle Description Change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Upload Audio Function
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("description", description);

    try {
      const res = await axios.post("/api/v1/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        setMessage("Audio uploaded successfully!");
        setShowModal(false);
        setAudioFile(null);
        setDescription("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload audio. Please try again.");
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      setLoggedInUser(null);
      setShowAvatarMenu(false);
      setMessage("Successfully logged out.");
    } catch (error) {
      setMessage(
        "Logout failed: " +
          (error.response?.data?.message || "Please try again.")
      );
    }
  };

  const text = "Listen to Your Heart";
  return (
    <div className="flex flex-col justify-center items-center  min-h-screen  relative ">
      <div className="flex flex-col items-center">
        {/* Animated Music Icon and Text */}
        <motion.p className="text-[#caf438] mt-20 text-3xl font-bold flex">
          <motion.span
            className="flex items-center"
            initial={{ scale: 1, rotate: 0 }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <LuMusic2 className="mt-1 mr-3" />
          </motion.span>

          {/* Animate each letter of the text with scaling and rotation */}
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "backOut",
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </div>
      {/* Top Right Corner Login/Signup Buttons */}
      <div className="absolute top-4 right-4 flex items-center space-x-4 z-20">
        {!isLoggedIn ? (
          <>
            <div className="space-x-4 flex  mb-6">
              <button
                onClick={() => {
                  setShowForms((prev) => !prev);
                  setFormType("login");
                }}
                className="bg-[#caf438] text-[#001925] flex font-bold py-2 px-4 rounded-lg border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#caf438] transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowForms((prev) => !prev);
                  setFormType("signup");
                }}
                className="bg-[#caf438] text-[#001925] font-bold py-2 px-4 rounded-lg border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#caf438] transition-all duration-200"
              >
                Signup
              </button>
            </div>
          </>
        ) : (
          <div className="relative z-20">
            <img
              src={loggedInUser.avatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowAvatarMenu((prev) => !prev)}
            />
            {showAvatarMenu && (
              <div className="absolute right-0 bg-[#001925] border border-[#caf438] shadow-lg rounded-md mt-2 p-4 w-64">
                {" "}
                {/* Increased width */}
                <div className="flex items-center space-x-2 p-2">
                  <span className="font-bold text-white">
                    {loggedInUser.username}
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center space-x-2 p-2 text-[#87a4b6] hover:bg-[#caf438] hover:text-white transition-all duration-200 w-full font-bold border border-transparent"
                >
                  <MdUpload className="text-lg" /> {/* Icon for Upload */}
                  <span>Upload Your Audio</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 w-full font-bold border border-transparent"
                >
                  <MdLogout className="text-lg" /> {/* Icon for Logout */}
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showForms && formType === "login" ? (
        <form
          onSubmit={handleLoginSubmit}
          className="bg-[#001925] p-8 rounded-lg w-full max-w-lg mt-20"
        >
          <div className="mb-5">
            <label
              className="block mb-1 text-[#87a4b6] font-bold"
              htmlFor="username"
            >
              Username
            </label>
            <div className="flex items-center bg-[#002733] p-3 border-l-4 border-transparent rounded-lg focus-within:border-[#caf438] transition-all duration-200">
              <AiOutlineUser className="text-[#caf438] mr-2" />
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
                className="w-full bg-transparent text-[#87a4b6] outline-none"
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div className="mb-5">
            <label
              className="block mb-1 text-[#87a4b6] font-bold"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center bg-[#002733] p-3 border-l-4 border-transparent rounded-lg focus-within:border-[#caf438] transition-all duration-200">
              <AiOutlineLock className="text-[#caf438] mr-2" />
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="w-full bg-transparent text-[#87a4b6] outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#caf438] text-[#001925] font-bold py-3 text-center border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#ff7a01] transition-all duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <TailSpin height="20" width="20" color="#ffffff" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      ) : (
        showForms && (
          <form
            onSubmit={handleSignupSubmit}
            className="bg-[#001925] p-8 rounded-lg w-full max-w-lg mt-20 mb-10"
          >
            <div className="mb-5">
              <label
                className="block mb-1 text-[#87a4b6] font-bold"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={signupData.fullname}
                onChange={handleSignupChange}
                required
                className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-5">
              <label
                className="block mb-1 text-[#87a4b6] font-bold"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                required
                className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
                placeholder="Choose a username"
              />
            </div>
            <div className="mb-5">
              <label
                className="block mb-1 text-[#87a4b6] font-bold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
                className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-5">
              <label
                className="block mb-1 text-[#87a4b6] font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
                className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
                placeholder="Create a password"
              />
            </div>
            <div className="mb-5">
              <label
                className="block mb-1 text-[#87a4b6] font-bold"
                htmlFor="avatar"
              >
                Avatar
              </label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleSignupChange}
                required
                className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
              />
            </div>
            <div className="mb-5">
              <label
                className="block mb-1 text-[#87a4b6] font-bold"
                htmlFor="coverImage"
              >
                Cover Image (optional)
              </label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={handleSignupChange}
                className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#caf438] text-[#001925] font-bold py-3 text-center border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#ff7a01] transition-all duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <TailSpin height="20" width="20" color="#ffffff" />
              ) : (
                "Signup"
              )}
            </button>
          </form>
        )
      )}
      {/* Signup Success Modal */}
      {signupSuccessModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative bg-[#001925] border-l-4 border-[#caf438] p-8 rounded-lg w-full max-w-md">
            {/* Close button (Top-Right Corner) */}
            <button
              onClick={() => setSignupSuccessModal(false)}
              className="absolute top-2 right-2 text-[#caf438] hover:text-[#ff7a01] transition-all"
            >
              <MdClose size={24} />
            </button>

            {/* Modal Header */}
            <h2 className="text-white text-2xl font-extrabold mb-5 text-center">
              Success
            </h2>

            {/* Success Message */}
            <p className="text-[#caf438] text-center mb-4">{message}</p>

            {/* Button to Close Modal */}
            <button
              onClick={() => setSignupSuccessModal(false)}
              className="w-full bg-[#caf438] text-[#001925] font-bold py-3 text-center border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#ff7a01] transition-all duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* Audio Upload Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative bg-[#001925] border-l-4 border-[#caf438] p-8 rounded-lg w-full max-w-md">
            {/* Close button (Top-Right Corner) */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-[#caf438] hover:text-[#ff7a01] transition-all"
            >
              <MdClose size={24} />
            </button>

            {/* Modal Header */}
            <h2 className="text-white text-2xl font-extrabold mb-5 text-center">
              Upload Your Audio
            </h2>

            {/* Message Display */}
            {message && (
              <p className="text-red-500 text-center mb-4">{message}</p>
            )}

            {/* Audio Upload Form */}
            <form onSubmit={handleFileUpload}>
              <div className="mb-5">
                <label
                  className="block mb-1 text-[#87a4b6] font-bold"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  required
                  className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
                  placeholder="Enter audio description"
                />
              </div>
              <div className="mb-5">
                <label
                  className="block mb-1 text-[#87a4b6] font-bold"
                  htmlFor="audio"
                >
                  Audio File
                </label>
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  required
                  className="w-full p-3 bg-[#002733] text-[#87a4b6] font-bold outline-none border-l-4 border-transparent focus:border-[#caf438] transition-all duration-200"
                />
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                className="w-full bg-[#caf438] text-[#001925] font-bold py-3 text-center border border-transparent hover:bg-transparent hover:text-[#caf438] hover:border-[#ff7a01] transition-all duration-200 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <TailSpin height="20" width="20" color="#ffffff" />
                ) : (
                  "Upload Audio"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Display Uploaded Audio */}
      {showUploadedAudio && (
  <motion.div
    initial={{ opacity: 0, y: -20 }} // Start hidden
    animate={controls}
    transition={{ duration: 0.5 }} // Duration of the animation
  >
    <UploadedAudio />
  </motion.div>
)}

    </div>
  );
};

export default AuthForm;
