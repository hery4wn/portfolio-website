'use client';
import { useLayoutEffect, type RefObject } from 'react';
import { createStoryPhaseEmitter } from '../../lib/story-phase';

/** Short native-flow scene: the image scrolls with the page; it is never pinned. */
export function useCompactStory(root: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled || !root.current) return;
    const host = root.current;
    let cancelled = false, dispose = () => {}, frame = 0;
    async function start() {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      try {
        const images = [...host.querySelectorAll<HTMLImageElement>('[data-story-asset],.hero-photo img,.hero-anime img,[data-reveal-brush]')];
        await Promise.all([document.fonts.ready, ...images.map(image => image.decode())]);
        if (cancelled || images.length < 6) return;
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const hero = host.querySelector<HTMLElement>('.hero')!;
        const scene = host.querySelector<HTMLElement>('.hero-scene')!;
        const world = host.querySelector<HTMLElement>('.scroll-world')!;
        const camera = host.querySelector<HTMLElement>('.scroll-camera')!;
        const paper = host.querySelector<HTMLElement>('.paper-motion')!;
        const control = host.querySelector<HTMLElement>('.reveal-control')!;
        const emit = createStoryPhaseEmitter(hero);
        let timeline: gsap.core.Timeline;
        function position() {
          const box = scene.getBoundingClientRect(), parent = hero.getBoundingClientRect();
          world.style.top = (box.top - parent.top) + 'px';
          world.style.height = box.height + 'px';
          for (const [key, value] of [['--auto-x', box.width * .54], ['--auto-y', box.height * .445], ['--auto-head-x', box.width * .562], ['--auto-head-y', box.height * .224]] as const) hero.style.setProperty(key, value + 'px');
        }
        function update() {
          const p = timeline.progress(); emit(p);
          host.dataset.storyProgress = (p <= .002 ? 0 : p).toFixed(4);
          const button = control.querySelector<HTMLButtonElement>('button');
          if (button) button.tabIndex = p > .2 ? -1 : 0;
        }
        const context = gsap.context(() => {
          host.classList.add('story-compact'); position();
          gsap.set(hero, { '--scroll-size': '0px', '--scroll-head-size': '0px' });
          gsap.set(world, { autoAlpha: 0 });
          timeline = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: update, scrollTrigger: {
            id: 'hery-opening-mobile', trigger: scene, start: 'top 48%', end: 'center 38%',
            pin: false, scrub: .4, invalidateOnRefresh: true,
            onRefresh: self => { host.dataset.storyStart = String(self.start); host.dataset.storyEnd = String(self.end); },
          }});
          timeline.to(hero, { '--scroll-size': () => scene.clientWidth * 3.6 + 'px', duration: .2 }, 0)
            .to(hero, { '--scroll-head-size': '190px', duration: .03 }, 0)
            .set(world, { autoAlpha: 1 }, .2)
            .set(scene, { autoAlpha: 0 }, .2)
            .to(control, { autoAlpha: 0, duration: .12 }, .2)
            .to(paper, { xPercent: -66, duration: .5 }, .25)
            .to(camera, { scale: 1.035, transformOrigin: '58% 28%', duration: .35 }, .48)
            .to({}, { duration: .17 }, .83);
          update();
        }, host);
        let lastWidth = document.documentElement.clientWidth;
        // Browser toolbar height changes should not repeatedly rebuild the scene while swiping.
        const resize = () => {
          const width = document.documentElement.clientWidth;
          if (width === lastWidth) return;
          lastWidth = width;
          cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { position(); ScrollTrigger.refresh(); });
        };
        const visible = () => { const tween = timeline.scrollTrigger?.getTween(); if (document.hidden) tween?.pause(); else { tween?.play(); ScrollTrigger.refresh(); ScrollTrigger.update(); } };
        window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visible);
        ScrollTrigger.refresh(); ScrollTrigger.update(); host.dataset.storyReady = 'true';
        dispose = () => {
          window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visible); cancelAnimationFrame(frame);
          context.revert(); host.classList.remove('story-compact'); world.style.top = ''; world.style.height = '';
          control.querySelector('button')?.removeAttribute('tabindex');
          delete host.dataset.storyReady; delete host.dataset.storyProgress;
          hero.dispatchEvent(new CustomEvent('story-phase', { detail: { p: 0, phase: 'intro' } }));
        };
      } catch { if (!cancelled) host.dataset.storyFallback = 'asset-or-module'; }
    }
    void start();
    return () => { cancelled = true; dispose(); };
  }, [root, enabled]);
}
