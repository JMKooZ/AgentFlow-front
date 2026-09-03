function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-8rem)] p-4">
      <button className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold mb-6">
        + 새 Agent
      </button>

      <nav className="space-y-2">
        <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">
          Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
          Agents
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
          Conversations
        </button>
      </nav>

      <div className="border-t mt-6 pt-4">
        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
          설정
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
