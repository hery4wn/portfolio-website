import 'server-only';
import { caseRecords } from '../content/cases';
import type { CaseStudy } from '../content/case-types';
export function getPublishedCases(): CaseStudy[] {
  return caseRecords.filter(r => r.status === 'published').map(({data:d}) => ({
    slug:d.slug,title:d.title,summary:d.summary,context:d.context,problem:d.problem,
    role:{title:d.role.title,summary:d.role.summary,contribution:[...d.role.contribution]}, technologies:[...d.technologies],
    decisions:d.decisions.map(x=>({title:x.title,body:x.body})),evidence:d.evidence.map(x=>({title:x.title,body:x.body})),
    results:[...d.results],limitations:[...d.limitations],learning:[...d.learning],
    media:{src:d.media.src,poster:d.media.poster,width:d.media.width,height:d.media.height,duration:d.media.duration,caption:d.media.caption,description:d.media.description.map(x=>({time:x.time,text:x.text}))},
    ...(d.additionalMedia?{additionalMedia:d.additionalMedia.map(({label,media:m})=>({label,media:{src:m.src,poster:m.poster,width:m.width,height:m.height,duration:m.duration,caption:m.caption,description:m.description.map(x=>({time:x.time,text:x.text}))}}))}:{}),
    links:d.links.map(x=>({label:x.label,href:x.href})),
  }));
}
export function getPublicCase(slug:string) { return getPublishedCases().find(c=>c.slug===slug); }
