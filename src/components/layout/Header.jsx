import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import { getAccessToken, getRemainingTokenSeconds } from "../../utils/token";

function formatRemainingTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function Header() {
  const { user, logout } = useAuth();
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const updateTokenTime = () => {
      const token = getAccessToken();

      if (!token) {
        setRemainingSeconds(0);
        return;
      }

      setRemainingSeconds(getRemainingTokenSeconds(token));
    };

    updateTokenTime();

    const interval = setInterval(updateTokenTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">AgentFlow</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {user?.data.name?.charAt(0) || "U"}
          </div>

          <span className="font-medium">{user?.data.name || "사용자"}님</span>
        </div>

        <span className="text-sm text-gray-500">
          {formatRemainingTime(remainingSeconds)}
        </span>

        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default Header;
