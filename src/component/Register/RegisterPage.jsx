import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Avatar from "../../assets/avatar.png";

const RegisterPage = () => {
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");  
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [birthdate, setBirthdate] = useState("");

  const handleAvatar = e => {
    if (e.target.files[0]) {
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0]) // Сохраняем URL изображения
        });
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    let photoURL = avatar.url;
    if (password !== passwordRepeat || password.length < 6) {
      alert(`Пароль не совпадают либо его длина меньше 6 символов`);
    } else {
      try {
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
                birthdate, 
                role: "ivWEEXNdOD9zP4pInXCk",
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
        
        // Перенаправление на главную страницу
        navigate("/");
      } catch (err) {
        setErr(true);
      }
    }
  };

  return (
    <>
      <div className="container-log">
        <div className="container-blur">
          <div className="login-container">
            <h3>Регистрация</h3>
            {err && <span>Error</span>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="avatar">
                  <label htmlFor="file">
                        <img src={avatar.url || Avatar} alt="" />
                        Загрузите изображение
                  </label>
                  <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />
                </div>
                <label htmlFor="text">ФИО:</label>
                <input
                  type="text"
                  id="text"
                  value={fullName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя пользователя"
                />
                <label htmlFor="text">Дата рождения:</label>
                <input 
                        type="date" 
                        placeholder='Введите дату рождения' 
                        value={birthdate} 
                        onChange={(e) => setBirthdate(e.target.value)}
                />
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Исправлено на обновление состояния password
                  placeholder="password"
                />
                <label htmlFor="password">Повторите пароль:</label>
                <input
                  type="password"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)} // Исправлено на обновление состояния passwordRepeat
                  placeholder="Repeat password"
                />
                <button>Зарегистрироваться</button>
              </div>
              <div className="aut-reg">
                У вас уже существует аккаунт?{" "}
                <Link to="/login">Авторизироваться</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export { RegisterPage };
