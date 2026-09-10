import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getAgent } from "../../api/agent";
import {
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessage,
} from "../../api/conversation";

function ConversationPage() {
  const { id: agentId } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState("");

  const scrollRef = useRef(null);

  // Agent 정보 + 대화 목록 최초 로드
  useEffect(() => {
    let ignore = false;

    getAgent(agentId)
      .then((data) => {
        if (!ignore) setAgent(data.data);
      })
      .catch((error) => console.error("Agent 조회 실패", error));

    setLoadingList(true);

    getConversations(agentId)
      .then((data) => {
        if (ignore) return;
        const list = data.data || [];
        setConversations(list);
        if (list.length > 0) setActiveId(list[0].id);
      })
      .catch((error) => {
        if (!ignore) console.error("대화 목록 조회 실패", error);
      })
      .finally(() => {
        if (!ignore) setLoadingList(false);
      });

    return () => {
      ignore = true;
    };
  }, [agentId]);

  // 선택된 대화의 메시지 로드
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    let ignore = false;
    setLoadingMessages(true);

    getMessages(activeId)
      .then((data) => {
        if (!ignore) setMessages(data.data || []);
      })
      .catch((error) => {
        if (!ignore) console.error("메시지 조회 실패", error);
      })
      .finally(() => {
        if (!ignore) setLoadingMessages(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, sending]);

  const handleNewConversation = async () => {
    const title = prompt("새 대화의 제목을 입력해주세요.", "새 대화");
    if (!title) return;

    try {
      const data = await createConversation(agentId, title);
      const created = data.data;
      setConversations((prev) => [created, ...prev]);
      setActiveId(created.id);
    } catch (error) {
      console.error("대화 생성 실패", error);
      alert("대화 생성에 실패했습니다.");
    }
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    if (!confirm("이 대화를 삭제할까요?")) return;

    try {
      await deleteConversation(agentId, conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeId === conversationId) setActiveId(null);
    } catch (error) {
      console.error("대화 삭제 실패", error);
      alert("대화 삭제에 실패했습니다.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !activeId || sending) return;

    setSendError("");
    setInput("");
    setSending(true);

    const optimisticUserMessage = {
      id: `temp-${Date.now()}`,
      role: "USER",
      content,
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      const data = await sendMessage(activeId, content);
      setMessages((prev) => [...prev, data.data]);
    } catch (error) {
      console.error("메시지 전송 실패", error);
      setSendError("메시지 전송에 실패했어요. 다시 시도해주세요.");
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticUserMessage.id),
      );
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl gap-4">
        <aside className="w-64 shrink-0 overflow-y-auto rounded-3xl bg-surface p-3 shadow-card">
          <div className="mb-2 flex items-center justify-between px-2 pt-1">
            <Link
              to={`/agents/${agentId}`}
              className="text-xs font-medium text-ink-tertiary hover:text-ink-sub"
            >
              ← {agent?.name || "Agent"}
            </Link>
          </div>

          <button
            onClick={handleNewConversation}
            className="mb-2 w-full rounded-2xl bg-primary-soft px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            + 새 대화
          </button>

          {loadingList && (
            <p className="px-2 py-3 text-sm text-ink-tertiary">
              불러오는 중...
            </p>
          )}

          {!loadingList && conversations.length === 0 && (
            <p className="px-2 py-3 text-sm text-ink-tertiary">
              아직 대화가 없어요. 새 대화를 시작해보세요.
            </p>
          )}

          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveId(conversation.id)}
                className={`flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                  activeId === conversation.id
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-ink-sub hover:bg-surface-alt"
                }`}
              >
                <span className="truncate">{conversation.title}</span>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="ml-2 shrink-0 text-ink-tertiary hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </aside>

        <Card className="flex flex-1 flex-col p-0">
          {!activeId && (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-ink-tertiary">
              <p>왼쪽에서 대화를 선택하거나</p>
              <p>새 대화를 시작해보세요.</p>
            </div>
          )}

          {activeId && (
            <>
              <div
                ref={scrollRef}
                className="flex-1 space-y-4 overflow-y-auto p-6"
              >
                {loadingMessages && (
                  <p className="text-center text-sm text-ink-tertiary">
                    불러오는 중...
                  </p>
                )}

                {!loadingMessages && messages.length === 0 && (
                  <p className="text-center text-sm text-ink-tertiary">
                    이 Agent에게 첫 메시지를 보내보세요.
                  </p>
                )}

                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-2xl bg-surface-alt px-4 py-3 text-[15px] text-ink-tertiary">
                      답변을 생각하는 중...
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-end gap-2 border-t border-line p-4"
              >
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="메시지를 입력하세요"
                  className="max-h-32 flex-1 resize-none rounded-2xl bg-surface-alt px-4 py-3 text-[15px] text-ink placeholder:text-ink-tertiary outline-none focus:bg-surface focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" disabled={sending || !input.trim()}>
                  전송
                </Button>
              </form>

              {sendError && (
                <p className="px-4 pb-3 text-sm text-danger">{sendError}</p>
              )}
            </>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "USER";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${isUser ? "bg-primary text-white" : "bg-surface-alt text-ink"}`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationPage;
