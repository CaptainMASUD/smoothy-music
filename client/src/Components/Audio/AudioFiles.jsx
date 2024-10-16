import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import UploadedAudio from '../UploadedAudio/UploadedAudio';

const AudioFiles = () => {
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
 

    

    // Check if the user is already logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await axios.get('/api/v1/users/me', { withCredentials: true });
                if (res.data.user) {
                    setIsLoggedIn(true);
                    setLoggedInUser(res.data.user);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };
        checkLoginStatus();
    }, []);

 
    // Handle user login/signup
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/v1/users/login' : '/api/v1/users/register';
        const payload = isLogin
            ? { username, password }
            : { fullname, username, email, password };
    
        try {
            const res = await axios.post(endpoint, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            setMessage(res.data.message);
            if (res.data.success) {
                // Update user state directly
                setIsLoggedIn(true);
                setLoggedInUser({
                    username: res.data.user.username || 'Guest', // Fallback if username is empty
                    avatar: res.data.user.avatar || null, // Can be null if no avatar
                });
                // Reset the form fields
                setUsername('');
                setPassword('');
                setFullname('');
                setEmail('');
                setAvatar(null);
                setCoverImage(null);
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setMessage('Failed to authenticate. Please check your credentials or try again later.');
        }
    };
    
    
    

    // Handle user logout
    const handleLogout = async () => {
        try {
            await axios.post('/api/v1/users/logout', {}, { withCredentials: true });
            setIsLoggedIn(false);
            setLoggedInUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            setMessage('Failed to logout. Please try again.');
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
    <div className="flex justify-between mb-4 items-center">
        <h1 className="text-3xl font-bold text-gray-800">Audio Files</h1>
        {isLoggedIn ? (
            <div className="flex items-center space-x-4">
                {loggedInUser && loggedInUser.avatar ? (
                    <img
                        src={loggedInUser.avatar}
                        alt={`${loggedInUser.username}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <span className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {loggedInUser && loggedInUser.username ? loggedInUser.username[0].toUpperCase() : 'U'}
                    </span>
                )}
                <span className="text-gray-800 font-semibold">
                    {loggedInUser ? loggedInUser.username : 'Unknown User'}
                </span>
                <button onClick={handleLogout} className="text-blue-600 hover:underline">
                    Logout
                </button>
            </div>
        ) : (
            <div className="flex space-x-4">
                <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline">Login</button>
                <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline">Sign Up</button>
            </div>
        )}
    </div>

    <div className="container mx-auto">
        {!isLoggedIn && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </h2>
                    {!isLogin && (
                        <>
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="fullname"
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-sm text-center w-full text-gray-700">{message}</p>
                )}
            </div>
        )}

              
              <UploadedAudio/>
            </div>
        </div>
    );
};

export default AudioFiles;
