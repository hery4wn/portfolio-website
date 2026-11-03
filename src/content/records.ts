// Only curated, public-safe records belong here. Planning JSON is never imported.
export type PublishedRecord = { status: 'published'; kind: 'profile'; data: { name: string; greeting: string; bio: string; process: string } };
export type DraftRecord = { status: 'draft'; kind: string; data: unknown };
export const records: ReadonlyArray<PublishedRecord | DraftRecord> = [
  { status: 'published', kind: 'profile', data: {
    name: 'Heryawan', greeting: 'About Hery',
    bio: 'Saya Heryawan, lulusan Informatika yang senang membangun web dan bereksperimen dengan AI. Saya belajar lewat proyek nyata dan mencatat proses di baliknya.',
    process: 'Saya mulai dari kebutuhan, membangun solusi, lalu menguji dan memperbaikinya. AI membantu proses eksplorasi dan implementasi; keputusan serta hasilnya tetap perlu saya pahami dan verifikasi.',
  } },
];
