import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';
import { decryptText } from './Crypto'; 
import Download from '../../../assets/downloads.png';
import Doc from '../../../assets/docs.png';

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const getFileName = (fileUrl) => {
        const decodedFileUrl = decodeURIComponent(fileUrl);
        const urlParts = decodedFileUrl.split('?');
        const cleanUrl = urlParts[0];
        const fileName = cleanUrl.split('-').pop();
        return fileName;
    };

    let decryptedText = null;
    let decryptedFile = null;

    try {
        decryptedText = message.text ? decryptText(message.text) : null;
        decryptedFile = message.file ? decryptText(message.file) : null;
    } catch (error) {
        console.error("Error decrypting message:", error);
    }

    const fileName = decryptedFile ? getFileName(decryptedFile) : '';

    return (
        <div ref={ref} 
            className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="massageContent">
            {decryptedText ? (<p>{decryptedText}</p>
            ) : decryptedFile ? (
            <>
                <p>                    
                    {fileName}
                    <a
                    href={decryptedFile}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img src={Doc} alt="" />
                    </a>
                </p>
                
            </>
            ) : null}
            </div>
        </div>
    );
};

export default Message;