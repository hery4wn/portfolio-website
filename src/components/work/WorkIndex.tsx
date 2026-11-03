'use client';
import { useEffect, useRef, useState } from 'react';
import type { Project, WorkCategory } from '../../content/types';
import type { CaseStudy } from '../../content/case-types';
import { ParallaxComponent } from '../ui/parallax-scrolling';
import { ProjectFolio } from './ProjectFolio';
import { StudioCompanions } from './StudioCompanions';
import { useMotionPolicy } from '../ui/MotionPolicy';
import styles from './work-folio.module.css';

type ReturnPoint={y:number;focusId:string};
export function WorkIndex({categories,cases}:{categories:WorkCategory[];cases:CaseStudy[]}) {
  const {reduce}=useMotionPolicy();
  const projects=categories.flatMap(c=>c.items.filter((p):p is Project=>p.kind==='project')).sort((a,b)=>Number(b.featured)-Number(a.featured));
  const first=projects.find(p=>p.id==='furia')||projects[0];
  const [selected,setSelected]=useState(first),[opened,setOpened]=useState<Project|null>(null),[ready,setReady]=useState(false),[failed,setFailed]=useState<string[]>([]);
  const root=useRef<HTMLElement>(null),image=useRef<HTMLImageElement>(null),origin=useRef<ReturnPoint|null>(null),panelOpen=useRef(false),frame=useRef(0);
  function restore(point:ReturnPoint|null){
    cancelAnimationFrame(frame.current);
    frame.current=requestAnimationFrame(()=>{const button=document.getElementById(point?.focusId||'preview-detail');if(point&&point.y>=0)scrollTo(0,point.y);button?.focus({preventScroll:true})});
  }
  useEffect(()=>{
    setReady(true);
    for(const project of projects.filter(p=>p.media).slice(0,3)){const img=new Image();img.src=project.media!.src;void img.decode().catch(()=>{})}
    const initial=location.hash.startsWith('#detail-');
    const sync=()=>{
      const project=projects.find(p=>location.hash==='#detail-'+p.id);
      if(project){setSelected(project);setOpened(project);panelOpen.current=true}
      else if(panelOpen.current){panelOpen.current=false;setOpened(null);const point=origin.current;origin.current=null;restore(point)}
    };
    const select=(event:Event)=>{const values=Object.values((event as CustomEvent<Record<string,string>>).detail||{}),project=projects.find(p=>values.includes(p.id));if(project)setSelected(project)};
    sync();window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);window.addEventListener('work-restore',select);
    if(initial){const deadline=performance.now()+8000;const reveal=()=>{const journey=root.current?.closest<HTMLElement>('.journey-content');if(journey&&!journey.dataset.journeyReady&&performance.now()<deadline){frame.current=requestAnimationFrame(reveal);return}document.getElementById('project-preview')?.scrollIntoView({block:'start'});};frame.current=requestAnimationFrame(reveal)}
    return()=>{cancelAnimationFrame(frame.current);window.removeEventListener('popstate',sync);window.removeEventListener('hashchange',sync);window.removeEventListener('work-restore',select)};
    // Public records are constant for this mounted index.
  },[]);
  useEffect(()=>{const img=image.current;if(selected&&img?.complete&&!img.naturalWidth)setFailed(p=>p.includes(selected.id)?p:[...p,selected.id])},[selected]);
  if(!first)return null;
  function select(project:Project, source:HTMLButtonElement){
    setSelected(project);
    if(matchMedia('(max-width:1023px)').matches){
      const strip=source.parentElement;
      if(strip)strip.scrollTo({left:source.offsetLeft-strip.offsetLeft-(strip.clientWidth-source.offsetWidth)/2,behavior:reduce?'instant':'smooth'});
    }
    if(panelOpen.current){setOpened(project);history.replaceState({...history.state},'','#detail-'+project.id)}
  }
  function open(project:Project,source:HTMLElement){
    origin.current={y:scrollY,focusId:source.id};panelOpen.current=true;setOpened(project);
    try{history.pushState({...history.state,heryProjectPanel:true},'','#detail-'+project.id)}catch{/* The local panel still works without history. */}
    requestAnimationFrame(()=>{const preview=document.getElementById('project-preview'),top=preview?.getBoundingClientRect().top;if(preview&&top!==undefined&&(top<70||top>innerHeight*.6))preview.scrollIntoView({block:'start',behavior:reduce?'instant':'smooth'})});
  }
  function close(){
    if(history.state?.heryProjectPanel&&location.hash.startsWith('#detail-')){history.back();return}
    panelOpen.current=false;setOpened(null);history.replaceState({...history.state,heryProjectPanel:undefined},'','#pilihan-karya');const point=origin.current;origin.current=null;restore(point);
  }
  const media=selected.media&&!failed.includes(selected.id)?selected.media:null;
  return <section ref={root} id="karya" data-reading tabIndex={-1} className="quiet-work quiet-chapter" aria-labelledby="work-title" onKeyDown={event=>{if(event.key==='Escape'&&opened&&!document.fullscreenElement){event.preventDefault();close()}}}>
    <ParallaxComponent/>
    <div className={`${styles.stage} quiet-work-stage`} id="pilihan-karya" tabIndex={-1}>
      <header className={styles.heading}><h3>Karya pilihan.</h3><p>Website, aplikasi, dan eksperimen.<br/>{' '}Berangkat dari kebutuhan nyata.</p></header>
      <div className={`${styles.folio} work-exhibit`}>
        <div className={styles.indexColumn}>
          <p className={styles.indexGuide}><span>{projects.length} proyek</span><span>Geser untuk memilih</span></p>
          <div className={styles.index} role="group" aria-label="Pilih proyek">
            {projects.map(project=><button id={`project-${project.id}`} key={project.id} type="button" className={styles.choice} disabled={!ready} aria-pressed={selected.id===project.id} aria-controls="project-preview" onClick={event=>select(project,event.currentTarget)}>
              <span className={styles.choiceText}><span>{project.title}</span><small>{project.category==='website'?'Website':'Aplikasi'}</small></span>
              <svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>
            </button>)}
          </div>
          <StudioCompanions selected={selected.id}/>
        </div>
        <ProjectFolio project={selected} media={media} ready={ready} imageRef={image} onError={()=>setFailed(p=>p.includes(selected.id)?p:[...p,selected.id])} onOpen={source=>open(selected,source)} detail={opened?cases.find(c=>c.slug===opened.id):undefined} detailOpen={!!opened} onClose={close}/>
      </div>
    </div>
  </section>;
}
