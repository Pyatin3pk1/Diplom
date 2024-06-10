import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from '../../firebase'; 

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    messages: []
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...state,
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      case "SET_MESSAGES":
        return {
          ...state,
          messages: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.chatId !== "null") {
      const unsubscribe = onSnapshot(doc(db, "chats", state.chatId), (doc) => {
        if (doc.exists()) {
          dispatch({ type: "SET_MESSAGES", payload: doc.data().messages });
        }
      });

      return () => unsubscribe();
    }
  }, [state.chatId]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
