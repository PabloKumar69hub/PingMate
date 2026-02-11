import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import formatMessageTime from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import Avatar from './Avatar'
import toast from "react-hot-toast"

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    loadingMessages
  } = useContext(ChatContext)

  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef()
  const [input,setInput] = useState('');
  const [isUploading,setIsUploading] = useState(false);

  const handleSendMessage = async(e)=>{
    e.preventDefault();
    if(input.trim() === "") return;
    await sendMessage({text: input.trim()});
    setInput("")
  }

  const handleSendImage = async(e)=>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }

    const reader= new FileReader();

    reader.onloadend= async()=>{
      try{
        setIsUploading(true);
        await sendMessage({image: reader.result})
      }finally{
        setIsUploading(false);
        e.target.value=""
      }
    }

    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if(selectedUser?._id){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>

      {/* HEADER */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <Avatar src={selectedUser.profilePic} size="w-8 h-8" />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName} 
          {onlineUsers.includes(String(selectedUser._id)) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
      </div>

      {/* CHAT AREA */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>

        {loadingMessages && (
          <div className='flex justify-center items-center h-full text-gray-400 animate-pulse'>
            Loading chat...
          </div>
        )}

        {!loadingMessages && Array.isArray(messages) && messages.map((msg, index) => {

          const isSender = msg.senderId === authUser?._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isSender ? 'justify-end' : 'justify-start'
              }`}
            >

              {!isSender && (
                <Avatar src={selectedUser?.profilePic} size="w-7 h-7" />
              )}

              {msg.image ? (
                <img 
                  src={msg.image} 
                  alt="" 
                  loading="lazy"
                  className='max-w-[230px] rounded-lg mb-8'
                />
              ) : (
                <p
                  className={`p-2 max-w-[240px] md:text-sm font-light rounded-lg mb-8 break-words
                  ${
                    isSender
                      ? 'bg-violet-500/30 text-white rounded-br-none'
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {isSender && (
                <Avatar src={authUser?.profilePic} size="w-7 h-7" />
              )}

              <div className='text-xs text-gray-500 mb-8'>
                {formatMessageTime(msg.createdAt)}
              </div>

            </div>
          )
        })}

        {isUploading && (
          <div className='text-sm text-gray-400 px-3'>
            Uploading image...
          </div>
        )}

        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null}
            type="text"
            placeholder="send a message"
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
          />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium text-white'>
        PingMate — Ping. Talk. Connect.
      </p>
    </div>
  )
}

export default ChatContainer
