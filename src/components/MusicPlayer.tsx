import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "vGJTaP6anOU";
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

export default function MusicPlayer() {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "playing" | "error">("idle");
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
    const create = () => {
      if (cancelled || player.current || !host.current || !window.YT?.Player) return;
      const mount = document.createElement("div");
      host.current.replaceChildren(mount);
      player.current = new window.YT.Player(mount, {
        videoId: VIDEO_ID, width: 200, height: 200,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, loop: 1, playlist: VIDEO_ID, origin: window.location.origin },
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            clearTimer();
            setStatus("loading");
            target.setVolume(45);
            target.unMute();
            timeout.current = setTimeout(() => {
              setStatus("ready"); setMessage("მუსიკის ჩასართავად შეეხეთ ღილაკს.");
            }, 12000);
            target.playVideo();
          },
          onStateChange: ({ data }) => {
            if (cancelled) return;
            if (data === 1) {
              clearTimer(); setStatus("playing"); setMessage("");
            } else if (data === 2 || data === 0) {
              clearTimer(); setStatus("ready");
            }
          },
          onError: ({ data }) => { console.warn("Music playback error", data); fail(); },
          onAutoplayBlocked: () => {
            if (cancelled) return;
            clearTimer(); setStatus("ready");
            setMessage("მუსიკის ჩასართავად შეეხეთ ღილაკს.");
          },
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
      if (document.hidden) {
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

  useEffect(() => {
    if (!message || status === "loading") return;
    const hide = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(hide);
  }, [message, status]);

  function toggle() {
    if (status === "idle" || status === "error") {
      setStatus("loading"); setMessage("მუსიკა იტვირთება…"); setAttempt(value => value + 1);
    } else if (status === "playing") {
      player.current?.pauseVideo(); setStatus("ready");
    } else if (status === "ready") {
      player.current?.unMute(); player.current?.setVolume(45);

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