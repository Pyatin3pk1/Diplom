import React, { useContext, useEffect, useState } from 'react';
import HeaderMes from '../Message/header/HeaderMes';
import { AuthContext } from '../Context/AuthContext';
import ListUser from './ListUser';
import Employee from './Employee';
import ListEmployee from './ListEmployee';
import { db } from '../../firebase'; // Импортируйте вашу инициализацию Firebase
import { doc, getDoc } from 'firebase/firestore';

const EmployeePage = () => {
    const { currentUser } = useContext(AuthContext);
    const [component, setComponent] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userRole = userDoc.data().role;

                        switch (userRole) {
                            case 'KzxCM6fT2xzPanAOEmcQ':
                                setComponent(<ListUser />);
                                break;
                            case 'oMGZva1dPCTa970VSpe2':
                                setComponent(<Employee />);
                                break;
                            case 'ivWEEXNdOD9zP4pInXCk':
                                setComponent(<ListEmployee />);
                                break;
                            default:
                                alert("Ошибка входа на страницу");
                                break;
                        }
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            } else {
                alert("Ошибка пользователя");
            }
        };

        fetchUserRole();
    }, [currentUser]);

    return (
        <div>
            <HeaderMes />
            {component}
        </div>
    );
};

export default EmployeePage;
