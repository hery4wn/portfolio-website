import { MotionProvider } from '../components/ui/MotionPolicy';
import type { Metadata } from 'next';
import './globals.css';
import './stage07.css';
import './stage08.css';
import './stage09.css';
import './exhibition.css';
import './resume-studio.css';
import './portfolio-work.css';
import './personal-world.css';
import './responsive.css';
export const metadata: Metadata = {
  title: 'Heryawan — Web & AI',
  description: 'Catatan dan proyek pribadi Heryawan. Belajar, membangun web, dan bereksperimen dengan AI.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><MotionProvider><a className="skip-link" href="#konten">Langsung ke konten</a>{children}</MotionProvider></body></html>;
}
