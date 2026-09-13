import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Main from "./pages/main/Main";
import AgentList from "./pages/agent/AgentList";
import AgentDetail from "./pages/agent/AgentDetail";
import ConversationPage from "./pages/conversation/ConversationPage";
import FileList from "./pages/file/FileList";
import DocumentList from "./pages/document/DocumentList";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* 여기 아래에 라우트만 추가하면 자동으로 로그인 보호가 적용돼요 */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Main />} />
                    <Route path="/agents" element={<AgentList />} />
                    <Route path="/agents/new" element={<AgentList />} />
                    <Route path="/agents/:id" element={<AgentDetail />} />
                    <Route path="/agents/:id/chat" element={<ConversationPage />} />
                    <Route path="/files" element={<FileList />} />
                    <Route path="/documents" element={<DocumentList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;