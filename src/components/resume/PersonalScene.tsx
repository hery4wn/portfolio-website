'use client';

import { useEffect, useRef, type ReactNode, type PointerEvent } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
import styles from './personal-scene.module.css';

export function PersonalScene({ children }: { children: ReactNode }) {
  return <section id="tentang-saya" className={styles.scene} aria-labelledby="about-hery-title" tabIndex={-1}>
    <div className={styles.light} data-personal-light aria-hidden="true" />
    <div className={styles.ribbon} data-personal-ribbon aria-hidden="true" />
    {children}
  </section>;
}

/** The supplied card's layered photograph/glass treatment, adapted to a portrait. */
export function PortraitCard() {
  const card = useRef<HTMLElement>(null);
  const { ready, reduce } = useMotionPolicy();
  const reset = () => {
    card.current?.style.setProperty('--tilt-x', '0deg');
    card.current?.style.setProperty('--tilt-y', '0deg');
  };
  useEffect(() => { if (reduce) reset(); }, [reduce]);
  function tilt(event: PointerEvent<HTMLElement>) {
    if (!ready || reduce || event.pointerType !== 'mouse' || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    card.current?.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 8}deg`);
    card.current?.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 8}deg`);
  }
  return <figure ref={card} className={styles.card} onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset}>
    <div className={styles.photo}>
      <img src="/media/profile/heryawan.png" width="1024" height="1536" loading="lazy" decoding="async" alt="Heryawan mengenakan kaus cream, berdiri dengan tangan bersilang dalam cahaya hangat." />
    </div>
    <figcaption className={styles.caption}>
      <div><h3>Heryawan.</h3><p>Membangun web. Terus belajar.</p></div>
      <span className={styles.signature} aria-hidden="true">H.</span>
    </figcaption>
  </figure>;
}
