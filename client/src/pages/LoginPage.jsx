import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currstate, setCurrstate] = useState("Sign up")
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [agree, setAgree] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (currstate === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    login(
      currstate === "Sign up" ? "signup" : "login",
      {
        name: fullname,
        email,
        password,
        bio
      }
    )
  }

  return (
    <div className='min-h-screen bg-[#8185B2]/10 backdrop-blur-lg flex items-center 
    justify-center gap-8 sm:justify-evenly max-sm:flex-col'>

      <div className="flex flex-col items-center gap-4">
        <img src={assets.logo_icon} alt="PingMate logo" className='w-30 sm:w-37' />
        <h1 className="text-white text-3xl font-medium tracking-wide">
          PingMate
        </h1>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className='border-2 bg-white/8 text-white border-gray-500 p-8 w-[380px] flex
        flex-col gap-7 rounded-lg shadow-lg'
      >

        <h2 className="flex items-center justify-between text-xl font-medium">
          <span>{currstate}</span>
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="arrow"
              className="w-5 cursor-pointer opacity-80"
            />
          )}
        </h2>

        {currstate === "Sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullname(e.target.value)}
            value={fullname}
            type="text"
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />

            {/* 🔐 Password with Show / Hide */}
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder='Password'
                required
                className='w-full p-2 pr-10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {showPassword ? (
                  /* Eye Off */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 7 9 7a17.3 17.3 0 01-4.42 4.92M6.61 6.61A17.3 17.3 0 003 12s4 7 9 7a9.77 9.77 0 004.29-.98"
                    />
                  </svg>
                ) : (
                  /* Eye */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}

        {currstate === "Sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='What should people know about you?'
            required
          />
        )}

        <button
          type='button'
          onClick={onSubmitHandler}
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 
          text-white rounded-md cursor-pointer'
        >
          {currstate === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* ✅ Terms & Privacy */}
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-violet-500 cursor-pointer scale-110"
          />
          <span>
            Agree to the{" "}
            <span className="underline cursor-pointer">terms of use</span> &{" "}
            <span className="underline cursor-pointer">privacy policy</span>.
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          {currstate === "Sign up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <span
                onClick={() => { setCurrstate("Login"); setIsDataSubmitted(false) }}
                className='font-medium text-violet-500 cursor-pointer'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account{" "}
              <span
                onClick={() => setCurrstate("Sign up")}
                className='font-medium text-violet-500 cursor-pointer'>
                Click here
              </span>
            </p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage
