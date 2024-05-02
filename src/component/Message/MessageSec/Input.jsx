import React, { useContext, useState } from 'react';
import Attach from '../../../assets/attach-file.png';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../firebase';
import {v4 as uuid} from "uuid";
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';


const Input = () => {
    const [text, setText] = useState("")
    const [file, setFile] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (file ) {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
      
            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                console.error(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    file: downloadURL,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                  }),
                });
      
                await updateDoc(doc(db, "userChat", currentUser.uid), {
                  [data.chatId + ".lastMessage"]: {
                    text,
                    file: downloadURL,
                  },
                  [data.chatId + ".date"]: serverTimestamp(),
                });
      
                await updateDoc(doc(db, "userChat", data.user.uid), {
                  [data.chatId + ".lastMessage"]: {
                    text,
                    file: downloadURL,
                  },
                  [data.chatId + ".date"]: serverTimestamp(),
                });
      
                setText("");
                setFile(null);
              }
            );
        } else {
            await updateDoc(doc(db,"chats", data.chatId),{
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    data:Timestamp.now()
                })
            })
    
            await updateDoc(doc(db, "userChat", currentUser.uid),{
                [data.chatId + ".lastMessage"]:{
                    text
                },
                [data.chatId+".data"]: serverTimestamp()
            })
            await updateDoc(doc(db, "userChat", data.user.uid),{
                [data.chatId + ".lastMessage"]:{
                    text
                },
                [data.chatId+".data"]: serverTimestamp()
            })
            setText("");
            setFile(null);
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setText("");
      };
    return (
        <div className='input'>
            <textarea type="text" value={text} placeholder='Введите сообщение...' onChange={e=>setText(e.target.value)}/>
            <div className="send">
                <input type="file" onChange={handleFileChange} style={{display:"none"}} id="file"/>
                <label htmlFor="file">
                    <img src={Attach} alt="" />
                </label>
                <button onClick={handleSend}>Отправить</button>
            </div>
        </div>
    );
};

export default Input;