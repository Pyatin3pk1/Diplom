import React, { useContext, useState } from 'react';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../../Context/ChatContext';
import Avatar from "../../../assets/avatar.png";


const Chat = () => {
    const {data} = useContext(ChatContext);
    const [isOpen, setOpen] = useState();
    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
            </div>
            <Messages/>
            <Input/>
        </div>
    );
};

export default Chat;