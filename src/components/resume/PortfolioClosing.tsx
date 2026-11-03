'use client';

import { useEffect, useRef } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
import styles from './closing.module.css';

const instagram = 'https://www.instagram.com/hery4wn/';

export function PortfolioClosing() {
  const card = useRef<HTMLAnchorElement>(null);
  const { ready, reduce } = useMotionPolicy();

  useEffect(() => {
    const element = card.current;
    if (!element || !ready || reduce) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      animation = element.animate([
        { transform: 'translateY(36px) rotate(-5deg)', opacity: .45 },
        { transform: 'translateY(0) rotate(-2deg)', opacity: 1 },
      ], { duration: 850, easing: 'cubic-bezier(.16,1,.3,1)' });
    }, { threshold: .25 });
    observer.observe(element);
    return () => { observer.disconnect(); animation?.cancel(); };
  }, [ready, reduce]);

  return <section id="kontak" data-reading tabIndex={-1} className={styles.closing} aria-labelledby="contact-title">
    <div className={styles.scene}>
      <div className={styles.copy}>
        <h2 data-scroll-reveal id="contact-title" tabIndex={-1}>Sampai jumpa<br/>di Instagram.</h2>
        <p data-scroll-reveal>Terima kasih sudah mampir. Kalau ingin ngobrol soal web, AI, atau proyek, sapa saya di Instagram.</p>
        <a data-scroll-reveal className={styles.cta} href={instagram} target="_blank" rel="noopener noreferrer">Buka @hery4wn <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></a>
      </div>
      <div className={styles.cardStage}>
      <a ref={card} className={styles.card} href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Buka profil Instagram @hery4wn">
        <div className={styles.qr}><img src="/media/profile/instagram-hery.png" width="1111" height="1600" alt="Kode QR Instagram @hery4wn" loading="lazy" decoding="async"/></div>
        <span>Pindai untuk membuka profil</span>
      </a>
      </div>
    </div>
    <div data-scroll-reveal className={styles.bottom}><span>Heryawan · Web &amp; AI</span><a href="#tentang">Kembali ke awal ↑</a><a href="/resume/">Résumé</a><a href="/lisensi/">Lisensi font</a></div>
  </section>;
}
