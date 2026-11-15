"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { ThemeSummary } from "@/lib/registry/summary";
import { ThemeCard } from "./theme-card";

type SchemeFilter = "all" | "light" | "dark";
type MotionFilter = "all" | "animated" | "still";

type Props = {
  themes: ThemeSummary[];
  showMotionFilter: boolean;
};

type ChipProps = {
  active: boolean;
  label: string;
  onSelect: () => void;
};

function Chip({ active, label, onSelect }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
        active
          ? "rounded-full border border-foreground bg-foreground px-3 py-1 text-sm text-background"
          : "rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
      }
    >
      {label}
    </button>
  );
}

export function ThemeBrowser({ themes, showMotionFilter }: Props) {
  const t = useTranslations("List");
  const [scheme, setScheme] = useState<SchemeFilter>("all");
  const [motion, setMotion] = useState<MotionFilter>("all");

  const visible = themes.filter((theme) => {
    if (scheme !== "all" && !theme.colorScheme.includes(scheme)) {
      return false;
    }
    if (motion === "animated" && !theme.motion) {
      return false;
    }
    if (motion === "still" && theme.motion) {
      return false;
    }
    return true;
  });

  function selectScheme(value: SchemeFilter) {
    setScheme(value);
    trackEvent({ name: "filter_use", params: { filter: "scheme", value } });
  }

  function selectMotion(value: MotionFilter) {
    setMotion(value);
    trackEvent({ name: "filter_use", params: { filter: "motion", value } });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <fieldset className="flex min-w-0 flex-wrap items-center gap-2">
          <legend className="float-left mr-2 text-sm text-muted-foreground">
            {t("filterScheme")}
          </legend>
          <Chip
            active={scheme === "all"}
            label={t("filterAll")}
            onSelect={() => selectScheme("all")}
          />
          <Chip
            active={scheme === "light"}
            label={t("filterLight")}
            onSelect={() => selectScheme("light")}
          />
          <Chip
            active={scheme === "dark"}
            label={t("filterDark")}
            onSelect={() => selectScheme("dark")}
          />
        </fieldset>
        {showMotionFilter ? (
          <fieldset className="flex min-w-0 flex-wrap items-center gap-2">
            <legend className="float-left mr-2 text-sm text-muted-foreground">
              {t("filterMotion")}
            </legend>
            <Chip
              active={motion === "all"}
              label={t("filterAll")}
              onSelect={() => selectMotion("all")}
            />
            <Chip
              active={motion === "animated"}
              label={t("filterAnimated")}
              onSelect={() => selectMotion("animated")}
            />
            <Chip
              active={motion === "still"}
              label={t("filterStill")}
              onSelect={() => selectMotion("still")}
            />
          </fieldset>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t("results", { count: visible.length })}
      </p>
      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          {themes.length === 0 ? t("emptyRegistry") : t("empty")}
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((theme, index) => (
            <li key={theme.slug} className="flex">
              <ThemeCard theme={theme} priority={index < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
