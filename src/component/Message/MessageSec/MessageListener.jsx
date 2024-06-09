import React, { useContext, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { AuthContext } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MessageListener = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        console.log('currentUser:', currentUser); 
    
        if (!currentUser || !currentUser.uid) {
            console.error('Текущий пользователь или ID пользователя не определены');
            return;
        }
    
        const unsubscribe = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
            if (doc.exists()) {
                const chats = doc.data();
    
                Object.entries(chats).forEach(([chatId, chat]) => {
                    if (chat && chat.lastMessage && chat.userInfo && chat.userInfo.uid === currentUser.uid) { // Добавляем проверку на наличие chat и chat.userInfo
                        toast.info(`Новое сообщение в чате: ${chatId}`, {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                });
            }
        });
    
        return () => {
            unsubscribe();
        };
    }, [currentUser]);

    return <ToastContainer />;
};

export default MessageListener;