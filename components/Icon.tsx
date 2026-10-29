import type { SVGProps } from "react";

type IconName =
  | "home" | "flame" | "trophy" | "target" | "clock" | "path" | "star" | "chevron"
  | "book"
  | "swap"
  | "spark"
  | "check"
  | "user"
  | "login"
  | "logout"
  | "arrow"
  | "volume"
  | "globe"
  | "chart";

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
  flame: <path d="M13 2c2 6-4 7-2 11 2-1 3-3 3-5 4 3 6 6 4 10-2 5-10 5-12 0-2-5 2-7 3-10 0 3 1 4 2 4-2-5 1-7 2-10Z"/>,
  trophy: <><path d="M7 3h10v6a5 5 0 0 1-10 0Z"/><path d="M7 5H3v3a4 4 0 0 0 5 4m9-7h4v3a4 4 0 0 1-5 4M12 14v6m-5 1h10"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  path: <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 5h7a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h7"/></>,
  star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H6.5A2.5 2.5 0 0 0 4 18.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4.5a2.5 2.5 0 0 1 2.5 2.5Z"/></>,
  swap: <><path d="m7 7-3 3 3 3"/><path d="M4 10h10a4 4 0 0 1 4 4v1"/><path d="m17 17 3-3-3-3"/><path d="M20 14H10a4 4 0 0 1-4-4V9"/></>,
  spark: <><path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4Z"/><path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8Z"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  login: <><path d="M10 17 15 12 10 7"/><path d="M15 12H3"/><path d="M14 3h4a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-4"/></>,
  logout: <><path d="m14 17 5-5-5-5"/><path d="M19 12H7"/><path d="M10 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h4"/></>,
  arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
  volume: <><path d="M5 10v4h3l4 3V7L8 10Z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3Z"/></>,
  chart: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
};

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
