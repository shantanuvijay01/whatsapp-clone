import React, { useState } from 'react'
import { BsArrowLeft, BsCheck2, BsPencil } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../../Redux/Auth/Action'
import { useDispatch, useSelector } from 'react-redux'

const ProfilePage = ({handleCloseOpenProfile}) => {

    const [flag, setFlag] = useState(false)
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [profile, setProfile] = useState(null);
    const [tempPicture, setTempPicture] = useState(null);
    const {auth} = useSelector(store=>store);
    const dispatch = useDispatch();

    const handleChange=(e)=>{
        setUsername(e.target.value);
    }
    
    const handleCheckClick=()=>{
        
        setFlag(false)
        const data = {
            id: auth.reqUser?.id,
            token: localStorage.getItem("token"),
            data: {full_name: username},
        }
        console.log("data", data)
            dispatch(updateUser(data))
    }

    const handleUpdateName=(e)=>{
        const data = {
            id: auth.reqUser?.id,
            token: localStorage.getItem("token"),
            data: {full_name: username},
        }
        if(e.target.key==="Enter"){
            dispatch(updateUser(data))
        }
    }
    
    const handleFlag =() =>{
        setFlag(true)
    }

    const uploadToCloudinary=async(pics)=>{
        console.log("token", localStorage.getItem("token"))
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "whatsapp");
        data.append("cloud_name", "dqudmxtxs");
        try{
        await fetch("https://api.cloudinary.com/v1_1/dqudmxtxs/image/upload", {
           //mode: "no-cors",
            //headers:{"Access-Control-Allow-Origin": "*"},
            method: "post",
            body: data,
        }).then((res)=> res.json()).then((data)=> {
            console.log("imgurl", data.url.toString());
            setTempPicture(data.url.toString());
            //setMessage("profile image updated successfully")
            //SetOpen(true)
           
            const dataa = {
                id: auth.reqUser.id,
                token: localStorage.getItem("token"),
                data: {profile_picture: data.url.toString()},
            };
            console.log("dataa", dataa);
            dispatch(updateUser(dataa));
        });} catch(error){
            console.log(error)
        }
    }
    
  return (
    <div className='w-full h-full'>
        <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
            <BsArrowLeft className='cursor-pointer text-2xl font-bold' 
            onClick={handleCloseOpenProfile}/>
            <p className='cursor-pointer font-semibold'> Profile</p>
        </div>
        <div className='flex flex-col justify-center items-center my-12'>
            <label htmlFor='imgInput'>
                <img className='rounded-full w-[15vw] h-[15vw] cursor-pointer' 
                src={auth.reqUser?.profile_picture || tempPicture || 'https://i.pinimg.com/236x/3c/04/b3/3c04b317457b59537203e12f522d7aa7.jpg'}/>
            </label>

            <input onChange={(e)=>uploadToCloudinary(e.target.files[0])} type='file' id='imgInput' className='hidden'/>
        </div>

         <div className='bg-white px-3'> 
            <p className='py-3'>Your Name</p>
            {!flag && <div className='w-full flex justify-between items-center'>
                <p className='py-3'>{auth.reqUser?.full_name|| 'username'}</p>
                <BsPencil onClick={handleFlag} className='cursor-pointer'/>
            </div>}
            
            {
                flag && <div className='w-full flex justify-between items-center py-2'>
                    <input onKeyPress={handleUpdateName} 
                    onChange={handleChange} className='w-[80%] outline-none border-b-2 border-blue-700 p-2' 
                    type='text' 
                    placeholder='Enter your name'/>
                    <BsCheck2 onClick={handleCheckClick} className='cursor-pointer text-2xl'/>
                </div>
            }
        </div>
        <div className='px-3 my-5'>
            <p className='py-10'>This is not your username, this name will be visible to your whatsapp contacts</p>
        </div>
    </div>
  )
}

export default ProfilePage