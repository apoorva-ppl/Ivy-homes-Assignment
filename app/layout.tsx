import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
export const metadata: Metadata = { title: "Ivy Homes", description: "x" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers><Navbar /><main className="min-h-[calc(100vh-65px)]">{children}</main></Providers>
      </body>
    </html>
  );
}
