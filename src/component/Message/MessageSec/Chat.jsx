import React, { useContext, useState } from 'react';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../../Context/ChatContext';

const Chat = () => {
    const {data} = useContext(ChatContext);
    const [isOpen, setOpen] = useState();
    return (
        <div className='chat'>
            <dev className="chatInfo">
                <span>{data.user?.displayName}</span>
            </dev>
            <Messages/>
            <Input/>
        </div>
    );
};

export default Chat;