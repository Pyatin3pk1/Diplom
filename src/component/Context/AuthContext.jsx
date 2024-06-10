import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authListenerEnabled, setAuthListenerEnabled] = useState(true);

  useEffect(() => {
    let unsub;

    if (authListenerEnabled) {
      unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user || null);
        console.log(user);
      });
    }

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [authListenerEnabled]);

  return (
    <AuthContext.Provider value={{ currentUser, setAuthListenerEnabled }}>
      {children}
    </AuthContext.Provider>
  );
};


