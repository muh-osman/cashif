"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export function AuthProvider({ initialLoggedIn = false, children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);

  useEffect(() => {
    setIsLoggedIn(initialLoggedIn);
  }, [initialLoggedIn]);

  const value = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
