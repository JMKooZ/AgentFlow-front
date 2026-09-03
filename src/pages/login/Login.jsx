import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { saveTokens } from "../../utils/token";
import { useAuth } from "../../contexts/useAuth";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">AgentFlow</h1>

          <p className="mt-2 text-gray-500">AI Agent Platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => setModal("findId")}
            className="hover:text-blue-600"
          >
            아이디 찾기
          </button>

          <span>|</span>

          <button
            type="button"
            onClick={() => setModal("findPassword")}
            className="hover:text-blue-600"
          >
            비밀번호 찾기
          </button>

          <span>|</span>

          <button
            type="button"
            onClick={() => setModal("signup")}
            className="hover:text-blue-600"
          >
            회원가입
          </button>
        </div>
      </div>

      {modal && <Modal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function Modal({ type, onClose }) {
  const title = {
    findId: "아이디 찾기",
    findPassword: "비밀번호 찾기",
    signup: "회원가입",
  }[type];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 text-xl"
          >
            ×
          </button>
        </div>

        {type === "findId" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              가입할 때 사용한 정보를 입력해주세요.
            </p>

            <input
              type="email"
              placeholder="이메일"
              className="w-full border rounded-lg px-4 py-3"
            />

            <button className="w-full bg-blue-600 text-white rounded-lg py-3">
              아이디 찾기
            </button>
          </div>
        )}

        {type === "findPassword" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              가입한 이메일을 입력해주세요.
            </p>

            <input
              type="email"
              placeholder="이메일"
              className="w-full border rounded-lg px-4 py-3"
            />

            <button className="w-full bg-blue-600 text-white rounded-lg py-3">
              비밀번호 찾기
            </button>
          </div>
        )}

        {type === "signup" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="이름"
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="email"
              placeholder="이메일"
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="password"
              placeholder="비밀번호"
              className="w-full border rounded-lg px-4 py-3"
            />

            <button className="w-full bg-blue-600 text-white rounded-lg py-3">
              회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
