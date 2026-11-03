'use client';
import { useEffect, useRef } from 'react';
import { MotionControl } from './MotionPolicy';
import styles from './section-nav.module.css';

const sections = [
  ['tentang', 'About Hery'],
  ['riwayat', 'Résumé'],
  ['karya', 'Karya pilihan'],
  ['tentang-saya', 'Tentang saya'],
  ['kontak', 'Penutup'],
];
export function SectionNav() {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) {
        if (menu.current.contains(document.activeElement)) menu.current.querySelector('summary')?.focus({ preventScroll: true });
        menu.current.open = false;
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  return <nav className="section-nav" aria-label="Navigasi utama">
    <details ref={menu} className="quiet-menu" onKeyDown={event => {
      if (event.key === 'Escape' && menu.current?.open) {
        event.preventDefault();
        menu.current.querySelector('summary')?.focus();
        menu.current.open = false;
      }
    }} onClick={event => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', link.hash);
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      (target.querySelector<HTMLElement>('h1,h2') || target).focus({ preventScroll: true });
      if (menu.current) menu.current.open = false;
    }}>
      <summary className={styles.trigger}>
        Menu
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 7h14"/><path d="M7 13h10"/>
        </svg>
      </summary>
      <div className={styles.panel}>
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 15 15 5M7 5h8v8"/>
            </svg>
          </a>
        ))}
        <MotionControl/>
      </div>
    </details>
  </nav>;
}
