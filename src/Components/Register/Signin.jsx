import { Button } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState } from 'react'
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { login, register } from '../../Redux/Auth/Action';
import { currentUser } from '../../Redux/Auth/Action';
import { useEffect } from 'react';

const Signin = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {auth} = useSelector(store=>store);
    const token = localStorage.getItem("token")
    const [inputData, setInputData] = useState({ email:"", password:""});
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("handle submit", inputData)
        setOpenSnackbar(true)
        dispatch(login(inputData));
    }
    const handleChange = (e) => {
        const {name,value} = e.target;
        setInputData((values)=>({...values,[name]:value}))
    }
    const handleSnackbarClose=()=>{
        setOpenSnackbar(false)
    }
    useEffect(()=>{
        if(token)dispatch(currentUser(token))
    },[token])

    useEffect(()=>{
        if(auth.reqUser?.full_name){
            navigate("/")
        }
    },[auth.reqUser]);
    return (
        <div>
            <div className='flex justify-center h-screen items-center'>
                <div className='w-[30%] p-10 shadow-md bg-white'>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <p className='mb-2'>Email</p>
                            <input type='text'
                                placeholder='Enter your email'
                                onChange={(e)=>handleChange(e)}
                                value={inputData.email}
                                className='py-2 outline-green-600 w-full rounded-md border'
                                name="email"/>
                        </div>
                        <div>
                            <p className='mb-2'>Password</p>
                            <input type='text'
                                placeholder='Enter your password'
                                onChange={(e)=>handleChange(e)}
                                value={inputData.password}
                                className='py-2 outline-green-600 w-full rounded-md border'
                                name="password" />
                        </div>
                        <div>
                            <Button type='submit'
                                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                                variant='contained'
                                className='w-full bg-green-600'>Sign In</Button>
                        </div>
                    </form>
                    <div className='flex space-x-3 items-center mt-5'>
                        <p>Create New Account</p>
                        <Button variant='text'
                            onClick={() => navigate("/signup")}>Signup</Button>
                    </div>
                </div>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Login successfull!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Signin