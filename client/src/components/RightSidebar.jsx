import React, { useContext, useMemo } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import Avatar from './Avatar'

const RightSidebar = () => {

  const { selectedUser, messages } = useContext(ChatContext)
  const { onlineUsers, logout } = useContext(AuthContext)

  const mediaMessages = useMemo(() => {
    if (!Array.isArray(messages)) return []
    return messages.filter(msg => msg.image)
  }, [messages])

  return selectedUser && (
    <div className='bg-[#8185B2]/10 backdrop-blur-lg text-white w-full relative overflow-y-scroll'>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <Avatar src={selectedUser?.profilePic} size="w-20 h-20" />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(String(selectedUser._id)) && (
            <p className='w-2 h-2 rounded-full bg-green-500'></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {mediaMessages.map((msg, index) => (
            <div key={index} onClick={() => window.open(msg.image)} className='cursor-pointer rounded'>
              <img src={msg.image} alt="" loading="lazy" className='h-full rounded-md' />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2
        bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none
        text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}

export default RightSidebar
