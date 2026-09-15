'use strict';

// ─── Config (hardcoded — no UI panel needed) ──────────────────────────────────
const API_KEY = 'd033bb9718bace3741ef7e882a6d291841591554';
const LANG    = 'id';

// ─── Cache ────────────────────────────────────────────────────────────────────
const LS_CACHE = 'kw_cache';

function loadCache() {
  try { return JSON.parse(localStorage.getItem(LS_CACHE)) || {}; }
  catch { return {}; }
}
function saveCache(cache) {
  try { localStorage.setItem(LS_CACHE, JSON.stringify(cache)); }
  catch { /* quota exceeded */ }
}

// ─── State ────────────────────────────────────────────────────────────────────
let openCount = 0;

// ─── 200 default keywords ─────────────────────────────────────────────────────
const DEFAULT_KEYWORDS = [
  { word: "Internet",            explanation: "Jaringan global yang menghubungkan jutaan komputer di seluruh dunia menggunakan protokol TCP/IP." },
  { word: "Jaringan",            explanation: "Sekumpulan perangkat yang saling terhubung untuk berbagi data dan sumber daya." },
  { word: "Protokol",            explanation: "Aturan atau standar yang mengatur cara data dikirim dan diterima antar perangkat." },
  { word: "TCP/IP",              explanation: "Transmission Control Protocol/Internet Protocol — protokol utama yang digunakan di internet." },
  { word: "Router",              explanation: "Perangkat yang mengarahkan paket data antar jaringan berbeda." },
  { word: "Switch",              explanation: "Perangkat jaringan yang menghubungkan beberapa perangkat dalam satu jaringan lokal (LAN)." },
  { word: "Bandwidth",           explanation: "Kapasitas maksimum data yang dapat ditransmisikan melalui jaringan dalam waktu tertentu." },
  { word: "Latency",             explanation: "Waktu tunda yang diperlukan data untuk berjalan dari sumber ke tujuan." },
  { word: "IP Address",          explanation: "Alamat unik yang diberikan kepada setiap perangkat dalam jaringan untuk identifikasi." },
  { word: "DNS",                 explanation: "Domain Name System — sistem yang menerjemahkan nama domain menjadi alamat IP." },
  { word: "HTTP",                explanation: "HyperText Transfer Protocol — protokol untuk mengirimkan halaman web dari server ke browser." },
  { word: "HTTPS",               explanation: "Versi aman dari HTTP yang menggunakan enkripsi SSL/TLS untuk melindungi data." },
  { word: "Server",              explanation: "Komputer yang menyediakan layanan, data, atau sumber daya kepada komputer lain (klien)." },
  { word: "Client",              explanation: "Perangkat atau program yang meminta layanan atau data dari server." },
  { word: "Firewall",            explanation: "Sistem keamanan yang memantau dan mengontrol lalu lintas jaringan berdasarkan aturan tertentu." },
  { word: "VPN",                 explanation: "Virtual Private Network — teknologi yang membuat koneksi terenkripsi melalui jaringan publik." },
  { word: "WiFi",                explanation: "Teknologi jaringan nirkabel yang memungkinkan perangkat terhubung ke internet tanpa kabel." },
  { word: "LAN",                 explanation: "Local Area Network — jaringan yang mencakup area terbatas seperti rumah atau kantor." },
  { word: "WAN",                 explanation: "Wide Area Network — jaringan yang mencakup area geografis yang luas, seperti internet." },
  { word: "MAN",                 explanation: "Metropolitan Area Network — jaringan yang mencakup area satu kota atau kampus besar." },
  { word: "Ethernet",            explanation: "Teknologi jaringan kabel yang paling umum digunakan untuk LAN." },
  { word: "MAC Address",         explanation: "Media Access Control Address — alamat fisik unik yang tertanam pada kartu jaringan." },
  { word: "Subnet",              explanation: "Pembagian jaringan IP yang lebih besar menjadi segmen-segmen lebih kecil." },
  { word: "Gateway",             explanation: "Node jaringan yang berfungsi sebagai titik akses ke jaringan lain." },
  { word: "Modem",               explanation: "Perangkat yang mengubah sinyal digital menjadi analog (dan sebaliknya) untuk transmisi data." },
  { word: "Packet",              explanation: "Unit data kecil yang dikirimkan melalui jaringan sebagai bagian dari transmisi yang lebih besar." },
  { word: "Enkripsi",            explanation: "Proses mengubah data menjadi kode rahasia agar tidak dapat dibaca oleh pihak yang tidak berwenang." },
  { word: "Dekripsi",            explanation: "Proses mengubah data terenkripsi kembali menjadi bentuk yang dapat dibaca." },
  { word: "SSL",                 explanation: "Secure Sockets Layer — protokol keamanan untuk enkripsi data antara browser dan server." },
  { word: "TLS",                 explanation: "Transport Layer Security — penerus SSL yang lebih aman untuk enkripsi komunikasi internet." },
  { word: "Cloud",               explanation: "Layanan komputasi yang menyediakan sumber daya IT melalui internet secara on-demand." },
  { word: "Server Cloud",        explanation: "Server virtual yang berjalan di infrastruktur cloud dan dapat diakses dari mana saja." },
  { word: "Hosting",             explanation: "Layanan yang menyediakan ruang penyimpanan di server untuk website atau aplikasi." },
  { word: "Domain",              explanation: "Nama unik yang mengidentifikasi sebuah website di internet, seperti google.com." },
  { word: "URL",                 explanation: "Uniform Resource Locator — alamat lengkap yang menunjukkan lokasi sumber daya di internet." },
  { word: "Browser",             explanation: "Aplikasi yang digunakan untuk mengakses dan menampilkan halaman web, seperti Chrome atau Firefox." },
  { word: "HTML",                explanation: "HyperText Markup Language — bahasa markup standar untuk membuat halaman web." },
  { word: "CSS",                 explanation: "Cascading Style Sheets — bahasa untuk mengatur tampilan dan gaya halaman web." },
  { word: "JavaScript",          explanation: "Bahasa pemrograman yang membuat halaman web menjadi interaktif dan dinamis." },
  { word: "API",                 explanation: "Application Programming Interface — antarmuka yang memungkinkan aplikasi berbeda untuk saling berkomunikasi." },
  { word: "Database",            explanation: "Kumpulan data terstruktur yang disimpan dan dikelola secara elektronik." },
  { word: "SQL",                 explanation: "Structured Query Language — bahasa untuk mengelola dan mengquery database relasional." },
  { word: "NoSQL",               explanation: "Tipe database non-relasional yang fleksibel untuk data tidak terstruktur." },
  { word: "Cache",               explanation: "Penyimpanan sementara data yang sering diakses untuk mempercepat pengambilan data." },
  { word: "Cookie",              explanation: "File kecil yang disimpan browser untuk mengingat informasi pengguna di website." },
  { word: "Session",             explanation: "Periode interaksi antara pengguna dan server web, biasanya berakhir saat browser ditutup." },
  { word: "Autentikasi",         explanation: "Proses verifikasi identitas pengguna, biasanya melalui username dan password." },
  { word: "Otorisasi",           explanation: "Proses menentukan hak akses yang dimiliki pengguna yang sudah terautentikasi." },
  { word: "Token",               explanation: "Kode digital yang digunakan untuk autentikasi atau otorisasi akses ke sistem." },
  { word: "OAuth",               explanation: "Protokol standar untuk memberikan akses terbatas ke akun pengguna tanpa berbagi password." },
  { word: "Malware",             explanation: "Perangkat lunak berbahaya yang dirancang untuk merusak atau menyusup ke sistem komputer." },
  { word: "Virus",               explanation: "Program berbahaya yang dapat menggandakan diri dan menyebar ke file lain di komputer." },
  { word: "Trojan",              explanation: "Malware yang menyamar sebagai program sah untuk menipu pengguna agar menginstalnya." },
  { word: "Ransomware",          explanation: "Malware yang mengenkripsi file korban dan meminta tebusan untuk memulihkan akses." },
  { word: "Phishing",            explanation: "Serangan siber yang menipu pengguna untuk memberikan informasi sensitif melalui email atau website palsu." },
  { word: "DDoS",                explanation: "Distributed Denial of Service — serangan yang membanjiri server dengan traffic untuk membuatnya tidak berfungsi." },
  { word: "Antivirus",           explanation: "Perangkat lunak yang mendeteksi, mencegah, dan menghapus malware dari komputer." },
  { word: "Patch",               explanation: "Pembaruan perangkat lunak yang memperbaiki celah keamanan atau bug pada program." },
  { word: "Vulnerability",       explanation: "Kelemahan dalam sistem atau software yang dapat dieksploitasi oleh penyerang." },
  { word: "Exploit",             explanation: "Kode atau teknik yang memanfaatkan kelemahan sistem untuk mendapatkan akses tidak sah." },
  { word: "Hacker",              explanation: "Seseorang yang memiliki keahlian teknis tinggi untuk menerobos atau mengamankan sistem komputer." },
  { word: "Ethical Hacker",      explanation: "Profesional keamanan yang sah ditugaskan untuk menguji dan menemukan kelemahan sistem." },
  { word: "Penetration Test",    explanation: "Uji keamanan resmi yang mensimulasikan serangan siber untuk menemukan celah keamanan." },
  { word: "Proxy",               explanation: "Server perantara yang meneruskan permintaan antara klien dan server tujuan." },
  { word: "Load Balancer",       explanation: "Perangkat yang mendistribusikan traffic jaringan ke beberapa server untuk efisiensi." },
  { word: "CDN",                 explanation: "Content Delivery Network — jaringan server yang mendistribusikan konten ke pengguna berdasarkan lokasi." },
  { word: "Ping",                explanation: "Perintah jaringan untuk menguji konektivitas antara dua perangkat dan mengukur waktu respons." },
  { word: "Traceroute",          explanation: "Alat diagnostik yang menampilkan jalur yang dilalui paket data dari sumber ke tujuan." },
  { word: "Port",                explanation: "Angka yang mengidentifikasi proses atau layanan tertentu di dalam sistem komputer." },
  { word: "Socket",              explanation: "Kombinasi IP address dan port yang membentuk endpoint komunikasi jaringan." },
  { word: "FTP",                 explanation: "File Transfer Protocol — protokol untuk mentransfer file antara komputer melalui jaringan." },
  { word: "SSH",                 explanation: "Secure Shell — protokol terenkripsi untuk mengakses dan mengelola komputer dari jarak jauh." },
  { word: "SMTP",                explanation: "Simple Mail Transfer Protocol — protokol standar untuk mengirimkan email." },
  { word: "IMAP",                explanation: "Internet Message Access Protocol — protokol untuk mengakses email dari server." },
  { word: "POP3",                explanation: "Post Office Protocol 3 — protokol untuk mengunduh email dari server ke perangkat lokal." },
  { word: "WebSocket",           explanation: "Protokol yang menyediakan komunikasi dua arah secara real-time antara klien dan server." },
  { word: "REST API",            explanation: "Gaya arsitektur API yang menggunakan HTTP untuk komunikasi antara klien dan server." },
  { word: "JSON",                explanation: "JavaScript Object Notation — format ringan untuk pertukaran data antar sistem." },
  { word: "XML",                 explanation: "eXtensible Markup Language — format markup untuk menyimpan dan mengirimkan data terstruktur." },
  { word: "Microservices",       explanation: "Arsitektur perangkat lunak yang membangun aplikasi sebagai kumpulan layanan kecil yang independen." },
  { word: "Containerization",    explanation: "Teknologi yang mengemas aplikasi beserta dependensinya agar berjalan konsisten di lingkungan apapun." },
  { word: "Docker",              explanation: "Platform containerization populer yang memungkinkan pengembang membuat dan menjalankan kontainer." },
  { word: "Kubernetes",          explanation: "Sistem orkestrasi kontainer open-source untuk mengotomatiskan deployment dan pengelolaan aplikasi." },
  { word: "DevOps",              explanation: "Metodologi yang mengintegrasikan pengembangan software dan operasi IT untuk percepatan delivery." },
  { word: "CI/CD",               explanation: "Continuous Integration/Continuous Deployment — praktik otomatisasi build, test, dan deployment software." },
  { word: "Git",                 explanation: "Sistem kontrol versi terdistribusi yang melacak perubahan kode sumber selama pengembangan." },
  { word: "Repository",          explanation: "Tempat penyimpanan kode sumber dan riwayat perubahannya, bisa lokal atau di cloud." },
  { word: "Commit",              explanation: "Proses menyimpan perubahan kode ke dalam repository git dengan pesan deskripsi." },
  { word: "Branch",              explanation: "Cabang pengembangan terpisah dalam repository yang memungkinkan kerja paralel tanpa konflik." },
  { word: "Merge",               explanation: "Proses menggabungkan perubahan dari satu branch ke branch lain dalam git." },
  { word: "Pull Request",        explanation: "Permintaan untuk menggabungkan kode dari satu branch ke branch lain, biasanya disertai review." },
  { word: "IPv4",                explanation: "Internet Protocol version 4 — versi IP dengan alamat 32-bit, contoh: 192.168.1.1" },
  { word: "IPv6",                explanation: "Internet Protocol version 6 — versi IP terbaru dengan alamat 128-bit untuk lebih banyak perangkat." },
  { word: "NAT",                 explanation: "Network Address Translation — teknik yang memetakan beberapa IP lokal ke satu IP publik." },
  { word: "DHCP",                explanation: "Dynamic Host Configuration Protocol — protokol yang otomatis menetapkan alamat IP ke perangkat." },
  { word: "OSI Model",           explanation: "Model referensi jaringan 7 lapis yang menstandarisasi fungsi-fungsi komunikasi jaringan." },
  { word: "Physical Layer",      explanation: "Lapisan OSI pertama yang menangani transmisi bit melalui media fisik seperti kabel." },
  { word: "Data Link Layer",     explanation: "Lapisan OSI kedua yang mengatur transfer data antar node yang terhubung langsung." },
  { word: "Network Layer",       explanation: "Lapisan OSI ketiga yang bertanggung jawab untuk routing paket data antar jaringan." },
  { word: "Transport Layer",     explanation: "Lapisan OSI keempat yang menyediakan transfer data yang handal antara host." },
  { word: "Application Layer",   explanation: "Lapisan OSI ketujuh yang menyediakan antarmuka antara aplikasi dan jaringan." },
  { word: "Throughput",          explanation: "Jumlah data aktual yang berhasil ditransmisikan melalui jaringan dalam periode waktu tertentu." },
  { word: "Jitter",              explanation: "Variasi keterlambatan dalam pengiriman paket data yang dapat mempengaruhi kualitas streaming." },
  { word: "Packet Loss",         explanation: "Kondisi saat paket data gagal mencapai tujuannya, menyebabkan penurunan performa jaringan." },
  { word: "QoS",                 explanation: "Quality of Service — teknik untuk memprioritaskan jenis traffic tertentu dalam jaringan." },
  { word: "VLAN",                explanation: "Virtual LAN — pembagian logis jaringan fisik menjadi beberapa jaringan virtual terpisah." },
  { word: "Topology",            explanation: "Susunan fisik atau logis dari perangkat dan koneksi dalam sebuah jaringan." },
  { word: "Star Topology",       explanation: "Topologi jaringan di mana semua perangkat terhubung ke satu hub atau switch pusat." },
  { word: "Bus Topology",        explanation: "Topologi jaringan di mana semua perangkat terhubung ke satu kabel utama." },
  { word: "Ring Topology",       explanation: "Topologi jaringan di mana perangkat terhubung membentuk cincin tertutup." },
  { word: "Mesh Topology",       explanation: "Topologi di mana setiap perangkat terhubung langsung ke semua perangkat lainnya." },
  { word: "Fiber Optik",         explanation: "Media transmisi data menggunakan cahaya melalui serat kaca, sangat cepat dan tahan gangguan." },
  { word: "Coaxial Cable",       explanation: "Jenis kabel dengan konduktor pusat dikelilingi lapisan pelindung, digunakan di TV kabel dan jaringan lama." },
  { word: "Twisted Pair",        explanation: "Kabel jaringan dengan pasangan kawat yang dipilin untuk mengurangi interferensi elektromagnetik." },
  { word: "Wireless",            explanation: "Teknologi transmisi data tanpa kabel fisik, menggunakan gelombang radio atau inframerah." },
  { word: "Bluetooth",           explanation: "Teknologi nirkabel jarak pendek untuk menghubungkan perangkat dalam radius sekitar 10 meter." },
  { word: "NFC",                 explanation: "Near Field Communication — teknologi nirkabel jarak sangat dekat untuk pembayaran dan transfer data." },
  { word: "IoT",                 explanation: "Internet of Things — konsep perangkat sehari-hari yang terhubung ke internet dan saling berkomunikasi." },
  { word: "5G",                  explanation: "Generasi kelima jaringan seluler dengan kecepatan sangat tinggi dan latensi sangat rendah." },
  { word: "4G LTE",              explanation: "Standar jaringan seluler generasi keempat dengan kecepatan unduh hingga 150 Mbps." },
  { word: "Hotspot",             explanation: "Titik akses WiFi publik yang memungkinkan perangkat terhubung ke internet di area tertentu." },
  { word: "Tethering",           explanation: "Berbagi koneksi internet dari smartphone ke perangkat lain melalui WiFi, Bluetooth, atau USB." },
  { word: "Bandwidth Throttling",explanation: "Pembatasan sengaja kecepatan internet oleh ISP berdasarkan penggunaan atau jenis traffic." },
  { word: "ISP",                 explanation: "Internet Service Provider — perusahaan yang menyediakan layanan akses internet kepada pelanggan." },
  { word: "Uptime",              explanation: "Persentase waktu sistem atau layanan beroperasi normal tanpa gangguan." },
  { word: "Downtime",            explanation: "Periode saat sistem atau layanan tidak beroperasi atau tidak dapat diakses." },
  { word: "Redundancy",          explanation: "Penggandaan komponen sistem untuk memastikan ketersediaan layanan saat terjadi kegagalan." },
  { word: "Backup",              explanation: "Salinan data yang dibuat untuk pemulihan jika data asli rusak atau hilang." },
  { word: "Recovery",            explanation: "Proses memulihkan sistem atau data ke kondisi normal setelah kegagalan." },
  { word: "Virtualisasi",        explanation: "Teknologi yang menciptakan versi virtual dari sumber daya hardware untuk efisiensi penggunaan." },
  { word: "Hypervisor",          explanation: "Perangkat lunak yang memungkinkan berjalan beberapa sistem operasi virtual di satu hardware." },
  { word: "Virtual Machine",     explanation: "Emulasi komputer yang berjalan di atas komputer fisik menggunakan hypervisor." },
  { word: "SaaS",                explanation: "Software as a Service — model layanan cloud di mana software diakses via internet, seperti Gmail." },
  { word: "PaaS",                explanation: "Platform as a Service — layanan cloud yang menyediakan platform pengembangan aplikasi." },
  { word: "IaaS",                explanation: "Infrastructure as a Service — layanan cloud yang menyediakan infrastruktur IT virtual." },
  { word: "Scalability",         explanation: "Kemampuan sistem untuk menangani peningkatan beban kerja dengan menambah sumber daya." },
  { word: "Availability",        explanation: "Tingkat aksesibilitas dan keandalan sistem dalam melayani pengguna tanpa gangguan." },
  { word: "Reliability",         explanation: "Kemampuan sistem untuk berfungsi dengan benar secara konsisten selama periode waktu tertentu." },
  { word: "Latency Optimization",explanation: "Teknik untuk mengurangi waktu tunda dalam transmisi data untuk pengalaman pengguna yang lebih baik." },
  { word: "Compression",         explanation: "Pengurangan ukuran data untuk menghemat ruang penyimpanan dan mempercepat transmisi." },
  { word: "Deduplication",       explanation: "Teknik penyimpanan yang menghilangkan data duplikat untuk menghemat ruang." },
  { word: "Streaming",           explanation: "Pengiriman dan pemutaran konten media secara langsung tanpa perlu mengunduh seluruh file." },
  { word: "P2P",                 explanation: "Peer-to-Peer — model jaringan di mana setiap perangkat bertindak sebagai klien dan server." },
  { word: "Torrent",             explanation: "Protokol P2P untuk mendistribusikan file besar melalui banyak pengguna secara bersamaan." },
  { word: "Web Scraping",        explanation: "Teknik otomatis untuk mengekstrak data dari halaman web menggunakan program." },
  { word: "Crawling",            explanation: "Proses otomatis menjelajahi halaman web untuk mengumpulkan dan mengindeks konten." },
  { word: "Indexing",            explanation: "Proses mengorganisir data dari web crawler ke dalam database yang dapat dicari dengan cepat." },
  { word: "Search Algorithm",    explanation: "Serangkaian instruksi yang digunakan mesin pencari untuk menentukan relevansi dan ranking hasil pencarian." },
  { word: "PageRank",            explanation: "Algoritma Google yang menentukan kepentingan halaman web berdasarkan jumlah dan kualitas tautan masuk." },
  { word: "SEO",                 explanation: "Search Engine Optimization — praktik mengoptimalkan website agar mendapat peringkat tinggi di hasil pencarian." },
  { word: "Backlink",            explanation: "Tautan dari website lain yang menunjuk ke website kamu, meningkatkan otoritas di mesin pencari." },
  { word: "Sitemap",             explanation: "File XML yang mendaftar semua halaman website untuk membantu mesin pencari mengindeks konten." },
  { word: "Robots.txt",          explanation: "File teks yang memberitahu crawler mesin pencari halaman mana yang boleh atau tidak boleh diindeks." },
  { word: "Metadata",            explanation: "Data yang mendeskripsikan data lain, seperti tag HTML yang menjelaskan konten halaman web." },
  { word: "Open Graph",          explanation: "Protokol meta tag yang mengontrol tampilan konten saat dibagikan di media sosial." },
  { word: "Responsive Design",   explanation: "Pendekatan desain web yang membuat tampilan menyesuaikan diri dengan ukuran layar perangkat." },
  { word: "Progressive Web App", explanation: "Aplikasi web yang memiliki kemampuan seperti aplikasi native, bisa diinstal dan bekerja offline." },
  { word: "Single Page App",     explanation: "Aplikasi web yang memuat satu halaman HTML dan memperbarui konten secara dinamis tanpa reload." },
  { word: "Framework",           explanation: "Kerangka kerja perangkat lunak yang menyediakan fondasi standar untuk pengembangan aplikasi." },
  { word: "Library",             explanation: "Kumpulan kode yang dapat digunakan kembali untuk memudahkan pengembangan software." },
  { word: "React",               explanation: "Library JavaScript buatan Meta untuk membangun antarmuka pengguna yang interaktif dan efisien." },
  { word: "Node.js",             explanation: "Runtime JavaScript di sisi server yang memungkinkan JavaScript berjalan di luar browser." },
  { word: "Python",              explanation: "Bahasa pemrograman tingkat tinggi yang populer untuk web, data science, dan otomatisasi." },
  { word: "Big Data",            explanation: "Kumpulan data dalam volume sangat besar yang memerlukan alat khusus untuk diproses dan dianalisis." },
  { word: "Machine Learning",    explanation: "Cabang AI di mana sistem belajar dari data untuk membuat prediksi tanpa diprogram secara eksplisit." },
  { word: "Artificial Intelligence", explanation: "Simulasi kecerdasan manusia dalam mesin yang diprogram untuk berpikir dan belajar." },
  { word: "Deep Learning",       explanation: "Subset machine learning yang menggunakan jaringan saraf tiruan berlapis untuk pembelajaran kompleks." },
  { word: "Neural Network",      explanation: "Sistem komputasi terinspirasi otak manusia yang terdiri dari node-node yang saling terhubung." },
  { word: "Natural Language Processing", explanation: "Cabang AI yang memungkinkan komputer memahami dan menghasilkan bahasa manusia." },
  { word: "Blockchain",          explanation: "Teknologi buku besar terdistribusi yang mencatat transaksi secara aman dan transparan." },
  { word: "Cryptocurrency",      explanation: "Mata uang digital yang menggunakan kriptografi untuk keamanan transaksi, seperti Bitcoin." },
  { word: "Cybersecurity",       explanation: "Praktik melindungi sistem, jaringan, dan program dari serangan digital dan ancaman siber." },
  { word: "Zero Trust",          explanation: "Model keamanan yang tidak mempercayai siapapun secara default, memverifikasi semua akses." },
  { word: "Multi-Factor Auth",   explanation: "Metode autentikasi yang memerlukan dua atau lebih bukti identitas untuk mengakses akun." },
  { word: "End-to-End Encryption", explanation: "Enkripsi di mana hanya pengirim dan penerima yang dapat membaca pesan, bukan perantara." },
  { word: "Digital Signature",   explanation: "Tanda tangan elektronik kriptografis yang memverifikasi keaslian dan integritas dokumen digital." },
  { word: "Certificate",         explanation: "Dokumen digital yang memverifikasi identitas website atau entitas dan memungkinkan koneksi aman." },
  { word: "PKI",                 explanation: "Public Key Infrastructure — sistem manajemen sertifikat digital untuk komunikasi aman." },
  { word: "Hashing",             explanation: "Proses mengubah data menjadi nilai tetap (hash) yang unik, digunakan untuk verifikasi integritas data." },
  { word: "Salting",             explanation: "Teknik keamanan menambahkan data acak ke password sebelum di-hash untuk mencegah serangan." },
  { word: "Brute Force",         explanation: "Serangan siber yang mencoba semua kemungkinan kombinasi password secara sistematis." },
  { word: "Man in the Middle",   explanation: "Serangan di mana penyerang menyisipkan diri di antara dua pihak yang berkomunikasi secara diam-diam." },
  { word: "SQL Injection",       explanation: "Serangan yang menyisipkan kode SQL berbahaya ke input untuk memanipulasi database." },
  { word: "XSS",                 explanation: "Cross-Site Scripting — serangan yang menyisipkan skrip berbahaya ke halaman web yang dilihat pengguna lain." },
  { word: "CSRF",                explanation: "Cross-Site Request Forgery — serangan yang memaksa pengguna menjalankan tindakan tidak diinginkan." },
  { word: "Input Validation",    explanation: "Proses memverifikasi bahwa input pengguna sesuai format yang diharapkan sebelum diproses." },
  { word: "Rate Limiting",       explanation: "Pembatasan jumlah permintaan yang dapat dilakukan pengguna ke API dalam periode waktu tertentu." },
  { word: "CORS",                explanation: "Cross-Origin Resource Sharing — mekanisme yang mengontrol akses sumber daya antar domain berbeda." },
  { word: "Webhooks",            explanation: "Mekanisme yang memungkinkan aplikasi mengirimkan notifikasi real-time ke URL tertentu saat event terjadi." },
  { word: "GraphQL",             explanation: "Bahasa query untuk API yang memungkinkan klien meminta hanya data yang mereka butuhkan." },
  { word: "gRPC",                explanation: "Framework RPC modern dari Google menggunakan HTTP/2 untuk komunikasi antar layanan yang efisien." },
  { word: "Message Queue",       explanation: "Komponen yang memungkinkan aplikasi berkomunikasi secara asinkron melalui antrian pesan." },
  { word: "Event Driven",        explanation: "Arsitektur di mana alur program ditentukan oleh event seperti klik, pesan, atau perubahan data." },
  { word: "Serverless",          explanation: "Model komputasi di mana developer menulis kode tanpa perlu mengelola infrastruktur server." },
  { word: "Edge Computing",      explanation: "Paradigma komputasi yang memproses data lebih dekat ke sumbernya daripada di server pusat." },
  { word: "Fog Computing",       explanation: "Ekstensi cloud computing yang membawa komputasi ke tepi jaringan, dekat perangkat IoT." },
  { word: "Data Center",         explanation: "Fasilitas yang menampung sistem komputer dan infrastruktur terkait untuk menyimpan dan memproses data." },
  { word: "Colocation",          explanation: "Layanan di mana perusahaan menempatkan server mereka sendiri di fasilitas data center pihak ketiga." },
  { word: "Uplink",              explanation: "Koneksi dari perangkat lokal atau jaringan ke jaringan yang lebih besar atau internet." },
  { word: "Downlink",            explanation: "Koneksi dari jaringan lebih besar ke perangkat atau jaringan lokal, arah transmisi ke bawah." },
  { word: "Asymmetric",          explanation: "Koneksi internet dengan kecepatan upload dan download yang berbeda, umumnya download lebih cepat." },
  { word: "Symmetric",           explanation: "Koneksi internet dengan kecepatan upload dan download yang sama, biasa pada koneksi bisnis." },
  { word: "Ping Test",           explanation: "Pengujian koneksi jaringan dengan mengukur waktu respon antara dua perangkat." },
  { word: "Speed Test",          explanation: "Pengujian untuk mengukur kecepatan upload, download, dan latensi koneksi internet." },
];

// Shuffle array in-place (Fisher-Yates)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function setStatus(msg, type = '') {
  const el = document.getElementById('statusBar');
  if (!el) return;
  el.className = 'status-bar' + (type ? ' ' + type : '');
  el.innerHTML = msg;
}

function updateCount() {
  const el = document.getElementById('openCount');
  if (el) el.textContent = openCount;
}

function updateTotal(n) {
  const el = document.getElementById('totalCount');
  if (el) el.textContent = n;
}

// ─── Serper.dev fetch ─────────────────────────────────────────────────────────
async function fetchFromSerper(query) {
  const cache    = loadCache();
  const cacheKey = `${query}__${LANG}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const headers = { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' };
  const bodyFor = (extra = {}) => JSON.stringify({ q: query, hl: LANG, num: 10, ...extra });

  const [webResp, imgResp] = await Promise.allSettled([
    fetch('https://google.serper.dev/search', { method: 'POST', headers, body: bodyFor() }).then(r => r.json()),
    fetch('https://google.serper.dev/images', { method: 'POST', headers, body: bodyFor() }).then(r => r.json()),
  ]);

  if (webResp.status === 'rejected') throw new Error('Network error: ' + webResp.reason);

  const webData = webResp.value;
  if (webData.message) throw new Error('Serper.dev: ' + webData.message);

  const organicItems = webData.organic || [];
  const imageItems   = (imgResp.status === 'fulfilled' && !imgResp.value.message)
                       ? (imgResp.value.images || []) : [];

  const results = organicItems.map((item, i) => {
    const img = imageItems[i];
    return {
      word:       item.title || query,
      explanation: item.snippet || '',
      thumbUrl:   img ? (img.thumbnailUrl || img.imageUrl || null) : null,
      searchUrl:  item.link || null,
      displayUrl: item.displayLink || item.link || '',
    };
  });

  if (results.length === 0 && webData.knowledgeGraph) {
    const kg = webData.knowledgeGraph;
    results.push({
      word: kg.title || query, explanation: kg.description || '',
      thumbUrl: kg.imageUrl || null, searchUrl: kg.descriptionLink || null,
      displayUrl: kg.descriptionSource || '',
    });
  }

  cache[cacheKey] = results;
  saveCache(cache);
  return results;
}

// ─── Card builder ─────────────────────────────────────────────────────────────
function buildCard(item, index) {
  const card = document.createElement('div');
  card.className = 'card';

  const imgHtml = item.thumbUrl
    ? `<img class="card-image" src="${escapeAttr(item.thumbUrl)}" alt="${escapeAttr(item.word)}" loading="lazy" onerror="this.style.display='none'" />`
    : '';

  card.innerHTML = `
    <div class="card-number">#${String(index + 1).padStart(3, '0')}</div>
    <div class="card-word">${escapeHtml(item.word)}</div>
    <div class="card-body">
      ${imgHtml}
      <div class="card-explanation">${escapeHtml(item.explanation)}</div>
      ${item.searchUrl
        ? `<a class="card-link" href="${escapeAttr(item.searchUrl)}" target="_blank" rel="noopener noreferrer">🔗 ${escapeHtml(item.displayUrl)}</a>`
        : ''}
    </div>
    <div class="card-toggle">+</div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-link')) return;
    const wasActive = card.classList.contains('active');
    card.classList.toggle('active');
    openCount += wasActive ? -1 : 1;
    updateCount();
  });

  return card;
}

// ─── Escape helpers ───────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ─── Grid renderer ────────────────────────────────────────────────────────────
function renderGrid(items) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  openCount = 0;
  updateCount();

  if (!items || items.length === 0) {
    grid.innerHTML = `<div class="empty-state"><span class="icon">🔍</span>Tidak ada hasil. Coba kata kunci lain.</div>`;
    updateTotal(0);
    return;
  }

  items.forEach((item, i) => grid.appendChild(buildCard(item, i)));
  updateTotal(items.length);
}

// ─── Show 200 default keywords (shuffled) ────────────────────────────────────
function showDefault() {
  const shuffled = shuffle([...DEFAULT_KEYWORDS]);
  renderGrid(shuffled);
  setStatus(`200 kata kunci ditampilkan secara acak — ketik di kotak pencarian untuk mencari via Google`);
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
}

// ─── Search handler ───────────────────────────────────────────────────────────
async function doSearch() {
  const input = document.getElementById('searchInput');
  const btnEl = document.getElementById('btnSearch');
  const query = (input?.value || '').trim();

  // Empty search → show default 200
  if (!query) {
    showDefault();
    return;
  }

  setStatus('<span class="spinner"></span>Mencari…', 'loading');
  if (btnEl) btnEl.disabled = true;

  try {
    const results = await fetchFromSerper(query);
    renderGrid(results);
    setStatus(`✅ ${results.length} hasil untuk "<strong>${escapeHtml(query)}</strong>"`);
  } catch (err) {
    setStatus('❌ ' + escapeHtml(err.message), 'error');
    console.error('[keywords.js]', err);
  } finally {
    if (btnEl) btnEl.disabled = false;
  }
}

// ─── Expand / Collapse all ────────────────────────────────────────────────────
function expandAll() {
  document.querySelectorAll('.card').forEach(c => c.classList.add('active'));
  openCount = document.querySelectorAll('.card').length;
  updateCount();
}

function collapseAll() {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  openCount = 0;
  updateCount();
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Enter key triggers search
  document.getElementById('searchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  // Show 200 shuffled keywords by default
  showDefault();
});
