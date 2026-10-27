import type { Metadata } from "next";
import { JendyApp } from "@/components/JendyApp";

export const metadata: Metadata = { title: "Jendy | 訳の先の「なぜ？」まで" };

export default function Page() {
  return <JendyApp view="home" />;
}
