import { PortfolioClosing } from '../components/resume/PortfolioClosing';
import { ScrollStory } from '../components/hero/ScrollStory';
import { StaticHero } from '../components/hero/StaticHero';
import { SectionNav } from '../components/ui/SectionNav';
import { ResumeTimeline } from '../components/resume/ResumeTimeline';
import { WorkRestoration } from '../components/work/WorkNavigation';
import { WorkIndex } from '../components/work/WorkIndex';
import { getPublicProfile } from '../lib/public-content';
import { getPublicPortfolio } from '../lib/portfolio-content';
import { getPublishedCases } from '../lib/case-content';
import { AboutHery } from '../components/resume/AboutHery';
import { JourneyMotion } from '../components/story/JourneyMotion';
import { OpeningExperience } from '../components/hero/OpeningExperience';
export default function Home() {
  const profile = getPublicProfile();
  const portfolio = getPublicPortfolio();
  return <><OpeningExperience/><main><JourneyMotion><ScrollStory hero={<StaticHero {...profile}/>} resume={<><SectionNav/><ResumeTimeline education={portfolio.education} experience={portfolio.experience}/><WorkIndex categories={portfolio.categories} cases={getPublishedCases()}/><WorkRestoration/></>}/>
    <AboutHery bio={profile.bio} process={profile.process}/>
    <PortfolioClosing/>
    </JourneyMotion>
  </main></>;
}
