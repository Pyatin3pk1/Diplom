import React, { useContext, useEffect, useState } from 'react';
import { UserListContext } from '../Context/UserListContext';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import Search from '../../assets/search.png';
import Plus from '../../assets/plus.png';
import Minus from '../../assets/minus.png';
import Avatar from "../../assets/avatar.png";
import { collection, doc, onSnapshot, updateDoc, getDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebase';
import AddEmployee from './addEmployee/AddEmployee';
import Delete from '../../assets/delete.png';
import handleSelect from './handleSelect';

const Employee = () => {
    const [addModel, setAddModel] = useState(false);
    const [searchText, setSearchText] = useState('');
    const { currentUser } = useContext(AuthContext);
    const { departments, fetchUsers } = useContext(UserListContext);
    const [employees, setEmployees] = useState([]);
    const { dispatch } = useContext(ChatContext);
    const [filteredEmployees, setFilteredEmployees] = useState([]); 
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
                ...doc.data(),
                photoURL: doc.data().photoURL instanceof Blob 
                    ? URL.createObjectURL(doc.data().photoURL) 
                    : doc.data().photoURL
            }));
            setEmployees(users);
            filterEmployeesByRole(selectedRole, users); 
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
    
    const handleSearch = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearchText(searchText);

        const filteredResults = employees.filter(employee =>
            employee.displayName.toLowerCase().includes(searchText)
        );
        filterEmployeesByRole(selectedRole, filteredResults); 
    };

    const handleSortByRole = (e) => {
        const selectedRole = e.target.value;
        setSelectedRole(selectedRole); 
        filterEmployeesByRole(selectedRole, employees); 
    };

    const filterEmployeesByRole = (role, employeesList) => {
        const filteredEmployees = role === '' 
            ? employeesList 
            : employeesList.filter(employee => employee.role === role);
        const filteredResults = searchText === '' 
            ? filteredEmployees 
            : filteredEmployees.filter(employee =>
                employee.displayName.toLowerCase().includes(searchText)
            );
        setFilteredEmployees(filteredResults); 
    };
    const handleClick = (u) => {
        handleSelect(u, navigate, currentUser, dispatch);
    };

    useEffect(() => {
        if (employees.length > 0) {
            filterEmployeesByRole(selectedRole, employees); 
        }
    }, [employees, selectedRole]);
    
    const handleDeleteEmployee = async (employee) => {
        const confirmDelete = window.confirm(`Вы уверены, что хотите удалить пользователя ${employee.displayName}?`);
    
        if (!confirmDelete) {
            return;
        }
    
        try {
            await deleteDoc(doc(db, "users", employee.uid));
    
            const combinedId = currentUser.uid > employee.uid
                ? currentUser.uid + employee.uid
                : employee.uid + currentUser.uid;
    
            const chatDocRef = doc(db, "chats", combinedId);
            const chatDoc = await getDoc(chatDocRef);
    
            if (chatDoc.exists()) {
                await deleteDoc(chatDocRef);
    
                const currentUserChatRef = doc(db, "userChats", currentUser.uid);
                const currentUserChatDoc = await getDoc(currentUserChatRef);
    
                if (currentUserChatDoc.exists()) {
                    await updateDoc(currentUserChatRef, {
                        [combinedId]: deleteField()
                    });
                }
    
                const employeeChatRef = doc(db, "userChats", employee.uid);
                const employeeChatDoc = await getDoc(employeeChatRef);
    
                if (employeeChatDoc.exists()) {
                    await updateDoc(employeeChatRef, {
                        [combinedId]: deleteField()
                    });
                }
            } else {
                console.log(`Chat document does not exist for combined ID: ${combinedId}`);
            }
    
            fetchUsers();
        } catch (err) {
            console.error(`Error deleting employee: ${err.message}`);
        }
    };    
    const closeModal = () => {
        setAddModel(false);
        fetchUsers();
    };

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
                            <img 
                                src={addModel ? Minus : Plus} 
                                className='addUser'
                                onClick={() => setAddModel((prev) => !prev)} 
                            />
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
                                const birthdate = employee.birthdate ? new Date(employee.birthdate).toLocaleDateString() : '-';
                                return (
                                    <div className="employee-item" key={employee.uid}>
                                        <div className="employee-item__content" onClick={() => handleClick(employee)}>
                                            <img src={avatarUrl} alt='avatar'/>
                                            <div className="employeeList">
                                                <label>{employee.displayName}</label>
                                                <span>Дата рождения: {birthdate}</span>
                                                <span>{departments[employee.department] || 'Отдел не найден'}</span>
                                                <span>Роль: {roles[employee.role] || 'Роль не задана'}</span>
                                            </div>
                                        </div>
                                        <button className="deleteChat" onClick={() => handleDeleteEmployee(employee)}> 
                                            <img src={Delete} alt="Delete"/>
                                        </button>
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
            {addModel && <AddEmployee closeModal={closeModal} />}
        </div>
    );    
};

export default Employee;
