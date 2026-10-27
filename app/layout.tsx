import type { Metadata } from "next";
import "./globals.css";
import "./learning.css";

export const metadata: Metadata = {
  title: "Jendy | 日本語で学ぶBahasa Indonesia",
  description: "日本語とBahasa Indonesiaを双方向で本格的に学べる学習プラットフォーム",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
