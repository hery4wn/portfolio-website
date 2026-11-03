'use client';
import { useEffect, useRef, useState } from 'react';
import type { Project } from '../../content/types';
import type { CaseStudy } from '../../content/case-types';
import { MediaPlayer } from './MediaPlayer';
import styles from './work-folio.module.css';

/** An in-place reading panel: the project index stays available, without a backdrop. */
export function ProjectDetailCard({project,study,onClose}:{project:Project;study?:CaseStudy;onClose:()=>void}){
  const close=useRef<HTMLButtonElement>(null),body=useRef<HTMLDivElement>(null);
  const [variant,setVariant]=useState(0);
  const options=study?[{label:study.media.height>study.media.width?'Mobile':'Demo',media:study.media},...(study.additionalMedia||[])]:[];
  const media=options[variant]?.media||study?.media;
  useEffect(()=>{close.current?.focus({preventScroll:true})},[]);
  useEffect(()=>{setVariant(0);if(body.current)body.current.scrollTop=0;return()=>{body.current?.querySelectorAll('video').forEach(v=>v.pause())}},[project.id]);
  return <section id="project-detail" className={styles.detail} aria-labelledby="project-detail-title" data-detail={project.id}>
    <div className={styles.detailBar}><button ref={close} type="button" onClick={onClose}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h14" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>Kembali ke pratinjau</button><span>Detail proyek</span></div>
    <div ref={body} className={styles.detailBody} tabIndex={0} aria-label="Isi detail proyek, dapat digulir">
      <header data-detail-intro><h4 id="project-detail-title">{project.title}</h4><p>{study?.summary||project.summary}</p><ul className={styles.tools} aria-label="Teknologi">{project.technologies.map(t=><li key={t}>{t}</li>)}</ul></header>
      {media&&<div className={styles.detailVideo} data-detail-intro>{options.length>1&&<div className={styles.videoVariants} role="group" aria-label="Pilih versi demo">{options.map((option,i)=><button key={option.label} type="button" aria-pressed={variant===i} onClick={()=>setVariant(i)}>{option.label}</button>)}</div>}<MediaPlayer key={project.id+media.src} media={media} title={project.title} preload="metadata" posterOverlay/></div>}
      <details key={'context-'+project.id} className={styles.detailDisclosure} open><summary>Tentang proyek</summary><p>{study?.context||project.context}</p>{study&&<p>{study.problem}</p>}</details>
      {study&&<>
        <details key={'demo-'+project.id} className={styles.detailDisclosure}><summary>Yang terlihat di demo</summary><ol className={styles.demoTimeline}>{media?.description.map(d=><li key={d.time}><span>{d.time}</span><p>{d.text}</p></li>)}</ol></details>
        <details key={'process-'+project.id} className={styles.detailDisclosure}><summary>Proses &amp; kontribusi</summary><p>{study.role.summary}</p><ul>{study.role.contribution.map(c=><li key={c}>{c}</li>)}</ul>{study.decisions.map(d=><div key={d.title}><h5>{d.title}</h5><p>{d.body}</p></div>)}</details>
        <details key={'notes-'+project.id} className={styles.detailDisclosure}><summary>Catatan &amp; pembelajaran</summary><ul>{[...study.limitations,...study.learning].map(c=><li key={c}>{c}</li>)}</ul></details>
        {study.links.length>0&&<div className={styles.detailLinks}>{study.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></a>)}</div>}
      </>}
    </div>
    <p className={styles.detailHint}>Gulir untuk cerita &amp; catatan proyek<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg></p>
  </section>;
}
