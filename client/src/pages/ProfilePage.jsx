import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate()

  const [draftName, setDraftName] = useState(authUser.fullName)
  const [draftBio, setDraftBio] = useState(authUser.bio)
  const [selectedImg, setSelectedImg] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: draftName, bio: draftBio })
        navigate('/')
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(selectedImg)
      reader.onload = async () => {
        const base64Image = reader.result
        await updateProfile({
          profilePic: base64Image,
          fullName: draftName,
          bio: draftBio,
        })
        navigate('/')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div
        className='w-full max-w-2xl backdrop-blur-2xl bg-white/5 text-gray-300 border border-white/10 
        flex items-center justify-between max-sm:flex-col-reverse rounded-xl'
      >
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-8 flex-1'>
          <h3 className='text-3xl font-medium text-white'>Profile Details</h3>

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'> 
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt=""
              className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}
            />
            upload profile image
          </label>

          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            type="text"
            required
            placeholder='Your Name'
            className='p-2 border border-gray-500 rounded-md
            text-white caret-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent'
          />

          <textarea
            value={draftBio}
            onChange={(e) => setDraftBio(e.target.value)}
            placeholder="Write your profile bio"
            required
            className='p-2 border border-gray-500 rounded-md
            text-white caret-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent'
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg
            ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>

        <img
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
          src={ authUser?.profilePic|| assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  )
}

export default ProfilePage
