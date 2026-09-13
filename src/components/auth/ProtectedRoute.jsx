import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken, getRemainingTokenSeconds } from "../../utils/token";

function isSessionValid() {
  const accessToken = getAccessToken();
  return Boolean(accessToken) && getRemainingTokenSeconds(accessToken) > 0;
}

function ProtectedRoute() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!isSessionValid()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;