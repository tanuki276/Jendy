import type { Metadata } from "next";
import { JendyApp } from "@/components/JendyApp";

export const metadata: Metadata = { title: "語族辞書 | Jendy" };

export default function Page() {
  return <JendyApp view="dictionary" />;
}
