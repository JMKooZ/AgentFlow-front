import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import Main from "./pages/main/Main";
import AgentList from "./pages/agent/AgentList";
import AgentDetail from "./pages/agent/AgentDetail";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <AgentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents/new"
          element={
            <ProtectedRoute>
              <AgentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents/:id"
          element={
            <ProtectedRoute>
              <AgentDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
