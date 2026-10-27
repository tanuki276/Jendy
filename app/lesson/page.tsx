import type { Metadata } from "next";
import { JendyApp } from "@/components/JendyApp";

export const metadata: Metadata = { title: "レッスン | Jendy" };

export default function Page() {
  return <JendyApp view="lesson" />;
}
