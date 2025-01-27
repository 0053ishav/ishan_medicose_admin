import "@/styles/globals.css";

export const metadata = {
  title: "Ishan Medicose Admin Dashboard",
  description: "Manage your pharmacy efficiently",
  icons: {
    icon: ["/favicon_ioPlus/favicon.ico?v=4"],
    apple: ["/favicon_ioPlus/apple-touch-icon.png?v=4"],
    shortcut: ["/favicon_ioPlus/apple-touch-icon.png"],
  },
  manifest: "/favicon_ioPlus/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}