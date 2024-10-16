import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaDownload, FaShareAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import searchnotfound from "../../Images/svg/search.svg";
import { formatDistanceToNow } from 'date-fns';

function UploadedAudio() {
  const [audioList, setAudioList] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState(''); 
  const audioRefs = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 

  const fetchAudioFiles = async () => {
    try {
      const res = await axios.get('/api/v1/audio', { withCredentials: true });
      setAudioList(res.data);
    } catch (error) {
      console.error('Error fetching audio files:', error);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const togglePlay = (audioId) => {
    if (currentlyPlaying !== audioId) {
      if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying].pause();
      }
      setCurrentlyPlaying(audioId);
      if (audioRefs.current[audioId]) {
        audioRefs.current[audioId].play();
      }
    } else {
      if (audioRefs.current[audioId]) {
        audioRefs.current[audioId].pause();
      }
      setCurrentlyPlaying(null);
    }
  };

  // Filter audioList based on search term and selected filter option
  const filteredAudioList = audioList.filter((audio) => {
    const descriptionMatch = audio.description.toLowerCase().includes(searchTerm.toLowerCase());
    const usernameMatch = audio.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
    return descriptionMatch || usernameMatch;
  });

  // Group audio files by username
  const groupedAudioList = audioList.reduce((acc, audio) => {
    const username = audio.user?.username || 'Unknown User';
    if (!acc[username]) {
      acc[username] = [];
    }
    acc[username].push(audio);
    return acc;
  }, {});

  // Function to highlight matching text
  const highlightText = (text, term) => {
    if (!term) return text; 
    const parts = text.split(new RegExp(`(${term})`, 'gi')); 
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="text-[#caf438]">{part}</span> 
      ) : (
        part
      )
    );
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setFilterOption(option);
    setSelectedUser(null); 
    setIsDropdownOpen(false); 
  };

  // Function to handle user card click
  const handleUserClick = (username) => {
    setSelectedUser(username); 
  };

  return (
    <div className="min-h-screen p-10 relative z-[0]">
      {/* Search input field */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center bg-[#001925] rounded-md overflow-hidden border border-[#caf438] w-1/2">
          <FaSearch className="text-[#caf438] w-7 h-7 p-2" /> 
          <input
            type="text"
            placeholder="Search by description or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-transparent text-[#caf438] placeholder-[#caf438] focus:outline-none"
          />
        </div>

        {/* Custom Filter options as dropdown */}
        <div className="relative ml-4">
          <div
            onClick={toggleDropdown}
            className="cursor-pointer p-2 bg-[#001925] border border-[#caf438] rounded-md text-[#caf438] flex justify-between items-center"
          >
            <span>{filterOption || 'Filter by...'}</span>
            <span className="text-[#caf438]">{isDropdownOpen ? '▲' : '▼'}</span> {/* Arrow indicator */}
          </div>

          {isDropdownOpen && (
            <ul className="absolute z-10 bg-[#001925] border border-[#caf438] rounded-md mt-1 w-full max-h-60 overflow-auto">
              {['username', 'description'].map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className="p-2 text-[#caf438] hover:bg-[#caf438] hover:text-[#001925] transition-colors duration-200 cursor-pointer"
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Conditional rendering based on the filter option */}
      {filterOption === 'username' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {Object.keys(groupedAudioList).map((username) => (
            <div
              key={username}
              onClick={() => handleUserClick(username)}
              className="bg-[#001925] p-4 rounded-md cursor-pointer hover:bg-[#caf438] hover:text-[#001925] transition-colors duration-200 flex items-center"
            >
              {groupedAudioList[username][0].user && groupedAudioList[username][0].user.avatar ? (
                <img
                  src={groupedAudioList[username][0].user.avatar}
                  alt={`${username}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md mr-4"
                />
              ) : (
                <span className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md mr-4">
                  {username[0].toUpperCase()}
                </span>
              )}
              <span className="font-semibold text-lg text-white">{username}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAudioList.length > 0 ? (
            filteredAudioList.map((audio) => (
              <div key={audio._id} className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-[#001925] bg-opacity-80 backdrop-blur-lg"></div>
                <div className="relative bg-[#001925] bg-opacity-90 p-6 h-full flex flex-col rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    {audio.user && audio.user.avatar ? (
                      <img
                        src={audio.user.avatar}
                        alt={`${audio.user.username}'s avatar`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <span className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
                        {audio.user ? audio.user.username[0].toUpperCase() : 'U'}
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {highlightText(audio.user?.username || 'Unknown User', searchTerm)} {/* Highlight username */}
                      </h3>
                      <p className="text-sm text-gray-200">{formatDistanceToNow(new Date(audio.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-100 mb-4 flex-grow">
                    {highlightText(audio.description, searchTerm)} {/* Highlight description */}
                  </p>
                  <div className="relative">
                    <audio
                      ref={(el) => (audioRefs.current[audio._id] = el)}
                      src={audio.audioFile}
                      className="w-full mb-2"
                      controlsList="nodownload"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <motion.button
                        onClick={() => togglePlay(audio._id)}
                        className="w-10 h-10 flex items-center justify-center text-[#caf438] hover:bg-[#caf438] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full"
                        whileTap={{ scale: 1.2 }} 
                      >
                        {currentlyPlaying === audio._id ? (
                          <FaPause className="w-4 h-4" />
                        ) : (
                          <FaPlay className="w-4 h-4" />
                        )}
                      </motion.button>
                      <span className="text-xs text-gray-200">
                        {audio.duration ? `${Math.floor(audio.duration / 60)}:${String(audio.duration % 60).padStart(2, '0')}` : 'N/A'}
                      </span>
                      <a 
                        href={audio.audioFile} 
                        download
                        className="text-[#caf438] hover:text-[#87a4b6] transition-all duration-200"
                      >
                        <FaDownload className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(audio.audioFile)}
                        className="text-[#caf438] hover:text-[#87a4b6] transition-all duration-200"
                      >
                        <FaShareAlt className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center">
              <img src={searchnotfound} alt="Search not found" className="w-32 h-32" />
              <p className="text-white">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}

      {/* Show uploaded music for selected user */}
      {selectedUser && (
        <div className="mt-8">
          <h2 className="text-2xl text-white mb-4">{selectedUser}'s Uploaded Music</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedAudioList[selectedUser].map((audio) => (
              <div key={audio._id} className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-[#001925] bg-opacity-80 backdrop-blur-lg"></div>
                <div className="relative bg-[#001925] bg-opacity-90 p-6 h-full flex flex-col rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    {audio.user && audio.user.avatar ? (
                      <img
                        src={audio.user.avatar}
                        alt={`${audio.user.username}'s avatar`}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <span className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
                        {audio.user ? audio.user.username[0].toUpperCase() : 'U'}
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {highlightText(audio.user?.username || 'Unknown User', searchTerm)} {/* Highlight username */}
                      </h3>
                      <p className="text-sm text-gray-200">{formatDistanceToNow(new Date(audio.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-100 mb-4 flex-grow">
                    {highlightText(audio.description, searchTerm)} {/* Highlight description */}
                  </p>
                  <div className="relative">
                    <audio
                      ref={(el) => (audioRefs.current[audio._id] = el)}
                      src={audio.audioFile}
                      className="w-full mb-2"
                      controlsList="nodownload"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <motion.button
                        onClick={() => togglePlay(audio._id)}
                        className="w-10 h-10 flex items-center justify-center text-[#caf438] hover:bg-[#caf438] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full"
                        whileTap={{ scale: 1.2 }} 
                      >
                        {currentlyPlaying === audio._id ? (
                          <FaPause className="w-4 h-4" />
                        ) : (
                          <FaPlay className="w-4 h-4" />
                        )}
                      </motion.button>
                      <span className="text-xs text-gray-200">
                        {audio.duration ? `${Math.floor(audio.duration / 60)}:${String(audio.duration % 60).padStart(2, '0')}` : 'N/A'}
                      </span>
                      <a 
                        href={audio.audioFile} 
                        download
                        className="text-[#caf438] hover:text-[#87a4b6] transition-all duration-200"
                      >
                        <FaDownload className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(audio.audioFile)}
                        className="text-[#caf438] hover:text-[#87a4b6] transition-all duration-200"
                      >
                        <FaShareAlt className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}

export default UploadedAudio;
