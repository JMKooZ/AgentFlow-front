// src/pages/agent/AgentList.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import AgentFormModal from "./AgentFormModal";
import { getMyAgents, createAgent, deleteAgent } from "../../api/agent";

const TOOL_LABEL = {
  DATE_TIME: "날짜/시간 조회",
  CALCULATOR: "계산기",
};

function AgentList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(
    location.pathname === "/agents/new",
  );
  const [submitting, setSubmitting] = useState(false);

  const fetchAgents = () => {
    setLoading(true);

    getMyAgents()
      .then((data) => setAgents(data.data || []))
      .catch((error) => console.error("Agent 목록 조회 실패", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    setShowModal(location.pathname === "/agents/new");
  }, [location.pathname]);

  const closeModal = () => {
    setShowModal(false);

    if (location.pathname === "/agents/new") {
      navigate("/agents");
    }
  };

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);

      await createAgent(payload);

      closeModal();
      fetchAgents();
    } catch (error) {
      console.error("Agent 생성 실패", error);
      alert("Agent 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (e, agentId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("이 Agent를 삭제할까요?")) {
      return;
    }

    try {
      await deleteAgent(agentId);
      setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
    } catch (error) {
      console.error("Agent 삭제 실패", error);
      alert("Agent 삭제에 실패했습니다.");
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Agent</h1>
            <p className="mt-1 text-[15px] text-ink-tertiary">
              내가 만든 AI 에이전트를 관리해요
            </p>
          </div>

          <Button onClick={() => navigate("/agents/new")}>+ 새 Agent</Button>
        </div>

        {loading && (
          <Card className="py-16 text-center text-ink-tertiary">
            불러오는 중...
          </Card>
        )}

        {!loading && agents.length === 0 && (
          <Card className="py-16 text-center">
            <p className="text-ink-tertiary">아직 생성한 Agent가 없습니다.</p>
            <button
              onClick={() => navigate("/agents/new")}
              className="mt-3 text-[15px] font-semibold text-primary"
            >
              첫 Agent 만들어보기
            </button>
          </Card>
        )}

        {!loading && agents.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Link key={agent.id} to={`/agents/${agent.id}`}>
                <Card className="flex h-full flex-col justify-between transition-shadow hover:shadow-card-hover">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-ink">
                        {agent.name}
                      </h3>

                      <button
                        onClick={(e) => handleDelete(e, agent.id)}
                        className="text-sm text-ink-tertiary hover:text-danger"
                      >
                        삭제
                      </button>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-tertiary">
                      {agent.description || "설명이 없습니다"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(agent.tools || []).length === 0 && (
                      <span className="text-xs text-ink-tertiary">
                        도구 없음
                      </span>
                    )}

                    {(agent.tools || []).map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-ink-sub"
                      >
                        {TOOL_LABEL[tool] || tool}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AgentFormModal
          onClose={closeModal}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      )}
    </MainLayout>
  );
}

export default AgentList;
