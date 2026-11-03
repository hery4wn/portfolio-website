'use client';
import { useLayoutEffect, useRef } from 'react';
import { useMotionPolicy } from './MotionPolicy';
import { ResumeStudioBackdrop } from '../story/SceneArtwork';

/** Studio depth carries the reader from the resume into the project selector. */
export function ParallaxComponent() {
  const root = useRef<HTMLDivElement>(null);
  const { ready, reduce } = useMotionPolicy();
  useLayoutEffect(() => {
    if (!root.current || !ready || reduce) return;
    const host = root.current;
    let cancelled = false, dispose = () => {};
    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      await document.fonts.ready;
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add({compact:'(max-width:1023px)',wide:'(min-width:1024px)'}, context => {
        const compact = !!context.conditions?.compact;
        const timeline = gsap.timeline({ scrollTrigger: { id: 'hery-work-parallax', trigger: host, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        for (const [layer, distance] of [[1,14],[2,-8],[3,30]]) {
          if (compact && layer === 3) continue;
          timeline.to(host.querySelectorAll(`[data-parallax-layer="${layer}"]`), { yPercent: distance * (compact ? .45 : 1), ease: 'none' }, 0);
        }
      }, host);
      host.dataset.parallaxReady = 'true';
      ScrollTrigger.refresh();
      dispose = () => { media.revert(); delete host.dataset.parallaxReady; };
    }
    void start().catch(() => { if (!cancelled) host.dataset.parallaxFallback = 'static'; });
    return () => { cancelled = true; dispose(); };
  }, [ready, reduce]);
  return <div ref={root} className="work-parallax work-transition">
    <div className="work-transition-scene" data-parallax-layer="1" aria-hidden="true"><ResumeStudioBackdrop/></div>
    <div className="work-transition-light" data-parallax-layer="2" aria-hidden="true"/>
    <div data-parallax-layer="3" className="work-transition-title"><h2 id="work-title" tabIndex={-1}>Karya.</h2><p>Ide, proses, dan hasil yang bisa dijelajahi.</p></div>
    <div className="work-transition-paper" aria-hidden="true"/>
  </div>;
}
