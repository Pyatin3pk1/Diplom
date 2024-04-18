import React from 'react';
import { Navigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import HeaderMes from './header/HeaderMes';
import './messag.scss'
import Sidebar from './MessageSec/Sidebar';
import Chat from './MessageSec/Chat';

function MessagePage() {
    return(
        <>
            <HeaderMes/>
            <div className='home'>
                <div className='container'>
                    <Sidebar/>
                    <Chat/>
                </div>
            </div>
        </>
    ) 
}

export default MessagePage;
