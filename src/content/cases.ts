import 'server-only';
import { additionalDemoCases } from './demo-cases';
import type { CaseStudy } from './case-types';
// Only curated public copy. Evidence paths, hashes and unresolved questions live in docs.
export const caseRecords: { status: 'published' | 'draft'; data: CaseStudy }[] = [
  ...additionalDemoCases.map(data=>({status:'published' as const,data})),
  { status: 'published', data: {
    slug: 'furia', title: 'Furia Sports Center',
    summary: 'Memperkenalkan tempat bermain, berlatih, dan bertemu—dengan jalur booking yang mengikuti layanan venue.',
    context: 'Inisiatif portofolio untuk Furia Sports Center Palopo, dibuat dengan izin pengelola. Fokus situsnya adalah memperkenalkan badminton, padel, dan gym.',
    problem: 'Informasi fasilitas perlu disusun agar pengunjung dapat mengenal pilihan olahraga dan menemukan langkah berikutnya. Pengelola sudah menggunakan layanan booking, sehingga cakupan situs perlu menyesuaikan alur tersebut.',
    role: { title: 'Pembuat situs profil · inisiatif portofolio', summary: 'Saya mendekati pengelola, memahami kebutuhan, mengambil foto venue dengan izin, dan mengembangkan situs profil sebagai karya portofolio.', contribution: ['Memahami layanan yang sudah digunakan pengelola dan menyesuaikan cakupan situs.', 'Menyusun informasi badminton, padel, dan gym dalam pengalaman web.', 'Menghubungkan informasi venue dengan jalur booking AYO yang sudah tersedia.'] },
    technologies: ['HTML', 'CSS', 'JavaScript'],
    decisions: [
      { title: 'Mengikuti alur booking venue', body: 'Situs mengarahkan pengunjung ke layanan AYO. Dengan begitu, informasi venue dan proses pemesanan tetap terhubung dengan layanan yang sudah digunakan.' },
      { title: 'Tiga olahraga mendapat ruang', body: 'Badminton, padel, dan gym hadir sebagai pilihan yang dapat ditelusuri. Showcase menampilkan pergantian tampilan dari satu olahraga ke olahraga lain.' },
      { title: 'Antarmuka menjadi pengantar', body: 'HTML, CSS, dan JavaScript digunakan untuk menyajikan profil, foto fasilitas, serta jalur menuju layanan booking. Lingkup cerita ini berfokus pada antarmuka situs profil.' },
    ],
    evidence: [
      { title: 'Showcase dari tampilan website', body: 'Rekaman memperlihatkan bagian-bagian situs dan pergantian tab olahraga: badminton, padel, lalu gym.' },
      { title: 'Jalur booking pada antarmuka', body: 'Kode situs memuat akses booking AYO dan informasi fasilitas. Booking tetap dilayani oleh layanan yang dituju.' },
    ],
    results: ['Situs profil Furia tersedia untuk dilihat, dengan informasi venue dan akses menuju layanan booking.', 'Showcase mendokumentasikan tampilan ketiga olahraga dalam satu situs.'],
    limitations: ['Proyek ini berawal sebagai inisiatif portofolio tanpa pembayaran pada kesepakatan awal.', 'Rekaman dan situs yang dapat dibuka tidak mengukur booking berhasil atau dampak bisnis.'],
    learning: ['Memahami kebutuhan usaha juga berarti memahami layanan yang sudah digunakan.', 'Komunikasi, izin penggunaan foto, dan pengelolaan ekspektasi merupakan bagian dari proses membangun situs.'],
    media: { src: '/media/cases/furia.mp4', poster: '/media/cases/furia-poster.webp', width: 1280, height: 1024, duration: 32, caption: 'Showcase website Furia. Efek suara transisi, tanpa narasi.', description: [{ time: '00:00–00:18', text: 'Penelusuran tampilan situs, fasilitas, dan bagian informasi venue.' }, { time: '00:18–00:22', text: 'Tampilan utama badminton.' }, { time: '00:22–00:27', text: 'Perpindahan ke tampilan padel.' }, { time: '00:27–00:32', text: 'Perpindahan ke tampilan gym.' }] },
    links: [{ label: 'Lihat situs Furia', href: 'https://furiapalopo.fit' }],
  } },
  { status: 'published', data: {
    slug: 'habit-tracker', title: 'Habit Tracker',
    additionalMedia:[{label:'Desktop',media:{src:'/media/cases/habit-tracker-desktop.mp4',poster:'/media/cases/habit-tracker-desktop-poster.jpg',width:1920,height:1080,duration:40,caption:'Showcase desktop Habit Tracker. Angka progres dan kebiasaan pada layar adalah isi demo.',description:[{time:'00:00–00:10',text:'Pengantar proyek, landing page, dan penjelasan alur aplikasi.'},{time:'00:10–00:24',text:'Dashboard, rutinitas, dan ringkasan progres.'},{time:'00:24–00:31',text:'Statistik serta riwayat kebiasaan.'},{time:'00:31–00:40',text:'Pengelolaan kebiasaan dan formulir pencatatan.'}]}}],
    summary: 'Mencatat kebiasaan, melihat progres, dan belajar membangun aplikasi web melalui proyek skripsi.',
    context: 'Habit Tracker merupakan proyek skripsi Informatika saya. Aplikasi berbasis Progressive Web App ini berfokus pada pencatatan kebiasaan dan penyajian progres.',
    problem: 'Kebiasaan sehari-hari membutuhkan catatan yang mudah diisi dan dilihat kembali. Proyek ini mengeksplorasi bagaimana aktivitas harian dapat ditampilkan sebagai riwayat dan ringkasan progres.',
    role: { title: 'Pengembang proyek skripsi', summary: 'Saya mengembangkan Habit Tracker sebagai tugas akhir. Ruang lingkup yang ditampilkan di sini adalah alur kebiasaan, pencatatan, serta tampilan progres.', contribution: ['Mengembangkan aplikasi pencatatan kebiasaan sebagai proyek skripsi.', 'Menyajikan alur kebiasaan dan progres melalui antarmuka aplikasi web.', 'Menggunakan proyek ini untuk mempelajari hubungan antarmuka, logika pencatatan, dan data.'] },
    technologies: ['Laravel', 'Vue', 'Inertia.js', 'Tailwind CSS', 'PWA'],
    decisions: [
      { title: 'Pencatatan terkait pengguna dan hari', body: 'Alur pencatatan pada implementasi memeriksa kepemilikan kebiasaan serta catatan hari yang sama. Struktur ini menghubungkan tindakan pengguna dengan riwayat kebiasaannya.' },
      { title: 'Progres dapat dibaca kembali', body: 'Ringkasan harian, streak, dan statistik memberi konteks pada catatan aktivitas. Showcase memperlihatkan perubahan status, tampilan level, dan halaman statistik.' },
      { title: 'Aplikasi web sebagai fondasi', body: 'Laravel, Vue, dan Inertia.js menghubungkan alur aplikasi dengan antarmuka. Manifest PWA menjadi bagian dari bentuk aplikasi web proyek ini.' },
    ],
    evidence: [
      { title: 'Alur pada showcase mobile', body: 'Rekaman memperlihatkan dashboard, penyelesaian kebiasaan, statistik, dan formulir kebiasaan baru.' },
      { title: 'Implementasi pencatatan', body: 'Kode proyek memuat pengelolaan kebiasaan, pemeriksaan catatan harian, serta penghitungan streak dan XP.' },
    ],
    results: ['Tersedia aplikasi dan rekaman alur pencatatan kebiasaan sebagai keluaran proyek skripsi.', 'Showcase memperlihatkan hubungan antara tindakan pada kebiasaan dan tampilan progres.'],
    limitations: ['Angka progres, XP, dan streak di dalam video adalah isi tampilan aplikasi; bukan ukuran adopsi atau keberhasilan pengguna.', 'Pengiriman notifikasi di perangkat dan perilaku offline belum menjadi hasil pengujian yang disajikan dalam studi ini.'],
    learning: ['Pencatatan sederhana tetap membutuhkan aturan tentang pengguna, tanggal, dan perubahan status.', 'Antarmuka progres perlu terhubung dengan logika data agar dapat dijelaskan, bukan sekadar menjadi angka pada layar.'],
    media: { src: '/media/cases/habit-tracker.mp4', poster: '/media/cases/habit-tracker-poster.webp', width: 720, height: 1280, duration: 39.97, caption: 'Showcase mobile Habit Tracker, tanpa audio. Angka pada layar adalah isi demo aplikasi.', description: [{ time: '00:00–00:09', text: 'Pengantar dan halaman awal aplikasi.' }, { time: '00:09–00:15', text: 'Dashboard, ringkasan progres, dan perubahan tema.' }, { time: '00:15–00:24', text: 'Pencatatan kebiasaan dan tampilan level.' }, { time: '00:24–00:32', text: 'Halaman statistik serta riwayat aktivitas.' }, { time: '00:32–00:40', text: 'Formulir untuk menambahkan kebiasaan.' }] },
    links: [],
  } },
  { status: 'published', data: {
    slug: 'sela', title: 'Sela', summary: 'Ruang kecil untuk belajar kosakata: dari kata baru, menjadi kartu, lalu latihan mengingat.',
    context: 'Sela adalah proyek pribadi yang berangkat dari kebutuhan saya belajar bahasa Inggris. Bentuknya adalah aplikasi flashcard dengan eksplorasi bantuan AI.',
    problem: 'Menemukan kata baru belum cukup untuk mengingatnya. Saya ingin menghubungkan proses mencatat makna, memeriksa contoh, dan kembali melatih kata tersebut dalam satu alur.',
    role: { title: 'Pembuat proyek pribadi', summary: 'Saya mengembangkan Sela sebagai alat belajar kosakata untuk kebutuhan pribadi, sambil mengeksplorasi bantuan AI dalam proses membuat kartu.', contribution: ['Mengembangkan proyek flashcard dari kebutuhan belajar kosakata bahasa Inggris.', 'Menghubungkan alur menambahkan kata, memeriksa isi kartu, dan latihan.', 'Memanfaatkan AI dalam eksplorasi dan implementasi sambil tetap memeriksa keputusan serta hasilnya.'] },
    technologies: ['Next.js', 'React', 'Supabase', 'ts-fsrs'],
    decisions: [
      { title: 'Isi diperiksa sebelum dilatih', body: 'Alur kartu membedakan draf dan kartu siap latihan. Bantuan AI menjadi bahan untuk diperiksa, bukan alasan melewati pemeriksaan isi.' },
      { title: 'Latihan dijadwalkan', body: 'Implementasi memakai ts-fsrs untuk menyusun penjadwalan kartu. Riwayat latihan terhubung dengan kartu yang dipelajari.' },
      { title: 'Respons AI memiliki struktur', body: 'Endpoint generasi memeriksa bentuk masukan dan respons sebelum mengembalikan isi kartu. Pemeriksaan struktur membantu menangani hasil yang belum lengkap; ketepatan makna tetap perlu diperiksa.' },
    ],
    evidence: [
      { title: 'Dari kata ke sesi latihan', body: 'Showcase memperlihatkan penambahan kata, bantuan AI, pilihan gambar, pemeriksaan kartu, serta sesi latihan.' },
      { title: 'Alur pada kode aplikasi', body: 'Kode memuat endpoint generasi kartu, pemisahan status draf/siap, serta penjadwalan menggunakan ts-fsrs.' },
    ],
    results: ['Tersedia proyek flashcard dan showcase yang mendokumentasikan alur membuat serta melatih kartu kosakata.', 'Alur bantuan AI dan penjadwalan kartu dapat ditelusuri dalam implementasi proyek.'],
    limitations: ['Isi yang dihasilkan AI masih perlu diperiksa, terutama makna dan contoh penggunaan.', 'Studi ini tidak mengukur peningkatan kemampuan bahasa, jumlah pengguna, atau ketersediaan provider AI saat ini.'],
    learning: ['Bantuan AI perlu ditempatkan di dalam alur pemeriksaan yang jelas.', 'Proyek untuk kebutuhan sendiri membantu menghubungkan keputusan fitur dengan proses belajar yang benar-benar ingin dilakukan.'],
    media: { src: '/media/cases/sela.mp4', poster: '/media/cases/sela-poster.webp', width: 720, height: 1280, duration: 59.97, caption: 'Showcase Sela, tanpa audio. Angka dan kartu pada layar merupakan isi rekaman aplikasi.', description: [{ time: '00:00–00:07', text: 'Pengantar dan beranda Sela.' }, { time: '00:07–00:20', text: 'Menambahkan kata dan memeriksa bantuan isi dari AI.' }, { time: '00:20–00:32', text: 'Memilih gambar dan menyimpan kartu.' }, { time: '00:32–00:38', text: 'Beranda dan tema gelap.' }, { time: '00:38–00:47', text: 'Memilih latihan dan membuka kartu.' }, { time: '00:47–00:54', text: 'Makna, contoh, dan detail kartu.' }, { time: '00:54–01:00', text: 'Pengaturan serta pilihan cadangan koleksi.' }] },
    links: [],
  } },
];
