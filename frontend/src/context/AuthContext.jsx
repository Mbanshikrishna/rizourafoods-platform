import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../api/auth";
import { getMe } from "../api/customer";
import { setAccessToken } from "../api/client";
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [session, setSession] = useState(null); const save = (data) => { setAccessToken(data.accessToken); setSession(data.customer); }; useEffect(() => { const existing = sessionStorage.getItem("rizoura-customer-access-token"); if (existing) getMe().then((result) => setSession(result.data)).catch(() => setAccessToken(null)); const expired = () => setSession(null); window.addEventListener("rizoura:session-expired", expired); return () => window.removeEventListener("rizoura:session-expired", expired); }, []); const value = useMemo(() => ({ session, async login(email, password) { const response = await auth.login(email, password); save(response.data); return response.data.customer; }, async register(data) { const response = await auth.register(data); save(response.data); return response.data.customer; }, async logout() { await auth.logout(); setAccessToken(null); setSession(null); } }), [session]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; }
export const useAuth = () => useContext(AuthContext);
