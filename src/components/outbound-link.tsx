"use client";

import type { ReactNode } from "react";
import { type AnalyticsEvent, trackEvent } from "@/lib/analytics";

type Props = {
  href: string;
  event?: AnalyticsEvent;
  className?: string;
  children: ReactNode;
};

export function OutboundLink({ href, event, className, children }: Props) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        if (event) {
          trackEvent(event);
        }
      }}
    >
      {children}
    </a>
  );
}
