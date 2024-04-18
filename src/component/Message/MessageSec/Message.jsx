import React, {  useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { ChatContext } from '../../Context/ChatContext';
import { storage } from '../../../firebase';
import Download from '../../../assets/downloads.png'
import Doc from '../../../assets/docs.png'

const Message = ({message}) => {

    const  {currentUser} = useContext(AuthContext);
    const  {data} = useContext(ChatContext);
    const ref = useRef();
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);
    const getFileName = (fileUrl) => {
        const decodedFileUrl = decodeURIComponent(fileUrl);
        const urlParts = decodedFileUrl.split('?');
        const cleanUrl = urlParts[0];
        const fileName = cleanUrl.split('/').pop();
        const fileParts = fileName.split('.');
        const fileExtension = fileParts.pop();
        const fileBaseName = fileParts.join('.');
      
        return { fileBaseName, fileExtension };
      };
    return (
        <div ref={ref} 
            className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="massageContent">
            {message.text ? (<p>{message.text}</p>
            ) : message.file ? (
            <>
                <p>
                    <img src={Doc} alt="" />
                    
                        {getFileName(message.file).fileBaseName}
                        {getFileName(message.file).fileExtension && `.${getFileName(message.file).fileExtension}`}
                    
                    
                    <a
                    href={message.file}
                    download={getFileName(message.file).fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <img src={Download} alt="" />
                    </a>
                </p>
                
            </>
            ) : null}
            </div>
        </div>
    );
};

export default Message;