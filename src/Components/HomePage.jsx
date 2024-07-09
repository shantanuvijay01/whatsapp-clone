import React, { useEffect, useState } from 'react'
import { TbCircleDashed } from 'react-icons/tb'
import { BiCommentDetail } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import { ImAttachment } from 'react-icons/im'
import { BsEmojiSmile, BsFilter, BsThreeDotsVertical } from 'react-icons/bs'
import ChatCard from './ChatCard/ChatCard'
import MessageCard from './MessageCard/MessageCard'
import "./HomePage.css"
import { useNavigate } from 'react-router-dom'
import ProfilePage from './Profile/ProfilePage'
import { Button, MenuItem, Menu } from '@mui/material'
import CreateGroup from './Group/CreateGroup'
import { useDispatch, useSelector } from 'react-redux'
import { logoutAction, searchUser } from '../Redux/Auth/Action'
import { currentUser } from '../Redux/Auth/Action'
import { createChat, getUsersChat } from '../Redux/Chat/Action'
import { createMessage, getAllMessages } from '../Redux/Message/Action'
import SockJS from 'sockjs-client'
import { over } from 'stompjs'
import { connect } from 'net'


const HomePage = () => {
    const [querys, setQuerys] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const [isCreateGroup, setIsCreateGroup] = useState(false)
    const [isProfile, setIsProfile] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const { auth, chat, message } = useSelector(store => store);
    const [isGroup, setIsGroup] = useState(false)
    const [isconnected, setIsConnected] = useState(false);
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");
    const [stompClient, setStompClient] = useState();

    const open = Boolean(anchorEl);

    const connect = () => {
        const sock = new SockJS("http://localhost:8080/websocket");
        const temp = over(sock);
        setStompClient(temp);
        const headers = {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
        }
        temp.connect(headers,onConnect,onError);
    }
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    const onError = (error) => {
        console.log("on error", error)
    }

    const onConnect = () => {
        setIsConnected(true);
    }

    useEffect(() => {
        if (message.newMessage && stompClient) {
            setMessages([...messages, message.newMessage])
            stompClient?.send("/app/message", {}, JSON.stringify(message.newMessage));
        }
    }, [message.newMessage])

    const onMessageRecieve = (payload) => {
        console.log("recieve message", JSON.parse(payload.body))
        const recievedMessage = JSON.parse(payload.body);
        setMessages([...messages, recievedMessage]);
    }

    useEffect(() => {
        if (isconnected && stompClient && auth.reqUser && currentChat) {
            const subscription = stompClient.subscribe("/group" + currentChat.id.toString(), onMessageRecieve);
            return ()=>{
                subscription.unsubscribe();
            }
        }
    })

    useEffect(()=>{
        connect();
    },[])

    useEffect(() => {
        setMessages(message.messages)
    }, message.messages)

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleNavigate = () => {
        setIsProfile(true);
    };

    const handleCurrentChat = (item) => {
        setCurrentChat(item)
    }

    const handleClickOnChatCard = (item, userId) => {
        setCurrentChat(item.id)
        dispatch(createChat({ token, data: { userId } }))
        setQuerys("")
    }

    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }))
    };


    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    }
    const handleBackGroup = () => {
        setIsCreateGroup(false);
    }

    const handleCreateGroup = () => {
        setIsGroup(true)
    }

    const handleCreateNewMessage = () => {
        dispatch(createMessage({ token, data: { chatId: currentChat.id, content: content } }))
    }

    const handleLogout = () => {
        dispatch(logoutAction())
        navigate("/signin")
    }

    useEffect(() => {
        dispatch(currentUser(token))
    }, [token])

    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signup")
        }
    }, [auth.reqUser])

    useEffect(() => {
        dispatch(getUsersChat({ token }));
    }, [chat.createdChat, chat.createdGroup])

    useEffect(() => {
        if (currentChat?.id)
            dispatch(getAllMessages({ chatId: currentChat.id, token }))
    }, [currentChat, message.newMessage])

    return (
        <div className='relative'>
            <div className='py-14 bg-[#00a884] w-full'></div>
            <div className='flex bg-[#f0f2f5] h-[90vh] absolute top-6 left-[2vw] w-[96vw]'>
                <div className='left w-[30%] bg-[#e8e9ec] h-full'>
                    {/* profile */}
                    {isGroup && <CreateGroup setIsGroup={setIsGroup} handleBackGroup={handleBackGroup} />}
                    {isProfile && (<div className='w-full h-full'><ProfilePage handleCloseOpenProfile={handleCloseOpenProfile} /></div>)}
                    {!isProfile && !isGroup && (<div className='w-full'>

                        {/* home */}
                        <div className='flex justify-between item-center p-3'>
                            <div onClick={handleNavigate} className='flex item-center space-x-3'>
                                <img
                                    className='rounded-full w-10 h-10 cursor-pointer'
                                    src={auth.reqUser?.profile_picture ||
                                        "https://i.pinimg.com/236x/4c/5a/45/4c5a45222b07968488581d2f6c408dbb.jpg"}
                                    alt="Profile picture"
                                />
                                <p>{auth.reqUser?.full_name}</p>
                            </div>
                            <div className='space-x-3 text-2xl flex'>
                                <TbCircleDashed className='cursor-pointer' onClick={() => navigate("/status")} />
                                <BiCommentDetail />
                                <div>
                                    <BsThreeDotsVertical id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick} />
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <div className='relative flex justify-center item-center bg-white py-4 px-3'>
                            <input className='border-none outline-none bg-slate-200 rounded-md w-[94%] pl-9'
                                type='text'
                                placeholder='Search or start new chat'
                                onChange={(e) => {
                                    setQuerys(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                                value={querys}
                            />
                            <AiOutlineSearch className='left-6 top-6 absolute' />
                            <div>
                                <BsFilter className='ml-4 text-3xl' />
                            </div>
                        </div>
                        <div className='bg-white overflow-y-scroll h-[72vh] px-3'>
                            {querys && auth.searchUser?.map((item) => (
                                <div onClick={() => handleClickOnChatCard(item.id)}>
                                    {" "}
                                    <hr />{" "}
                                    <ChatCard name={item.full_name}
                                        userImg={
                                            item.profile_picture}
                                    />
                                </div>
                            ))}

                            {!querys && chat.chats?.map((item) => (
                                <div onClick={() => handleCurrentChat(item)}>
                                    <hr />{" "}
                                    {item.group ? (
                                        <ChatCard
                                            name={item.chat_name}
                                            userImg={item.chat_image || "https://i.pinimg.com/236x/34/9c/21/349c218f8adf8713821838aa5d2ba15d.jpg"
                                            } />) : (
                                        <ChatCard
                                            isChat={true}
                                            name={auth.reqUser?.id !== item.users[0]?.id
                                                ? item.users[0].full_name || "https://i.pinimg.com/236x/34/9c/21/349c218f8adf8713821838aa5d2ba15d.jpg"
                                                : item.users[1].full_name || "https://i.pinimg.com/236x/34/9c/21/349c218f8adf8713821838aa5d2ba15d.jpg"
                                            }
                                            userImg={
                                                auth.reqUser.id !== item.users[0].id
                                                    ? item.users[0].profile_picture || "https://i.pinimg.com/236x/34/9c/21/349c218f8adf8713821838aa5d2ba15d.jpg"
                                                    : item.users[1].profile_picture || "https://i.pinimg.com/236x/34/9c/21/349c218f8adf8713821838aa5d2ba15d.jpg"
                                            } />
                                    )}
                                </div>))}
                        </div>
                    </div>)}
                </div>
                {!currentChat &&
                    (<div className='w-[70%] flex flex-col items-center justify-center h-full'>
                        <div className='max-w-[70%] text-center'>
                            <img src='https://i.gadgets360cdn.com/large/whatsapp_multi_device_support_update_image_1636207150180.jpg' alt='' />
                            <h1 className='text-4xl text-grey-600'>WhatsApp Web</h1>
                            <p className='my-9'> Send and recieve message withour keeping your phone online.
                                Use WhatsApp on Up to 4 Linked devices and 1 phone at the same time.
                            </p>
                        </div>
                    </div>)
                }

                {currentChat && (
                    <div className='w-[70%] relative bg-blue-200'>
                        <div className='header absolute top-0 w-full bg-[#f0f2f5]'>
                            <div className='flex justify-between'>
                                <div className='flex py-3 space-x-4 items-center px-3'>
                                    <img className='w-10 h-10 rounded-full'
                                        src={currentChat.group ?
                                            currentChat.chat_image :
                                            (auth.reqUser.id !== currentChat.users[0].id
                                                ? currentChat.users[0].profile_picture ||
                                                'https://i.pinimg.com/236x/b7/b9/cb/b7b9cb139143b9df1c18f0b8159f82a2.jpg'
                                                : currentChat.users[1].profile_picture ||
                                                'https://i.pinimg.com/236x/b7/b9/cb/b7b9cb139143b9df1c18f0b8159f82a2.jpg'
                                            )}
                                        alt='' />
                                    <p>
                                        {currentChat.group ? currentChat.chat_name : (auth.reqUser?.id === currentChat.users[0]?.id
                                            ? currentChat.users[1].full_name :
                                            currentChat.users[0].full_name)}
                                    </p>
                                </div>
                                <div className='py-3 space-x-4 flex item-center px-3'>
                                    <AiOutlineSearch />
                                    <BsThreeDotsVertical />
                                </div>
                            </div>
                        </div>

                        {/* message section */}
                        <div className='px-10 h-[85vh] overflow-y-scroll bg-blue-100'>
                            <div className='spacy-y-1 flex flex-col justify-center mt-20 py-2'>
                                {messages?.map((item, i) =>
                                    <MessageCard
                                        isReqUserMessage={item.user.id !== auth.reqUser.id}
                                        content={item.content} />)}
                            </div>
                        </div>

                        {/* footer */}
                        <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl'>
                            <div className='flex justify-between items-center px-5'>
                                <BsEmojiSmile className='cursor-pointer' />
                                <ImAttachment />

                                <input className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
                                    type='text'
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder='Type message'
                                    value={content}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleCreateNewMessage();
                                            setContent("");
                                        }
                                    }} />
                            </div>
                        </div>
                    </div>)}

            </div>
        </div>
    );
};

export default HomePage

