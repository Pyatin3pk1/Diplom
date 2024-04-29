import React, { useContext, useState } from "react";
import { useDispatch } from 'react-redux';
import Logo from '../../../assets/logo.png';
import { MdClose } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const HeaderMes = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState();
  return (
    <>
        <header className="header">
        <div className="container">
            <nav className={`menu ${isOpen ? "active" : ""}`}>
            <label className="burger-user">{currentUser.displayName}</label>
            <ul className="menu-list">
                <li className="menu-item">
                <a >Заявления</a>
                </li>
                <li className="menu-item">
                <a >Чат</a>
                </li>
                <li className="menu-item">
                <a >Уведомления</a>
                </li>
                <li className="menu-item user">
                <a >{currentUser.displayName}</a>
                    <ul>
                        <li><button onClick={() =>{ signOut(auth); navigate("/login")}}>Выход</button></li>
                    </ul>
                </li>
            </ul>
            <button className="menu-button"
                onClick={() => setOpen(!isOpen)}><GiHamburgerMenu/></button>
            <button className="button-logaut" onClick={() =>{ signOut(auth); navigate("/login")}}>Выход</button>
            </nav>
        </div>
        </header>
    </>
  );
}

export default HeaderMes;