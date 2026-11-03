'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { resumeAlbums } from '../../content/resume-photos';
import styles from './resume-album.module.css';

export function AlbumViewer({ id, presentation = 'default' }: {id: string; presentation?: 'default' | 'studio'}) {
  const album = resumeAlbums[id];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  if (!album) return null;
  const active = album.photos[index];
  const change = (next: number) => {setIndex(next); setFailed(false);};
  const arrow = (next: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{transform:next ? undefined : 'rotate(180deg)'}}><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>;
  return <div className={`${styles.viewer} ${presentation === 'studio' ? styles.studioViewer : ''}`}>
    <figure className={styles.figure}>
      <div className={styles.image}>{failed ? <p>Foto belum dapat dimuat. <a href={active.src}>Buka file foto</a></p> : <img key={active.src} src={active.src} alt={active.alt} onError={() => setFailed(true)} decoding="async"/>}</div>
      <figcaption aria-live="polite">{active.caption}</figcaption>
    </figure>
    {album.photos.length > 1 && <div className={styles.controls}>
      <button type="button" aria-label="Foto sebelumnya" onClick={() => change((index - 1 + album.photos.length) % album.photos.length)}>{presentation === 'studio' ? arrow(false) : 'Sebelumnya'}</button>
      <span aria-live="polite">{index + 1} / {album.photos.length}</span>
      <button type="button" aria-label="Foto berikutnya" onClick={() => change((index + 1) % album.photos.length)}>{presentation === 'studio' ? arrow(true) : 'Berikutnya'}</button>
    </div>}
  </div>;
}

export function AlbumPreview({ id }: {id: string}) {
  const album = resumeAlbums[id];
  if (!album) return null;
  return <span className={styles.preview} data-album-preview>
    <span className={styles.contactSheet}>{album.photos.slice(0, 2).map(photo => <img key={photo.src} src={photo.src} width="128" height="90" alt="" loading="lazy" decoding="async"/>)}</span>
    <span>Lihat {album.photos.length} foto <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></span>
  </span>;
}

export function ResumeAlbum({ id }: {id: string}) {
  const album = resumeAlbums[id];
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useId();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  if (!album) return null;
  return <>
    <button ref={trigger} type="button" className={styles.trigger} data-album-trigger aria-haspopup="dialog" aria-label={`Lihat foto: ${album.title}`} onClick={() => setOpen(true)}><AlbumPreview id={id}/></button>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={title} onClose={() => {setOpen(false);trigger.current?.focus({preventScroll:true});}} onClick={event => {
      if(event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.current?.close();
    }}>
      <div className={styles.bar}><h2 id={title}>{album.title}</h2><button type="button" autoFocus onClick={() => dialog.current?.close()}>Tutup <span aria-hidden="true">×</span></button></div>
      {open && <AlbumViewer key={id} id={id}/>}
    </dialog>
  </>;
}
