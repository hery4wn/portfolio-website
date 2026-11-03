import { ScrollLayers } from './ScrollStory';
import { SocialMarks } from '../ui/SocialMarks';
import { HeroReveal } from './HeroReveal';
import { HeroAtmosphere } from './OpeningExperience';

export function StaticHero({ name, greeting, bio }: { name: string; greeting: string; bio: string }) {
  return <HeroReveal><ScrollLayers/>
    <HeroAtmosphere/>
    <header className="hero-header"><a className="brand" href="#tentang" aria-label="Heryawan — kembali ke perkenalan"><span>{name}</span><small>Web &amp; AI</small></a><SocialMarks/></header>
    <div className="hero-copy">
      <h1 id="hero-title" className="hero-title" tabIndex={-1}>{greeting}</h1>
      <p>{bio}</p>
      <a className="scroll-cue" href="#resume">Scroll untuk kenalan<svg aria-hidden="true" viewBox="0 0 24 44"><path d="M12 0v39M3 30l9 10 9-10"/></svg></a>
    </div>
    <p className="hero-note">Belajar. Membangun. Berbagi.<small>Catatan &amp; proyek pribadi</small></p>
    <p className="hero-side" aria-hidden="true">Portfolio — 2026</p>
    <p className="hero-bottom" aria-hidden="true">Rasa ingin tahu. Terus jalan.</p>
  </HeroReveal>;
}
