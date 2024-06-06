import React from 'react';
import Search from './Search'
import Chats from './Chats';
import MessageListener from './MessageListener';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Search/>
            <Chats/>
            {/* <MessageListener/> */}
        </div>
    );
};

export default Sidebar;


