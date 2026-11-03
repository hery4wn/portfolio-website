import type { Metadata } from 'next';
import { ResumeContent } from '../../components/resume/ResumeContent';
import { getPublicPortfolio } from '../../lib/portfolio-content';
export const metadata: Metadata = { title: 'Résumé — Heryawan' };
export default function ResumePage() {
  const portfolio = getPublicPortfolio();
  return <main className="resume-page"><header className="resume-page-header" id="konten" tabIndex={-1}><a href="/#riwayat">Kembali ke portfolio</a><h1>Heryawan — Résumé</h1><p>Web development, eksperimen AI, dan proses belajar yang bisa dilihat lewat karya.</p></header><ResumeContent education={portfolio.education} experience={portfolio.experience} capabilities={portfolio.capabilities} standalone/></main>;
}
