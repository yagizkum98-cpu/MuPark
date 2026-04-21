"use client";

import { useEffect, useState } from "react";
import EntryGamification from "@/components/EntryGamification";

const OPEN_EVENT = "mupark:open-entry-story";

export default function LandingEntryStoryModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8">
      <button
        type="button"
        aria-label="Close entry story"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-white/85 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-6xl">
        <EntryGamification variant="modal" onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
