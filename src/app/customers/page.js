"use client";
import { useState, useEffect } from "react";
import { Search, Edit3, Briefcase, Mail, X, Save, Phone } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // States לעריכה
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("שגיאה במשיכת לקוחות:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/customers/${customerToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerToEdit),
      });
      if (res.ok) {
        fetchCustomers();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("שגיאה בעדכון לקוח:", error);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)),
  );

  return (
    <div className="p-8 space-y-8 text-right" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">מאגר לקוחות</h1>
        <div className="relative w-64">
          <Search className="absolute right-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="חיפוש שם או טלפון..."
            className="w-full p-2.5 pr-10 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-gray-500 font-bold border-b">
            <tr>
              <th className="px-6 py-4">לקוח</th>
              <th className="px-6 py-4">טלפון</th>
              <th className="px-6 py-4">חברה</th>
              <th className="px-6 py-4">סכום</th>
              <th className="px-6 py-4">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  טוען נתונים...
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-gray-400 text-xs flex items-center gap-1">
                      <Mail size={12} /> {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} className="text-green-500" />{" "}
                      {customer.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Briefcase size={14} className="text-blue-500" />{" "}
                      {customer.company || "פרטי"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-green-700 font-bold bg-green-50 px-3 py-1 rounded-lg inline-block">
                      {customer.amount?.includes("₪")
                        ? customer.amount
                        : `₪${Number(customer.amount || 0).toLocaleString()}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setCustomerToEdit(customer);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
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

      {/* מודל עריכת לקוח */}
      {isEditModalOpen && customerToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute left-4 top-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-center text-gray-800">
              עריכת פרטי לקוח
            </h2>

            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  שם הלקוח
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerToEdit.name}
                  onChange={(e) =>
                    setCustomerToEdit({
                      ...customerToEdit,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  מספר טלפון
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left font-sans"
                  value={customerToEdit.phone || ""}
                  onChange={(e) =>
                    setCustomerToEdit({
                      ...customerToEdit,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  חברה / ארגון
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerToEdit.company || ""}
                  onChange={(e) =>
                    setCustomerToEdit({
                      ...customerToEdit,
                      company: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  סכום עסקה
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 font-bold">
                    ₪
                  </span>
                  <input
                    type="text"
                    className="w-full p-3 pl-8 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-green-700"
                    value={customerToEdit.amount?.replace(/[^0-9]/g, "") || ""}
                    onChange={(e) =>
                      setCustomerToEdit({
                        ...customerToEdit,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                <Save size={20} /> שמור שינויים
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
