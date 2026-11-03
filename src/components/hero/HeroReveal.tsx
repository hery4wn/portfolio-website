'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';

type RevealState = 'photo' | 'local-preview' | 'anime';

export function HeroReveal({ children }: { children: ReactNode }) {
  const policy = useMotionPolicy();
  const [forced, setForced] = useState(false);
  const [locked, setLocked] = useState(false);
  const [brushReady, setBrushReady] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const illustration = useRef<HTMLImageElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const failed = useRef(false);
  const [available, setAvailable] = useState(false);
  const [preview, setPreview] = useState(false);
  const [selected, setSelected] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [finePointer, setFinePointer] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const state: RevealState = available && (selected || forced || preview) ? selected || forced ? 'anime' : 'local-preview' : 'photo';

  const reset = useCallback(() => {
    setPreview(false);
    setSelected(false);
  }, []);

  const verifyImages = useCallback(async () => {
    const base = photo.current;
    const overlay = illustration.current;
    if (failed.current || !base?.complete || !overlay?.complete || !base.naturalWidth || !overlay.naturalWidth) return;
    const source = overlay.currentSrc;
    try {
      await Promise.all([base.decode(), overlay.decode()]);
      if (!failed.current && overlay.currentSrc === source) setAvailable(true);
    } catch { /* The poster remains the default until a usable image has decoded. */ }
  }, []);

  const unavailable = useCallback(() => {
    failed.current = true;
    reset();
    if (document.activeElement === toggle.current) document.getElementById('hero-title')?.focus();
    setAvailable(false);
  }, [reset]);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const crop = matchMedia('(max-width: 1023px)');
    const preferences = () => {
      setReduced(motion.matches);
      setFinePointer(pointer.matches);
      setPreview(false);
    };
    const resizeCrop = () => {
      if (document.activeElement === toggle.current) document.getElementById('hero-title')?.focus();
      setAvailable(false);
      reset();
      requestAnimationFrame(() => { void verifyImages(); });
    };
    preferences();
    void verifyImages();
    motion.addEventListener('change', preferences);
    pointer.addEventListener('change', preferences);
    crop.addEventListener('change', resizeCrop);
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (!entry.isIntersecting) reset();
    });
    if (hero.current) observer.observe(hero.current);
    const resize = new ResizeObserver(() => setPreview(false));
    if (scene.current) resize.observe(scene.current);
    const onHidden = () => { if (document.hidden) reset(); };
    const onBlur = () => setPreview(false);
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('blur', onBlur);
    return () => {
      motion.removeEventListener('change', preferences);
      pointer.removeEventListener('change', preferences);
      crop.removeEventListener('change', resizeCrop);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('blur', onBlur);
    };
  }, [reset, verifyImages]);

  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    const phase = (event: Event) => { const { p } = (event as CustomEvent<{p:number}>).detail; setForced(p > .001); setLocked(p > .16); setPreview(false); if (p === 0) setSelected(false); };
    el.addEventListener('story-phase', phase);
    return () => el.removeEventListener('story-phase', phase);
  }, []);

  useEffect(() => {
    const image = hero.current?.querySelector<HTMLImageElement>('[data-reveal-brush]');
    if (!image) return;
    const loaded = () => setBrushReady(image.complete && image.naturalWidth > 0);
    loaded(); image.addEventListener('load', loaded); image.addEventListener('error', loaded);
    return () => { image.removeEventListener('load', loaded); image.removeEventListener('error', loaded); };
  }, []);

  useEffect(() => { if (policy.reduce) setPreview(false); }, [policy.reduce]);

  function previewCharacter(event: PointerEvent<HTMLElement>) {
    if (!available || !brushReady || selected || forced || locked || reduced || policy.reduce || !finePointer || event.pointerType !== 'mouse' || !scene.current) return;
    const box = scene.current.getBoundingClientRect();
    // The raster alpha masks perform the footprint/character intersection directly.
    // Keep the full brush active around the pointer, including before its center hits.
    scene.current.style.setProperty('--brush-x', (event.clientX - box.left) + 'px');
    scene.current.style.setProperty('--brush-y', (event.clientY - box.top) + 'px');
    setPreview(true);
  }

  return (
    <section ref={hero} id="tentang" className="hero" aria-labelledby="hero-title" data-reveal-state={state} data-story-forced={forced}
      onPointerMove={previewCharacter} onPointerLeave={() => setPreview(false)}
      onKeyDown={(event) => { if (event.key === 'Escape') { reset(); setAnnouncement('Foto Hery ditampilkan.'); } }}>
      <div ref={scene} className="hero-scene">
        <picture className="hero-photo">
          <source media="(max-width: 1023px)" srcSet="/media/hero/studio-photo-mobile.webp"/>
          <img ref={photo} src="/media/hero/studio-photo.webp" width="2400" height="1601"
            alt="Hery duduk di studio merah hangat, kedua kaki melintasi tepi paper, ditemani lima maskot."
            fetchPriority="high" onLoad={verifyImages} onError={unavailable}/>
        </picture>
        <picture className="hero-anime" aria-hidden="true">
          <source media="(max-width: 1023px)" srcSet="/media/hero/reveal/anime-mobile.webp"/>
          <img ref={illustration} src="/media/hero/reveal/anime-desktop.webp" width="2400" height="1601"
            alt="" decoding="async" fetchPriority="low" onLoad={verifyImages} onError={unavailable}/>
        </picture>
      </div>
      <img data-reveal-brush className="sr-only" src="/media/hero/reveal/brush.png" alt="" aria-hidden="true" onLoad={() => setBrushReady(true)} onError={() => setBrushReady(false)}/>
      {children}
      <div className="reveal-control" hidden={!available}>
        <button ref={toggle} type="button" className="reveal-toggle" aria-pressed={selected} aria-describedby="reveal-help"
          tabIndex={inView && !locked ? 0 : -1} onClick={() => {
            setSelected(!selected); setPreview(false);
            setAnnouncement(selected ? 'Foto Hery ditampilkan.' : 'Ilustrasi Hery ditampilkan; pose dan pakaian berganti.');
          }}>
          <span>Versi ilustrasi</span><span className="reveal-switch" aria-hidden="true"><span/></span>
        </button>
        <p id="reveal-help" className="sr-only">Tampilkan ilustrasi Hery dengan pakaian berbeda. Latar studio tetap sama. Tekan Escape untuk kembali ke foto.</p>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
