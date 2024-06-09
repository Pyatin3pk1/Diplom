import React, { useContext } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import Message from './Message';
import { isSameDay } from 'date-fns';

const Messages = () => {
    const { data } = useContext(ChatContext);

    console.log("ChatContext data:", data); // Для отладки

    // Проверка наличия сообщений
    if (!data || !data.messages || !Array.isArray(data.messages)) {
        return <div>No messages available</div>;
    }

    // Сортировка сообщений по дате
    const sortedMessages = data.messages.sort((a, b) => a.date.toDate() - b.date.toDate());

    const checkShowDate = (index) => {
        if (index === 0) return true;
        const currentMessageDate = sortedMessages[index].date.toDate();
        const previousMessageDate = sortedMessages[index - 1].date.toDate();
        return !isSameDay(currentMessageDate, previousMessageDate);
    };

    return (
        <div className="messages">
            {sortedMessages.map((message, index) => (
                <Message 
                    key={message.id} 
                    message={message} 
                    showDate={checkShowDate(index)}
                />
            ))}
        </div>
    );
};

export default Messages;
