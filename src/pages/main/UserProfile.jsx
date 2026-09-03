import { useAuth } from "../../contexts/useAuth";

function UserProfile() {
  const { user } = useAuth();

  return (
    <section className="bg-white rounded-2xl border p-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
          {user?.data.name?.charAt(0) || "U"}
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            {user?.data.name || "사용자"}님, 안녕하세요.
          </h2>

          <p className="text-gray-500 mt-1">{user?.data.email}</p>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold">
          + 새 Agent 만들기
        </button>
      </div>
    </section>
  );
}

export default UserProfile;
