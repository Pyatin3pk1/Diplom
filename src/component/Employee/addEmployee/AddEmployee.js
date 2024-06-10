import React, { useEffect, useState, useContext } from 'react';
import { auth, db, storage } from '../../../firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Avatar from "../../../assets/avatar.png";
import { AuthContext } from "../../Context/AuthContext";
import "./addEmployee.css";
import { UserListContext } from "../../Context/UserListContext";

const AddEmployee = ({ closeModal }) => {
    const { currentUser, setAuthListenerEnabled } = useContext(AuthContext);
    const { fetchUsers } = useContext(UserListContext);
    const [avatar, setAvatar] = useState({ file: null, url: "" });
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthdate, setBirthdate] = useState(""); // Новое состояние для даты рождения
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [err, setErr] = useState(false);

    useEffect(() => {
        const fetchRolesAndDepartments = async () => {
            const rolesCollection = collection(db, 'Role');
            const departmentsCollection = collection(db, 'Department');
            const rolesSnapshot = await getDocs(rolesCollection);
            const departmentsSnapshot = await getDocs(departmentsCollection);

            setRoles(rolesSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
            setDepartments(departmentsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
        };

        fetchRolesAndDepartments();
    }, []);

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setAuthListenerEnabled(false);

            const res = await createUserWithEmailAndPassword(auth, email, password);
            let photoURL = avatar.url;

            if (avatar.file) {
                const storageRef = ref(storage, `avatars/${res.user.uid}`);
                await uploadBytes(storageRef, avatar.file);
                photoURL = await getDownloadURL(storageRef);
            }

            await updateProfile(res.user, { displayName: fullName, photoURL });
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: fullName,
                photoURL,
                email,
                birthdate,  // Сохраняем дату рождения
                role: selectedRole,
                department: selectedDepartment,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});

            // Входим обратно в учетную запись администратора
            await signOut(auth);
            await signInWithEmailAndPassword(auth, currentUser.email, password); // Предполагается, что у вас есть способ хранения пароля администратора

            // Включаем прослушиватель изменений состояния аутентификации
            setAuthListenerEnabled(true);

            // Закрываем модальное окно и обновляем список пользователей
            fetchUsers();
            closeModal();
        } catch (err) {
            console.error("Ошибка при регистрации:", err);
            if (err.code && err.code.includes("auth/")) {
                alert("Ошибка при регистрации: " + err.message);
                setErr(true);
            } else {
                alert("Произошла ошибка: " + err.message);
            }
            setAuthListenerEnabled(true); 
        }
    };

    return (
        <div className='addEmployee'>
            <div className="item">
                <h2>Создание учетной записи</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="file">
                        <img src={avatar.url || Avatar} alt="" />
                        Загрузите изображение
                    </label>
                    <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />
                    <input 
                        type="text" 
                        placeholder='Введите имя пользователя' 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder='Введите email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder='Введите пароль' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input 
                        type="date" 
                        placeholder='Введите дату рождения' 
                        value={birthdate} 
                        onChange={(e) => setBirthdate(e.target.value)}
                    />
                    <select 
                        name="role" 
                        value={selectedRole} 
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">Выберите роль</option>
                        {roles.map(role => (
                            <option key={role.uid} value={role.uid}>{role.Name}</option>
                        ))}
                    </select>
                    <select 
                        name="department" 
                        value={selectedDepartment} 
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">Выберите отдел</option>
                        {departments.map(department => (
                            <option key={department.uid} value={department.uid}>{department.Name}</option>
                        ))}
                    </select>
                    {err && <span>Ошибка при регистрации</span>}
                    <button type="submit">Сохранить</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
