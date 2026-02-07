import { NavLink, Link } from "react-router";

export function SidebarNavigation() {
  const navItems = [
    { name: "Locations", path: "/", icon: "dashboard" },
    { name: "Transportations", path: "/transportations", icon: "flight_takeoff" },
    { name: "Routes", path: "/routes", icon: "map" },
  ];

  return (
    <aside className="w-72 h-full bg-secondary text-white flex flex-col border-r border-slate-800 hidden lg:flex shrink-0">
      <div className="p-8 pb-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-white">
            <svg
              fill="currentColor"
              height="32"
              viewBox="0 0 24 24"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 16v-2l-8.5-5V3.5C13.5 2.67 12.83 2 12 2s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium tracking-wide leading-none">
              TURKISH
            </span>
            <span className="text-xs text-gray-400 font-light tracking-widest mt-1">
              AIRLINES ROUTE PLANNER
            </span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 ${isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span
              className={`material-symbols-outlined text-[22px] ${item.name === "Routes" ? "font-normal" : "font-light"
                }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-sm tracking-wide ${item.name === "Routes" ? "font-medium" : "font-light"
                }`}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
