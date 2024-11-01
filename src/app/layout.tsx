import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "耳孔無有力 (EarLeslie)",
  description: "互動式音樂訓練網站，幫助使用者提升音感",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
