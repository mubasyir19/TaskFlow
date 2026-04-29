import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Auth | Task Manager",
  description: "Organize your day, achieve more",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`h-full antialiased`}>
      <div className="min-h-screen">
        {children}
        <Footer />
        <Toaster richColors position="bottom-right" />
      </div>
    </div>
  );
}
