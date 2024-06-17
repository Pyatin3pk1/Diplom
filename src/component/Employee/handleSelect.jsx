import { doc, serverTimestamp, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const handleSelect = async (u, navigate, currentUser, dispatch) => {
    const combinedId = currentUser.uid > u.uid
        ? currentUser.uid + u.uid
        : u.uid + currentUser.uid;
    try {
        const chatDocRef = doc(db, "chats", combinedId);
        const chatDocSnap = await getDoc(chatDocRef);
        if (!chatDocSnap.exists()) {
            await setDoc(chatDocRef, { messages: [] });
        }
        const currentUserChatRef = doc(db, "userChats", currentUser.uid);
        const currentUserChatSnap = await getDoc(currentUserChatRef);
        if (!currentUserChatSnap.exists()) {
            await setDoc(currentUserChatRef, {});
        }
        const selectedUserChatRef = doc(db, "userChats", u.uid);
        const selectedUserChatSnap = await getDoc(selectedUserChatRef);
        if (!selectedUserChatSnap.exists()) {
            await setDoc(selectedUserChatRef, {});
        }
        await updateDoc(currentUserChatRef, {
            [combinedId + ".userInfo"]: {
                uid: u.uid,
                displayName: u.displayName || '',
                photoURL: u.photoURL || '',
            },
            [`${combinedId}.lastMessage.isRead`]: true, 
            [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(selectedUserChatRef, {
            [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName || '',
                photoURL: currentUser.photoURL || '',
            },
            [`${combinedId}.lastMessage.isRead`]: true, 
            [combinedId + ".date"]: serverTimestamp(),
        });
        dispatch({ type: "ADD_CHAT", payload: { uid: combinedId, 
            members: [currentUser, u], messages: [] } });
        dispatch({ type: "CHANGE_USER", payload: u });
        navigate('/Diplom/');
    } catch (err) {
        console.error("Ошибка при создании или получении чата:", err);
    }
};

export default handleSelect;
