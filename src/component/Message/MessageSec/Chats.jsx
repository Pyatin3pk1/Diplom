import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';

const Chats = () => {
    const [chats, setChats] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const {rootElement} = document.documentElement;

    const updateStatus = (e) => {
        const color = navigator.onLine ? '#008000' :
        '#bb2e07';
        rootElement.style.setProperty('--status-color', color)
    }
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    useEffect(()=>{
        const getChats = () =>{
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data() || []);
             });

             return () => {
                 unsub();
             }
        };
        currentUser.uid && getChats();
    },[currentUser.uid]);

    const handleSelect = (u) =>{
        dispatch({type:"CHANGE_USER", payload:u})
    }

    return (
        <div className='chats'>
            <div className="status"></div>
            {chats && Object.entries(chats).map((chat) =>(
                <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
                    <div className="status"></div>
                    <div className="userCharInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chats;
