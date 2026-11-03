'use client';
import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '../../content/case-types';
export function MediaPlayer({ media, title, preload='none',posterOverlay=false }: { media: CaseStudy['media']; title: string; preload?:'none'|'metadata';posterOverlay?:boolean }) {
  const video=useRef<HTMLVideoElement>(null);
  const launcher=useRef<HTMLButtonElement>(null);
  const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(false),[message,setMessage]=useState(''),[started,setStarted]=useState(false);
  useEffect(()=>{
    setReady(true);const element=video.current;if(!element)return;
    if(element.error)setError(true);
    const hide=()=>{if(document.hidden)element.pause()};
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)element.pause()});observer.observe(element);
    document.addEventListener('visibilitychange',hide);
    return()=>{element.pause();observer.disconnect();document.removeEventListener('visibilitychange',hide)};
  },[]);
  async function toggle(){const element=video.current;if(!element)return;if(!element.paused){element.pause();return}try{setMessage('');await element.play()}catch{setLoading(false);setMessage('Pemutaran belum dimulai. Gunakan kontrol video atau coba lagi.')}}
  return <figure className={'case-demo '+(media.height>media.width?'portrait':'landscape')}>
    <div className="video-frame" style={{aspectRatio:`${media.width}/${media.height}`}} aria-busy={loading}>
      <img className="video-backing" src={media.poster} width={media.width} height={media.height} alt="" aria-hidden="true" loading="lazy" style={posterOverlay&&!started?{zIndex:2,pointerEvents:'none'}:undefined}/>
      <video ref={video} src={media.src} controls playsInline muted preload={preload} poster={media.poster} width={media.width} height={media.height} tabIndex={posterOverlay&&!started?-1:0} aria-hidden={posterOverlay&&!started||undefined} aria-label={'Demo '+title} aria-describedby="demo-caption" style={error?{visibility:'hidden'}:undefined}
        onLoadStart={()=>{if(video.current&&!video.current.paused)setLoading(true)}} onLoadedData={()=>setLoading(false)} onCanPlay={()=>setLoading(false)} onWaiting={()=>{if(video.current&&!video.current.paused)setLoading(true)}} onPlay={()=>setPlaying(true)} onPlaying={()=>{const focusPlayer=document.activeElement===launcher.current;setStarted(true);setPlaying(true);setLoading(false);if(focusPlayer)requestAnimationFrame(()=>video.current?.focus({preventScroll:true}))}} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>{setError(true);setLoading(false);setPlaying(false)}}>
        Browser ini tidak mendukung video. Ringkasan isi demo tersedia di bawah.
      </video>
      {ready&&posterOverlay&&!started&&!error&&<button ref={launcher} className="video-launch" type="button" onClick={toggle} aria-label={'Putar demo '+title}><span><svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true"><path d="m9 5 11 7-11 7z" fill="currentColor"/></svg></span></button>}
    </div>
    {ready&&<div className="player-actions">{!error?(!posterOverlay&&<button type="button" onClick={toggle}>{playing?'Jeda demo':'Putar demo'}</button>):<button type="button" onClick={()=>{setError(false);setMessage('');video.current?.load()}}>Coba muat ulang demo</button>}<p role="status">{error?'Demo belum bisa diputar. Poster dan ringkasan tetap tersedia.':loading?'Memuat demo…':message}</p></div>}
    <figcaption id="demo-caption">{media.caption}</figcaption>
  </figure>;
}
