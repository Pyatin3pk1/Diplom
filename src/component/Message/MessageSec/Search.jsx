import React, { useContext, useState } from 'react';
import '../messag.scss'
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc, } from "firebase/firestore";
import { db } from '../../../firebase';
import { AuthContext } from '../../Context/AuthContext';
import { update } from 'firebase/database';

const Search = () => {
    const[username, setUsername] = useState("");
    const[user, setUser] = useState(null);
    const[err, setErr] = useState(false);
    const citiesRef = collection(db, "cities");

    const{currentUser} = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(
          collection(db, "users"),
          where("displayName", "==", username)
        );
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        } catch (err) {
          setErr(true);
        }
      };
    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
      };
    const handleSelect = async() =>{
        const combinedId = currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
        try{
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedId + ".userInfo"]: {
                    uid: user.uid,
                    displayName: user.displayName,
                },
                [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                [combinedId + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                },
                [combinedId + ".date"]: serverTimestamp(),
                });
        }
        }catch(err){
            setUser(null);
            setUsername("")
        };
    }
    return (
        <div className='search'>
            <div className="searchForm">
                <input className='inpurSearch' type="text" placeholder='Введите имя' onKeyDown={handleKey} onChange={e=>setUsername(e.target.value)}/>
            </div>
            {err && <span>Пользователь не найден!</span>}
            {user && (<div className="userChat" onClick={handleSelect}> 
                <div className="userCharInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>)}
        </div>
    );
};

export default Search;