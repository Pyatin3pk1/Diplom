import { AuthContext } from "./component/Context/AuthContext";
import { Navigate } from "react-router-dom";
import React, { Children, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Link,
} from "react-router-dom";
import Log from "./component/Login/Log";
import ChatMes from "./component/Message/ChatMes";
import Reg from "./component/Register/Reg";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <BrowserRouter>
      <Routes >
        <Route exact path="/login" element={<Log/>} />
        <Route exact path="/register" element={<Reg/>} />
        <Route exact path="/" element={<ChatMes/>} />
        <Route
          exact path="/"
          element={
            <ProtectedRoute>
              <ChatMes/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
