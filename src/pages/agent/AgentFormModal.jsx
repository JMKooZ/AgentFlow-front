import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const TOOL_OPTIONS = [
  { value: "DATE_TIME", label: "날짜/시간 조회" },
  { value: "CALCULATOR", label: "계산기" },
  { value: "CONVERSATION_QUERY", label: "이전 대화 검색" },
  { value: "FILE_WRITE", label: "파일 생성" },
  { value: "WEB_SEARCH", label: "웹 검색" },
];

function AgentFormModal({ initial, onClose, onSubmit, submitting }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [systemPrompt, setSystemPrompt] = useState(initial?.systemPrompt || "");
  const [tools, setTools] = useState(new Set(initial?.tools || []));
  const [error, setError] = useState("");

  const toggleTool = (value) => {
    setTools((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Agent 이름을 입력해주세요.");
    if (!systemPrompt.trim()) return setError("System Prompt를 입력해주세요.");
    setError("");
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      systemPrompt: systemPrompt.trim(),
      tools: Array.from(tools),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-surface p-8 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">
            {initial ? "Agent 수정" : "새 Agent 만들기"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-tertiary hover:bg-surface-alt"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="이름"
            placeholder="예: 일정 관리 Agent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="설명 (선택)"
            placeholder="이 Agent가 어떤 역할을 하는지 간단히 적어주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink-sub">
              System Prompt
            </span>
            <textarea
              rows={4}
              placeholder="Agent의 역할과 응답 방식을 지시해주세요"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full resize-none rounded-2xl bg-surface-alt px-4 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none focus:bg-surface focus:ring-2 focus:ring-primary"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium text-ink-sub">
              사용할 도구
            </span>
            <div className="flex flex-wrap gap-2">
              {TOOL_OPTIONS.map((tool) => {
                const active = tools.has(tool.value);
                return (
                  <button
                    key={tool.value}
                    type="button"
                    onClick={() => toggleTool(tool.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-primary-soft text-primary" : "bg-surface-alt text-ink-sub hover:bg-line"}`}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              취소
            </Button>
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "저장 중..." : initial ? "수정하기" : "만들기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgentFormModal;
