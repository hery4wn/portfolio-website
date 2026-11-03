'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { AlbumPreview, AlbumViewer } from './ResumeAlbum';
import styles from './resume-album.module.css';
import type { Experience } from '../../content/types';

export function useExperienceDialog() {
  const [entry, setEntry] = useState<Experience | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const titleId = useId();
  useEffect(() => {
    if (!entry || !dialog.current) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => { document.body.style.overflow = previous; if (element.open) element.close(); };
  }, [entry]);
  function open(value: Experience, source: HTMLElement) { trigger.current = source; setEntry(value); }
  function close() { dialog.current?.close(); }
  const modal = <dialog className={`experience-dialog ${styles.experience}`} ref={dialog} aria-labelledby={titleId} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls.at(-1);
    if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
  }} onClose={() => { setEntry(null); if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true }); }} onClick={event => { if (event.target !== event.currentTarget) return; const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(); }}>
    {entry && <><button type="button" className="dialog-close" onClick={close} autoFocus>Tutup <span aria-hidden="true">×</span></button><h2 id={titleId}>{entry.organization}</h2><p className="experience-role">{entry.role}</p>{entry.period && <p>{entry.period}</p>}<AlbumViewer key={entry.id} id={entry.id}/><p>{entry.summary}</p><p>{entry.context}</p></>}
  </dialog>;
  return { open, modal };
}

export function ExperienceList({ entries }: { entries: Experience[] }) {
  const [ready, setReady] = useState(false);
  const { open, modal } = useExperienceDialog();
  useEffect(() => setReady(true), []);
  return <><div className="experience-list">{entries.map(entry => <details key={entry.id} className="experience-entry" data-resume-entry={entry.id}>
    <summary id={'experience-'+entry.id} aria-haspopup={ready ? 'dialog' : undefined} onClick={event => { if (ready) { event.preventDefault(); open(entry, event.currentTarget); } }}><span className="experience-title">{entry.organization}</span><span>{entry.role}</span>{entry.period && <span className="experience-period">{entry.period}</span>}<AlbumPreview id={entry.id}/><span className="entry-action">Baca pengalaman <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M10 3v14M3 10h14" fill="none" stroke="currentColor" strokeWidth="1.25"/></svg></span></summary>
    <p>{entry.summary}</p><p>{entry.context}</p><noscript><p>Dokumentasi foto tersedia saat JavaScript diaktifkan.</p></noscript>
  </details>)}</div>{modal}</>;
}
