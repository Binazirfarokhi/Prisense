import {createContext, useState, useContext, useEffect} from 'react';
import {authedRequest, JWT_TOKEN} from "../http";

const AuthContext = createContext();

//Old auth 
const useAuth = () => {
  const _authed = Boolean(localStorage.getItem(JWT_TOKEN));
  const [authed, setAuthed] = useState(_authed);
  const [userData, setUserData] = useState(
    localStorage.getItem('USER_DATA') ?
      JSON.parse(localStorage.getItem('USER_DATA')) : null
  );
  return {
    authed,
    userData,
    setUserData,
    login(token, userData) {
      localStorage.setItem(JWT_TOKEN, token);
      localStorage.setItem('USER_DATA', JSON.stringify(userData));
      return new Promise(res => {
        setAuthed(true);
        setUserData(userData);
        res();
      })
    },
    logout() {
      localStorage.removeItem(JWT_TOKEN);
      localStorage.removeItem('USER_DATA')
      return new Promise(res => {
        setAuthed(false);
        res();
      })
    }
  }
}

export const AuthProvider = ({children}) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext);
}
