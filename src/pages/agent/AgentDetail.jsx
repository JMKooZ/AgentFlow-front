import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import AgentFormModal from "./AgentFormModal";
import { getAgent, updateAgent, deleteAgent } from "../../api/agent";

const TOOL_LABEL = {
  DATE_TIME: "날짜/시간 조회",
  CALCULATOR: "계산기",
  CONVERSATION_QUERY: "이전 대화 검색",
  FILE_WRITE: "파일 생성",
  WEB_SEARCH: "웹 검색",
};

function AgentDetail() {
  const { id: agentId } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    getAgent(agentId)
        .then((data) => {
          if (!ignore) setAgent(data.data);
        })
        .catch((error) => {
          if (!ignore) {
            console.error("Agent 조회 실패", error);
            alert("Agent를 찾을 수 없습니다.");
            navigate("/agents");
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });

    return () => {
      ignore = true;
    };
  }, [agentId, navigate]);

  const handleUpdate = async (payload) => {
    try {
      setSubmitting(true);

      await updateAgent(agentId, payload);

      const data = await getAgent(agentId);
      setAgent(data.data);
      setShowEdit(false);
    } catch (error) {
      console.error("Agent 수정 실패", error);
      alert("Agent 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("이 Agent를 삭제할까요? 되돌릴 수 없어요.")) {
      return;
    }

    try {
      await deleteAgent(agentId);
      navigate("/agents");
    } catch (error) {
      console.error("Agent 삭제 실패", error);
      alert("대화 기록이 남아있는 Agent는 삭제할 수 없어요.");
    }
  };

  if (loading) {
    return (
        <MainLayout>
          <div className="mx-auto max-w-3xl">
            <Card className="py-16 text-center text-ink-tertiary">불러오는 중...</Card>
          </div>
        </MainLayout>
    );
  }

  if (!agent) {
    return null;
  }

  return (
      <MainLayout>
        <div className="mx-auto max-w-3xl space-y-6">
          <Link to="/agents" className="text-sm font-medium text-ink-tertiary hover:text-ink-sub">
            ← Agent 목록으로
          </Link>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ink">{agent.name}</h1>
                <p className="mt-1.5 text-[15px] text-ink-tertiary">
                  {agent.description || "설명이 없습니다"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowEdit(true)}>
                  수정
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {(agent.tools || []).length === 0 && (
                  <span className="text-xs text-ink-tertiary">사용 중인 도구 없음</span>
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

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-ink-sub">System Prompt</h2>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
              {agent.systemPrompt}
            </p>
          </Card>

          <div className="rounded-2xl bg-primary-soft px-4 py-3 text-sm leading-relaxed text-primary">
            📄 이 Agent는{" "}
            <Link to="/documents" className="font-semibold underline">
              문서함
            </Link>
            에 업로드한 문서도 자동으로 참고해요 (모든 Agent 공통).
          </div>

          <Link to={`/agents/${agentId}/chat`}>
            <Button fullWidth>이 Agent와 대화 시작하기</Button>
          </Link>
        </div>

        {showEdit && (
            <AgentFormModal
                initial={agent}
                onClose={() => setShowEdit(false)}
                onSubmit={handleUpdate}
                submitting={submitting}
            />
        )}
      </MainLayout>
  );
}

export default AgentDetail;