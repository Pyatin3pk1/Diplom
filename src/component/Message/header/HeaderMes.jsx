import React, { useContext, useState } from "react";
import { useDispatch } from 'react-redux';
import "./header.css"
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { AuthContext } from "../../Context/AuthContext";

const HeaderMes = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <>
        <header className="header">
        <div className="container">
            <nav className="menu">
            <ul className="menu-list">
                <li className="menu-item">
                <a ><img  alt="logo" /></a>
                </li>
                <li className="menu-item">
                <a >Заявления</a>
                </li>
                <li className="menu-item">
                <a >Чат</a>
                </li>
                <li className="menu-item">
                <a >Уведомления</a>
                </li>
                <li className="menu-item">
                <a >{currentUser.displayName}</a>
                    <ul>
                        <li><button onClick={() => signOut(auth)}>Выход</button></li>
                    </ul>
                </li>
            </ul>
            </nav>
        </div>
        </header>
    </>
    
  );
}

export default HeaderMes;