import React, { useContext, useState } from 'react';
import '../messag.scss';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { AuthContext } from '../../Context/AuthContext';

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext);

    return (
        <div className='search'>
            <div className="searchForm">
                <h2>Чаты</h2>
            </div>
        </div>
    );
};

export default Search;