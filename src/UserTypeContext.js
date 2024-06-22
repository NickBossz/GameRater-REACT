import React, { createContext, useContext, useState, useEffect } from 'react';

const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => {
    // Tenta recuperar o userType do localStorage, se não existir, usa null
    return JSON.parse(localStorage.getItem('userType')) || null;
  });

  useEffect(() => {
    // Salva o userType no localStorage sempre que ele mudar
    localStorage.setItem('userType', JSON.stringify(userType));
  }, [userType]);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export const useUserType = () => useContext(UserTypeContext);
