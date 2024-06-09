import React, { useContext, useEffect, useState } from 'react';
import { UserListContext } from '../Context/UserListContext';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import Search from '../../assets/search.png';
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';
import Avatar from "../../assets/avatar.png";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc, getDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import AddEmployee from './addEmployee/AddEmployee';
import Delete from '../../assets/delete.png';

const ListUser = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const { departments, fetchUsers } = useContext(UserListContext);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]); 
    const [searchResults, setSearchResults] = useState([]); 
    const [roles, setRoles] = useState({});
    const [selectedRole, setSelectedRole] = useState(''); 

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

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const users = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setEmployees(users);
            setSearchResults(users); 
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'Role'), (snapshot) => {
            const roleData = {};
            snapshot.forEach(doc => {
                roleData[doc.id] = doc.data().Name;
            });
            setRoles(roleData);
        });

        return () => unsubscribe();
    }, []);

    const handleSelect = async (u) => {
        const combinedId = currentUser.uid > u.uid
            ? currentUser.uid + u.uid
            : u.uid + currentUser.uid;
    
        try {
            // Проверка и создание документа чата, если его нет
            const chatDocRef = doc(db, "chats", combinedId);
            const chatDocSnap = await getDoc(chatDocRef);
    
            if (!chatDocSnap.exists()) {
                await setDoc(chatDocRef, { messages: [] });
            }
    
            // Проверка и создание документа userChats для текущего пользователя
            const currentUserChatRef = doc(db, "userChats", currentUser.uid);
            const currentUserChatSnap = await getDoc(currentUserChatRef);
    
            if (!currentUserChatSnap.exists()) {
                await setDoc(currentUserChatRef, {});
            }
    
            // Проверка и создание документа userChats для выбранного пользователя
            const selectedUserChatRef = doc(db, "userChats", u.uid);
            const selectedUserChatSnap = await getDoc(selectedUserChatRef);
    
            if (!selectedUserChatSnap.exists()) {
                await setDoc(selectedUserChatRef, {});
            }
    
            // Обновление документов userChats для текущего и выбранного пользователей
            await updateDoc(currentUserChatRef, {
                [combinedId + ".userInfo"]: {
                    uid: u.uid,
                    displayName: u.displayName || '',
                    photoURL: u.photoURL || '',
                },
                [combinedId + ".date"]: serverTimestamp(),
            });
    
            await updateDoc(selectedUserChatRef, {
                [combinedId + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName || '',
                    photoURL: currentUser.photoURL || '',
                },
                [combinedId + ".date"]: serverTimestamp(),
            });
    
            // Обновление состояния чатов в контексте
            dispatch({ type: "ADD_CHAT", payload: { uid: combinedId, members: [currentUser, u], messages: [] } });
    
            dispatch({ type: "CHANGE_USER", payload: u });
            navigate('/');
        } catch (err) {
            console.error("Ошибка при создании или получении чата:", err);
        }
    };

    const handleSearch = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearchText(searchText);

        const filteredResults = employees.filter(employee =>
            employee.displayName.toLowerCase().includes(searchText)
        );
        setSearchResults(filteredResults);
        filterEmployeesByRole(selectedRole, filteredResults); 
    };

    const handleSortByRole = (e) => {
        const selectedRole = e.target.value;
        setSelectedRole(selectedRole); 
        filterEmployeesByRole(selectedRole, searchResults); 
    };

    const filterEmployeesByRole = (role, employeesList) => {
        const filteredEmployees = role === '' 
            ? employeesList 
            : employeesList.filter(employee => employee.role === role);
        setFilteredEmployees(filteredEmployees); 
    };

    useEffect(() => {
        if (employees.length > 0) {
            setFilteredEmployees(employees); 
        }
    }, [employees]);

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
                        <select onChange={handleSortByRole} value={selectedRole}> 
                            <option value="">Выберите роль</option> 
                            {Object.entries(roles).map(([roleId, roleName]) => (
                                <option key={roleId} value={roleId}>{roleName}</option>
                            ))}
                        </select>
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
                                                <span>Роль: {roles[employee.role] || 'Роль не задана'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="notEmployees">
                                <p>Пользоват не найдены</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ListUser;