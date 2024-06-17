import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from '../../../firebase';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';
import Delete from '../../../assets/delete.png';
import Avatar from "../../../assets/avatar.png";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const [isOpen, setOpen] = useState();
    const [lastPageUpdate, setLastPageUpdate] = useState(
        parseInt(localStorage.getItem('lastPageUpdate')) || Date.now()
    );

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const unsubscribe = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                const userChats = doc.exists() ? doc.data() : {};
                const chatArray = Object.entries(userChats).map(([chatId, chat]) => ({ ...chat, chatId }));
                setChats(chatArray);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleSelect = (chatId, userInfo) => {
        dispatch({ type: "CHANGE_USER", payload: userInfo });
        try {
            const chatDocRef = doc(db, "userChats", currentUser.uid);
            updateDoc(chatDocRef, {
                [`${chatId}.lastMessage.isRead`]: true
            });
        } catch (error) {
            console.error("Error updating lastMessage: ", error);
        }
    };

    const handleDeleteChat = async (userInfo, chatId) => {
        if (!currentUser || !currentUser.uid || !userInfo || !userInfo.uid || !chatId) {
            return;
        }
        const confirmDelete = window.confirm(`Вы уверены, что хотите удалить чат с ${userInfo.displayName}?`);
        if (!confirmDelete) {
            return;
        }
        try {
            await deleteDoc(doc(db, "chats", chatId));
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [chatId]: deleteField()
            });
            await updateDoc(doc(db, "userChats", userInfo.uid), {
                [chatId]: deleteField()
            });
            setChats(prevChats => prevChats.filter(chat => chat.chatId !== chatId));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        localStorage.setItem('lastPageUpdate', lastPageUpdate.toString());
    }, [lastPageUpdate]);

    return (
        <div className='chats'>
            {Array.isArray(chats) && chats.map((chat) => {
                const avatarUrl = chat.userInfo?.photoURL ? chat.userInfo.photoURL : Avatar;
                const isRead = chat.lastMessage?.isRead;

                const chatClass = chat.lastMessage?.hasOwnProperty('isRead') ? 'read' : 'unread';

                return (
                    <div className={`userChat ${chatClass}`} key={chat.chatId}>
                        <div className="userChatInfo" onClick={() => { handleSelect(chat.chatId, chat.userInfo); setOpen(!isOpen); }}>
                            <img src={avatarUrl} alt="" />
                            <span>{chat.userInfo?.displayName}</span>
                        </div>
                        <button className="deleteChat" onClick={() => handleDeleteChat(chat.userInfo, chat.chatId)}> 
                            <img src={Delete} alt="Delete"/>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Chats;
