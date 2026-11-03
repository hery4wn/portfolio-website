'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';

export function MascotGreeting() {
  const { ready, reduce } = useMotionPolicy();
  const host = useRef<HTMLElement>(null);
  const pose = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const motion = useRef<Animation | null>(null);
  const [available, setAvailable] = useState(false);
  const [failed, setFailed] = useState(false);
  const [running, setRunning] = useState(false);
  const [greeted, setGreeted] = useState(false);

  const stop = useCallback(() => {
    const animation = motion.current;
    motion.current = null;
    if (animation) { animation.onfinish = null; animation.oncancel = null; animation.cancel(); }
    setRunning(false);
  }, []);

  useEffect(() => {
    const check = () => {
      const element = image.current;
      if (!element?.complete) return;
      setAvailable(element.naturalWidth > 0);
      setFailed(!element.naturalWidth);
    };
    check();
    const hidden = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
    if (host.current) observer.observe(host.current);
    document.addEventListener('visibilitychange', hidden);
    return () => { stop(); observer.disconnect(); document.removeEventListener('visibilitychange', hidden); };
  }, [stop]);

  useEffect(() => { if (reduce) stop(); }, [reduce, stop]);

  function greet() {
    if (!ready || !available || motion.current?.playState === 'running') return;
    setGreeted(true);
    if (reduce || !pose.current?.animate) return;
    const animation = pose.current.animate([
      { transform: 'translateY(0) rotate(0deg) scale(1,1)' },
      { transform: 'translateY(2px) rotate(-2deg) scale(1.04,.96)', offset: .15 },
      { transform: 'translateY(-8px) rotate(-4deg) scale(.98,1.03)', offset: .4 },
      { transform: 'translateY(0) rotate(3deg) scale(1.03,.97)', offset: .75 },
      { transform: 'translateY(0) rotate(0deg) scale(1,1)' },
    ], { duration: 800, iterations: 1, easing: 'ease-out' });
    motion.current = animation;
    setRunning(true);
    animation.onfinish = () => { if (motion.current === animation) { motion.current = null; setRunning(false); } };
  }

  return <aside ref={host} className="mascot-greeting" aria-label="Muse, maskot studio" data-mascot-state={running ? 'reacting' : greeted ? 'greeted' : 'idle'}>
    <div className="mascot-flight"><div className="mascot-idle"><div ref={pose} className="mascot-pose">
      <img ref={image} src="/media/mascot/muse-greeting.webp" width="384" height="384" loading="lazy" alt="Muse, maskot cream dengan lambang biru." hidden={failed}
        onLoad={() => { setAvailable(true); setFailed(false); }} onError={() => {
          if (document.activeElement === button.current) document.getElementById('contact-title')?.focus({ preventScroll: true });
          stop(); setAvailable(false); setFailed(true);
        }}/>
      <span className="mascot-fallback" hidden={!failed}>Muse</span>
    </div></div></div>
    <button ref={button} type="button" className="mascot-greet-button" hidden={!ready || !available} onClick={greet} onKeyDown={event => { if (event.key === 'Escape') stop(); }} aria-busy={running}>Sapa Muse</button>
    <p className="mascot-status" role="status" aria-live="polite">{greeted ? 'Terima kasih sudah mampir.' : ''}</p>
  </aside>;
}
