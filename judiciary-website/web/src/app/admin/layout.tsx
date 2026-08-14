import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Portal | National Judiciary",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm text-gray-500">
            Staff Portal • Secure access only
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">14 Aug 2026</span>
            <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-gray-700">
              Notifications
            </button>
            <button className="px-3 py-1.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800">
              Profile
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
