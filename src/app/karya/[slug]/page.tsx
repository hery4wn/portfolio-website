import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedCases, getPublicCase } from '../../../lib/case-content';
import { MediaPlayer } from '../../../components/work/MediaPlayer';
import { BackToWork, NextCaseLink } from '../../../components/work/WorkNavigation';
import { SharedCover } from '../../../components/story/SharedCover';
export const dynamicParams=false;
export function generateStaticParams(){return getPublishedCases().map(c=>({slug:c.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const item=getPublicCase((await params).slug);return item?{title:item.title+' — Heryawan',description:item.summary}:{title:'Karya tidak ditemukan'}}
export default async function CasePage({params}:{params:Promise<{slug:string}>}){
  const item=getPublicCase((await params).slug);if(!item)notFound();
  const cases=getPublishedCases(),next=cases[(cases.findIndex(c=>c.slug===item.slug)+1)%cases.length];
  return <main className="case-page" id="konten" tabIndex={-1}>
    <nav className="case-top" aria-label="Navigasi studi kasus"><BackToWork slug={item.slug}/><a href="/#tentang">Heryawan</a></nav>
    <article><header className="case-header"><div><h1 tabIndex={-1}>{item.title}</h1><p className="case-lede">{item.summary}</p><p className="case-type">{item.role.title}</p><p className="case-tools">{item.technologies.join(' · ')}</p><a className="text-link" href="#demo">Lihat demo <span aria-hidden="true">↓</span></a></div><SharedCover slug={item.slug}><figure className="case-cover"><img src={item.media.poster} width={item.media.width} height={item.media.height} alt={'Cuplikan showcase '+item.title} fetchPriority="high"/><figcaption>Cuplikan dari showcase proyek.</figcaption></figure></SharedCover></header>
    <div className="case-body"><nav className="case-contents" aria-label="Isi studi kasus"><a href="#konteks">Konteks</a><a href="#peran">Peran</a><a href="#keputusan">Keputusan</a><a href="#demo">Demo &amp; bukti</a><a href="#hasil">Hasil</a><a href="#catatan">Catatan</a></nav><div className="case-reading">
      <section id="konteks" aria-labelledby="context-title"><h2 id="context-title" tabIndex={-1}>Konteks proyek</h2><p>{item.context}</p><h3>Masalah yang didekati</h3><p>{item.problem}</p></section>
      <section id="peran" aria-labelledby="role-title"><h2 id="role-title" tabIndex={-1}>Peran &amp; kontribusi</h2><p>{item.role.summary}</p><ul>{item.role.contribution.map(text=><li key={text}>{text}</li>)}</ul></section>
      <section id="keputusan" aria-labelledby="decisions-title"><h2 id="decisions-title" tabIndex={-1}>Keputusan dalam implementasi</h2><div className="case-decisions">{item.decisions.map(d=><div key={d.title}><h3>{d.title}</h3><p>{d.body}</p></div>)}</div></section>
      <section id="demo" aria-labelledby="demo-title"><h2 id="demo-title" tabIndex={-1}>Demo &amp; bukti</h2><MediaPlayer media={item.media} title={item.title}/><details className="demo-description"><summary>Ringkasan visual demo</summary><ol>{item.media.description.map(d=><li key={d.time}><span>{d.time}</span><p>{d.text}</p></li>)}</ol></details><div className="case-evidence">{item.evidence.map(e=><div key={e.title}><h3>{e.title}</h3><p>{e.body}</p></div>)}</div></section>
      <section id="hasil" aria-labelledby="results-title"><h2 id="results-title" tabIndex={-1}>Hasil yang dapat ditunjukkan</h2><ul>{item.results.map(text=><li key={text}>{text}</li>)}</ul></section>
      <section id="catatan" aria-labelledby="notes-title"><h2 id="notes-title" tabIndex={-1}>Batas &amp; pembelajaran</h2><ul>{item.limitations.map(text=><li key={text}>{text}</li>)}</ul><h3>Yang saya pelajari</h3><ul>{item.learning.map(text=><li key={text}>{text}</li>)}</ul></section>
      {item.links.length>0&&<section aria-labelledby="links-title"><h2 id="links-title">Telusuri proyek</h2>{item.links.map(link=><a className="text-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}</section>}
      <footer className="case-footer"><BackToWork slug={item.slug}/><NextCaseLink slug={next.slug}>Karya berikutnya: {next.title}<span aria-hidden="true">↗</span></NextCaseLink></footer>
    </div></div></article>
  </main>;
}
