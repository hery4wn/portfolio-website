'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { resumeAlbums } from '../../content/resume-photos';
import { AlbumViewer } from './ResumeAlbum';
import { useMotionPolicy } from '../ui/MotionPolicy';
import styles from './resume-photo-stage.module.css';
import { StudioCompanions } from '../work/StudioCompanions';

export function ResumePhotoStage({children}: {children: ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const mascotDock = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('uncp');
  const [wide, setWide] = useState(false);
  const {reduce} = useMotionPolicy();
  useEffect(() => {
    const query = matchMedia('(min-width:1024px)');
    const sync = () => setWide(query.matches);
    sync(); query.addEventListener('change',sync);
    return () => query.removeEventListener('change',sync);
  }, []);
  useEffect(() => {
    if (!wide || !root.current) return;
    const host = root.current;
    let pending = 0;
    let hovered: Element | null = null;
    const entries = [...host.querySelectorAll<HTMLElement>('[data-resume-entry]')];
    function choose(element: Element | null) {
      const id = element?.getAttribute('data-resume-entry');
      if (id && resumeAlbums[id]) setActive(id);
    }
    function update() {
      pending = 0;
      if (document.querySelector('dialog[open]') || host.querySelector('aside')?.contains(document.activeElement)) return;
      if (hovered) { choose(hovered); return; }
      const target = innerHeight * .4;
      const nearest = entries.reduce<HTMLElement | null>((best, entry) => {
        const box = entry.getBoundingClientRect();
        const distance = Math.abs(Math.max(box.top,Math.min(target,box.bottom))-target);
        if (!best) return entry;
        const b = best.getBoundingClientRect();
        return distance < Math.abs(Math.max(b.top,Math.min(target,b.bottom))-target) ? entry : best;
      }, null);
      choose(nearest);
    }
    const scroll = () => { hovered = null; if (!pending) pending = requestAnimationFrame(update); };
    const over = (event: PointerEvent) => { if(event.pointerType !== 'mouse') return; hovered = (event.target as Element).closest('[data-resume-entry]'); choose(hovered); };
    const leave = () => {hovered = null;};
    const focus = (event: FocusEvent) => choose((event.target as Element).closest('[data-resume-entry]'));
    host.addEventListener('pointerover',over);host.addEventListener('pointermove',over);host.addEventListener('pointerleave',leave);host.addEventListener('focusin',focus);
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();
    return () => {cancelAnimationFrame(pending);host.removeEventListener('pointerover',over);host.removeEventListener('pointermove',over);host.removeEventListener('pointerleave',leave);host.removeEventListener('focusin',focus);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
  }, [wide]);
  useEffect(() => {
    const photo = rail.current;
    const dock = mascotDock.current;
    if (!wide || !photo || !dock) return;
    let pending = 0;
    function measure() {
      pending = 0;
      if (!photo || !dock) return;
      const gap = dock.getBoundingClientRect().top - photo.getBoundingClientRect().bottom;
      const opacity = Math.max(0, Math.min(1, (gap - 16) / 36));
      dock.style.setProperty('--mascot-opacity', String(opacity));
      dock.dataset.visible = String(opacity > 0);
    }
    const schedule = () => { if (!pending) pending = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(photo);
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    measure();
    return () => {
      cancelAnimationFrame(pending);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [wide]);
  useEffect(() => {
    if (reduce || !wide) return;
    const animation = frame.current?.animate([{opacity:.4,transform:'translateY(20px) rotate(1deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],{duration:450,easing:'cubic-bezier(.16,1,.3,1)'});
    return () => animation?.cancel();
  },[active,wide,reduce]);
  return <div ref={root} className={styles.layout} data-photo-stage={wide ? 'active' : 'compact'}>
    <div className={styles.reading}>{children}</div>
    {wide && <aside ref={rail} className={styles.rail} aria-label="Dokumentasi riwayat">
      <div ref={frame} className={styles.frame} data-active-album={active}>
        <h3>{resumeAlbums[active].title}</h3>
        <AlbumViewer key={active} id={active} presentation="studio"/>
      </div>
    </aside>}
    {wide && <div className={styles.mascotTrack} aria-hidden="true">
      <div ref={mascotDock} className={styles.mascotDock}><StudioCompanions selected="resume" variant="resume"/></div>
    </div>}
  </div>;
}
