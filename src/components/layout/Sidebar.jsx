import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "대시보드", end: true },
  { to: "/agents", label: "Agent" },
];

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-line bg-surface p-4">
      <NavLink to="/agents/new" className="mb-6 block">
        <button className="h-12 w-full rounded-2xl bg-primary text-[15px] font-semibold text-white transition-colors hover:bg-primary-strong">
          + 새 Agent
        </button>
      </NavLink>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-ink-sub hover:bg-surface-alt"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-ink-tertiary">
          <span>Conversations</span>
          <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs">
            준비중
          </span>
        </div>
      </nav>

      <div className="mt-6 border-t border-line pt-4">
        <button className="w-full rounded-2xl px-4 py-3 text-left text-[15px] font-medium text-ink-sub hover:bg-surface-alt">
          설정
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
