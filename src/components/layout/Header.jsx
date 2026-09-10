import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { getAccessToken, getRemainingTokenSeconds } from "../../utils/token";

function formatRemainingTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
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
    <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-6">
      <Link to="/" className="text-lg font-bold text-ink">
        AgentFlow
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
            {user?.data.name?.charAt(0) || "U"}
          </div>
          <span className="text-[15px] font-medium text-ink">
            {user?.data.name || "사용자"}님
          </span>
        </div>

        <span className="text-sm tabular-nums text-ink-tertiary">
          {formatRemainingTime(remainingSeconds)}
        </span>

        <button
          type="button"
          onClick={logout}
          className="rounded-xl px-4 py-2 text-sm font-medium text-ink-sub hover:bg-surface-alt"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default Header;
