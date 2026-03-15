"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  MessageSquare,
  User,
  Loader2,
} from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newForm, setNewForm] = useState({
    title: "",
    leadId: "",
    priority: "רגיל",
  });

  const fetchData = async () => {
    try {
      const [tRes, lRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/leads"),
      ]);
      const tasksData = await tRes.json();
      const leadsData = await lRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addComment = async (taskId, content) => {
    if (!content.trim()) return;
    const res = await fetch(`/api/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) fetchData();
  };

  const updateTask = async (id, data) => {
    // עדכון אופטימי בממשק למהירות
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchData();
  };

  const deleteTask = async (id) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המשימה?")) return;

    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchData();
  };

  const stats = {
    open: tasks.filter((t) => t.status === "פתוח").length,
    done: tasks.filter((t) => t.status === "הושלם").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900">ניהול משימות</h1>
          <p className="text-gray-500 mt-1">
            ניהול, עדכון ומחיקת משימות מהמערכת
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
            <p className="text-[10px] text-blue-500 font-bold uppercase">
              פתוחות
            </p>
            <p className="text-2xl font-black text-blue-700">{stats.open}</p>
          </div>
          <div className="bg-green-50 px-6 py-3 rounded-2xl border border-green-100 text-center">
            <p className="text-[10px] text-green-500 font-bold uppercase">
              בוצעו
            </p>
            <p className="text-2xl font-black text-green-700">{stats.done}</p>
          </div>
        </div>
      </div>

      {/* טופס הוספה */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newForm.title) return;
          const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newForm,
              leadId: newForm.leadId ? parseInt(newForm.leadId) : null,
            }),
          });
          if (res.ok) {
            setNewForm({ title: "", leadId: "", priority: "רגיל" });
            fetchData();
          }
        }}
        className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            מה המשימה?
          </label>
          <input
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={newForm.title}
            onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
            placeholder="תיאור המשימה..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            קשר לליד
          </label>
          <select
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={newForm.leadId}
            onChange={(e) => setNewForm({ ...newForm, leadId: e.target.value })}
          >
            <option value="">ללא קישור</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            עדיפות
          </label>
          <select
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={newForm.priority}
            onChange={(e) =>
              setNewForm({ ...newForm, priority: e.target.value })
            }
          >
            <option value="רגיל">רגיל</option>
            <option value="דחוף">דחוף</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> הוסף משימה
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-6 rounded-3xl border-2 transition-all group ${task.status === "הושלם" ? "opacity-60 bg-gray-50 border-transparent shadow-none" : "border-white shadow-xl shadow-gray-100 hover:border-blue-100"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  {/* כפתור לשינוי עדיפות בלחיצה */}
                  <button
                    onClick={() =>
                      updateTask(task.id, {
                        priority: task.priority === "דחוף" ? "רגיל" : "דחוף",
                      })
                    }
                    className={`text-[10px] font-black p-1 px-2 rounded-lg transition-colors ${task.priority === "דחוף" ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
                  >
                    {task.priority === "דחוף" ? "דחוף" : "רגיל"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* כפתור מחיקה */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                  {/* כפתור שינוי סטטוס */}
                  <button
                    onClick={() =>
                      updateTask(task.id, {
                        status: task.status === "פתוח" ? "הושלם" : "פתוח",
                      })
                    }
                  >
                    {task.status === "הושלם" ? (
                      <CheckCircle2 className="text-green-500" size={26} />
                    ) : (
                      <Circle className="text-gray-300" size={26} />
                    )}
                  </button>
                </div>
              </div>

              <h3
                className={`text-lg font-bold mb-2 ${task.status === "הושלם" ? "line-through text-gray-400" : "text-gray-900"}`}
              >
                {task.title}
              </h3>

              {task.lead && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 mb-4 bg-blue-50 px-2 py-1 rounded-md w-fit border border-blue-100">
                  <User size={12} /> {task.lead.name}
                </div>
              )}

              <div className="space-y-3 border-t border-gray-50 pt-4 mt-4">
                <div className="max-h-32 overflow-y-auto space-y-2 mb-2 custom-scrollbar">
                  {task.comments?.length > 0 ? (
                    task.comments.map((c) => (
                      <div
                        key={c.id}
                        className="bg-gray-50 p-2 rounded-xl border-r-2 border-r-blue-400"
                      >
                        <p className="text-[11px] text-gray-800 font-medium">
                          {c.content}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock size={10} />{" "}
                          {new Date(c.createdAt).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-300 text-center italic">
                      אין עדכונים עדיין
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="הוסף עדכון..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-400 transition-all pr-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment(task.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <MessageSquare
                    size={14}
                    className="absolute right-2.5 top-2.5 text-gray-300"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
