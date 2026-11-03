'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, type MouseEvent, type ReactNode } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
type Snapshot={v:1;slug:string;focusId:string;offset:number;selected:Record<string,string>};
let pending:{slug:string;depth:number}|null=null;
const ordinary=(event:MouseEvent<HTMLAnchorElement>)=>!event.defaultPrevented&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.altKey&&!event.shiftKey;
export function ProjectLink({slug,href,id,children,className}:{slug:string;href:string;id:string;children:ReactNode;className?:string}){
  const router=useRouter();
  return <Link href={href} id={id} className={className} prefetch={false} onFocus={event=>{router.prefetch(href);const category=event.currentTarget.closest('.index-category');if(category)window.dispatchEvent(new CustomEvent('work-restore',{detail:{[category.id]:slug}}))}} onPointerEnter={event=>{if(event.pointerType!=='mouse')return;router.prefetch(href);const category=event.currentTarget.closest('.index-category');if(category)window.dispatchEvent(new CustomEvent('work-restore',{detail:{[category.id]:slug}}))}} onClick={event=>{
    if(!ordinary(event))return;
    const selected:Record<string,string>={};
    document.querySelectorAll<HTMLElement>('.index-category').forEach(category=>{const cover=category.querySelector<HTMLElement>('[data-preview]');if(cover?.dataset.preview)selected[category.id]=cover.dataset.preview});
    const category=event.currentTarget.closest('.index-category');if(category)selected[category.id]=slug;
    const snapshot:Snapshot={v:1,slug,focusId:id,offset:event.currentTarget.getBoundingClientRect().top,selected};
    try{history.replaceState({...history.state,heryWorkReturn:snapshot},'',location.href)}catch{/* Normal link navigation remains available. */}
    pending={slug,depth:1};
  }}>{children}</Link>;
}
export function BackToWork({slug}:{slug:string}){
  useEffect(()=>{if(pending?.slug===slug){history.replaceState({...history.state,heryCaseReturn:{v:1,depth:pending.depth}},'',location.href);pending=null;document.querySelector<HTMLElement>('.case-header h1')?.focus({preventScroll:true})}},[slug]);
  return <a className="back-to-work" href="/#karya" onClick={event=>{const from=history.state?.heryCaseReturn;if(ordinary(event)&&from?.v===1&&Number.isInteger(from.depth)&&from.depth>0&&from.depth<=50){event.preventDefault();history.go(-from.depth)}}}>Kembali ke indeks karya <span aria-hidden="true">↗</span></a>;
}
export function NextCaseLink({slug,children}:{slug:string;children:ReactNode}){
  return <Link prefetch={false} href={'/karya/'+slug+'/'} onClick={event=>{const from=history.state?.heryCaseReturn;if(ordinary(event)&&from?.v===1&&from.depth<50)pending={slug,depth:from.depth+1}}}>{children}</Link>;
}
export function WorkRestoration(){
  const policy=useMotionPolicy();
  useEffect(()=>{
    if(!policy.ready)return;
    let cancelled=false,stopWaiting=()=>{};
    const abort=()=>{cancelled=true;stopWaiting()};
    const restore=async()=>{
      const snapshot=history.state?.heryWorkReturn as Snapshot|undefined;
      if(!snapshot||snapshot.v!==1||!snapshot.slug||!snapshot.focusId)return;
      await document.fonts.ready;await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
      if(cancelled)return;
      const host=document.querySelector<HTMLElement>('.scroll-story');
      if(host&&host.dataset.storyMode!=='normal-flow'&&!host.dataset.storyReady&&!host.dataset.storyFallback){
        await new Promise<void>(resolve=>{let timer:ReturnType<typeof setTimeout>;const observer=new MutationObserver(()=>{if(host.dataset.storyReady||host.dataset.storyFallback)finish()});function finish(){observer.disconnect();clearTimeout(timer);resolve()}stopWaiting=finish;observer.observe(host,{attributes:true});timer=setTimeout(finish,8000)});
      }
      const journey=document.querySelector<HTMLElement>('.journey-content');
      if(journey&&!journey.dataset.journeyReady){await new Promise<void>(resolve=>{let timer:ReturnType<typeof setTimeout>;const observer=new MutationObserver(()=>{if(journey.dataset.journeyReady)finish()});function finish(){observer.disconnect();clearTimeout(timer);resolve()}stopWaiting=finish;observer.observe(journey,{attributes:true});timer=setTimeout(finish,8000)})}
      if(cancelled)return;
      window.dispatchEvent(new CustomEvent('work-restore',{detail:snapshot.selected}));
      await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
      if(cancelled)return;
      const target=document.getElementById(snapshot.focusId)||document.getElementById('project-'+snapshot.slug);
      if(!target)return;
      const nav=document.querySelector('.section-nav')?.getBoundingClientRect().height||0;
      const offset=Math.max(nav+24,Math.min(Number.isFinite(snapshot.offset)?snapshot.offset:nav+24,innerHeight-64));
      window.scrollBy(0,target.getBoundingClientRect().top-offset);target.focus({preventScroll:true});
    };
    void restore();
    const show=()=>{cancelled=false;void restore()};
    window.addEventListener('pageshow',show);window.addEventListener('popstate',show);window.addEventListener('wheel',abort,{passive:true,once:true});window.addEventListener('pointerdown',abort,{passive:true,once:true});
    return()=>{cancelled=true;stopWaiting();window.removeEventListener('pageshow',show);window.removeEventListener('popstate',show);window.removeEventListener('wheel',abort);window.removeEventListener('pointerdown',abort)};
  },[policy.ready]);
  return null;
}
