import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Next.js Sentry Integration Demo",
  description: "A comprehensive demo of Sentry integration with Next.js including error tracking, performance monitoring, and session replay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navigation />
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
          {children}
        </main>
      </body>
    </html>
  );
}
