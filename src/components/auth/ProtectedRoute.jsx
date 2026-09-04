import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken, getRemainingTokenSeconds } from "../../utils/token";

function isSessionValid() {
  const accessToken = getAccessToken();
  return Boolean(accessToken) && getRemainingTokenSeconds(accessToken) > 0;
}

function ProtectedRoute({ children }) {
  const [redirect, setRedirect] = useState(false);
  const alerted = useRef(false);

  useEffect(() => {
    if (!isSessionValid() && !alerted.current) {
      alerted.current = true;
      alert("로그인 후 이용해주세요.");
      setRedirect(true);
    }
  }, []);

  if (!isSessionValid() && !redirect) {
    // 첫 렌더 시점엔 아직 useEffect가 안 돌았으므로 아무것도 보여주지 않고 대기
    return null;
  }

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
