import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { saveTokens } from "../../utils/token";
import { useAuth } from "../../contexts/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loadUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      saveTokens(data.data.accessToken, data.data.refreshToken);

      await loadUser();

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("아이디 또는 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-white">
            AF
          </div>

          <h1 className="text-2xl font-bold text-ink">AgentFlow</h1>
          <p className="mt-1.5 text-[15px] text-ink-tertiary">
            AI 에이전트를 만들고, 대화를 시작해보세요
          </p>
        </div>

        <div className="rounded-3xl bg-surface p-8 shadow-card">
          <form onSubmit={handleLogin} className="space-y-3">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button type="submit" disabled={loading} fullWidth className="mt-5">
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-ink-tertiary">
            <button
              type="button"
              onClick={() => setModal("findId")}
              className="hover:text-ink-sub"
            >
              아이디 찾기
            </button>

            <span className="text-line">·</span>

            <button
              type="button"
              onClick={() => setModal("findPassword")}
              className="hover:text-ink-sub"
            >
              비밀번호 찾기
            </button>

            <span className="text-line">·</span>

            <button
              type="button"
              onClick={() => setModal("signup")}
              className="hover:text-ink-sub"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>

      {modal && <AuthModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function AuthModal({ type, onClose }) {
  const title = {
    findId: "아이디 찾기",
    findPassword: "비밀번호 찾기",
    signup: "회원가입",
  }[type];

  const description = {
    findId: "가입할 때 사용한 이메일을 입력해주세요.",
    findPassword: "가입한 이메일을 입력해주세요.",
    signup: "몇 가지 정보만 입력하면 바로 시작할 수 있어요.",
  }[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-surface p-8 shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-tertiary hover:bg-surface-alt"
          >
            ✕
          </button>
        </div>

        <p className="mb-6 text-sm text-ink-tertiary">{description}</p>

        <div className="space-y-3">
          {type === "signup" && <Input type="text" placeholder="이름" />}

          <Input type="email" placeholder="이메일" />

          {type === "signup" && (
            <Input type="password" placeholder="비밀번호" />
          )}

          <Button fullWidth className="mt-2">
            {title}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
