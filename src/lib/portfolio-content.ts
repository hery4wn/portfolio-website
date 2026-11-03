import 'server-only';
import { getPublishedCases } from './case-content';
import { educationRecords, experienceRecords, projectRecords, capabilityRecords } from '../content/portfolio';
import type { WorkCategory, Project } from '../content/types';

export function projectDetailPath(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid project slug');
  return `/karya/${slug}/`;
}

export function getPublicPortfolio() {
  const education = educationRecords.filter(r => r.status === 'published').map(({ data: d }) => ({ id: d.id, institution: d.institution, program: d.program, period: d.period, note: d.note }));
  const experience = experienceRecords.filter(r => r.status === 'published').map(({ data: d }) => ({ id: d.id, organization: d.organization, role: d.role, summary: d.summary, context: d.context, ...(d.period ? {period: d.period} : {}), kind: d.kind }));
  const detailed = new Set(getPublishedCases().map(c => c.slug));
  const projects: Project[] = projectRecords.filter(r => r.status === 'published').map(({ data: d }) => ({ id: d.id, title: d.title, summary: d.summary, context: d.context, kind: d.kind, category: d.category, featured: d.featured, technologies: [...d.technologies], ...(d.media ? { media: { src: d.media.src, alt: d.media.alt, width: d.media.width, height: d.media.height } } : {}), ...(detailed.has(d.id) ? { detailHref: projectDetailPath(d.id) } : {}) }));
  const evidenceIds = new Set([...projects.map(p => '#project-'+p.id), ...experience.map(e => '#experience-'+e.id)]);
  const capabilities = capabilityRecords.filter(r => r.status === 'published').map(({ data: d }) => ({ id: d.id, title: d.title, summary: d.summary, evidence: d.evidence.filter(e => evidenceIds.has(e.href)).map(e => ({ label: e.label, href: e.href })) })).filter(c => c.evidence.length > 0);
  const categories: WorkCategory[] = [
    { id: 'website', title: 'Website', description: 'Situs profil dan eksplorasi web dari kebutuhan nyata hingga proyek kuliah.', items: projects.filter(p => p.category === 'website') },
    { id: 'application', title: 'Aplikasi', description: 'Alat untuk kebiasaan, kosakata, dan aktivitas sehari-hari.', items: projects.filter(p => p.category === 'application') },
    { id: 'work', title: 'Pengalaman Kerja', description: 'Pengalaman layanan pelanggan di luar pengembangan software.', items: experience.filter(e => e.kind === 'work') },
    { id: 'contribution', title: 'Kontribusi', description: 'Tanggung jawab publikasi, dokumentasi, dan desain dalam kegiatan bersama.', items: experience.filter(e => e.kind === 'contribution') },
  ].filter(c => c.items.length > 0);
  return { education, experience, capabilities, categories };
}
