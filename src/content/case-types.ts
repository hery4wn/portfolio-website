export type CaseStudy = {
  slug: string; title: string; summary: string; context: string; problem: string;
  role: { title: string; summary: string; contribution: string[] };
  technologies: string[];
  decisions: { title: string; body: string }[];
  evidence: { title: string; body: string }[];
  results: string[]; limitations: string[]; learning: string[];
  media: { src: string; poster: string; width: number; height: number; duration: number; caption: string; description: { time: string; text: string }[] };
  additionalMedia?: {label:string;media:CaseStudy['media']}[];
  links: { label: string; href: string }[];
};
