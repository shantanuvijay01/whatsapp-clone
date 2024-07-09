import React from 'react'

const ChatCard = ({userImg, name}) => {
    return (
        <div className='flex item-center justify-center py-2 group cursor-pointer'>
            <div className='w-[20%]'>
                <img className="h-11 w-11 ml-2 rounded-full" src={
                    userImg ||"https://i.pinimg.com/236x/ba/29/63/ba2963623d72865cfaae8e6f18a09d75.jpg"}
                    alt="pp" />
            </div>
            <div className='pl-5 w-[80%]'>
                <div className='flex justify-between items-center'>
                    <p className='text-lg'>{name}</p>
                    <p className='text-sm'>timestamp</p>
                </div>
                <div className='flex justify-between items-center'>
                    <p>messages...</p>
                    <div className='flex space-x-2 items-center'>
                        <p className='text-xs py-1 px-2 text-white bg-green-500 rounded-full'>5</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatCard