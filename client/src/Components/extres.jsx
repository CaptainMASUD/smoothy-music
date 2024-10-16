import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaDownload, FaShareAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import searchnotfound from "../../Images/svg/search.svg";

function UploadedAudio() {
  const [audioList, setAudioList] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const audioRefs = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const audioPlayerRef = useRef(null); // Ref for the global audio player
  const [isPlaying, setIsPlaying] = useState(false); // State for global player

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
        setIsPlaying(true);
      }
    } else {
      if (audioRefs.current[audioId]) {
        audioRefs.current[audioId].pause();
        setIsPlaying(false);
      }
      setCurrentlyPlaying(null);
    }
  };

  // Function to play audio in the global player
  const playAudioInPlayer = (audio) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audio.audioFile; // Set the audio source
      audioPlayerRef.current.play();
      setCurrentlyPlaying(audio._id);
      setIsPlaying(true);
    }
  };

  const handleAudioCardClick = (audio) => {
    playAudioInPlayer(audio);
  };

  const filteredAudioList = audioList.filter((audio) => {
    const descriptionMatch = audio.description.toLowerCase().includes(searchTerm.toLowerCase());
    const usernameMatch = audio.user?.username.toLowerCase().includes(searchTerm.toLowerCase());
    return descriptionMatch || usernameMatch;
  });

  const groupedAudioList = audioList.reduce((acc, audio) => {
    const username = audio.user?.username || 'Unknown User';
    if (!acc[username]) {
      acc[username] = [];
    }
    acc[username].push(audio);
    return acc;
  }, {});

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setFilterOption(option);
    setSelectedUser(null);
    setIsDropdownOpen(false);
  };

  const handleUserClick = (username) => {
    setSelectedUser(username);
  };

  return (
    <div className="min-h-screen p-20 relative z-[0]">
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
            <span className="text-[#caf438]">{isDropdownOpen ? '▲' : '▼'}</span>
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
                        {highlightText(audio.user?.username || 'Unknown User', searchTerm)}
                      </h3>
                      <p className="text-sm text-gray-200">{new Date(audio.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-100 mb-4 flex-grow">
                    {highlightText(audio.description, searchTerm)}
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
                        onClick={() => handleAudioCardClick(audio)} // Handle audio card click
                        className="w-10 h-10 flex items-center justify-center text-[#caf438] hover:bg-[#caf438] hover:text-[#001925] transition-colors duration-200"
                      >
                        {currentlyPlaying === audio._id ? <FaPause /> : <FaPlay />}
                      </motion.button>
                      <a
                        href={audio.audioFile}
                        download
                        className="flex items-center justify-center text-[#caf438] hover:text-[#caf438] transition-colors duration-200"
                      >
                        <FaDownload />
                      </a>
                      <button className="flex items-center justify-center text-[#caf438] hover:text-[#caf438] transition-colors duration-200">
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img src={searchnotfound} alt="Search not found" className="w-24 h-24" />
              <p className="text-gray-400">No audio found.</p>
            </div>
          )}
        </div>
      )}

      {/* Global Audio Player */}
      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-transparent w-full max-w-md p-4 rounded-t-lg shadow-lg z-50`}>
        <div className="bg-[#001925] p-4 rounded-lg flex items-center justify-between">
          <audio ref={audioPlayerRef} onEnded={() => setIsPlaying(false)} />
          <div className="flex items-center space-x-4">
            {isPlaying ? (
              <FaPause className="text-[#caf438] cursor-pointer" onClick={() => { audioPlayerRef.current.pause(); setIsPlaying(false); }} />
            ) : (
              <FaPlay className="text-[#caf438] cursor-pointer" onClick={() => { audioPlayerRef.current.play(); setIsPlaying(true); }} />
            )}
            <span className="text-[#caf438]">{currentlyPlaying ? audioList.find(audio => audio._id === currentlyPlaying)?.description : 'Select a track'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadedAudio;
