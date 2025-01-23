import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Pharmacy Admin Dashboard",
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
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <Navbar />
            {/* Main Page Content */}
            <main className="p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

