import type { Education, Experience } from '../../content/types';
import { ExperienceList } from './ExperienceDialog';
import { ResumePhotoStage } from './ResumePhotoStage';
import { ResumeAlbum } from './ResumeAlbum';
import { ResumeStudioBackdrop } from '../story/SceneArtwork';

function StudyMark() {
  return <span className="resume-list-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="m3 9 9-5 9 5-9 5-9-5Zm4 3v5c3 2 7 2 10 0v-5M21 9v7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>;
}
export function ResumeTimeline({education,experience}:{education:Education[];experience:Experience[]}) {
  return <section id="riwayat" data-reading tabIndex={-1} className="quiet-resume quiet-chapter resume-studio" aria-labelledby="journey-title">
    <div className="resume-backdrop-track" aria-hidden="true"><div className="resume-backdrop-sticky"><ResumeStudioBackdrop/></div></div>
    <ResumePhotoStage><span id="resume" className="resume-anchor" tabIndex={-1}/><div id="konten" tabIndex={-1} className="resume-studio-content">
      <header className="resume-studio-heading"><h2 id="journey-title" tabIndex={-1}>Résumé</h2><p>Pendidikan, pengalaman, dan perjalanan belajar saya.</p></header>
      <section className="resume-studio-group" aria-labelledby="education-title"><h3 id="education-title">Pendidikan</h3><ol className="resume-studio-list">{education.map(item=><li key={item.id} data-resume-entry={item.id} tabIndex={0}><StudyMark/><div><p className="resume-list-period">{item.period}</p><h4>{item.institution}</h4><p>{item.program}</p>{item.note&&<p className="resume-list-note">{item.note}</p>}<ResumeAlbum id={item.id}/></div></li>)}</ol></section>
      <section className="resume-studio-group resume-studio-experience" aria-labelledby="experience-title"><h3 id="experience-title">Pengalaman</h3><ExperienceList entries={experience}/></section>
      <a className="quiet-text-link" href="/resume/">Résumé lengkap &amp; versi cetak <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></a>
    </div></ResumePhotoStage>
  </section>;
}
