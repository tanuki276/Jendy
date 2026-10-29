import type { Metadata } from "next";
import "./globals.css";
import "./learning.css";
import "./insights.css";
import "./sakura.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "Jendy | 訳の先の「なぜ？」まで",
  description: "日本語とインドネシア語の違いから、文の構造・語感・実際の使い方を学ぶ。198レッスン、語族辞書、継続練習、間隔反復。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

