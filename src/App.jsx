import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./component/Context/AuthContext";
import Log from "./component/Login/Log";
import ChatMes from "./component/Message/ChatMes";
import Reg from "./component/Register/Reg";
import EmployeePage from "./component/Employee/EmployeePage";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/Diplom/login" />;
  }

  return children;
};

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/Diplom/login" element={<Log />} />
        <Route path="/Diplom/register" element={<Reg />} />
        <Route path="/Diplom/employee" element={<EmployeePage />} />
        <Route path="/Diplom/" element={<ProtectedRoute><ChatMes /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
