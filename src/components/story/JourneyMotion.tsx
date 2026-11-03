'use client';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';

const revealTargets = [
  '.resume-studio-heading > *',
  '.resume-studio-group > h3',
  '[data-resume-entry]',
  '.resume-studio-content > a',
  '.work-transition-title > *',
  '#pilihan-karya header > *',
  '#pilihan-karya [aria-controls="project-preview"][id^="project-"]',
  '#tentang-saya header > *',
  '#tentang-saya details',
  '[data-scroll-reveal]',
].join(',');

/** Chapter motion enhances the existing native scroll layout. */
export function JourneyMotion({children}:{children:ReactNode}) {
  const root=useRef<HTMLDivElement>(null),{ready,reduce}=useMotionPolicy();
  useLayoutEffect(() => {
    const host = root.current;
    if (!host || !ready || reduce || !('IntersectionObserver' in window)) return;
    const running = new Map<Element, Animation>();
    const observer = new IntersectionObserver(entries => {
      let order = 0;
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (target.contains(document.activeElement)) continue;

        const heading = /^H[2-4]$/.test(target.tagName);
        const compact = matchMedia('(max-width:1023px)').matches;
        const animation = target.animate([
          { clipPath: heading ? 'inset(0 100% 0 0)' : compact ? 'inset(0)' : 'inset(85% 0 0 0)', translate: compact ? '0 12px' : heading ? '-14px 10px' : '0 18px' },
          { clipPath: 'inset(0 0 0 0)', translate: '0 0' },
        ], { duration: heading ? 1400 : compact ? 900 : 1150, delay: Math.min(order++ * (compact ? 60 : 90), compact ? 120 : 270), easing: 'cubic-bezier(.33,.7,.3,1)', fill: 'backwards' });
        running.set(target, animation);
        animation.onfinish = () => running.delete(target);
      }
    }, { rootMargin: '0px 0px 24px 0px', threshold: 0 });
    host.querySelectorAll(revealTargets).forEach(element => {
      // Long photo/timeline entries must remain readable while a finger scrolls.
      if (matchMedia('(max-width:1023px)').matches && element.matches('[data-resume-entry]')) {
        element.querySelectorAll('h4,.experience-title').forEach(title => observer.observe(title));
      } else observer.observe(element);
    });

    const exposeFocused = (event: FocusEvent) => {
      for (const [element, animation] of running) {
        if (event.target instanceof Node && element.contains(event.target)) {
          animation.cancel();
          running.delete(element);
        }
      }
    };
    host.addEventListener('focusin', exposeFocused);
    return () => {
      observer.disconnect();
      host.removeEventListener('focusin', exposeFocused);
      running.forEach(animation => animation.cancel());
    };
  }, [ready, reduce]);
  useLayoutEffect(()=>{
    if(!root.current||!ready)return;const host=root.current;
    if(reduce){host.dataset.journeyReady='true';return()=>{delete host.dataset.journeyReady}};
    let cancelled=false,dispose=()=>{},cancelWait=()=>{};
    async function start(){
      await document.fonts.ready;
      const opening=document.querySelector<HTMLElement>('.scroll-story');
      if(opening&&opening.dataset.storyMode!=='normal-flow'&&!opening.dataset.storyReady&&!opening.dataset.storyFallback){
        await new Promise<void>(resolve=>{
          let timer:ReturnType<typeof setTimeout>;
          const observer=new MutationObserver(()=>{if(opening.dataset.storyReady||opening.dataset.storyFallback||opening.dataset.storyMode==='normal-flow')finish()});
          function finish(){observer.disconnect();clearTimeout(timer);resolve()}
          cancelWait=finish;observer.observe(opening,{attributes:true});timer=setTimeout(finish,8000);
        });
      }
      const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
      if(cancelled)return;gsap.registerPlugin(ScrollTrigger);
      const media=gsap.matchMedia();
      media.add({compact:'(max-width:1023px)',wide:'(min-width:1024px)'},(context)=>{
        // Only the incoming folio moves; the project index remains steady to read.
        const compact=!!context.conditions?.compact;
        gsap.fromTo('[data-folio-entry]',{x:compact?0:65,y:compact?16:35,rotation:compact?0:3},{x:0,y:0,rotation:0,ease:'none',scrollTrigger:{trigger:compact?'[data-folio-entry]':'.work-exhibit',start:'top bottom',end:compact?'top 78%':'top 58%',scrub:.35}});
        // The photo settles before reading; only the architectural light keeps drifting.
        gsap.fromTo('[data-personal-entry]',{y:compact?16:90,rotation:compact?0:-4},{y:0,rotation:0,ease:'none',scrollTrigger:{trigger:'[data-personal-entry]',start:'top bottom',end:compact?'top 75%':'top 35%',scrub:.45}});
        gsap.fromTo('[data-personal-light]',{y:compact?-12:-55},{y:compact?12:55,ease:'none',scrollTrigger:{trigger:'#tentang-saya',start:'top bottom',end:'bottom top',scrub:.6}});
        gsap.fromTo('[data-personal-ribbon]',{y:compact?20:60},{y:compact?-20:-60,ease:'none',scrollTrigger:{trigger:'#tentang-saya',start:'top bottom',end:'bottom top',scrub:.6}});
      },host);
      host.dataset.journeyReady='true';window.dispatchEvent(new Event('journey-ready'));ScrollTrigger.refresh();
      dispose=()=>{media.revert();delete host.dataset.journeyReady};
    }
    void start().catch(()=>{if(!cancelled)host.dataset.journeyReady='true'});
    return()=>{cancelled=true;cancelWait();dispose()};
  },[ready,reduce]);
  return <div ref={root} className="journey-content">{children}</div>;
}
