import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Ishan Medicose Admin Dashboard",
  description: "Manage your pharmacy efficiently",
  icons:{ 
    icon: [
      '/favicon_ioPlus/favicon.ico?v=4',
    ],
    apple: [
      '/favicon_ioPlus/apple-touch-icon.png?v=4',
    ],
    shortcut: [
      '/favicon_ioPlus/apple-touch-icon.png'
    ]
},
  manifest: '/favicon_ioPlus/site.webmanifest'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full max-w-[1600px] w-full mx-auto pt-0 ">
    <Navbar />
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="flex-none">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  </div>
  );
}