import type { Metadata } from "next";
import { JendyApp } from "@/components/JendyApp";

export const metadata: Metadata = { title: "学習状況 | Jendy" };

export default function Page() {
  return <JendyApp view="dashboard" />;
}
