"use client";

import { useEffect, useRef, useState } from "react";
import { type AnalyticsEvent, trackEvent } from "@/lib/analytics";
import { CheckIcon, CopyIcon } from "./icons";

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
    <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre px-4 py-3 font-mono text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        className="flex shrink-0 items-center gap-1.5 border-l border-border bg-muted/60 px-3.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        aria-live="polite"
      >
        {copied ? (
          <CheckIcon className="size-4 text-accent" />
        ) : (
          <CopyIcon className="size-4" />
        )}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
