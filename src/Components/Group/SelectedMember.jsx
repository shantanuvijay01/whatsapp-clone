import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'


const SelectedMember = ({handleRemoveMember, member}) => {
  return (
    <div className='flex items-center bg-slate-300 rounded-full'>
        <img
        className='w-7 h-7 rounded-full'
        src = {member.profile_picture || 'https://i.pinimg.com/236x/b7/54/01/b754019357647c50d424971ca3364ed5.jpg'}
        alt = ''/>
    <p className='px-2'>{member.full_name}</p>
    <AiOutlineClose
    onClick={handleRemoveMember}
    className='pr-1 cursor-pointer'/>
    </div>
  )
}

export default SelectedMember