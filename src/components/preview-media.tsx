"use client";

import Image from "next/image";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = {
  slug: string;
  poster: string;
  video?: string | undefined;
  alt: string;
  playLabel: string;
  priority?: boolean;
};

const WIDTH = 1280;
const HEIGHT = 720;

export function PreviewMedia({
  slug,
  poster,
  video,
  alt,
  playLabel,
  priority = false,
}: Props) {
  const [playing, setPlaying] = useState(false);

  if (!video) {
    return (
      <Image
        src={poster}
        alt={alt}
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="aspect-video w-full rounded-lg border border-border object-cover"
      />
    );
  }

  if (playing) {
    return (
      <video
        src={video}
        poster={poster}
        controls
        autoPlay
        loop
        muted
        playsInline
        aria-label={alt}
        className="aspect-video w-full rounded-lg border border-border bg-black object-cover"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent({ name: "preview_play", params: { slug } });
        setPlaying(true);
      }}
      aria-label={`${playLabel}: ${alt}`}
      className="group relative block w-full overflow-hidden rounded-lg border border-border"
    >
      <Image
        src={poster}
        alt={alt}
        width={WIDTH}
        height={HEIGHT}
        priority={priority}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="aspect-video w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
        <span className="flex size-14 items-center justify-center rounded-full bg-black/70 text-white">
          <svg
            viewBox="0 0 24 24"
            className="ml-1 size-6 fill-current"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
