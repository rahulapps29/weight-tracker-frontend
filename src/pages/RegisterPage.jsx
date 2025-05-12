import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Register from "../components/auth/Register";
import AuthContext from "../context/AuthContext";

const RegisterPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
