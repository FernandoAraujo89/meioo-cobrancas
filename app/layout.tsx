import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MeiooOnboarding } from "./components/MeiooOnboarding";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avante Web",
  description: "Módulo de cobranças Meioo integrado ao Avante ERP",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // habilita env(safe-area-inset-*) no iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-bg antialiased">
        {children}
        <MeiooOnboarding />
      </body>
    </html>
  );
}
