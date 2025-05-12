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

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const extractUserData = (decodedToken) => {
    console.log("Decoded Token Details:", {
      fullToken: decodedToken,
      standardClaims: {
        iss: decodedToken.iss, // Issuer
        sub: decodedToken.sub, // Subject (user ID)
        aud: decodedToken.aud, // Audience
        exp: decodedToken.exp, // Expiration time
        iat: decodedToken.iat, // Issued at
        nbf: decodedToken.nbf, // Not before
        jti: decodedToken.jti, // JWT ID
      },
      customClaims: {
        username: decodedToken.username,
        preferred_username: decodedToken.preferred_username,
        name: decodedToken.name,
        email: decodedToken.email,
        // Add any other custom claims your token might have
      },
    });

    return {
      id: decodedToken.sub || decodedToken.userId,
      username:
        decodedToken.username ||
        decodedToken.preferred_username ||
        decodedToken.name,
      email: decodedToken.email,
    };
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      console.log("Initializing auth with stored token:", storedToken);

      if (storedToken) {
        try {
          console.log("Raw token string:", storedToken);
          const decoded = jwtDecode(storedToken);
          console.log("Token decoded successfully");

          const userData = extractUserData(decoded);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          console.log("Authentication initialized successfully");
        } catch (error) {
          console.error("Token decoding error:", error);
          console.error("Invalid token - performing logout");
          logout();
        }
      } else {
        console.log("No stored token found");
      }
    };
    initializeAuth();
  }, []);

  const login = async (token) => {
    console.log("Login initiated with token:", token);
    localStorage.setItem("token", token);

    try {
      const decoded = jwtDecode(token);
      console.log("Login token decoded successfully");

      const userData = extractUserData(decoded);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(token);
      setIsAuthenticated(true);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Login completed successfully");
    } catch (error) {
      console.error("Login token decoding failed:", error);
      logout();
    }
  };

  const logout = () => {
    console.log("Logout initiated");
    console.log("Current auth state before logout:", {
      user,
      token,
      isAuthenticated,
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];

    console.log("Logout completed");
    console.log("Auth state after logout:", {
      user: null,
      token: null,
      isAuthenticated: false,
    });
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

// Export the context as default
export default AuthContext;
