import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/auth/Login";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
