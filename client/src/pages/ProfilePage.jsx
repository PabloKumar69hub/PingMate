import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';

const ProfilePage = () => {
  const [selectedImg,SetSelectedImg]=useState(null)
  const navigate = useNavigate();
  const[name,setName]=useState("RamGoat")
  const[bio,setBio]=useState("Nibba why are u lookin at this get a job")
  const handleSumbit=async(e)=>{
    e.preventDefault();
    navigate('/')
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-full max-w-2xl backdrop-blur-2xl bg-white/5 text-gray-300 border border-white/10 
      flex items-center justify-between max-sm:flex-col-reverse rounded-xl'>
        
        <form onSubmit={handleSumbit} className='flex flex-col gap-5 p-8 flex-1'>
          <h3 className='text-3xl font-medium text-white'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'> 
            <input onChange={(e)=>SetSelectedImg(e.target.files[0])} type="file" 
            id='avatar' accept='.png, .jpg, .jpeg' hidden/>
          <img src={selectedImg ? URL.createObjectURL(selectedImg):assets.avatar_icon} 
          alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
          upload profile image
          </label>
         <input onChange={()=>setName(e.target.value)} value={name}
         type="text" required placeholder='Your Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
         <textarea onChange={()=>setBio(e.target.value)} value={bio}
         placeholder="Write your profile bio required" required 
         className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' ></textarea>
         <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">
          Save
          </button>
        </form>

        <img className='max-w-44 aspect aspect-square rounded-full mx-10 max-sm:mt-10' 
        src={assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
