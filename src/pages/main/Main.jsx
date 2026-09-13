import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import UserProfile from "./UserProfile";
import Card from "../../components/ui/Card";
import { getMyAgents } from "../../api/agent";

function Main() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAgents()
      .then((data) => setAgents(data.data || []))
      .catch((error) => console.error("Agent 목록 조회 실패", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <UserProfile />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <p className="text-[15px] text-ink-tertiary">내 Agent</p>
            <p className="mt-2 text-3xl font-extrabold text-ink">
              {loading ? "-" : agents.length}
            </p>
          </Card>
          <Card>
            <p className="text-[15px] text-ink-tertiary">Conversations</p>
            <p className="mt-2 text-3xl font-extrabold text-ink">0</p>
          </Card>
          <Card>
            <p className="text-[15px] text-ink-tertiary">Messages</p>
            <p className="mt-2 text-3xl font-extrabold text-ink">0</p>
          </Card>
        </section>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">최근 Agent</h2>
            <Link to="/agents" className="text-sm font-medium text-primary">
              전체보기
            </Link>
          </div>

          {!loading && agents.length === 0 && (
            <div className="py-12 text-center text-ink-tertiary">
              아직 생성한 Agent가 없습니다.
            </div>
          )}

          {agents.length > 0 && (
            <div className="space-y-2">
              {agents.slice(0, 5).map((agent) => (
                <Link
                  key={agent.id}
                  to={`/agents/${agent.id}`}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 hover:bg-surface-alt"
                >
                  <div>
                    <p className="font-semibold text-ink">{agent.name}</p>
                    <p className="text-sm text-ink-tertiary">
                      {agent.description || "설명 없음"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

export default Main;
