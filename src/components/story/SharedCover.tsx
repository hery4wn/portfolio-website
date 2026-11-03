'use client';
import { ViewTransition, type ReactNode } from 'react';
import { useMotionPolicy } from '../ui/MotionPolicy';

/** A unique category preview pairs with the corresponding detail cover. */
export function SharedCover({ slug, children }: { slug: string; children: ReactNode }) {
  const { ready, reduce } = useMotionPolicy();
  return <ViewTransition name={ready && !reduce ? 'work-cover-'+slug : undefined} share="work-cover-morph" default="none">{children}</ViewTransition>;
}
