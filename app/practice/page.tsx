import type { Metadata } from "next";
import { JendyApp } from "@/components/JendyApp";

export const metadata: Metadata = { title: "練習 | Jendy" };

export default function Page() {
  return <JendyApp view="practice" />;
}
