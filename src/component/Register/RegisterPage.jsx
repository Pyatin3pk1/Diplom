import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterPage = ({ title, handleClick }) => {
    const [fullName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [passRepeat, setPassRepeat] = useState('');
    const [err, setErr] = useState(false)
    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const passwordRepead = e.target[3].value;
        if(password !== passRepeat || password.length < 6){
            alert("Пароль не совпадают либо его дляна меньше 6 символов!!!");
        }else{
            try{
                const res = await createUserWithEmailAndPassword(auth, 
                    email, password);
                console.log(res);
                await updateProfile(res.user, {
                  displayName,
                });
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  displayName,
                  email,
                });
                await setDoc(doc(db, "userChats", res.user.uid), {});
                navigate("/");
              
            }catch(err){
                setErr(true);
            }
        }
        
    }
    return (
        <>
            <div className="container-log">
                <div className="container-blur">
                    <div className="login-container">
                        <h3>Регистрация</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="text">ФИО:</label>
                                <input type="text" id="text" value={fullName}
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder='Полностью ФИО' />
                            </div>
                            <div className="input-group">
                                {err && <span>Error</span>}
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='email'
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Пароль:</label>
                                <input
                                    type="password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    placeholder='password'
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Повторите пароль:</label>
                                <input
                                    type="password"
                                    value={passRepeat}
                                    onChange={(e) => setPassRepeat(e.target.value)}
                                    placeholder='Repead password'
                                />
                            </div>
                            <div className="input-group">
                                <button >
                                    Зарегистрироваться
                                </button>
                            </div>
                            <div className="aut-reg">
                                У вас уже существует аккаунт? <Link to="/login">Авторизироваться</Link>
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </>
        
    );
};
export {RegisterPage};