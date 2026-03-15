import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Matan CRM",
  description: "מערכת ניהול לקוחות",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-gray-50 font-sans antialiased text-gray-900 overflow-x-hidden">
        <div className="flex">
          {/* ה-Sidebar תמיד מימין */}
          <Sidebar />

          {/* התוכן הראשי עם מרווח כדי שלא יוסתר */}
          <main className="flex-1 pr-64 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
