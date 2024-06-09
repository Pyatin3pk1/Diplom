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

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const getChats = () => {
                const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                    setChats(doc.data() || []);
                });

                return () => {
                    unsub();
                };
            };
            getChats();
        }
    }, [currentUser]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    const handleDeleteChat = async (userInfo) => {
        if (!currentUser || !currentUser.uid || !userInfo || !userInfo.uid) {
            return;
        }

        const confirmDelete = window.confirm(`Вы уверены, что хотите удалить чат с ${userInfo.displayName}?`);

        if (!confirmDelete) {
            return;
        }

        const combinedId = currentUser.uid > userInfo.uid
            ? currentUser.uid + userInfo.uid
            : userInfo.uid + currentUser.uid;

        try {
            await deleteDoc(doc(db, "chats", combinedId));

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedId]: deleteField()
            });

            await updateDoc(doc(db, "userChats", userInfo.uid), {
                [combinedId]: deleteField()
            });

            setChats(prevChats => {
                const newChats = { ...prevChats };
                delete newChats[combinedId];
                return newChats;
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='chats'>
            {chats && Object.entries(chats).map(([chatId, chat]) => {
                const avatarUrl = chat.userInfo.photoURL ? chat.userInfo.photoURL : Avatar;
                return (
                    <div className="userChat" key={chatId}>
                        <div className="userChatInfo" onClick={() => handleSelect(chat.userInfo)}>
                            <img src={avatarUrl} alt="" />
                            <span>{chat.userInfo.displayName}</span>
                        </div>
                        <button className="deleteChat" onClick={() => handleDeleteChat(chat.userInfo)}> 
                            <img src={Delete} alt="Delete"/>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Chats;
