"use client";
import { useState, useEffect } from "react";
import { Plus, X, Edit3, Phone, Briefcase, DollarSign } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    source: "גוגל",
  });

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setNewLead({ name: "", email: "", phone: "", source: "גוגל" });
      fetchLeads();
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/leads/${leadToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadToEdit),
      });

      if (response.ok) {
        fetchLeads();
        setIsEditModalOpen(false);
        setLeadToEdit(null);
      }
    } catch (error) {
      console.error("שגיאה בעדכון הליד:", error);
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">ניהול לידים</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> ליד חדש
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-500 font-bold border-b">
            <tr>
              <th className="px-6 py-4">שם הליד</th>
              <th className="px-6 py-4">טלפון</th>
              <th className="px-6 py-4">מקור פנייה</th>
              <th className="px-6 py-4">סטטוס</th>
              <th className="px-6 py-4">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  טוען...
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{lead.name}</div>
                    <div className="text-gray-400 text-xs">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-blue-500" />
                      {lead.phone || "לא הוזן"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${lead.status === "חדש" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setLeadToEdit({ ...lead, amount: "", company: "" });
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit3 size={16} /> עריכה
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* מודל הוספת ליד חדש */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-center text-gray-800">
              ליד חדש
            </h2>
            <form onSubmit={handleAddLead} className="space-y-4">
              <input
                type="text"
                placeholder="שם הליד"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({ ...newLead, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="אימייל"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left font-sans"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({ ...newLead, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="מספר טלפון"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left font-sans"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({ ...newLead, phone: e.target.value })
                }
              />
              <select
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={newLead.source}
                onChange={(e) =>
                  setNewLead({ ...newLead, source: e.target.value })
                }
              >
                <option value="גוגל">גוגל</option>
                <option value="פייסבוק">פייסבוק</option>
                <option value="המלצה">המלצה</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition-all"
              >
                שמור
              </button>
            </form>
          </div>
        </div>
      )}

      {/* מודל עריכה והמרה ללקוח */}
      {isEditModalOpen && leadToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              עריכת פרטי ליד
            </h2>
            <form onSubmit={handleUpdateLead} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  שם הליד
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadToEdit.name}
                  onChange={(e) =>
                    setLeadToEdit({ ...leadToEdit, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  מספר טלפון
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left font-sans"
                  value={leadToEdit.phone || ""}
                  onChange={(e) =>
                    setLeadToEdit({ ...leadToEdit, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  מקור פנייה
                </label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadToEdit.source}
                  onChange={(e) =>
                    setLeadToEdit({ ...leadToEdit, source: e.target.value })
                  }
                >
                  <option value="גוגל">גוגל</option>
                  <option value="פייסבוק">פייסבוק</option>
                  <option value="המלצה">המלצה</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  סטטוס פנייה
                </label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={leadToEdit.status}
                  onChange={(e) =>
                    setLeadToEdit({ ...leadToEdit, status: e.target.value })
                  }
                >
                  <option value="חדש">חדש</option>
                  <option value="בטיפול">בטיפול</option>
                  <option value="הושלם">הושלם</option>
                </select>
              </div>

              {leadToEdit.status === "הושלם" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="relative">
                    <Briefcase
                      className="absolute right-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="שם חברה"
                      className="w-full p-3 pr-10 border rounded-xl"
                      value={leadToEdit.company || ""}
                      onChange={(e) =>
                        setLeadToEdit({
                          ...leadToEdit,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="relative">
                    <DollarSign
                      className="absolute right-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="number"
                      placeholder="סכום עסקה סופי"
                      className="w-full p-3 pr-10 border rounded-xl font-bold text-blue-700"
                      value={leadToEdit.amount || ""}
                      onChange={(e) =>
                        setLeadToEdit({ ...leadToEdit, amount: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg mt-2"
              >
                {leadToEdit.status === "הושלם"
                  ? "אשר המרה ללקוח"
                  : "עדכן ב-Database"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
