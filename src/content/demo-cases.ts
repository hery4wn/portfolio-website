import 'server-only';
import type { CaseStudy } from './case-types';

// Public descriptions reviewed against the supplied Demo Project recordings.
// Provenance, sample frames and original filenames stay in docs/qa/work-studio.
export const additionalDemoCases:CaseStudy[]=[
  {
    slug:'sipesan',title:'SIPESAN',summary:'Dari laporan warga ke tindak lanjut: eksplorasi alur pengaduan sampah dalam satu portal.',
    context:'SIPESAN adalah proyek kuliah mengenai pelaporan dan pengaduan sampah. Demo menggunakan konteks Kota Palopo; penyebutannya tidak menandakan kerja sama atau penggunaan resmi oleh pemerintah.',
    problem:'Laporan perlu memiliki informasi yang dapat ditinjau: lokasi, deskripsi, foto, dan status penanganan. Proyek ini mengeksplorasi penyajian alur tersebut bagi pelapor dan admin.',
    role:{title:'Pengembang proyek kuliah',summary:'Saya membangun SIPESAN sebagai proyek perkuliahan. Rekaman menjadi bukti tampilan dan alur yang disajikan di sini.',contribution:['Menyusun portal informasi dan akses akun.','Membangun tampilan pengelolaan laporan serta rincian pengaduan.','Menyajikan foto bukti, lokasi, dan pembaruan status dalam alur admin.']},
    technologies:['Laravel','Tailwind CSS','Alpine.js'],
    decisions:[{title:'Laporan dapat ditinjau dalam konteks',body:'Halaman rincian mempertemukan deskripsi, lokasi, foto, dan status sehingga admin tidak perlu mengandalkan daftar judul laporan saja.'},{title:'Pisahkan pengantar publik dan area admin',body:'Demo berpindah dari portal informasi ke akses akun, daftar pengaduan, dan rincian laporan.'}],
    evidence:[{title:'Rekaman alur admin',body:'Video memperlihatkan login, dashboard, daftar pengaduan, dan pembaruan status pada halaman rincian.'}],
    results:['Tersedia demo portal dan alur pengelolaan pengaduan untuk ditinjau.'],
    limitations:['Ini proyek kuliah; tulisan “resmi” di dalam antarmuka demo bukan bukti afiliasi atau adopsi pemerintah.','Rekaman tidak membuktikan laporan lapangan telah diselesaikan atau layanan beroperasi untuk publik.'],
    learning:['Konteks laporan dan status tindak lanjut perlu dapat dibaca bersama.'],
    media:{src:'/media/cases/sipesan.mp4',poster:'/media/work/sipesan.png',width:1920,height:1080,duration:30,caption:'Demo SIPESAN dari proyek kuliah. Data, identitas, dan status pada layar adalah isi rekaman.',description:[{time:'00:00–00:04',text:'Pengantar SIPESAN dan teknologi proyek.'},{time:'00:04–00:13',text:'Portal publik, informasi layanan, dan bagian pengantar platform.'},{time:'00:13–00:18',text:'Akses akun dan perpindahan ke area admin.'},{time:'00:18–00:23',text:'Dashboard dan daftar pengaduan.'},{time:'00:23–00:30',text:'Rincian laporan, lokasi, foto bukti, dan pilihan pembaruan status.'}]},links:[],
  },
  {
    slug:'hampersly',title:'Hampersly',summary:'Menjelajahi hampers dari katalog, mengenal produknya, lalu melihat toko di baliknya.',
    context:'Hampersly merupakan proyek kuliah dengan konsep marketplace hampers multi-penjual. Isi katalog dan toko pada rekaman merupakan bagian dari demo.',
    problem:'Pengunjung perlu dapat berpindah dari pilihan produk ke informasi yang lebih rinci dan identitas toko. Proyek ini mengeksplorasi jalur penelusuran tersebut.',
    role:{title:'Pengembang proyek kuliah',summary:'Saya membangun eksplorasi marketplace hampers sebagai proyek perkuliahan.',contribution:['Menyusun beranda dan katalog produk.','Mengembangkan tampilan detail produk dengan informasi harga dan stok.','Menghubungkan detail produk dengan halaman toko penjual.']},
    technologies:['Laravel','Tailwind CSS','Alpine.js'],
    decisions:[{title:'Katalog menjadi titik masuk',body:'Produk disajikan bersama gambar, harga, nama toko, dan akses detail agar pengunjung dapat mulai membandingkan pilihan.'},{title:'Toko tetap terlihat dalam alur produk',body:'Rekaman berlanjut dari detail produk ke halaman toko dan produk lain dari penjual yang sama.'}],
    evidence:[{title:'Alur penelusuran produk',body:'Video memperlihatkan beranda, daftar produk, detail produk, dan halaman toko.'}],results:['Tersedia demo alur penelusuran katalog, produk, dan toko.'],
    limitations:['Harga, stok, ulasan, dan nama toko pada rekaman merupakan isi demo; bukan bukti transaksi atau penjual aktif.','Rekaman memperlihatkan kontrol tambah ke keranjang, tetapi tidak memverifikasi pembayaran atau pengiriman.'],
    learning:['Katalog dan identitas penjual perlu terhubung dalam satu alur yang mudah diikuti.'],
    media:{src:'/media/cases/hampersly.mp4',poster:'/media/work/hampersly.png',width:1920,height:1080,duration:31.17,caption:'Demo proyek kuliah Hampersly. Produk, harga, stok, dan toko adalah isi rekaman.',description:[{time:'00:00–00:04',text:'Pengantar konsep marketplace hampers.'},{time:'00:04–00:09',text:'Beranda, pengantar produk, dan informasi belanja.'},{time:'00:09–00:14',text:'Penelusuran katalog dan pilihan produk.'},{time:'00:14–00:24',text:'Detail produk, harga, stok, jumlah, dan kontrol tambah ke keranjang.'},{time:'00:24–00:31',text:'Halaman toko dan daftar produk dari penjual yang sama.'}]},links:[],
  },
  {
    slug:'personal-os',title:'Personal OS',summary:'Satu ruang pribadi untuk menyatukan pekerjaan yang perlu dilakukan dan arah yang ingin dituju.',
    context:'Personal OS adalah proyek pribadi untuk mengatur aktivitas sehari-hari. Rekaman memperlihatkan workspace dengan tugas, proyek, goals, habits, dan catatan keuangan.',
    problem:'Rencana dan catatan harian mudah tersebar di banyak tempat. Proyek ini mengeksplorasi penyajian beberapa kebutuhan pribadi dalam navigasi yang saling berdekatan.',
    role:{title:'Pembuat proyek pribadi',summary:'Saya mengembangkan Personal OS untuk mengeksplorasi sistem produktivitas bagi kebutuhan sendiri.',contribution:['Menyusun dashboard dengan ringkasan aktivitas dan fokus.','Menghubungkan area tugas, proyek, goals, dan kebiasaan dalam satu workspace.','Menyajikan tampilan keuangan dan quick capture dalam alur aplikasi.']},
    technologies:['Laravel','Vue','Inertia.js'],
    decisions:[{title:'Ringkasan membantu kembali ke aktivitas',body:'Dashboard mempertemukan tugas, jadwal, fokus, dan pintasan sehingga pengunjung tidak memulai dari daftar modul yang terpisah.'},{title:'Arah dan aktivitas memiliki tempat masing-masing',body:'Goals, proyek, dan habits tersedia sebagai area berbeda dalam navigasi workspace.'}],
    evidence:[{title:'Walkthrough workspace',body:'Video menelusuri beranda, goals, habits, finance, dan quick capture; thumbnail baru memperlihatkan versi dashboard yang lebih baru daripada rekaman.'}],
    results:['Tersedia walkthrough proyek produktivitas pribadi dan screenshot dashboard terbaru yang disediakan pemilik.'],
    limitations:['Versi dashboard pada thumbnail dan video berbeda; keduanya merupakan dokumentasi proyek pada waktu yang berbeda.','Angka tugas, progres, dan saldo pada layar tidak digunakan sebagai klaim hasil atau dampak produk.','Rekaman tidak memverifikasi seluruh modul yang tercantum pada navigasi.'],
    learning:['Workspace pribadi membantu menguji hubungan antara perencanaan, aktivitas, dan catatan keseharian.'],
    media:{src:'/media/cases/personal-os.mp4',poster:'/media/work/personal-os.png',width:1920,height:1080,duration:58.37,caption:'Walkthrough Personal OS. Versi antarmuka video lebih awal daripada thumbnail dashboard terbaru.',description:[{time:'00:00–00:08',text:'Pengantar workspace dan teknologi proyek.'},{time:'00:08–00:18',text:'Beranda dan area aktivitas workspace.'},{time:'00:18–00:27',text:'Goals dan arah prioritas.'},{time:'00:27–00:36',text:'Habits dan pencatatan kebiasaan.'},{time:'00:36–00:48',text:'Ringkasan keuangan dan akun.'},{time:'00:48–00:58',text:'Quick capture dan penutup walkthrough.'}]},links:[],
  },
];
