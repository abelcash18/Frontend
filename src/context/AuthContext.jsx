import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
   const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
   );
          const updateUser = (data) =>{
            console.debug("AuthContext.updateUser called with:", data);
            if (!data) {
              setCurrentUser(null);
              return;
            }

            let user = data;
            if (user.user) user = user.user;
            if (user.data) user = user.data;
            if (user.user) user = user.user;

            // Preserve token and accessToken from current state if not present in new data
            if (currentUser && !user.token && !user.accessToken) {
              user.token = currentUser.token || currentUser.accessToken;
              user.accessToken = currentUser.accessToken || currentUser.token;
            }

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