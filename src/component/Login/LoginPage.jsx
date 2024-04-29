import React, { useState } from 'react';

import {Link, useNavigate} from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = ({title, handleClick}) => {
    const[email, setEmail] = useState('');
    const[pass, setPass] = useState('');
    const [err, setErr] = useState(false)
    const navigate = useNavigate();
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const email = e.target[0].value;
        const password = e.target[1].value;        
        try{
            await signInWithEmailAndPassword(auth, 
                email, password);
            navigate("/");
          
        }catch(err){
            setErr(true);
        }
    }
    return (
        <>
            <div className="container-log">
                <div className="container-blur">
                    <div className="login-container">
                        <h3>Авторизация</h3>
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