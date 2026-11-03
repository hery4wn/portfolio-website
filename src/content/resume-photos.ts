export type ResumePhoto = { src: string; alt: string; caption: string };
const photo = (slug: string, caption: string, alt = caption): ResumePhoto => ({src: `/media/resume/${slug}.webp`, caption, alt});
export const resumeAlbums: Record<string, {title: string; photos: ResumePhoto[]}> = {
  'pmm-ugm': {title: 'PMM Batch 3 di UGM', photos: [photo('pmm-ugm-portrait', 'Dokumentasi Heryawan selama mengikuti PMM Batch 3 di Universitas Gadjah Mada.'), photo('pmm-ugm-group', 'Dokumentasi bersama peserta PMM Batch 3 di UGM.')]},
  uncp: {title: 'Momen wisuda UNCP', photos: [
    photo('uncp-portrait', 'Dokumentasi wisuda Universitas Cokroaminoto Palopo.', 'Potret Heryawan mengenakan toga di lokasi wisuda UNCP.'),
    photo('uncp-ceremony', 'Bersama teman-teman pada acara wisuda UNCP.'),
    photo('uncp-group', 'Foto bersama di lokasi wisuda UNCP.'),
  ]},
  'smkn-2': {title: 'Masa SMK', photos: [photo('smkn-group', 'Dokumentasi bersama teman-teman di SMK Negeri 2 Luwu Timur.')]},
  brilink: {title: 'Keseharian di Agen BRILink', photos: [photo('brilink-counter', 'Konter layanan Agen BRILink.'), photo('brilink-selfie', 'Dokumentasi Heryawan di lokasi Agen BRILink.')]},
  'kkn-pdd': {title: 'KKN di Desa Lestari', photos: [photo('kkn-community', 'Dokumentasi bersama tim KKN dan masyarakat Desa Lestari, Tomoni, Luwu Timur. Februari 2026.'), photo('kkn-team', 'Foto bersama tim KKN di Desa Lestari. Februari 2026.')]},
  'pdk-disnaker': {title: 'Pengenalan Dunia Kerja', photos: [photo('dinas-computer', 'Memeriksa berkas pendaftar kartu AK1 sebagai admin website SIAPkerja. Mei–Juni 2025.'), photo('dinas-group', 'Dokumentasi kegiatan PDK di Dinas Transmigrasi dan Tenaga Kerja Luwu Timur.')]},
  metronix: {title: 'Magang di Metronix', photos: [photo('metronix-group', 'Dokumentasi magang SMK di CV. Metronix Makassar Utama. Oktober–Desember 2021.')]},
};
