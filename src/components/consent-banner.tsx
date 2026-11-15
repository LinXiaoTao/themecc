"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  type ConsentDecision,
  updateAnalyticsConsent,
} from "@/lib/analytics";

type Props = {
  message: string;
  acceptLabel: string;
  declineLabel: string;
};

export function ConsentBanner({ message, acceptLabel, declineLabel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored !== "granted" && stored !== "denied") {
      setVisible(true);
    }
  }, []);

  function decide(decision: ConsentDecision) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, decision);
    updateAnalyticsConsent(decision);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <section
      aria-label={message}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-lg border border-border bg-card p-4 text-sm shadow-lg sm:flex-row sm:items-center"
    >
      <p className="flex-1">{message}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => decide("denied")}
          className="rounded-md border border-border px-3 py-1.5 hover:bg-muted"
        >
          {declineLabel}
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-foreground hover:opacity-90"
        >
          {acceptLabel}
        </button>
      </div>
    </section>
  );
}
