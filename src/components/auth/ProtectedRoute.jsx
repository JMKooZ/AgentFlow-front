import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken, getRemainingTokenSeconds } from "../../utils/token";

function isSessionValid() {
  const accessToken = getAccessToken();
  return Boolean(accessToken) && getRemainingTokenSeconds(accessToken) > 0;
}

function ProtectedRoute({ children }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  if (!checked) {
    // 첫 렌더 시점엔 아직 세션 체크가 끝나지 않았으니 잠깐 대기
    return null;
  }

  if (!isSessionValid()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;