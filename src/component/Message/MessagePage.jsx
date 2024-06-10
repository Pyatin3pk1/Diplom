import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import HeaderMes from './header/HeaderMes';
import { GiHamburgerMenu } from "react-icons/gi";
import './messag.scss'
import Sidebar from './MessageSec/Sidebar';
import Chat from './MessageSec/Chat';

function MessagePage() {
    const [isOpen, setOpen] = useState();
    return(
        <>
            <HeaderMes/>
            <div className='home'>
                <div className={`container ${isOpen ? "open" : ""}`}>
                    <button className="sidebar-button"
                        onClick={() => setOpen(!isOpen)}><GiHamburgerMenu/>
                    </button>
                    <Sidebar/> 
                    <Chat/>
                </div>
            </div>
        </>
    ) 
}

export default MessagePage;
