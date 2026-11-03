'use client';
import { useEffect, useRef } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
export function ResumeAtmosphere(){
  const root=useRef<HTMLDivElement>(null),{ready,reduce}=useMotionPolicy();
  useEffect(()=>{
    const layer=root.current,section=layer?.closest<HTMLElement>('[data-atmosphere]');if(!layer||!section||!ready||section.closest('.journey-content'))return;
    if(reduce){layer.style.transform='none';return}
    let frame=0;
    const draw=()=>{frame=0;const box=section.getBoundingClientRect();if(box.bottom<0||box.top>innerHeight)return;const progress=Math.min(1,Math.max(0,(innerHeight-box.top)/(box.height+innerHeight)));const amount=innerWidth<=1023?2:4;layer.style.transform=`translate3d(${(progress-.5)*amount}%,${(progress-.5)*3}%,0) scale(${1+progress*.035})`;layer.dataset.progress=progress.toFixed(3)};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw)};draw();
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);layer.style.transform='none'};
  },[ready,reduce]);
  return <div className="resume-atmosphere" aria-hidden="true"><div className="resume-window"><div ref={root} className="resume-illustration"><picture><source media="(max-width:760px)" srcSet="/media/story-r3/desk-mobile.webp"/><img src="/media/story-r3/desk.webp" alt="" width="1600" height="1000" loading="lazy"/></picture></div><div className="resume-shade"/></div></div>;
}
