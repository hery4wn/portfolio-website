/** Technical contract only. No scene, animation or visual changes. */
export type VisualSource = 'layered-image' | 'image-sequence' | 'glb';
export interface VisualAsset {
  id: string;
  source: VisualSource;
  path: string;
  poster: string;
  provenance: string;
  license: string;
  productionApproved: boolean;
}
export const animationPolicy = {
  reducedMotion: 'static-poster',
  content: 'semantic-html',
  loading: 'on-demand',
} as const;
