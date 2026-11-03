import { PersonalScene, PortraitCard } from './PersonalScene';
import styles from './personal-scene.module.css';

export function AboutHery({ bio, process }: { bio: string; process: string }) {
  const items = [
    { title: 'Siapa saya?', body: bio },
    { title: 'Apa yang saya bangun?', body: 'Website dan aplikasi web. Furia berangkat dari konteks sebuah tempat olahraga, Habit Tracker dari proyek skripsi, dan Sela dari kebutuhan belajar kosakata.' },
    { title: 'Bagaimana cara saya bekerja?', body: process },
    { title: 'Bagaimana saya memakai AI?', body: 'AI membantu eksplorasi dan implementasi. Saya tetap perlu memahami keputusan yang diambil, menguji hasilnya, dan memperbaiki bagian yang belum sesuai.' },
    { title: 'Apa yang saya lakukan di luar kode?', body: 'Saya juga memiliki pengalaman melayani pelanggan dan transaksi pada Agen BRILink, serta mengoordinasikan publikasi, dokumentasi, dan desain dalam kegiatan KKN UNCP.' },
    { title: 'Apa yang sedang saya pelajari?', body: 'Saya mengembangkan kemampuan web dan mengeksplorasi pemanfaatan AI lewat proyek. Proses belajar dan keputusan di baliknya saya tampilkan dalam portfolio ini.' },
  ];
  return <PersonalScene>
    <div className={styles.layout}>
      <header className={styles.heading}>
        <h2 id="about-hery-title" tabIndex={-1}>Tentang saya<span>.</span></h2>
        <p>Sedikit tentang orang di balik proyek-proyek ini.</p>
      </header>
      <div className={styles.portrait} id="profil" tabIndex={-1} data-personal-entry>
        <PortraitCard />
      </div>
      <div className={styles.story}>
        <p data-scroll-reveal className={styles.intro}>Web, AI, dan<br/><span>rasa ingin tahu.</span></p>
        <div className={styles.accordions}>{items.map((item, index) => <details key={item.title} name="about-hery" className={styles.item} open={index === 0}>
          <summary>{item.title}<span className={styles.plus} aria-hidden="true" /></summary>
          <p>{item.body}</p>
        </details>)}</div>
        <a data-scroll-reveal className={styles.resumeLink} href="/resume/">Lihat résumé lengkap <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></a>
      </div>
    </div>
  </PersonalScene>;
}
