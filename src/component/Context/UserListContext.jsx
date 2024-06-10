import React, { createContext, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export const UserListContext = createContext();

export const UserListContextProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState({});

    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where("role", "==", "KzxCM6fT2xzPanAOEmcQ")); 
            const querySnapshot = await getDocs(q);
            const employeesList = querySnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setEmployees(employeesList);
            console.log('Employees:', employeesList);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchUsers();

        const fetchDepartments = async () => {
            try {
                const departmentsCollection = collection(db, 'Department');
                const querySnapshot = await getDocs(departmentsCollection);
                const departmentsMap = {};
                querySnapshot.docs.forEach(doc => {
                    departmentsMap[doc.id] = doc.data().Name;  
                });
                setDepartments(departmentsMap);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <UserListContext.Provider value={{ employees, departments, fetchUsers }}>
            {children}
        </UserListContext.Provider>
    );
};
