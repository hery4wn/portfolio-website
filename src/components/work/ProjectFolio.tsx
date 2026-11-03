'use client';
import { useLayoutEffect, useRef, type RefObject } from 'react';
import type { Project } from '../../content/types';
import type { CaseStudy } from '../../content/case-types';
import { useMotionPolicy } from '../ui/MotionPolicy';
import { ProjectDetailCard } from './ProjectDetailCard';
import styles from './work-folio.module.css';

export function ProjectFolio({project,media,ready,imageRef,onError,onOpen,detail,detailOpen,onClose}:{project:Project;media:Project['media']|null;ready:boolean;imageRef:RefObject<HTMLImageElement|null>;onError:()=>void;onOpen:(source:HTMLElement)=>void;detail?:CaseStudy;detailOpen:boolean;onClose:()=>void}) {
  const surface=useRef<HTMLDivElement>(null),backing=useRef<HTMLDivElement>(null),previous=useRef(project.id+':preview');
  const {reduce}=useMotionPolicy();
  const portrait=!!media&&media.height>media.width;
  useLayoutEffect(()=>{
    const state=project.id+(detailOpen?':detail':':preview');
    const changed=previous.current!==state;previous.current=state;
    if(!changed||reduce||!surface.current?.animate)return;
    const sheet=surface.current;
    const compact=matchMedia('(max-width:1023px)').matches;
    const animations=[sheet.animate([
      {transform:compact?'translateY(12px)':'perspective(1200px) translateX(24px) rotateY(-7deg) rotate(1deg)',opacity:.55},
      {transform:'perspective(1200px) translateX(0) rotateY(0) rotate(0)',opacity:1},
    ],{duration:560,easing:'cubic-bezier(.16,1,.3,1)'}),
    ...(backing.current?.animate?[backing.current.animate([{transform:'translateX(10px) rotate(6deg)'},{transform:'translateX(0) rotate(2deg)'}],{duration:720,easing:'cubic-bezier(.16,1,.3,1)'})]:[]),
    ...Array.from(sheet.querySelectorAll(detailOpen?'[data-detail-intro]':'[data-folio-reveal]')).map((el,i)=>el.animate([
      {clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'},
    ],{duration:620,delay:i*65,easing:'cubic-bezier(.16,1,.3,1)'}))];
    return()=>animations.forEach(animation=>animation.cancel());
  },[project.id,detailOpen,reduce]);
  return <div className={styles.preview} id="project-preview" data-folio-entry>
    <div ref={backing} className={styles.backing} aria-hidden="true"/>
    <div ref={surface} className={styles.surface} data-panel-open={detailOpen}>
      <figure className={styles.figure} data-preview={project.id} aria-hidden={detailOpen||undefined} inert={detailOpen} style={detailOpen?{visibility:'hidden'}:undefined}>
        <div className={styles.artwork} data-format={portrait?'portrait':media?'landscape':'text'} data-artwork-project={project.id}>
          {media?<>
            <div className={styles.imageWell} data-folio-reveal><img ref={imageRef} key={media.src} src={media.src} width={media.width} height={media.height} alt={media.alt} loading="lazy" decoding="async" onError={onError}/></div>
            {!portrait&&<p className={styles.landscapeNote}>{project.id==='furia'?'Profil venue · Inisiatif portofolio':project.id==='personal-os'?'Dashboard terbaru · Proyek pribadi':'Antarmuka dari demo · Proyek kuliah'}</p>}
            {portrait&&<div className={styles.marginNote} data-folio-reveal><span className={styles.noteTitle}>{project.id==='sela'?'Belajar dari satu kata.':'Ruang untuk kebiasaan baik.'}</span><p>{project.context}</p><ul aria-label="Teknologi">{project.technologies.slice(0,3).map(tech=><li key={tech}>{tech}</li>)}</ul></div>}
          </>:<div className={styles.textCover} data-folio-reveal><span>{project.title}</span><p>{project.context}</p><small>Ringkasan proyek · Pratinjau visual belum tersedia</small></div>}
        </div>
        <figcaption className={styles.caption}>
          <div className={styles.captionTop}><span>{project.category==='website'?'Website':'Aplikasi'}</span><span>{media?'Pratinjau proyek':'Catatan proyek'}</span></div>
          <h4>{project.title}</h4><p>{project.summary}</p>
          <button id="preview-detail" className={styles.open} type="button" hidden={!ready} aria-controls="project-preview" aria-expanded={detailOpen} onClick={event=>onOpen(event.currentTarget)}>Jelajahi proyek<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg></button>
        </figcaption>
      </figure>
      {detailOpen&&<ProjectDetailCard project={project} study={detail} onClose={onClose}/>}
    </div>
    <p className={styles.previewNote} aria-live="polite" aria-atomic="true">{project.title}<span>Detail, proses &amp; demo yang tersedia</span></p>
  </div>;
}
