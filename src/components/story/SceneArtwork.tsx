export function SceneImage({ scene, className = '', eager = false }: { scene: 'desk' | 'studio'; className?: string; eager?: boolean }) {
  return <picture className={'scene-image ' + className}><source media="(max-width:760px)" srcSet={'/media/story-r3/'+scene+'-mobile.webp'}/><img src={'/media/story-r3/'+scene+'.webp'} width="1600" height="1000" alt="" loading={eager ? 'eager' : 'lazy'} decoding="async"/></picture>;
}

/** Same registered planes used when the opening paper has moved away. */
export function ResumeStudioBackdrop() {
  return <div className="resume-studio-backdrop"><div className="resume-studio-planes"><img src="/media/hero/scroll/studio.webp" width="1535" height="1025" alt=""/><img src="/media/hero/scroll/foreground.webp" width="1535" height="1025" alt=""/></div><div className="resume-studio-blur"/><div className="resume-studio-tint"/></div>;
}
