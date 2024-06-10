import React, { useState } from 'react';

import {Link, useNavigate} from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = ({title, handleClick}) => {
    const[email, setEmail] = useState('');
    const[pass, setPass] = useState('');
    const[errMessage, setErrMessage] = useState('')
    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const userEmail = email;
        const password = pass;        
        try{
            await signInWithEmailAndPassword(auth, 
                userEmail, password);
            navigate("/Diplom/");
          
        }catch(err){
            setErrMessage('Ошибка авторизации. Пожалуйста попробуйте ещё раз.');
            setTimeout (() => {
                setErrMessage('');
            }, 10000)
        }
    }
    return (
        <>
            <div className="container-log">
                <div className="container-blur">
                    <div className="login-container">
                        <h3>Авторизация</h3>
                        {errMessage && <p>{errMessage}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                type="email"
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
                            <button>
                                    Авторизоваться
                                </button>
                            </div>
                            <div className="aut-reg">
                                У вас не существует аккаунт? <Link to="/register">Зарегестрироваться</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>   
        </>
    );
};

export {LoginPage};