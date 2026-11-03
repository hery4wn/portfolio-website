import 'server-only';
import { records } from '../content/records';

export function getPublicProfile() {
  const profile = records.find((record) => record.status === 'published' && record.kind === 'profile');
  if (!profile || profile.status !== 'published') throw new Error('Published profile missing');
  const { name, greeting, bio, process } = profile.data;
  // Explicit field allowlist. No generic spreading of internal records.
  return { name, greeting, bio, process };
}
