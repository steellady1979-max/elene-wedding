import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "o_1aF54DO60";
type Player = {
  playVideo: () => void; pauseVideo: () => void; unMute: () => void;
  setVolume: (volume: number) => void; destroy: () => void;
};
type PlayerEvent = { target: Player; data: number };
declare global {
  interface Window {
    YT?: { Player: new (element: HTMLElement, options: {
      videoId: string; width: number; height: number;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: PlayerEvent) => void;
        onStateChange: (event: PlayerEvent) => void;
        onError: (event: PlayerEvent) => void; onAutoplayBlocked: () => void;
      };
    }) => Player };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const GESTURE_EVENTS = ["touchstart", "touchend", "pointerdown", "click", "keydown"] as const;

export default function MusicPlayer() {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Remember whether the visitor already touched the screen, so a player that
  // finishes loading after the first touch can start with sound immediately.
  const gestured = useRef(false);
  const muted = useRef(true);
  const [attempt, setAttempt] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "playing" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!attempt) return;
    let cancelled = false;
    const clearTimer = () => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = null;
    };
    const fail = () => {
      if (cancelled) return;
      clearTimer();
      setStatus("error");
      setMessage("მუსიკა ვერ ჩაიტვირთა. სცადეთ ხელახლა.");
    };
    const hint = () => {
      if (cancelled) return;
      clearTimer();
      setStatus("ready");
      setMessage("შეეხეთ ეკრანს და მუსიკა ჩაირთვება ✨");
    };
    const create = () => {
      if (cancelled || player.current || !host.current || !window.YT?.Player) return;
      const mount = document.createElement("div");
      host.current.replaceChildren(mount);
      player.current = new window.YT.Player(mount, {
        videoId: VIDEO_ID, width: 200, height: 200,
        // Muted autoplay is allowed by browsers; sound is added on first touch.
        playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, loop: 1, playlist: VIDEO_ID, start: 15, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            clearTimer();
            target.setVolume(45);
            if (gestured.current) {
              target.unMute();
              muted.current = false;
            }
            target.playVideo();
            if (muted.current) hint();
          },
          onStateChange: ({ data }) => {
            if (cancelled) return;
            if (data === 1) {
              clearTimer();
              if (muted.current) {
                setStatus("ready");
                setMessage("შეეხეთ ეკრანს და მუსიკა ჩაირთვება ✨");
              } else {
                setStatus("playing"); setMessage("");
              }
            } else if (data === 2 || data === 0) {
              clearTimer(); setStatus("ready");
            }
          },
          onError: ({ data }) => { console.warn("Music playback error", data); fail(); },
          onAutoplayBlocked: () => { hint(); },
        },
      });
    };
    const previous = window.onYouTubeIframeAPIReady;
    const onReady = () => { previous?.(); create(); };
    window.onYouTubeIframeAPIReady = onReady;
    let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (!window.YT?.Player) {
      if (!script) {
        script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener("error", fail);
    } else create();
    timeout.current = setTimeout(fail, 20000);
    const onVisibility = () => {
      if (document.hidden && !muted.current) {
        player.current?.pauseVideo();
        setStatus(current => current === "playing" ? "ready" : current);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true; clearTimer();
      document.removeEventListener("visibilitychange", onVisibility);
      script?.removeEventListener("error", fail);
      if (window.onYouTubeIframeAPIReady === onReady) { if (previous) window.onYouTubeIframeAPIReady = previous; else delete window.onYouTubeIframeAPIReady; }
      player.current?.destroy(); player.current = null;
      // Allow a failed API download to be retried.
      if (!window.YT?.Player) script?.remove();
    };
  }, [attempt]);

  // First touch anywhere on the page turns the sound on and keeps it playing.
  useEffect(() => {
    const activate = () => {
      gestured.current = true;
      const current = player.current;
      if (current) {
        current.unMute();
        muted.current = false;
        current.setVolume(45);
        current.playVideo();
        setStatus(status => (status === "ready" || status === "loading") ? "playing" : status);
      }
      GESTURE_EVENTS.forEach(event => document.removeEventListener(event, activate));
    };
    GESTURE_EVENTS.forEach(event => document.addEventListener(event, activate, { passive: true }));
    return () => GESTURE_EVENTS.forEach(event => document.removeEventListener(event, activate));
  }, []);

  useEffect(() => {
    if (!message || status === "loading") return;
    const hide = setTimeout(() => setMessage(""), 6000);
    return () => clearTimeout(hide);
  }, [message, status]);

  function toggle() {
    if (status === "idle" || status === "error") {
      setStatus("loading"); setMessage("მუსიკა იტვირთება…"); setAttempt(value => value + 1);
    } else if (status === "playing") {
      player.current?.pauseVideo(); setStatus("ready");
    } else if (status === "ready") {
      gestured.current = true;
      player.current?.unMute(); muted.current = false; player.current?.setVolume(45);

      setStatus("loading"); setMessage("მუსიკა იტვირთება…");
      timeout.current = setTimeout(() => {
        setStatus("ready"); setMessage("მუსიკის ჩასართავად სცადეთ ხელახლა.");
      }, 12000);
      player.current?.playVideo();
    }
  }

  return (
    <>
      <div ref={host} aria-hidden="true" inert className="pointer-events-none fixed -left-[300px] top-0 h-[200px] w-[200px] overflow-hidden" />
      <div className="music-controls fixed right-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-3">
        <span role="status" className={message ? "rounded-xl bg-wine px-3 py-2 font-geo text-sm text-white shadow-soft" : "sr-only"}>{message}</span>
        {status === "error" && (
          <a href={"https://www.youtube.com/watch?v=" + VIDEO_ID} target="_blank" rel="noreferrer"
            className="rounded-xl bg-wine px-3 py-2 font-geo text-sm text-white underline">
            მუსიკის გახსნა
          </a>
        )}
        <button type="button" onClick={toggle} disabled={status === "loading"}
          aria-label={status === "playing" ? "მუსიკის გამორთვა" : status === "error" ? "მუსიკის ხელახლა ჩართვა" : "მუსიკის ჩართვა"}
          aria-pressed={status === "playing"} aria-busy={status === "loading"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-parchment/30 bg-wine text-parchment shadow-soft transition hover:bg-wine/90 disabled:opacity-70 sm:h-14 sm:w-14">
          {status === "loading" ? <LoaderCircle className="h-5 w-5 animate-spin" /> : status === "playing" ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>
    </>
  );
}
