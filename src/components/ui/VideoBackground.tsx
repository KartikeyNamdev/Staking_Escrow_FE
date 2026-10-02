"use client";

import React, { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  className?: string;
  overlayOpacity?: number;
}

/**
 * Decorative looping video. It only downloads once it comes near the viewport,
 * pauses while off-screen (or while the tab is hidden) and fades in once it can
 * play, so a page with several of these stays smooth on phones. Skipped
 * entirely for reduced-motion / data-saver users.
 */
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  className = "",
  overlayOpacity = 0.3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection?.saveData;
    if (reducedMotion || saveData) return;

    let visible = false;
    const sync = () => {
      const video = videoRef.current;
      if (!video) return;
      if (visible && !document.hidden) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) setShouldLoad(true);
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(container);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          className={`w-full h-full object-cover brightness-150 contrast-125 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
};
