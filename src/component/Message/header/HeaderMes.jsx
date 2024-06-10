import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../assets/avatar.png";

const HeaderMes = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  // Проверяем, что currentUser установлен, прежде чем использовать его свойства
  const displayName = currentUser ? currentUser.displayName : '';
  const avatarUrl = currentUser ? currentUser.photoURL : '';

  return (
    <>
      <header className="header">
        <div className="container">
          <nav className={`menu ${isOpen ? "active" : ""}`}>
            <label className="burger-user">{displayName}</label>
            <ul className="menu-list">
              <li className="menu-item">
                <a onClick={() => { navigate('/Diplom/') }}>Чат</a>
              </li>
              <li className="menu-item">
                <a onClick={() => { navigate('/Diplom/employee') }}>Сотрудники</a>
              </li>
              <li className="menu-item menu-item__user">
                <img src={avatarUrl || Avatar} alt="avatar"/>
                <a>{displayName}</a>
              </li>
              <li>
                <button className="menu-button" onClick={() => setOpen(!isOpen)}><GiHamburgerMenu /></button>
                <button className="button-logaut" onClick={() => { signOut(auth); navigate("/Diplom/login") }}>Выход</button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default HeaderMes;
