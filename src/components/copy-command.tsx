"use client";

import { useEffect, useRef, useState } from "react";
import { type AnalyticsEvent, trackEvent } from "@/lib/analytics";

type Props = {
  command: string;
  copyLabel: string;
  copiedLabel: string;
  event: AnalyticsEvent;
};

export function CopyCommand({ command, copyLabel, copiedLabel, event }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    trackEvent(event);
    setCopied(true);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-card">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre px-3 py-2.5 font-mono text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 border-l border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        aria-live="polite"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
