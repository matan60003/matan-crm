"use client";
import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  UserPlus,
  Clock,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Save,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState({
    customers: [],
    urgentTasks: [],
    stats: {},
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    amount: "",
  });

  const fetchDashboardData = () => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        company: "",
        amount: "",
      });
      fetchDashboardData();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-gray-900">לוח בקרה</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 shadow-lg font-bold"
        >
          <Plus size={20} /> לקוח חדש
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-r-4 border-r-blue-500">
          <p className="text-gray-500 font-medium">סה"כ לקוחות</p>
          <h3 className="text-3xl font-black mt-1">
            {data.stats.totalCustomers || 0}
          </h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-r-4 border-r-orange-500">
          <p className="text-gray-500 font-medium">לידים בטיפול</p>
          <h3 className="text-3xl font-black mt-1 text-orange-600">
            {data.stats.activeLeads || 0}
          </h3>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-r-4 border-r-purple-500">
          <p className="text-gray-500 font-medium text-sm">סה"כ עסקאות</p>
          <h3 className="text-3xl font-black mt-1">
            {data.stats.totalAmount || "₪0"}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">לקוחות אחרונים</h2>
          </div>
          <table className="w-full text-right text-sm">
            <tbody className="divide-y divide-gray-50">
              {data.customers.slice(0, 5).map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                      פעיל
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">
                    {customer.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 text-red-600">
            <AlertCircle size={20} /> משימות דחופות
          </h2>
          <div className="space-y-4">
            {data.urgentTasks?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                אין משימות דחופות
              </p>
            ) : (
              data.urgentTasks?.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-red-50 rounded-2xl border border-red-100"
                >
                  <p className="font-bold text-red-800 text-sm mb-1">
                    {task.title}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-center text-gray-800">
              הוספת לקוח חדש
            </h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                type="text"
                placeholder="שם מלא"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="אימייל"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-left"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="טלפון נייד"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-left"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="סכום עסקה"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-green-700"
                value={newCustomer.amount}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, amount: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2"
              >
                <Save size={20} /> שמור
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
