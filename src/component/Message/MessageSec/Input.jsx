import React, { useContext, useState } from 'react';
import Attach from '../../../assets/attach-file.png';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../../firebase';
import { v4 as uuid } from "uuid";
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';
import CryptoJS from 'crypto-js';

const Input = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const MAX_MESSAGE_LENGTH = 500; // Максимальная длина сообщения
    const MAX_FILE_SIZE_MB = 5; // Максимальный размер файла в МБ

    const secretKey = 'your-secret-key';

    const encryptText = (text) => {
        return CryptoJS.AES.encrypt(text, secretKey).toString();
    };

    const decryptText = (ciphertext) => {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

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
                [data.chatId + ".lastMessage"]: {
                    text: encryptedText,
                    file: downloadURL || null,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: encryptedText,
                    file: downloadURL || null,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            setText("");
            setFile(null);
        } catch (err) {
            console.error("Error sending message: ", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
            alert(`Файл не может превышать ${MAX_FILE_SIZE_MB} МБ.`);
            setFile(null);
        } else {
            setFile(selectedFile);
            setText("");
            console.log("File selected: ", selectedFile);
        }
    };

    return (
        <div className='input'>
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
            />
            <div className="send">
                <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="file" />
                <label htmlFor="file">
                    <img src={Attach} alt="Attach" />
                </label>
                <button onClick={handleSend}>Отправить</button>
            </div>
        </div>
    );
};

export default Input;
