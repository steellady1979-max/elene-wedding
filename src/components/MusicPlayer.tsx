import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "cE6wxDqdOV0";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function MusicPlayer() {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let cleanupGestures = () => {};

    function startMuted() {
      const p = playerRef.current;
      if (!p) return;
      try {
        p.mute?.();
        p.setVolume?.(45);
        p.playVideo?.();
      } catch {
        /* noop */
      }
    }

    function unmuteOnGesture() {
      const p = playerRef.current;
      if (!p) return;
      try {
        p.unMute?.();
        p.setVolume?.(45);
        p.playVideo?.();
        setMuted(false);
      } catch {
        /* noop */
      }
      cleanupGestures();
    }

    function createPlayer() {
      if (cancelled || playerRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player("hidden-yt-audio", {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          playsinline: 1,
          loop: 1,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setReady(true);
            startMuted();

            const events: (keyof WindowEventMap)[] = [
              "pointerdown",
              "touchstart",
              "keydown",
              "scroll",
            ];
            events.forEach((ev) =>
              window.addEventListener(ev, unmuteOnGesture, { once: true, passive: true }),
            );
            cleanupGestures = () => {
              events.forEach((ev) => window.removeEventListener(ev, unmuteOnGesture));
            };
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      cleanupGestures();
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, []);

  function toggle() {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute?.();
      p.setVolume?.(45);
      p.playVideo?.();
      setMuted(false);
    } else {
      p.mute?.();
      setMuted(true);
    }
  }

  return (
    <>
      <div
        aria-hidden="true"
        style={{ display: "none", position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <div id="hidden-yt-audio" />
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-label={muted ? "მუსიკის ჩართვა" : "მუსიკის დადუმება"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-parchment/30 bg-wine/95 text-parchment shadow-soft backdrop-blur transition hover:scale-105 hover:bg-wine disabled:opacity-50 sm:h-14 sm:w-14"
      >
        {muted ? (
          <VolumeX className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <Volume2 className="h-5 w-5" strokeWidth={1.5} />
        )}
        {!muted && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-parchment/40" />
        )}
      </button>
    </>
  );
}
