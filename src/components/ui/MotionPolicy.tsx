'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
type Mode = 'device' | 'reduce';
const Motion = createContext({ ready: false, reduce: true, mode: 'device' as Mode, setMode: (_: Mode) => {} });
export const useMotionPolicy = () => useContext(Motion);
export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, updateMode] = useState<Mode>('device');
  const [system, setSystem] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setSystem(query.matches);
    sync();
    try { if (localStorage.getItem('hery-motion-v1') === 'reduce') updateMode('reduce'); } catch {}
    setReady(true);
    query.addEventListener('change', sync);
    const storage = (event: StorageEvent) => { if (event.key === 'hery-motion-v1') updateMode(event.newValue === 'reduce' ? 'reduce' : 'device'); };
    window.addEventListener('storage', storage);
    const anchorFocus = (event: MouseEvent) => { const a=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]'); if(!a||event.button||event.metaKey||event.ctrlKey)return; const url=new URL(a.href,location.href); if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return; requestAnimationFrame(()=>{if(event.defaultPrevented)return;const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));const heading=target?.querySelector<HTMLElement>('h1,h2')||target;heading?.focus({preventScroll:true});}); };
    document.addEventListener('click',anchorFocus);
    return () => { query.removeEventListener('change', sync); window.removeEventListener('storage', storage); document.removeEventListener('click',anchorFocus); };
  }, []);
  function setMode(value: Mode) { updateMode(value); try { localStorage.setItem('hery-motion-v1', value); } catch {} }
  const reduce = system || mode === 'reduce';
  return <Motion.Provider value={{ ready, reduce, mode, setMode }}><div data-motion={reduce ? 'reduce' : 'normal'}>{children}</div></Motion.Provider>;
}
export function MotionControl() {
  const { mode, setMode } = useMotionPolicy();
  return <label className="motion-setting">Gerak<select aria-label="Preferensi gerak" value={mode} onChange={e => setMode(e.target.value as Mode)}><option value="device">Ikuti perangkat</option><option value="reduce">Kurangi gerak</option></select></label>;
}
