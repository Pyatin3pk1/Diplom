import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { decryptText } from './Crypto'; 
import Download from '../../../assets/downloads.png';
import Doc from '../../../assets/docs.png';
import { format, isToday, isYesterday } from 'date-fns';

const Message = ({ message, showDate }) => {
    const { currentUser } = useContext(AuthContext);
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

    const handleImageClick = () => {
        if (/.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName)) {
            window.open(decryptedFile, '_blank');
        } else {
            const link = document.createElement('a');
            link.href = decryptedFile;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const formatDate = (timestamp) => {
        const date = timestamp.toDate();
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return 'Yesterday, ' + format(date, 'HH:mm');
        } else {
            return format(date, 'dd/MM/yyyy, HH:mm');
        }
    };

    const formatDateForHeader = (timestamp) => {
        const date = timestamp.toDate();
        return format(date, 'dd.MM.yyyy');
    };

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            {showDate && <div className="message-date">{formatDateForHeader(message.date)}</div>}
            <div className="massageContent">
                {decryptedText ? (
                    <p>{decryptedText}</p>
                ) : decryptedFile ? (
                    <>
                        { /.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName) ? (
                            <img src={decryptedFile} alt="img" onClick={handleImageClick} />
                        ) : (
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
                        )}
                    </>
                ) : null}
                <span>{formatDate(message.date)}</span>
            </div>
        </div>
    );
};

export default Message;
