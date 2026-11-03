'use client';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
import { createStoryPhaseEmitter } from '../../lib/story-phase';
import { useCompactStory } from './useCompactStory';
import type { ScrollTrigger as Trigger } from 'gsap/ScrollTrigger';
const Story = createContext(false);
export function ScrollLayers() {
  const enabled = useContext(Story);
  if (!enabled) return null;
  const image = (name: string, className?: string) => <picture className={className}><source media="(max-width:1023px)" srcSet={'/media/hero/scroll/'+name+'-mobile.webp'}/><img data-story-asset src={'/media/hero/scroll/'+name+'.webp'} width="1535" height="1025" alt=""/></picture>;
  return <div className="scroll-world" aria-hidden="true"><div className="scroll-camera"><div className="scroll-idle">{image('studio')}<div className="paper-motion">{image('paper')}</div>{image('foreground','story-foreground')}</div></div></div>;
}
export function ScrollStory({ hero, resume }: { hero: ReactNode; resume: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<Trigger | null>(null);
  const { ready, reduce } = useMotionPolicy();
  const [desktop, setDesktop] = useState(false);
  const [compact, setCompact] = useState(false);
  const eligible = ready && !reduce && desktop;
  const compactEnabled = ready && !reduce && compact;
  useCompactStory(root, compactEnabled);
  useEffect(() => {
    const mq = matchMedia('(min-width:1024px) and (min-height:700px)');
    const small = matchMedia('(max-width:1023px)');
    const sync = () => { setDesktop(mq.matches); setCompact(small.matches); };
    sync(); mq.addEventListener('change', sync); small.addEventListener('change', sync);
    return () => { mq.removeEventListener('change', sync); small.removeEventListener('change', sync); };
  }, []);
  useLayoutEffect(() => {
    if (!eligible || !root.current || !stage.current) return;
    const host = root.current, viewport = stage.current;
    let cancelled = false, dispose = () => {}, pending = 0;
    const captureReading = () => {
      const sections = [...document.querySelectorAll<HTMLElement>('[data-reading]')].filter(el => !el.inert && el.getAttribute('aria-hidden') !== 'true');
      const visibleHeadings = sections.map(el => el.querySelector<HTMLElement>('h2')).filter((el): el is HTMLElement => !!el && el.getBoundingClientRect().top >= 0 && el.getBoundingClientRect().top < innerHeight);
      const fallback = sections.find(el => el.getBoundingClientRect().top <= innerHeight * .65 && el.getBoundingClientRect().bottom > 0);
      const element = visibleHeadings[0] || fallback?.querySelector<HTMLElement>('h2');
      return element ? { element, top: element.getBoundingClientRect().top } : null;
    };
    async function start() {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const assets = [...host.querySelectorAll<HTMLImageElement>('[data-story-asset],.hero-photo img,.hero-anime img,[data-reveal-brush]')];
      try {
        await Promise.all([document.fonts.ready, ...assets.map(img => img.decode())]);
        if (cancelled || assets.length < 4) return;
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const heroElement = host.querySelector<HTMLElement>('.hero')!;
        const world = host.querySelector<HTMLElement>('.scroll-world')!;
        const camera = host.querySelector<HTMLElement>('.scroll-camera')!;
        const paper = host.querySelector<HTMLElement>('.paper-motion')!;
        const copy = [...host.querySelectorAll<HTMLElement>('.hero-copy,.hero-header,.hero-note,.hero-side,.hero-bottom,.reveal-control')];
        let timeline: gsap.core.Timeline;
        let paused = false;
        const emitPhase = createStoryPhaseEmitter(heroElement);
        function accessibility(p: number) {
          const focused = document.activeElement;
          const focusHero = !!focused && heroElement.contains(focused);
          heroElement.inert = p >= .94 && !focusHero;
          heroElement.setAttribute('aria-hidden', String(heroElement.inert));
          heroElement.style.zIndex = focusHero && p > .2 ? '5' : '1';
          for (const control of heroElement.querySelectorAll<HTMLElement>('a,button')) control.tabIndex = p > .2 ? -1 : 0;
          emitPhase(p);
          host.dataset.storyProgress = (p <= .002 ? 0 : p).toFixed(4);
        }
        function positionReveal() { const box=viewport.getBoundingClientRect(); const scale=Math.max(box.width/2400,box.height/1601); const dw=2400*scale,dh=1601*scale,ox=(box.width-dw)/2,oy=(box.height-dh)/2; for(const [key,value] of [['--auto-x',ox+dw*.68],['--auto-y',oy+dh*.44],['--auto-head-x',ox+dw*.695],['--auto-head-y',oy+dh*.23]] as const) heroElement.style.setProperty(key,value+'px'); }
        const context = gsap.context(() => {
          const h = heroElement.getBoundingClientRect().height;
          host.classList.add('story-enhanced'); viewport.style.height = Math.max(h, innerHeight) + 'px';
          positionReveal();
          gsap.set(heroElement, { '--scroll-size': '0px', '--scroll-head-size': '0px' });
          gsap.set(world, { autoAlpha: 0 });
          timeline = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: () => accessibility(timeline.progress()), scrollTrigger: {
            id: 'hery-opening', trigger: host, start: 'top top', end: () => '+=' + Math.round(innerHeight * 2.2),
            pin: false, scrub: .28, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 10,
            onRefresh: self => { host.dataset.storyStart = String(self.start); host.dataset.storyEnd = String(self.end); },
          }});
          timeline.to(heroElement, { '--scroll-size': () => (Math.max(innerWidth, innerHeight) * 3.6) + 'px', duration: .16 }, 0)
            .to(heroElement, { '--scroll-head-size': '440px', duration: .025 }, 0)
            .set(world, { autoAlpha: 1 }, .16)
            .set(heroElement.querySelector('.hero-scene'), { autoAlpha: 0 }, .16)
            .to(copy, { autoAlpha: 0, y: -26, stagger: .012, duration: .15 }, .16)
            .to(paper, { xPercent: -66, rotationY: -3, transformOrigin: '0% 50%', duration: .39 }, .27)
            .to(camera, { scale: 1.14, xPercent: -1.2, transformOrigin: '84% 27%', duration: .36 }, .42)
            .to({}, { duration: .22 }, .78);
          gsap.fromTo(host.querySelector('.story-reading-shade'), {opacity:0}, {opacity:1,ease:'none',scrollTrigger:{trigger:host,start:()=> 'top -'+Math.round(innerHeight*2.2),end:()=>'+='+Math.round(innerHeight*.7),scrub:true,invalidateOnRefresh:true}});
          trigger.current = timeline.scrollTrigger!;
          accessibility(timeline.progress());
        }, host);
        function navigate(hash: string, focus: boolean) {
          const id = decodeURIComponent(hash.slice(1));
          const target = document.getElementById(id === 'resume' || id === 'konten' ? 'riwayat' : id);
          if (!target) return;
          if (id !== 'tentang' && trigger.current) { timeline.progress(1); window.scrollTo(0, trigger.current.end + 1); ScrollTrigger.update(); }
          if (id === 'tentang' && trigger.current) { timeline.progress(0); window.scrollTo(0, trigger.current.start); ScrollTrigger.update(); }
          const workTrigger = id === 'karya' ? ScrollTrigger.getById('hery-works') : undefined;
          if (workTrigger?.pin) {
            // Direct navigation arrives at the reading hold, after the cover settles.
            window.scrollTo(0, workTrigger.start + (workTrigger.end - workTrigger.start) * .72);
            ScrollTrigger.update();
          }
          else if (id !== 'tentang') window.scrollTo(0, window.scrollY + target.getBoundingClientRect().top - (['resume', 'riwayat', 'konten'].includes(id) ? 0 : 96));
          accessibility(id === 'tentang' ? 0 : 1);
          if (focus) { const heading = target.querySelector<HTMLElement>('h1,h2') || target; heading.focus({ preventScroll: true }); }
        }
        function click(event: MouseEvent) {
          if (event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          const link = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
          if (!link) return;
          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || !document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
          event.preventDefault(); history.pushState(null, '', url.hash); navigate(url.hash, true);
        }
        const hash = () => { if(history.state?.heryProjectModal||history.state?.heryModalReturn)return;cancelAnimationFrame(pending); pending = requestAnimationFrame(() => navigate(location.hash, false)); };
        const focus = () => accessibility(timeline.progress());
        const visibility = () => { if (document.hidden) { timeline.scrollTrigger?.getTween()?.pause(); paused = true; } else { if (paused) { timeline.scrollTrigger?.getTween()?.play(); paused = false; } ScrollTrigger.refresh(); ScrollTrigger.update(); } };
        const show = () => { ScrollTrigger.refresh(); hash(); };
        const resize = () => { const reading = captureReading(); cancelAnimationFrame(pending); pending = requestAnimationFrame(() => { viewport.style.height = Math.max(innerWidth / 1.608, innerHeight) + 'px'; positionReveal(); ScrollTrigger.refresh(); if (reading?.element.isConnected) window.scrollBy(0, reading.element.getBoundingClientRect().top - reading.top); }); };
        document.addEventListener('click', click); document.addEventListener('focusin', focus); document.addEventListener('focusout', focus);
        document.addEventListener('visibilitychange', visibility); window.addEventListener('hashchange', hash); window.addEventListener('popstate', hash); window.addEventListener('pageshow', show); window.addEventListener('resize', resize);
        ScrollTrigger.refresh(); if (location.hash) navigate(location.hash, false);
        host.dataset.storyReady = 'true';
        dispose = () => {
          const anchor = captureReading();
          document.removeEventListener('click', click); document.removeEventListener('focusin', focus); document.removeEventListener('focusout', focus); document.removeEventListener('visibilitychange', visibility);
          window.removeEventListener('hashchange', hash); window.removeEventListener('popstate', hash); window.removeEventListener('pageshow', show); window.removeEventListener('resize', resize); cancelAnimationFrame(pending);
          context.revert(); trigger.current = null; host.classList.remove('story-enhanced'); viewport.style.height = ''; delete host.dataset.storyReady; delete host.dataset.storyProgress;
          heroElement.inert = false; heroElement.removeAttribute('aria-hidden'); heroElement.style.zIndex = '';
          heroElement.dispatchEvent(new CustomEvent('story-phase', { detail: { p: 0, phase: 'intro' } }));
          for (const control of heroElement.querySelectorAll<HTMLElement>('a,button')) control.removeAttribute('tabindex');
          if (anchor) requestAnimationFrame(() => { if(anchor.element.isConnected) window.scrollBy(0, anchor.element.getBoundingClientRect().top - anchor.top); });
        };
      } catch { host.dataset.storyFallback = 'asset-or-module'; }
    }
    void start();
    return () => { cancelled = true; dispose(); };
  }, [eligible]);
  return <Story.Provider value={eligible || compactEnabled}><div ref={root} className="scroll-story" data-story-mode={eligible ? 'desktop-candidate' : compactEnabled ? 'compact-candidate' : 'normal-flow'}><div ref={stage} className="story-stage">{hero}<div className="story-reading-shade" aria-hidden="true"/></div><div className="story-reading-distance" aria-hidden="true"/>{resume}</div></Story.Provider>;
}
