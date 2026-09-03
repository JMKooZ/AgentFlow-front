import MainLayout from "../../layouts/MainLayout";
import UserProfile from "./UserProfile";

function Main() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <UserProfile />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border p-6">
            <p className="text-gray-500">내 Agent</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <p className="text-gray-500">Conversations</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <p className="text-gray-500">Messages</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-bold">최근 Agent</h2>

          <div className="py-12 text-center text-gray-400">
            아직 생성한 Agent가 없습니다.
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default Main;
