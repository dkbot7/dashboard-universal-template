import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { dashboardConfig } from "@/config/dashboard.config";

const inter = Inter({
  subsets: ["latin"],
});

// Metadata dinamica baseada na configuracao
export const metadata: Metadata = {
  title: dashboardConfig.name,
  description: dashboardConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={dashboardConfig.locale.language}>
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main
            className="flex-1 overflow-y-auto"
            style={{ backgroundColor: dashboardConfig.theme.background }}
          >
            <div className="container mx-auto p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
