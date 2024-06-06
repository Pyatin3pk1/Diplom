import React, { useContext, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../Context/AuthContext';

const MessageListener = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        console.log('currentUser:', currentUser); 

        if (!currentUser || !currentUser.uid) {
            console.error('Current user or user ID is not defined');
            return;
        }

        const unsubscribe = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
            if (doc.exists()) {
                const chats = doc.data();

                Object.entries(chats).forEach(([chatId, chat]) => {

                    if (chat.lastMessage && chat.userInfo.uid !== currentUser.uid) {
                        toast.info(`Новое сообщение от ${chat.userInfo.displayName}: ${chat.lastMessage.text}`, {
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

