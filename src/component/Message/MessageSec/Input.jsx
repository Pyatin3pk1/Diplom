import React, { useContext, useState, useEffect } from 'react';
import Attach from '../../../assets/attach-file.png';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../firebase';
import { v4 as uuid } from "uuid";
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';
import { encryptText } from './Crypto';
import Delete from '../../../assets/delete.png';
import Shipment from '../../../assets/shipment.png';

const Input = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [messageSent, setMessageSent] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false); 
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const MAX_MESSAGE_LENGTH = 500; 
    const MAX_FILE_SIZE_MB = 5; 

    const handleSend = async () => {
        if (!text && !file) return;

        if (text.length > MAX_MESSAGE_LENGTH) {
            alert(`Сообщение не может превышать ${MAX_MESSAGE_LENGTH} символов.`);
            return;
        }

        if (file && file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
            alert(`Файл не может превышать ${MAX_FILE_SIZE_MB} МБ.`);
            return;
        }

        try {
            let downloadURL = null;

            if (file) {
                setUploadingFile(true); 
                const storageRef = ref(storage, `files/${uuid()}-${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                        },
                        (error) => {
                            console.error("Upload error: ", error);
                            reject(error);
                        },
                        async () => {
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("File available at: ", downloadURL);
                            downloadURL = encryptText(downloadURL);
                            setUploadingFile(false); 
                            resolve();
                        }
                    );
                });
            }

            const encryptedText = text ? encryptText(text) : null;

            const messageData = {
                id: uuid(),
                text: encryptedText,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                file: downloadURL || null,
            };

            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion(messageData),
            });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [`${data.chatId}.lastMessage.isRead`]: true, 
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [`${data.chatId}.lastMessage`]: {
                    text: encryptedText,
                    file: downloadURL || null,
                    isRead: false, 
                },
                [`${data.chatId}.date`]: serverTimestamp(),
            });

            setText("");
            setFile(null);
            setFilePreview(null);
            setMessageSent(true);
        } catch (err) {
            console.error("Error sending message: ", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size / (1024 * 1024) 
            > MAX_FILE_SIZE_MB) {
            alert(`Файл не может превышать ${MAX_FILE_SIZE_MB} МБ.`);
            setFile(null);
            setFilePreview(null);
        } else {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
            console.log("File selected: ", selectedFile);
        }
    };

    const handleFileRemove = () => {
        setFile(null);
        setFilePreview(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            handleSend(); 
        }
    };

    useEffect(() => {
        let timer;
        if (messageSent) {
            timer = setTimeout(() => {
                setMessageSent(false);
            }, 3000); 
        }
        return () => clearTimeout(timer);
    }, [messageSent]);

    return (
        <div className='input'>
            {filePreview && (
                <div className="file-preview" style={{ cursor: 'pointer' }}>
                    {uploadingFile && ( 
                        <div className="uploading-notification">
                            <p>Загрузка...</p>
                        </div>
                    )}
                    <img className="file-preview__delete" src={Delete} onClick={handleFileRemove} alt="Delete"/>
                    { /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name) ? (
                        <img src={filePreview} alt="file preview" />
                    ) : (
                        <p>{file.name}</p>
                    )}
                </div>
            )}
            
            <div className="send">
                <textarea
                    type="text"
                    value={text}
                    placeholder='Введите сообщение...'
                    onChange={e => {
                        if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                            setText(e.target.value);
                        } else {
                            alert(`Сообщение не может превышать ${MAX_MESSAGE_LENGTH} символов.`);
                        }
                    }}
                    onKeyPress={handleKeyPress} 
                />
                <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="file" />
                <label htmlFor="file">
                    <img src={Attach} alt="Attach" />
                </label>
                <img src={Shipment} alt="" onClick={handleSend} style={{ cursor: messageSent ? 'not-allowed' : 'pointer' }} />
            </div>
        </div>
    );
};

export default Input;
