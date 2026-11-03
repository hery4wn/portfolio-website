export type Education = { id: string; institution: string; program: string; period: string; note: string };
export type Experience = { id: string; organization: string; role: string; summary: string; context: string; period?: string; kind: 'work' | 'contribution' };
export type Project = { id: string; title: string; summary: string; context: string; kind: 'project'; category: 'website' | 'application'; featured: boolean; technologies: string[]; media?: { src: string; alt: string; width: number; height: number }; detailHref?: string };
export type IndexItem = Project | Experience;
export type WorkCategory = { id: string; title: string; description: string; items: IndexItem[] };
export type Capability = { id: string; title: string; summary: string; evidence: { label: string; href: string }[] };
