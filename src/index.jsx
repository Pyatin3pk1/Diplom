import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import { AuthContextProvider } from "./component/Context/AuthContext";
import { ChatContextProvider } from "./component/Context/ChatContext";
import { UserListContextProvider } from "./component/Context/UserListContext";
import "./index.css";
import "./firebase";

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <UserListContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </UserListContextProvider>
    </ChatContextProvider>
  </AuthContextProvider>,
);
