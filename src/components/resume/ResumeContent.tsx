import type { Education, Experience, Capability } from '../../content/types';
import { ResumeAtmosphere } from './ResumeAtmosphere';
import { ResumeAlbum } from './ResumeAlbum';
import { ExperienceList } from './ExperienceDialog';
export function ResumeContent({ education, experience, capabilities, standalone = false }: { education: Education[]; experience: Experience[]; capabilities: Capability[]; standalone?: boolean }) {
  return <section id="riwayat" data-atmosphere={!standalone?true:undefined} data-reading tabIndex={-1} className={'resume-content reading-section'+(!standalone?' resume-immersive':'')} aria-labelledby="riwayat-title">{!standalone&&<ResumeAtmosphere/>}<div className="resume-content-inner">
    <header className="resume-heading"><h2 id="riwayat-title" tabIndex={-1} className={!standalone?'line-reveal':undefined}><span className="line-window"><span>Belajar di kelas.</span></span><span className="line-window"><span>Tumbuh lewat pengalaman.</span></span></h2><p>Saya Heryawan, lulusan Informatika yang membangun web dan bereksperimen dengan AI. Pendidikan, layanan pelanggan, dan proyek menjadi bagian dari proses belajar saya.</p>{!standalone && <a className="text-link" href="/resume/">Résumé versi baca &amp; cetak <span aria-hidden="true">↗</span></a>}</header>
    <div className="resume-columns"><div className="education-notes"><h3>Pendidikan</h3><ol className="education-list">{education.map(entry => <li key={entry.id}><p className="education-period">{entry.period}</p><h4>{entry.institution}</h4><p>{entry.program}</p>{entry.note && <p className="education-note">{entry.note}</p>}<ResumeAlbum id={entry.id}/></li>)}</ol></div>
      <div className="experience-notes"><h3>Pengalaman &amp; organisasi</h3><ExperienceList entries={experience}/></div></div>
    <div className="capabilities"><h3>Kemampuan dalam konteks</h3><p>Teknologi dan cara kerja yang saya gunakan dalam proyek serta pengalaman.</p><dl>{capabilities.map(item => <div key={item.id}><dt>{item.title}</dt><dd><p>{item.summary}</p><div className="evidence-links" aria-label={'Bukti '+item.title}>{item.evidence.map(link => <a key={link.href} href={standalone ? '/'+link.href : link.href}>{link.label}<span aria-hidden="true">↗</span></a>)}</div></dd></div>)}</dl></div>
  </div></section>;
}
