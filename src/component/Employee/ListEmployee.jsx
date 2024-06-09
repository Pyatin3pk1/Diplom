import React, { useContext, useEffect, useState } from 'react';
import { UserListContext } from '../Context/UserListContext';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import Search from '../../assets/search.png';
import Avatar from "../../assets/avatar.png";
import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc, getDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';


const ListEmployee = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [addModel, setAddModel] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const { employees, departments, fetchUsers } = useContext(UserListContext);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const getChats = () => {
                const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                    setChats(doc.data() || []);
                });

                return () => {
                    unsub();
                };
            };
            getChats();
        }
    }, [currentUser]);

    const handleSelect = async (u) => {
        const combinedId = currentUser.uid > u.uid
            ? currentUser.uid + u.uid
            : u.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: u.uid,
                        displayName: u.displayName || '',
                        photoURL: u.photoURL || '',
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", u.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName || '',
                        photoURL: currentUser.photoURL || '',
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                dispatch({ type: "ADD_CHAT", payload: { uid: combinedId, members: [currentUser, u], messages: [] } });
            }

            dispatch({ type: "CHANGE_USER", payload: u });
            navigate('/'); 
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };
    

    const filteredEmployees = employees.filter(employee =>
        employee.displayName && employee.displayName.toLowerCase().includes(searchText.toLowerCase())
    );


    return (
        <div className="home">
            <div className="container">
                <div className="employee-list">
                    <div className="search">
                        <div className="search__moduls">
                            <div className="searchBar">
                                <img src={Search} alt="search" />
                                <input 
                                    type="text" 
                                    placeholder="Поиск" 
                                    value={searchText} 
                                    onChange={handleSearch} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="employeeConteiner">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => {
                                const avatarUrl = employee.photoURL ? employee.photoURL : Avatar;

                                return (
                                    <div className="employee-item" key={employee.uid}>
                                        <div className="employee-item__content" onClick={() => handleSelect(employee)}>
                                            <img src={avatarUrl} alt='avatar'/>
                                            <div className="employeeList">
                                                <label>{employee.displayName}</label>
                                                <span>{departments[employee.department] || 'Отдел не найден'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="notEmployees">
                                <p>Пользователи не найдены</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListEmployee;
