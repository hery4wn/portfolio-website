'use client';
import { useEffect, useRef, useState } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
import styles from './opening.module.css';

export function OpeningExperience() {
  const { ready, reduce } = useMotionPolicy();
  const [phase, setPhase] = useState('waiting');
  const [progress, setProgress] = useState(0);
  const finish = useRef<() => void>(() => {});
  useEffect(() => {
    if (!ready) return;
    const heroEntry = location.hash === '#tentang';
    if (reduce || (!heroEntry && (location.hash || scrollY > 20))) {
      setPhase('done');
      return;
    }
    let cancelled = false, exiting = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root.dataset.opening = 'loading';
    setPhase('loading');
    const finishOpening = () => {
      if (cancelled || exiting) return;
      exiting = true;
      setProgress(100);
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setPhase('exit'); root.dataset.opening = 'reveal';
        document.body.style.overflow = previousOverflow;
        timers.push(setTimeout(() => { if (!cancelled) { setPhase('done'); delete root.dataset.opening; } }, 1500));
      }, 180));
    };
    finish.current = finishOpening;
    const images = [...document.querySelectorAll<HTMLImageElement>('.hero img')];
    const tasks = [document.fonts.ready, ...images.map(image => image.decode().catch(() => {}))];
    let completed = 0;
    // Percentage represents settled hero-image/font tasks, not fabricated byte progress.
    Promise.all(tasks.map(task => Promise.resolve(task).finally(() => {
      completed++; if (!cancelled && !exiting) setProgress(Math.round(completed / tasks.length * 100));
    }))).then(() => { if (!cancelled) timers.push(setTimeout(finishOpening, 650)); });
    timers.push(setTimeout(finishOpening, 4500));
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') finishOpening(); };
    window.addEventListener('keydown', escape);
    return () => { cancelled = true; timers.forEach(clearTimeout); window.removeEventListener('keydown', escape); document.body.style.overflow = previousOverflow; delete root.dataset.opening; };
  }, [ready, reduce]);
  if (phase === 'waiting' || phase === 'done') return null;
  return <div className={styles.opening} data-phase={phase}>
    <div className={styles.content}>
      <p className={styles.name}>Sebentar,<br/>kita kenalan.</p>
      <div className={styles.meter} role="progressbar" aria-label="Menyiapkan gambar dan font hero" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <span>{String(progress).padStart(2, '0')}<small>%</small></span>
        <div className={styles.track}><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
      </div>
      <p className={styles.note}>Heryawan · Web &amp; AI</p>
    </div>
    <button className={styles.skip} onClick={() => finish.current()}>Langsung masuk</button>
  </div>;
}

export function HeroAtmosphere() {
  const host = useRef<HTMLDivElement>(null);
  const { reduce } = useMotionPolicy();
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let visible = false;
    const sync = () => { element.dataset.running = String(visible && !document.hidden && !reduce); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element); document.addEventListener('visibilitychange', sync); sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [reduce]);
  return <div ref={host} className={styles.atmosphere} aria-hidden="true">
    <div className={styles.lightSweep}/>
    {Array.from({length: 9}, (_, index) => <i key={index} style={{left: `${52 + (index * 17) % 45}%`, top: `${12 + (index * 23) % 76}%`, animationDelay: `${-index * 1.7}s`, animationDuration: `${7 + index % 4}s`}}/>)}
  </div>;
}
