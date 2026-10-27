# Jendy

日本語話者が Bahasa Indonesia を本格的に学び、インドネシア語話者も日本語を逆方向に学べる双方向学習サイトです。

## Stack

- Next.js 16 / React 19 / TypeScript
- Supabase Auth + Postgres + Row Level Security
- Vercel
- GitHub
- Inline SVG icon system

## Foundation features

- 日本語 → Bahasa Indonesia / Bahasa Indonesia → 日本語の切り替え
- A1〜A2向けの基礎6ユニット
- 文法・語感メモ付き例文
- Web Speech API を使った例文読み上げ
- Supabase Email/Password ログイン・新規登録
- ログインユーザーごとの学習進捗保存
- RLSによるユーザー別データ保護
- PC / mobile responsive UI

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` に以下を設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Database

`supabase/migrations/` に Jendy 用テーブルと RLS policy のマイグレーションを保存しています。

- `jendy_profiles`: 表示名・学習方向
- `jendy_progress`: レッスン完了状況・スコア

## Next steps

教材コンテンツのDB化、SRS復習、単語帳、クイズ、CEFR相当のコース拡張、発音練習、管理画面を順次追加できる構造です。
