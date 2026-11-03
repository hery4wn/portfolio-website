/** Emits a true photo reset when reverse scroll crosses the intro threshold. */
export function createStoryPhaseEmitter(hero: HTMLElement) {
  let lastPhase = '';
  return (progress: number) => {
    const p = progress <= .002 ? 0 : progress;
    const phase = p === 0 ? 'intro' : p < .16 ? 'reveal' : p < .82 ? 'opening' : 'reading';
    if (phase !== lastPhase) {
      lastPhase = phase;
      hero.dispatchEvent(new CustomEvent('story-phase', { detail: { p, phase } }));
    }
    return phase;
  };
}
