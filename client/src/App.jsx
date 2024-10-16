// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [fullname, setFullname] = useState('');
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [coverImageFile, setCoverImageFile] = useState(null);
//   const [loginUsername, setLoginUsername] = useState('');
//   const [loginPassword, setLoginPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Handle user registration
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('fullname', fullname);
//     formData.append('email', email);
//     formData.append('username', username);
//     formData.append('password', password);
//     formData.append('avatar', avatarFile);
//     formData.append('coverImage', coverImageFile);

//     try {
//       const res = await axios.post('/api/v1/users/register', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setMessage(res.data.message);
//       // Reset form fields after successful registration
//       setFullname('');
//       setEmail('');
//       setUsername('');
//       setPassword('');
//       setAvatarFile(null);
//       setCoverImageFile(null);
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   // Handle user login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/v1/users/login', { username: loginUsername, password: loginPassword });
//       setMessage(res.data.message);
//       setIsLoggedIn(true);
//       // Reset login fields after successful login
//       setLoginUsername('');
//       setLoginPassword('');
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div>
//       <h1>User Authentication</h1>

//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={fullname}
//           onChange={(e) => setFullname(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setAvatarFile(e.target.files[0])}
//           required
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setCoverImageFile(e.target.files[0])}
//           required
//         />
//         <button type="submit">Register</button>
//       </form>

//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={loginUsername}
//           onChange={(e) => setLoginUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={loginPassword}
//           onChange={(e) => setLoginPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default App;

import React from 'react'
import AudioFiles from './Components/Audio/AudioFiles'
import AuthForm from './Components/LoginAndSingup/LoginAndSingup'
import UploadedAudio from './Components/UploadedAudio/UploadedAudio'
import FormComponent from './Components/Form/Form'

function App() {
  return (
    <div >
      <AuthForm/>
    </div>
  )
}

export default App
