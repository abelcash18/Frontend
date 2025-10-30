import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
   const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
   );
          const updateUser = (data) =>{
            console.debug("AuthContext.updateUser called with:", data);
            // normalize common response wrappers so components can rely on a flat user object
            if (!data) {
              setCurrentUser(null);
              return;
            }

            let user = data;
            // unwrap common wrappers: { user: {...} } or { data: {...} }
            if (user.user) user = user.user;
            if (user.data) user = user.data;
            // handle nested wrappers again just in case
            if (user.user) user = user.user;

            console.debug("AuthContext.updateUser normalized to:", user);
            setCurrentUser(user);
          };
          useEffect (()=>{
            localStorage.setItem("user", JSON.stringify(currentUser));
          }, [currentUser])

  return (
    <AuthContext.Provider value={{currentUser, updateUser}}>
      {children}
    </AuthContext.Provider>
  );
 }; 