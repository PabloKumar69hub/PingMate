import React, { useContext, useEffect, useState, useRef } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import Avatar from './Avatar'

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='bg-[#8185B2]/10 backdrop-blur-lg h-full p-5 rounded-r-xl overflow-y-scroll text-white'>

      {/* HEADER */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-2'>
          <img 
            src={assets.logo_icon} 
            alt="PingMate Logo"
            className='w-8 h-8 object-contain'
          />
          <h1 className='text-lg font-semibold'>PingMate</h1>
        </div>

        <div className="relative" ref={menuRef}>
          <img 
            src={assets.menu_icon} 
            alt="Menu" 
            className='w-5 cursor-pointer'
            onClick={() => setMenuOpen(prev => !prev)}
          />

          {menuOpen && (
            <div className='absolute top-full right-0 mt-2 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 z-20 shadow-lg'>
              <p 
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }} 
                className='cursor-pointer text-sm hover:text-violet-400'
              >
                Edit Profile
              </p>
              <hr className='my-2 border-gray-600' />
              <p 
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }} 
                className='cursor-pointer text-sm hover:text-red-400'
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mb-5'>
        <img src={assets.search_icon} alt="Search" className='w-3' />
        <input
          onChange={(e) => setInput(e.target.value)}
          className='bg-transparent outline-none text-white text-xs flex-1'
          placeholder='Search User...'
        />
      </div>

      {/* USERS */}
      <div className='flex flex-col gap-1'>
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(String(user._id));

          return (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-2 cursor-pointer rounded transition ${
                selectedUser?._id === user._id && 'bg-[#282142]/50'
              }`}
            >
              <Avatar src={user.profilePic} size="w-9 h-9" />

              <div className='flex-1'>
                <p className='text-sm'>{user.fullName}</p>
                <span className={`text-xs ${
                  isOnline ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {unseenMessages[user._id] > 0 && (
                <span className='bg-violet-500 text-xs h-5 w-5 flex items-center justify-center rounded-full'>
                  {unseenMessages[user._id]}
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Sidebar;
