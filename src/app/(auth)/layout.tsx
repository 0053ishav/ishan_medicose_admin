import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="flex flex-row h-auto max-w-[1600px] w-full mx-auto pt-0">
        <div className="flex h-screen w-full sticky top-0 items-center justify-center bg-slate-100 max-lg:hidden">
          <div>
            <Image
              src="/Logo/logo-no-background.svg"
              width={500}
              height={500}
              alt="Ishan Medicose Logo"
            />
          </div>
        </div>
      <Toaster />
        {children}
      </main>
  );
}