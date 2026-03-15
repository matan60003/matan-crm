"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, UserPlus, ClipboardList } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ activeLeads: 0 });

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCounts({ activeLeads: data.activeLeadsCount || 0 }));
  }, [pathname]);

  const menuItems = [
    { icon: LayoutDashboard, label: "דאשבורד", path: "/" },
    { icon: Users, label: "לקוחות", path: "/customers" },
    {
      icon: UserPlus,
      label: "לידים",
      path: "/leads",
      badge: counts.activeLeads,
    },
    { icon: ClipboardList, label: "משימות", path: "/tasks" },
  ];

  return (
    <div className="w-64 bg-white h-screen border-l border-gray-100 flex flex-col p-6 fixed right-0 top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
          M
        </div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">
          Matan CRM
        </h1>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={22}
                  className={
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-blue-600"
                  }
                />
                <span className="font-bold">{item.label}</span>
              </div>
              {item.badge > 0 && !isActive && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
          סטטוס מערכת
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-gray-700">
            סנכרון Docker פעיל
          </span>
        </div>
      </div>
    </div>
  );
}
