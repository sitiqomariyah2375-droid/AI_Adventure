import { Mission } from '../types';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'misi-1',
    number: 1,
    title: 'Kenali Perangkat TIK: Anatomi Mesin Pintar',
    subtitle: 'Memahami bagaimana input diolah menjadi output dan disimpan dengan aman.',
    level: 'Level 1 — Explorer',
    topic: 'Perangkat TIK & Sistem Komputer',
    estimatedMinutes: 20,
    xpReward: 250,
    badge: {
      name: 'Hardware Master',
      icon: 'Cpu',
      description: 'Berhasil mengidentifikasi dan mengelompokkan komponen TIK modern.',
    },
    learningObjectives: [
      'Mengidentifikasi fungsi perangkat input, proses, output, dan storage.',
      'Membedakan memori primer (RAM/ROM) dan penyimpanan sekunder (SSD/HDD/Cloud).',
      'Menganalisis spesifikasi komputer untuk kebutuhan lab SMK (grafis vs jaringan).',
    ],
    quickSummary:
      'Komputer bekerja dalam siklus IPOS (Input, Processing, Output, Storage). Data dimasukkan lewat perangkat input, diproses oleh CPU didukung RAM, ditampilkan melalui output, dan disimpan secara permanen pada storage.',
    contextualCase: {
      role: 'Teknisi Junior Lab Komputer SMK',
      scenario:
        'Lab Multimedia SMK baru menerima 20 unit workstation tanpa konfigurasi. Pak Budi meminta Anda memilah perangkat yang baru datang ke rak penyimpanan yang tepat agar perakitan berjalan efisien.',
      challenge:
        'Kelompokkan komponen yang berserakan ke 4 kategori: Input, Process, Output, dan Storage, serta putuskan spesifikasi ideal untuk editing video.',
    },
    interactiveSteps: [
      {
        id: 'step-1-1',
        title: 'Klasifikasi Komponen TIK',
        type: 'categorize',
        instruction: 'Tentukan kategori yang tepat untuk setiap komponen berikut!',
        data: {
          items: [
            { id: 'item-1', name: 'Keyboard Mekanikal & Barcode Scanner', correctCategory: 'Input' },
            { id: 'item-2', name: 'Intel Core i7 & GPU RTX 4060', correctCategory: 'Proses' },
            { id: 'item-3', name: 'Monitor 4K & Proyektor HDMI', correctCategory: 'Output' },
            { id: 'item-4', name: 'NVMe SSD 1TB & Harddisk Eksternal', correctCategory: 'Storage' },
            { id: 'item-5', name: 'Drawing Pen Tablet DKV', correctCategory: 'Input' },
          ],
          categories: ['Input', 'Proses', 'Output', 'Storage'],
        },
        hints: [
          'Komponen input berfungsi mengirimkan instruksi atau sinyal dari luar ke dalam komputer.',
          'Komponen proses melakukan perhitungan logika dan aritmatika (ALU/CPU).',
          'Storage menyimpan data bahkan saat komputer dimatikan (non-volatile).',
        ],
        explanation:
          'Siklus pemrosesan data selalu membutuhkan masukan (Input), pengolah (Proses), penampil hasil (Output), dan media simpan (Storage). Barcode scanner & drawing tablet adalah input; CPU/GPU adalah pemroses; Monitor/Proyektor adalah output; dan NVMe SSD adalah storage cepat non-volatile.',
      },
      {
        id: 'step-1-2',
        title: 'Analisis Kebutuhan Workstation SMK',
        type: 'scenario_decision',
        instruction: 'Pilihlah keputusan arsitektur komputer yang paling optimal untuk kasus berikut:',
        data: {
          scenario:
            'Siswa jurusan Desain Komunikasi Visual (DKV) sering mengeluh aplikasi editing video 3D mereka sering crash dan render lambat pada PC dengan RAM 4GB dan HDD 5400 RPM. Rekomendasi upgrade paling tepat dengan efisiensi biaya adalah:',
          options: [
            { id: 'opt-a', text: 'Ganti casing RGB dan tambah keyboard mechanical baru', isCorrect: false, feedback: 'Casing dan keyboard tidak mempengaruhi kinerja komputasi dan rendering.' },
            { id: 'opt-b', text: 'Upgrade RAM minimal 16GB dual channel dan ganti HDD sistem ke NVMe SSD', isCorrect: true, feedback: 'Tepat sekali! Render video dan animasi 3D membutuhkan kapasitas RAM besar untuk cache file serta read/write speed SSD yang tinggi.' },
            { id: 'opt-c', text: 'Tambah daya speaker eksternal agar audio lebih jelas', isCorrect: false, feedback: 'Speaker adalah perangkat output audio, tidak memperbaiki lag rendering.' },
          ],
        },
        hints: [
          'Perhatikan bottleneck utama: crash saat membuka aplikasi berat biasanya karena kehabisan ruang memori kerja (RAM).',
          'Waktu loading lambat sangat dipengaruhi oleh throughput media penyimpanan (HDD vs SSD).',
        ],
        explanation:
          'Aplikasi editing multimedia memuat aset video berukuran giga-byte ke RAM secara real-time. Upgrade RAM 16GB + NVMe SSD adalah solusi paling efektif mengatasi bottleneck pemrosesan grafis.',
      },
    ],
    missionQuiz: [
      {
        id: 'mq-1-1',
        type: 'multiple_choice',
        topic: 'Perangkat TIK',
        difficulty: 'Dasar',
        question: 'Manakah di antara perangkat berikut yang merupakan perangkat input sekaligus output (I/O device)?',
        options: ['Layar Sentuh (Touchscreen)', 'Plotter Grafis', 'Mikrofon Kondensor', 'Webcam Full HD'],
        correctIndex: 0,
        explanation: 'Layar sentuh mendeteksi sentuhan jari sebagai input data dan menampilkan antarmuka visual sebagai output.',
        hint: 'Perangkat ini bisa kamu sentuh untuk memberi perintah dan juga menampilkan gambar di tempat yang sama.',
        reviewTopic: 'Perangkat Input dan Output TIK',
      },
      {
        id: 'mq-1-2',
        type: 'true_false',
        topic: 'Sistem Komputer',
        difficulty: 'Dasar',
        question: 'Data yang tersimpan di dalam RAM akan tetap ada meskipun komputer dimatikan secara total.',
        correctAnswerBool: false,
        explanation: 'RAM bersifat volatile (sementara). Ketika aliran daya listrik terputus, semua data di dalam RAM akan hilang.',
        hint: 'Ingat sifat volatile vs non-volatile pada memori komputer.',
        reviewTopic: 'Memori Primer (RAM vs ROM)',
      },
    ],
    status: 'available',
  },
  {
    id: 'misi-2',
    number: 2,
    title: 'Pecahkan Masalah dengan Berpikir Komputasional',
    subtitle: 'Kuasai 4 pilar: Dekomposisi, Abstraksi, Pengenalan Pola, dan Algoritma.',
    level: 'Level 1 — Explorer',
    topic: 'Berpikir Komputasional',
    estimatedMinutes: 25,
    xpReward: 300,
    badge: {
      name: 'Computational Thinker',
      icon: 'Brain',
      description: 'Mampu membedah masalah kompleks menjadi solusi terstruktur.',
    },
    learningObjectives: [
      'Menjelaskan dan menerapkan 4 pilar computational thinking.',
      'Melakukan dekomposisi terhadap studi kasus manajemen antrean kantin sekolah.',
      'Mengeliminasi detail yang tidak relevan melalui teknik abstraksi.',
    ],
    quickSummary:
      'Berpikir komputasional (BK) adalah metode berpikir manusia untuk memformulasikan masalah dan solusinya sehingga dapat diselesaikan secara efektif oleh manusia maupun komputer. 4 pilarnya adalah Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma.',
    contextualCase: {
      role: 'Koordinator Solusi Inovasi OSIS SMK',
      scenario:
        'Kantin sekolah selalu mengalami antrean panjang dan kekacauan transaksi selama 15 menit jam istirahat. Banyak siswa tidak sempat makan dan pembayaran sering salah hitung.',
      challenge:
        'Terapkan 4 pilar berpikir komputasional untuk merancang sistem pemesanan makanan mandiri pra-istirahat.',
    },
    interactiveSteps: [
      {
        id: 'step-2-1',
        title: 'Mencocokkan 4 Pilar Berpikir Komputasional',
        type: 'matching',
        instruction: 'Cocokkan pilar Berpikir Komputasional dengan aksi nyata yang tepat dalam kasus antrean kantin!',
        data: {
          pairs: [
            { left: 'Dekomposisi', right: 'Memecah antrean jadi: menu, pembayaran, penyiapan, pengambilan' },
            { left: 'Pengenalan Pola', right: 'Mengetahui jam ramai terjadi tepat 5 menit setelah bel istirahat' },
            { left: 'Abstraksi', right: 'Mengabaikan warna baju siswa & fokus pada nomor pesanan dan menu' },
            { left: 'Algoritma', right: 'Langkah terurut: Pilih Menu -> Bayar QRIS -> Ambil Struk -> Ambil Makanan' },
          ],
        },
        hints: [
          'Dekomposisi adalah memecah masalah besar menjadi bagian-bagian lebih kecil.',
          'Abstraksi menyaring detail yang tidak esensial untuk mempermudah solusi.',
        ],
        explanation:
          'Dengan memecah proses (dekomposisi), melihat pola waktu (pola), membuang detail tak penting (abstraksi), dan membuat alur urut (algoritma), antrean kantin yang rumit dapat diselesaikan dengan sistematis.',
      },
      {
        id: 'step-2-2',
        title: 'Uji Abstraksi Data Siswa',
        type: 'multiple_choice',
        instruction: 'Jika Anda membuat database nomor pesanan di kantin, data manakah yang HARUS diabstraksikan (DIABAIKAN) karena tidak relevan?',
        data: {
          options: [
            'Nomor Pesanan Unik dan Daftar Menu yang Dipesan',
            'Warna sepatu atau merek tas siswa yang memesan',
            'Waktu pemesanan dan total nominal yang harus dibayar',
            'Status pesanan (sedang dimasak / siap diambil)',
          ],
          correctIndex: 1,
        },
        hints: ['Abstraksi berarti memilah mana data yang krusial bagi sistem dan mana yang cuma kebisingan/detail tak berpengaruh.'],
        explanation:
          'Warna sepatu atau merek tas sama sekali tidak diperlukan dalam transaksi pembelian makanan di sistem kantin. Mengabaikan detail tersebut adalah inti dari teknik abstraksi.',
      },
    ],
    missionQuiz: [
      {
        id: 'mq-2-1',
        type: 'multiple_choice',
        topic: 'Berpikir Komputasional',
        difficulty: 'Menengah',
        question: 'Seorang mekanik sepeda motor di bengkel SMK memeriksa keluhan mesin brebet dengan mengecek: busi, filter udara, karburator/injektor, dan bahan bakar satu per satu. Pilar BK yang diterapkan mekanik tersebut adalah:',
        options: ['Dekomposisi', 'Enkripsi Data', 'Kompilasi Kode', 'Abstraksi Berlebihan'],
        correctIndex: 0,
        explanation: 'Mekanik memecah sistem mesin yang kompleks menjadi sub-komponen individual yang dapat diuji secara terpisah (Dekomposisi).',
        hint: 'Mekanik membagi sistem besar menjadi beberapa bagian kecil untuk diperiksa satu demi satu.',
        reviewTopic: 'Pilar Dekomposisi dalam Pemecahan Masalah',
      },
    ],
    status: 'available',
  },
  {
    id: 'misi-3',
    number: 3,
    title: 'Rancang Algoritma: Logika Langkah Demi Langkah',
    subtitle: 'Mengubah ide abstrak menjadi algoritma terstruktur, pseudocode, dan flowchart.',
    level: 'Level 2 — Problem Solver',
    topic: 'Algoritma & Pemrograman Dasar',
    estimatedMinutes: 30,
    xpReward: 350,
    badge: {
      name: 'Algorithm Architect',
      icon: 'GitBranch',
      description: 'Mampu menyusun pseudocode dan alur logika flowchart tanpa error.',
    },
    learningObjectives: [
      'Menuliskan algoritma deskriptif dan pseudocode yang jelas.',
      'Menggunakan simbol standar flowchart (Terminator, Process, Decision, I/O).',
      'Menerapkan struktur kontrol: sekuensial, percabangan (if-else), dan perulangan (loop).',
    ],
    quickSummary:
      'Algoritma adalah urutan langkah logis yang terhingga untuk menyelesaikan suatu masalah. Algoritma harus memiliki: input, output, finiteness (berhingga), definiteness (jelas), dan effectiveness (efektif).',
    contextualCase: {
      role: 'Junior Programmer Tim IT Sekolah',
      scenario:
        'Guru piket SMK memerlukan sistem pintu gerbang otomatis pintar. Jika siswa datang sebelum pukul 07.00 WIB, gerbang terbuka dan status tercatat "Tepat Waktu". Jika pukul 07.01 - 07.15 WIB, status "Terlambat Toleransi". Jika lewat 07.15 WIB, gerbang terkunci dan diarahkan ke Pos Konseling.',
      challenge:
        'Susun urutan logika percabangan kondisi presensi gerbang otomatis secara benar.',
    },
    interactiveSteps: [
      {
        id: 'step-3-1',
        title: 'Menyusun Urutan Algoritma Gerbang Sekolah',
        type: 'order_steps',
        instruction: 'Urutkan langkah algoritma validasi presensi gerbang otomatis berikut dari awal hingga akhir!',
        data: {
          initialItems: [
            'Periksa: Apakah Waktu <= 07.00? Jika Ya -> Cetak "Tepat Waktu" & Buka Gerbang',
            'Siswa melakukan scan kartu RFID / Barcode kartu pelajar di sensor gerbang',
            'Sistem membaca ID siswa dan mencatat jam masuk saat ini',
            'Jika Waktu > 07.15 -> Gerbang Kunci Otomatis & Nyalakan Lampu Merah ke Pos Konseling',
            'Selesai dan simpan log ke database absensi harian',
            'Jika Waktu 07.01 s.d 07.15 -> Cetak "Terlambat" & Catat Poin Pelanggaran Ringan',
          ],
          correctOrder: [
            'Siswa melakukan scan kartu RFID / Barcode kartu pelajar di sensor gerbang',
            'Sistem membaca ID siswa dan mencatat jam masuk saat ini',
            'Periksa: Apakah Waktu <= 07.00? Jika Ya -> Cetak "Tepat Waktu" & Buka Gerbang',
            'Jika Waktu 07.01 s.d 07.15 -> Cetak "Terlambat" & Catat Poin Pelanggaran Ringan',
            'Jika Waktu > 07.15 -> Gerbang Kunci Otomatis & Nyalakan Lampu Merah ke Pos Konseling',
            'Selesai dan simpan log ke database absensi harian',
          ],
        },
        hints: [
          'Algoritma harus dimulai dari input (scan kartu), dilanjutkan proses pembacaan jam, baru kemudian pengujian kondisi percabangan secara berjenjang.',
        ],
        explanation:
          'Langkah dimulai dari trigger input sensor, pencatatan waktu realtime, evaluasi kondisi bersyarat dari nilai waktu terkecil ke terbesar, hingga penyimpanan log transaksi.',
      },
      {
        id: 'step-3-2',
        title: 'Simbol Standar Flowchart',
        type: 'matching',
        instruction: 'Cocokkan bentuk simbol flowchart berikut dengan kegunaan resminya!',
        data: {
          pairs: [
            { left: 'Oval / Kapsul (Terminator)', right: 'Menyatakan awal (Start) atau akhir (End) dari suatu program' },
            { left: 'Jajar Genjang (Parallelogram)', right: 'Operasi Input data dari user atau Output hasil' },
            { left: 'Persegi Panjang (Rectangle)', right: 'Proses komputasi, perhitungan aritmatika, atau inisialisasi' },
            { left: 'Belah Ketupat (Diamond / Decision)', right: 'Pengambilan keputusan bersyarat (kondisi Benar/Salah)' },
          ],
        },
        hints: ['Belah ketupat selalu memiliki minimal 2 jalur keluar: Ya/Benar (True) dan Tidak/Salah (False).'],
        explanation:
          'Standar simbol ANSI/ISO flowchart menjamin diagram alur dapat dipahami secara seragam oleh programmer di seluruh dunia.',
      },
    ],
    missionQuiz: [
      {
        id: 'mq-3-1',
        type: 'multiple_choice',
        topic: 'Algoritma',
        difficulty: 'Menengah',
        question: 'Pada struktur perulangan (looping), kondisi apa yang terjadi jika tidak ada batas terminasi (counter) yang diperbarui?',
        options: ['Infinite Loop (Perulangan tak hingga yang membuat program hang)', 'Syntax Error langsung saat kompilasi', 'Data otomatis terenkripsi', 'Program berjalan lebih cepat'],
        correctIndex: 0,
        explanation: 'Jika syarat berhenti loop tidak pernah tercapai (selalu bernilai True), komputer akan terus mengeksekusi perintah tanpa henti (Infinite Loop) hingga kehabisan memori.',
        hint: 'Apa yang terjadi jika kamu disuruh push-up selamanya tanpa ada angka hitungan akhir?',
        reviewTopic: 'Struktur Kontrol Perulangan (Looping)',
      },
    ],
    status: 'available',
  },
  {
    id: 'misi-4',
    number: 4,
    title: 'Detektif Keamanan Digital: Lindungi Data Pribadi',
    subtitle: 'Bongkar modus kejahatan siber, phishing, rekayasa sosial, dan amankan akun.',
    level: 'Level 2 — Problem Solver',
    topic: 'Literasi Digital & Keamanan Siber',
    estimatedMinutes: 25,
    xpReward: 350,
    badge: {
      name: 'Cyber Sentinel',
      icon: 'ShieldCheck',
      description: 'Mampu membedah trik phishing dan mengaktifkan pertahanan digital berlapis.',
    },
    learningObjectives: [
      'Mengenali ciri-ciri tautan atau email phishing dan serangan social engineering.',
      'Membuat kata sandi yang kuat dengan entropy tinggi serta mengelola password manager.',
      'Menjelaskan fungsi Otentikasi Dua Faktor (2FA) dan risiko penggunaan Wi-Fi publik terbuka.',
    ],
    quickSummary:
      'Keamanan data bukan hanya masalah teknis perangkat lunak, melainkan juga perilaku manusia (human firewall). Serangan seperti phishing mengeksploitasi rasa panik atau keserakahan korban untuk mencuri kredensial rahasia.',
    contextualCase: {
      role: 'Petugas Keamanan Siber Sekolah',
      scenario:
        'Seorang siswa kelas X menerima pesan WhatsApp dari nomor tak dikenal yang mengaku dari "Admin Beasiswa Kemendikbud". Pesan tersebut berisi file dengan nama "Daftar_Nama_Penerima_Bantuan_2026.apk" dan meminta siswa segera menginstal aplikasi tersebut.',
      challenge:
        'Lakukan investigasi terhadap pesan tersebut dan tentukan tindakan pertahanan digital yang wajib diambil.',
    },
    interactiveSteps: [
      {
        id: 'step-4-1',
        title: 'Audit Pesan Mencurigakan (Phishing Detection)',
        type: 'scenario_decision',
        instruction: 'Berdasarkan studi kasus pesan APK beasiswa, apa tindakan yang paling tepat?',
        data: {
          scenario:
            'File dikirim berformat .apk melalui nomor pribadi WhatsApp dengan bahasa mendesak ("Segera buka dalam 1 jam atau hak beasiswa Anda hangus!").',
          options: [
            { id: 'opt-1', text: 'Langsung buka file APK untuk mengecek apakah nama saya terdaftar', isCorrect: false, feedback: 'BAHAYA BESAR! Menginstal APK dari luar Play Store/sumber resmi dapat memasang spyware/trojan SMS stealer ke HP Anda.' },
            { id: 'opt-2', text: 'Kirimkan file ke grup kelas agar teman-teman juga bisa melihat', isCorrect: false, feedback: 'Ini justru akan memperluas penyebaran malware ke teman-teman sekelas.' },
            { id: 'opt-3', text: 'Jangan buka, blokir pengirim, dan konfirmasi ke pihak sekolah/guru BK atau kanal resmi pemerintah', isCorrect: true, feedback: 'Sangat Tepat! Lembaga resmi pemerintah tidak pernah mendistribusikan surat pengumuman via file .apk mencurigakan melalui WhatsApp pribadi.' },
          ],
        },
        hints: ['Perhatikan ekstensi file (.apk di Android merupakan paket aplikasi program, bukan dokumen PDF biasa).', 'Ciri khas scam adalah menciptakan urgensi palsu.'],
        explanation:
          'Modus sniffing/malware berkedok undangan nikah atau beasiswa format .apk dirancang untuk menyadap SMS OTP perbankan korban. Tidak pernah instal file .apk tak dikenal adalah prinsip keamanan dasar.',
      },
      {
        id: 'step-4-2',
        title: 'Komponen Kata Sandi Kuat (Strong Password)',
        type: 'multiple_choice',
        instruction: 'Dari pilihan berikut, manakah pola kata sandi yang paling aman terhadap serangan brute force dan dictionary attack?',
        data: {
          options: [
            'smkbisa12345 (nama sekolah + angka urut)',
            '26102008 (tanggal lahir pemilik)',
            'Bintang#Gitar$92Kopi (Passphrase kombinasi 4 kata acak, huruf besar, simbol, dan angka)',
            'password_rahasia (kata umum dalam kamus)',
          ],
          correctIndex: 2,
        },
        hints: ['Passphrase panjang yang menggabungkan kata berbeda, angka, dan karakter khusus membutuhkan miliaran tahun untuk dibobol komputer brute force.'],
        explanation:
          'Passphrase majemuk (panjang > 14 karakter) dengan variasi simbol jauh lebih tahan terhadap serangan kamus (dictionary attack) daripada kata sandi pendek berbasis tanggal lahir atau nama umum.',
      },
    ],
    missionQuiz: [
      {
        id: 'mq-4-1',
        type: 'multiple_choice',
        topic: 'Keamanan Siber',
        difficulty: 'Dasar',
        question: 'Apakah fungsi utama dari Two-Factor Authentication (2FA) pada akun email atau media sosial?',
        options: [
          'Memberikan lapisan keamanan kedua (seperti kode OTP/kunci fisik) meskipun password telah bocor',
          'Membuat kecepatan internet akun menjadi 2 kali lebih cepat',
          'Menghapus jejak riwayat browsing secara otomatis setiap logout',
          'Menggandakan kapasitas memori cloud storage',
        ],
        correctIndex: 0,
        explanation: '2FA menambahkan verifikasi kepemilikan perangkat (something you have) setelah memasukkan kata sandi (something you know), sehingga peretas yang mengetahui password tetap tidak bisa login.',
        hint: '2FA melibatkan faktor kedua selain kata sandi.',
        reviewTopic: 'Otentikasi Dua Faktor (2FA)',
      },
    ],
    status: 'available',
  },
  {
    id: 'misi-5',
    number: 5,
    title: 'Etika & Tanggung Jawab Kecerdasan Artifisial (AI Ethics)',
    subtitle: 'Menjadi kreator cerdas yang bijak: Menghadapi bias, privasi, dan integritas akademik.',
    level: 'Level 3 — Digital Innovator',
    topic: 'Etika AI & Literasi Data',
    estimatedMinutes: 30,
    xpReward: 400,
    badge: {
      name: 'Ethical AI Champion',
      icon: 'Scale',
      description: 'Menjunjung integritas, memverifikasi fakta AI, dan menghormati hak cipta.',
    },
    learningObjectives: [
      'Memahami keterbatasan AI Generatif (halusinasi informasi dan bias data latih).',
      'Menerapkan prinsip integritas akademik saat menggunakan AI untuk tugas sekolah.',
      'Menghormati hak kekayaan intelektual (HAKI) dan perlindungan data pribadi (UU PDP).',
    ],
    quickSummary:
      'AI adalah akselerator ide dan asisten belajar yang hebat, bukan pengganti otak manusia. Siswa SMK harus memiliki keterampilan verifikasi fakta (fact-checking), menyebutkan atribusi penggunaan AI secara transparan, serta menjaga data sensitif tidak diunggah ke internet.',
    contextualCase: {
      role: 'Ketua Tim Proyek Kreatif Digital SMK',
      scenario:
        'Dalam tugas menyusun artikel teknologi otomotif ramah lingkungan, salah satu anggota tim Anda menyalin 100% jawaban dari AI tanpa membaca ulang dan tanpa menyebutkan sumber referensi. Ternyata ada data statistik palsu yang diciptakan oleh model (AI Hallucination).',
      challenge:
        'Bangun protokol verifikasi informasi dan panduan etis penggunaan AI di lingkungan belajar SMK.',
    },
    interactiveSteps: [
      {
        id: 'step-5-1',
        title: 'Deteksi Halusinasi AI & Verifikasi Fakta',
        type: 'scenario_decision',
        instruction: 'Bagaimana langkah verifikasi yang benar sebelum mengutip data angka/fakta dari AI ke dalam laporan?',
        data: {
          scenario:
            'AI menyebutkan: "Baterai mobil listrik model X mampu bertahan 30 tahun tanpa penggantian berdasarkan riset Universitas Z tahun 2024."',
          options: [
            { id: 'opt-a', text: 'Langsung percaya karena AI dilatih dari miliaran dokumen internet', isCorrect: false, feedback: 'AI Generatif memprediksi kata berikutnya secara probabilistik dan bisa mengalami "halusinasi" menghasilkan informasi fiktif yang terdengar meyakinkan.' },
            { id: 'opt-b', text: 'Cari judul riset atau jurnal Universitas Z tersebut di Google Cendekia / situs resmi untuk memastikan keberadaan dan validitas data', isCorrect: true, feedback: 'Tepat sekali! Selalu lakukan triangulasi data dengan jurnal, buku, atau situs kredibel.' },
            { id: 'opt-c', text: 'Tanyakan lagi ke AI yang sama: "Apakah kamu yakin?" lalu selesai', isCorrect: false, feedback: 'Menanyakan ke AI yang sama tanpa verifikasi sumber primer eksternal tidak menjamin akurasi fakta.' },
          ],
        },
        hints: ['Triangulasi informasi ke sumber primer adalah standar literasi ilmiah.'],
        explanation:
          'AI generatif bekerja dengan memprediksi token kata berdasarkan korelasi statistik, bukan pemahaman kebenaran mutlak. Oleh sebab itu, klaim data atau fakta sejarah/teknis wajib selalu dicocokkan ke sumber ilmiah yang sah.',
      },
      {
        id: 'step-5-2',
        title: 'Transparansi & Kejujuran Akademik',
        type: 'multiple_choice',
        instruction: 'Manakah bentuk atribusi penggunaan AI yang paling sesuai dengan etika Kurikulum Merdeka?',
        data: {
          options: [
            'Menyembunyikan penggunaan AI agar mendapat pujian dari guru',
            'Menyertakan catatan transparan di akhir karya: "Ide kerangka awal dibantu oleh AI, draf dikembangkan secara mandiri, dan fakta telah diverifikasi melalui buku [X]"',
            'Menyalin mentah-mentah dan mengganti beberapa kata sambung saja',
            'Menggunakan AI untuk mengerjakan ujian tertutup',
          ],
          correctIndex: 1,
        },
        hints: ['Integritas terletak pada kejujuran proses dan penghargaan terhadap sumber ide.'],
        explanation:
          'Transparansi menunjukkan kedewasaan intelektual. Menyebutkan bagian mana yang dibantu AI dan bagaimana Anda memvalidasinya adalah praktik terbaik di era kecerdasan artifisial.',
      },
    ],
    missionQuiz: [
      {
        id: 'mq-5-1',
        type: 'multiple_choice',
        topic: 'Etika AI',
        difficulty: 'Menengah',
        question: 'Mengapa kita tidak boleh memasukkan data pribadi sensitif (seperti NIK KTP, password, nomor rekening, atau rekam medis) ke dalam prompt AI publik?',
        options: [
          'Karena prompt dapat disimpan oleh penyedia platform untuk pelatihan model berikutnya dan berisiko bocor',
          'Karena AI akan menolak semua kalimat yang mengandung angka',
          'Karena komputer AI akan meledak jika menerima data rahasia',
          'Karena data pribadi otomatis berubah menjadi virus komputer',
        ],
        correctIndex: 0,
        explanation: 'Data yang dikirim ke layanan cloud publik dapat disimpan dalam log server dan berpotensi terekspos jika terjadi kebocoran data (Data Breach) sesuai ketentuan UU PDP.',
        hint: 'Ingat regulasi privasi data dan bagaimana model AI belajar dari input pengguna.',
        reviewTopic: 'Privasi Data & Keamanan Informasi Publik',
      },
    ],
    status: 'available',
  },
  {
    id: 'misi-6',
    number: 6,
    title: 'Inovasi Digital: Rancang Solusi Nyata untuk Sekolahmu',
    subtitle: 'Menerapkan TIK, algoritma, dan desain sistem untuk memecahkan problem riil di SMK.',
    level: 'Level 3 — Digital Innovator',
    topic: 'Proyek Rekayasa Solusi TIK',
    estimatedMinutes: 35,
    xpReward: 500,
    badge: {
      name: 'SMK Innovator',
      icon: 'Rocket',
      description: 'Berhasil merancang blueprint sistem digital terintegrasi untuk sekolah.',
    },
    learningObjectives: [
      'Mengidentifikasi kebutuhan pengguna (user requirements) di lingkungan sekolah.',
      'Merancang arsitektur sistem sederhana (input, database, antarmuka, notifikasi).',
      'Mempresentasikan gagasan inovasi digital dengan argumen rasional dan terukur.',
    ],
    quickSummary:
      'Puncak pembelajaran Informatika kelas X adalah kemampuan memecahkan masalah nyata dengan solusi digital. Mulai dari peminjaman alat lab praktik kejuruan, perpustakaan digital, hingga sistem monitoring fasilitas sekolah.',
    contextualCase: {
      role: 'Kepala Tim R&D Digital Siswa SMK',
      scenario:
        'Peminjaman alat di ruang bengkel praktik jurusan SMK sering kacau: alat multimeter dan solder sering hilang, kartu pinjam manual sering terselip, dan siswa kesulitan mengetahui ketersediaan alat sebelum jam praktik dimulai.',
      challenge:
        'Rancang rancang-bangun (blueprint) aplikasi "Smart Tool Loan SMK" berbasis web/mobile.',
    },
    interactiveSteps: [
      {
        id: 'step-6-1',
        title: 'Menentukan Fitur Kunci Sistem Peminjaman',
        type: 'multiple_choice',
        instruction: 'Fitur mana yang paling krusial untuk mencegah kehilangan alat bengkel secara akuntabel?',
        data: {
          options: [
            'Game mini pengisi waktu luang saat menunggu alat',
            'Pencatatan barcode/QR code pada setiap unit alat yang terikat dengan NISN peminjam dan batas waktu pengembalian otomatis',
            'Animasi 3D berputar pada menu utama aplikasi',
            'Pemutar musik latar belakang saat siswa memilih solder',
          ],
          correctIndex: 1,
        },
        hints: ['Fokus pada akar masalah: bagaimana membuktikan siapa yang membawa alat fisik tertentu.'],
        explanation:
          'Pengikatan unik antara ID alat (QR code unik per item) dengan ID peminjam (NISN siswa) menjamin penelusuran (traceability) dan akuntabilitas kepemilikan alat fisik.',
      },
      {
        id: 'step-6-2',
        title: 'Alur Proses Peminjaman Terintegrasi',
        type: 'order_steps',
        instruction: 'Susun alur pengguna yang paling logis untuk aplikasi peminjaman alat praktik:',
        data: {
          initialItems: [
            'Toolman bengkel menyerahkan alat setelah memeriksa kondisi fisik',
            'Siswa memilih jenis alat dan memindai QR code unik pada unit alat',
            'Siswa melakukan login dengan NISN dan memilih jadwal mata pelajaran praktik',
            'Sistem mengirimkan notifikasi pengembalian 15 menit sebelum jam praktik usai',
            'Saat pengembalian, toolman scan ulang QR code dan status berubah menjadi "Tersedia"',
          ],
          correctOrder: [
            'Siswa melakukan login dengan NISN dan memilih jadwal mata pelajaran praktik',
            'Siswa memilih jenis alat dan memindai QR code unik pada unit alat',
            'Toolman bengkel menyerahkan alat setelah memeriksa kondisi fisik',
            'Sistem mengirimkan notifikasi pengembalian 15 menit sebelum jam praktik usai',
            'Saat pengembalian, toolman scan ulang QR code dan status berubah menjadi "Tersedia"',
          ],
        },
        hints: ['Alur dimulai dari autentikasi siswa, transaksi scan pinjam, penyerahan fisik, pengingat, dan penutupan transaksi kembali.'],
        explanation:
          'Desain interaksi pengguna (UX) yang runtut mencegah celah kelalaian manusia pada penyerahan dan pengembalian barang berharga.',
      },
    ],
    missionQuiz: [
      {
        id: 'mq-6-1',
        type: 'case_study',
        topic: 'Inovasi Digital',
        difficulty: 'Tantangan',
        question: 'Ketika aplikasi rancangan Anda telah selesai dibuat versi purwarupa (prototype), langkah apa yang paling tepat dilakukan sebelum sistem diimplementasikan secara penuh di sekolah?',
        options: [
          'Melakukan Uji Coba Pengguna Terbatas (User Acceptance Testing / UAT) bersama siswa dan toolman bengkel untuk mendapatkan umpan balik langsung',
          'Langsung menghapus semua buku catatan manual dan memaksa semua orang memakainya tanpa pelatihan',
          'Merahasiakan aplikasi dan menyimpannya di laptop pribadi saja',
          'Menjual aplikasi ke sekolah lain tanpa pernah diuji coba sama sekali',
        ],
        correctIndex: 0,
        explanation: 'User Acceptance Testing (UAT) memastikan aplikasi benar-benar menjawab kebutuhan riil pengguna, mendeteksi bug tersembunyi, dan memastikan kesiapan pengguna.',
        hint: 'Sebelum rilis masal, perangkat lunak selalu membutuhkan pengujian oleh pengguna nyata.',
        reviewTopic: 'Siklus Pengembangan Perangkat Lunak (SDLC) & Pengujian Pengguna',
      },
    ],
    status: 'available',
  },
];
