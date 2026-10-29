import Link from "next/link";
import { Icon } from "./Icon";
import { BridgeMark } from "./BridgeMark";
import type { PageView } from "./JendyApp";
import type { Direction } from "@/lib/learning-content";

export function AppNavigation({
  view,
  direction,
  xp,
  streak,
  reviews,
  signedIn,
  effectsOff,
  onDirection,
  onEffects,
  onSignOut,
}: {
  view: PageView;
  direction: Direction;
  xp: number;
  streak: number;
  reviews: number;
  signedIn: boolean;
  effectsOff: boolean;
  onDirection: () => void;
  onEffects: () => void;
  onSignOut: () => void;
}) {
  const ja = direction === "ja-id";
  const items = [
    ["home", "/", "ホーム", "Beranda", "home"],
    ["lesson", "/lesson", "学習マップ", "Jalur belajar", "path"],
    ["practice", "/practice", "トレーニング", "Latihan", "spark"],
    ["review", "/review", "復習", "Ulasan", "book"],
    ["dashboard", "/dashboard", "学習記録", "Progres", "chart"],
    ["dictionary", "/dictionary", "ことばの辞書", "Kamus kata", "globe"],
    ["study", "/study", "文法・例文", "Tata bahasa", "book"],
  ] as const;
  return (
    <>
      <a className="skip-link" href="#page-content">
        {ja ? "コンテンツへ移動" : "Lewati ke konten"}
      </a>
      <aside className="app-sidebar">
        <Link href="/" className="brand" aria-label="Jendy home">
          <BridgeMark />
          <span>
            Jendy<span className="brand-period">.</span>
          </span>
        </Link>
        <span className="sidebar-caption">A LITTLE EVERY DAY.</span>
        <nav
          className="app-nav"
          aria-label={ja ? "メインナビゲーション" : "Navigasi utama"}
        >
          {items.map(([page, href, labelJa, labelId, icon]) => (
            <Link
              key={page}
              href={href}
              aria-current={view === page ? "page" : undefined}
            >
              <Icon name={icon} size={23} />
              <span>{ja ? labelJa : labelId}</span>
              {page === "review" && reviews > 0 && (
                <b className="nav-count">{reviews > 99 ? "99+" : reviews}</b>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-encouragement">
            <Icon name="spark" size={23} />
            <strong>
              {ja ? "まちがいも、前進。" : "Salah juga berarti maju."}
            </strong>
            <p>
              {ja
                ? "何度でも、あなたのペースで。"
                : "Coba lagi, sesuai ritmemu."}
            </p>
          </div>
          <Link href="/login">
            <Icon name="user" size={19} />
            {ja
              ? signedIn
                ? "アカウント"
                : "ログイン・登録"
              : signedIn
                ? "Akun"
                : "Masuk / Daftar"}
          </Link>
        </div>
      </aside>
      <header className="app-topbar">
        <div className="topbar-course">
          <span className={`country-flag ${ja ? "indonesia" : "japan"}`} />
          <span>{ja ? "インドネシア語" : "Bahasa Jepang"}</span>
          <small>{ja ? "日本語から学ぶ" : "Dari bahasa Indonesia"}</small>
        </div>
        <div className="topbar-actions">
          <span
            className="topbar-stat streak-stat"
            aria-label={`${streak} ${ja ? "日連続" : "hari beruntun"}`}
          >
            <Icon name="flame" size={22} />
            <strong>{streak}</strong>
          </span>
          <span className="topbar-stat xp-stat">
            <Icon name="spark" size={22} />
            <strong>
              {xp.toLocaleString()}
              <small> XP</small>
            </strong>
          </span>
          <button
            className="direction-mini"
            onClick={onDirection}
            aria-label={ja ? "学習方向を切り替える" : "Ganti arah belajar"}
          >
            <Icon name="swap" size={17} />
            <span>{ja ? "JA → ID" : "ID → JA"}</span>
          </button>
          <details className="app-settings">
            <summary
              aria-label={ja ? "設定とアカウント" : "Pengaturan dan akun"}
            >
              <Icon name="user" size={20} />
            </summary>
            <div>
              <button
                className="effects-toggle"
                aria-pressed={!effectsOff}
                onClick={onEffects}
              >
                {ja
                  ? effectsOff
                    ? "効果音 OFF"
                    : "効果音 ON"
                  : effectsOff
                    ? "Efek OFF"
                    : "Efek ON"}
              </button>
              <Link href="/dictionary">
                {ja ? "ことばの辞書" : "Kamus kata"}
              </Link>
              <Link href="/study">{ja ? "文法・例文" : "Tata bahasa"}</Link>
              {signedIn ? (
                <button onClick={onSignOut}>
                  {ja ? "ログアウト" : "Keluar"}
                </button>
              ) : (
                <Link href="/login">
                  {ja ? "ログイン・登録" : "Masuk / Daftar"}
                </Link>
              )}
            </div>
          </details>
        </div>
      </header>
    </>
  );
}
