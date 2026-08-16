import { createContext, useContext, useMemo, useState } from "react";
import * as auth from "../api/auth";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(sessionStorage.getItem("rizoura-session") || "null"));
  const value = useMemo(() => ({
    session,
    async login(email, password) {
      const response = await auth.login(email, password);
      const next = { accessToken: response.data.accessToken, email };
      sessionStorage.setItem("rizoura-session", JSON.stringify(next)); setSession(next);
    },
    async logout() { await auth.logout(); sessionStorage.removeItem("rizoura-session"); setSession(null); },
  }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
