import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import "./firebase";
import { AuthContextProvider } from "./component/Context/AuthContext";
import { ChatContextProvider } from "./component/Context/ChatContext";

const root = createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
          <App />
    </React.StrictMode>
    </ChatContextProvider>
    
  </AuthContextProvider>,
);