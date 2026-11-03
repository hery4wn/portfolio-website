'use client';
import { useEffect, useRef } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';
import styles from './work-folio.module.css';

export function StudioCompanions({selected,variant='work'}:{selected:string;variant?:'work'|'resume'}){
  const host=useRef<HTMLDivElement>(null),previous=useRef(selected),motions=useRef<Animation[]>([]);
  const {reduce}=useMotionPolicy();
  function stop(){motions.current.forEach(a=>a.cancel());motions.current=[]}
  function wave(){
    stop();if(reduce||document.hidden||!host.current||host.current.getBoundingClientRect().bottom<0||host.current.getBoundingClientRect().top>innerHeight)return;
    motions.current=Array.from(host.current.querySelectorAll('img')).flatMap((el,i)=>el.animate?[el.animate([
      {transform:'translateY(0) rotate(0)'},{transform:`translateY(-${i?9:16}px) rotate(${i?7:-8}deg)`,offset:.4},{transform:'translateY(0) rotate(3deg)',offset:.75},{transform:'translateY(0) rotate(0)'},
    ],{duration:800,delay:i*90,easing:'cubic-bezier(.16,1,.3,1)'})]:[]);
  }
  useEffect(()=>{if(previous.current!==selected)wave();previous.current=selected;return stop},[selected,reduce]);
  useEffect(()=>{
    const hide=()=>{if(document.hidden)stop()};let greeted=false;
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)stop();else if(!greeted){greeted=true;wave()}});
    if(host.current)observer.observe(host.current);document.addEventListener('visibilitychange',hide);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);stop()};
  },[reduce]);
  return <div ref={host} className={variant==='resume'?styles.resumeCompanions:styles.companions} onPointerEnter={wave} aria-hidden="true">
    {variant==='resume'?<><img src="/media/mascot/dots.webp" width="100" height="120" loading="lazy" alt=""/><img src="/media/mascot/grok-bot.webp" width="92" height="120" loading="lazy" alt=""/><img src="/media/mascot/muse.webp" width="85" height="120" loading="lazy" alt=""/></>:<><img src="/media/mascot/blue-beret.webp" width="145" height="105" loading="lazy" alt=""/><img src="/media/mascot/orange-bot.webp" width="175" height="155" loading="lazy" alt=""/></>}
  </div>;
}
