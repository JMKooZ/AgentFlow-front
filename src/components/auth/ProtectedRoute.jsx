import { Navigate } from "react-router-dom";
import { getAccessToken } from "../../utils/token";

function ProtectedRoute({ children }) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    alert("로그인 후 이용해주세요.");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
