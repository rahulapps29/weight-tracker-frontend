import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/auth";

// Create context
const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const extractUserData = (decodedToken) => {
    console.log("Decoded Token Details:", decodedToken);

    const firstName = decodedToken.firstName || decodedToken.given_name || "";
    const lastName = decodedToken.lastName || decodedToken.family_name || "";

    return {
      id: decodedToken.sub || decodedToken.userId || decodedToken.id,
      email: decodedToken.email,
      firstName,
      lastName,
      fullName:
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || decodedToken.name || "",
    };
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const userData = extractUserData(decoded);

          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          console.log("Auth initialized:", userData);
        } catch (error) {
          console.error("Token decoding failed:", error);
          logout();
        }
      }
    };
    initializeAuth();
  }, []);

  const login = async (newToken) => {
    console.log("Login initiated with token:", newToken);
    localStorage.setItem("token", newToken);

    try {
      const decoded = jwtDecode(newToken);
      const userData = extractUserData(decoded);

      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);

      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      console.log("Login successful:", userData);
    } catch (error) {
      console.error("Login failed. Invalid token.", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];

    console.log("User logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
