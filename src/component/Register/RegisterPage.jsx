import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Avatar from "../../assets/avatar.png";

const RegisterPage = () => {
    const navigate = useNavigate();
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [err, setErr] = useState(false);
  
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

  if (form.password !== form.passwordRepeat || form.password.length < 6) {
      alert('Пароль не совпадают либо его длина меньше 6 символов');
  } else {
      try {
          const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
          let photoURL = avatar.url;

          if (avatar.file) {
              const storageRef = ref(storage, `avatars/${res.user.uid}`);
              await uploadBytes(storageRef, avatar.file);
              photoURL = await getDownloadURL(storageRef);
          }

          await updateProfile(res.user, { displayName: form.fullName, photoURL });
          await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: form.fullName,
              photoURL,
              email: form.email,
              birthdate: form.birthdate,
              role: "ivWEEXNdOD9zP4pInXCk",
          });
          await setDoc(doc(db, "userChats", res.user.uid), {});

          navigate("/Diplom/");
      } catch (error) {
          setErr(true);
          console.error("Ошибка при регистрации: ", error);
      }
  }
};
const [form, setForm] =useState({
  fullName: "",
  email: "",
  password: "",
  passwordRepeat: "",
  birthdate: "",
});
const handleChange = (e) => {
  const {name, value} = e.target;
  setForm({
    ...form,
    [name] : value,
  });
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
                  <input type="file" id='file' 
                  style={{ display: "none" }} onChange={handleAvatar} />
                </div>
                <label htmlFor="text">ФИО:</label>
                <input type="text" id="text" name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                />
                <label htmlFor="text">Дата рождения:</label>
                <input type="date" name="birthdate" 
                  placeholder='Введите дату рождения' 
                  value={form.birthdate} 
                   onChange={handleChange}
                />
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email"
                />
                <label htmlFor="password">Пароль:</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange} 
                  placeholder="password"
                />
                <label htmlFor="password">Повторите пароль:</label>
                <input
                  type="password"
                  name="passwordRepeat"
                  value={form.passwordRepeat}
                  onChange={handleChange}
                  placeholder="Repeat password"
                />
                <button>Зарегистрироваться</button>
              </div>
              <div className="aut-reg">
                У вас уже существует аккаунт?{" "}
                <Link to="/Diplom/login">Авторизироваться</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export { RegisterPage };
