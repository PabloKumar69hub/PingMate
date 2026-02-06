import React, { use, useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {
  
      const [currstate,setCurrstate]=useState("Sign up")
      const [fullname,setFullname]=useState("")
      const [email,setEmail]=useState("")
      const [password,setPassword]=useState("")
      const [bio,setBio]=useState("")
      const [isDataSubmitted,setIsDataSubmitted]=useState(false);

  
  return (
   
   <div className='min-h-screen bg-[#8185B2]/10 backdrop-blur-lg flex items-center 
 justify-center gap-8 sm:justify-evenly max-sm:flex-col'>

      
      {/*------------left area-----------------*/}  
<div className="flex flex-col items-center gap-4">
  <img src={assets.logo_icon} alt="PingMate logo" className='w-30 sm:w-37' />
  <h1 className="text-white text-3xl font-medium tracking-wide">
    PingMate
  </h1>
</div>
      {/*------------right area----------------*/}
      <form className='border-2 bg-white/8 text-white border-gray-500 p-6 flex
      flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className="flex items-center gap-3 text-xl font-medium">
  {currstate}
  <img src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer opacity-80' />
  </h2>
  {currstate === "Sign up" && !isDataSubmitted &&  (
    <input onChange={(e)=>setFullname(e.target.value)} value={fullname}
    type="text" className='p-2 border border-gray-500 rounded-md 
    focus:outline-none' placeholder="Full Name" required/>
  )}
    {!isDataSubmitted && (
      <>
      <input onChange={(e)=>setEmail(e.target.value)} value={email} 
      type="email" placeholder='Email Address' required className='p-2 
      border border-gray-500 rounded-md focus:outline-none focus:ring-2 
      focus:ring-indigo-500' />
      <input onChange={(e)=>setPassword(e.target.value)} value={password} 
      type="password" placeholder='Password' required className='p-2 
      border border-gray-500 rounded-md focus:outline-none focus:ring-2 
      focus:ring-indigo-500' />

      </>
    )}
    {
      currstate === "Sign up" && isDataSubmitted && (
        <textarea onChange={(e)=>setBio(e.target.value)} value={bio} 
        rows={4} className='p-2 border border-gray-500 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-indigo-500'
        placeholder='How should others see you?' required></textarea>
      )
    }
    <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 
    text-white rounded-md cursor-pointer'>
      {currstate === "Sign up" ? "Create Account" : "Login Now"}
    </button>
    <div>
      <input type="checkbox" />
      <p>Agree to our terms of use & privacy policy.</p>
      </div>

  </form>
  </div>
  )
}

export default LoginPage
