import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

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
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || playerRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player("hidden-yt-audio", {
        videoId: VIDEO_ID,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, loop: 1, playlist: VIDEO_ID },
        events: {
          onReady: () => {
            if (cancelled) return;
            playerRef.current?.setVolume?.(45);
            setReady(true);
          },
          onStateChange: (e: any) => {
            if (cancelled || !window.YT?.PlayerState) return;
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
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
    if (playing) p.pauseVideo?.();
    else p.playVideo?.();
  }

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          display: "none",
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <div id="hidden-yt-audio" />
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "მუსიკის გაჩერება" : "მუსიკის ჩართვა"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-parchment/30 bg-wine/95 text-parchment shadow-soft backdrop-blur transition hover:scale-105 hover:bg-wine disabled:opacity-50 sm:h-14 sm:w-14"
      >
        {playing ? (
          <Pause className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <Music className="h-5 w-5" strokeWidth={1.5} />
        )}
        {playing && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-parchment/40" />
        )}
      </button>
    </>
  );
}
