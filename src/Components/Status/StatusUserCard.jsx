import React from 'react'
import { useNavigate } from 'react-router-dom'

const StatusUserCard = () => {
    const navigate = useNavigate();

    const handleNavigate=()=>{
        navigate(`/status/{userId}`)
    }
  return (
    <div onClick={handleNavigate} className='flex items-center p-3 cursor-pointer'>
        <div>
            <img className='h-7 w-7 lg:w-10 lg:h-10 rounded-full' 
            src='https://i.pinimg.com/236x/26/bf/f3/26bff310d6ec218f199c13d40b52f891.jpg' alt=''/>  
        </div>
            {/* right */}
        <div className='ml-2 text-white'>
            <p>Abel Tesfaye</p>
        </div>
    </div>
  )
}

export default StatusUserCard