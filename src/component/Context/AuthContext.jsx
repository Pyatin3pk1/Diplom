import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authListenerEnabled, setAuthListenerEnabled] = useState(true);

  useEffect(() => {
    let unsubscribe;

    if (authListenerEnabled) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user || null);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [authListenerEnabled]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={{ currentUser, setAuthListenerEnabled }}>
      {children}
    </AuthContext.Provider>
  );
};
