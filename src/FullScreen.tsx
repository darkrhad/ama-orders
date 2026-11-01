import { useEffect, useState } from 'react';

// Hides the browser's tabs and address bar (for a tablet that can't add the
// app to its home screen, such as a kiosk-mode one). Browsers only allow it
// from a tap, so it is a button; it ends on reload or with the browser's own exit.

type Doc = Document & { webkitFullscreenElement?: Element; webkitFullscreenEnabled?: boolean; webkitExitFullscreen?: () => void };
type El = HTMLElement & { webkitRequestFullscreen?: () => void };

const doc = document as Doc;
const supported = Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
const isFull = () => Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
// Opened from a home-screen icon there are no browser bars to hide.
const standalone = window.matchMedia('(display-mode: standalone)').matches;

export default function FullScreen() {
  const [full, setFull] = useState(isFull);

  useEffect(() => {
    const update = () => setFull(isFull());
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, []);

  if (!supported || standalone) return null;

  const toggle = () => {
    const root = document.documentElement as El;
    if (isFull()) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else doc.webkitExitFullscreen?.();
    } else if (root.requestFullscreen) {
      root.requestFullscreen().catch(() => {});
    } else {
      root.webkitRequestFullscreen?.();
    }
  };

  return (
    <button className="fullscreen" onClick={toggle} aria-label={full ? 'Exit full screen' : 'Full screen'}>
      {full ? '⤡' : '⛶'}
    </button>
  );
}
