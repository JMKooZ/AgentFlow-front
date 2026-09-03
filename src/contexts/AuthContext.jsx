import { createContext, useCallback, useEffect, useState } from "react";

import { getMyProfile } from "../api/user";
import { clearTokens, getAccessToken } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getMyProfile();

      setUser(data);
    } catch (error) {
      console.error("사용자 정보 조회 실패", error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const logout = () => {
    clearTokens();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loadUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
