import React from "react";

interface VideoBackgroundProps {
  src: string;
  className?: string;
  overlayOpacity?: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  className = "",
  overlayOpacity = 0.3,
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover brightness-150 contrast-125"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
};
