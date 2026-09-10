import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import Card from "../../components/ui/Card";

function UserProfile() {
  const { user } = useAuth();

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-2xl font-bold text-primary">
          {user?.data.name?.charAt(0) || "U"}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ink">
            {user?.data.name || "사용자"}님, 안녕하세요.
          </h2>
          <p className="mt-1 text-[15px] text-ink-tertiary">
            {user?.data.email}
          </p>
        </div>
      </div>

      <Link to="/agents/new">
        <button className="h-12 rounded-2xl bg-primary px-5 text-[15px] font-semibold text-white hover:bg-primary-strong">
          + 새 Agent 만들기
        </button>
      </Link>
    </Card>
  );
}

export default UserProfile;
