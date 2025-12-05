import React from 'react';

// Optional looping eco-theme background video.
// Place a subtle, muted MP4 at src/assets/eco-loop.mp4 or update the src below.

const BackgroundVideo = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-40 overflow-hidden opacity-40 mix-blend-screen">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/src/assets/eco-loop.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-950/70" />
    </div>
  );
};

export default BackgroundVideo;
