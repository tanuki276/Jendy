"use client";
import { useEffect, useRef, type RefObject } from "react";
export function useModalFocus(active: boolean, ref: RefObject<HTMLDivElement | null>, close: () => void) {
  const latest = useRef(close);
  useEffect(() => { latest.current = close; }, [close]);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); latest.current(); }
      if (event.key !== "Tab") return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select, textarea:not(:disabled), summary, [tabindex="0"]');
      if (!nodes?.length) { event.preventDefault(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", keydown); previous?.focus(); };
  }, [active, ref]);
}
