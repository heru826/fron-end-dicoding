# 📝 DOKUMEN INSTRUKSI: PANDUAN BEDAH KOMPONEN JAVASCRIPT

## Proyek: Personal Finance & Expense Tracker App (Submission Dicoding)

**Deskripsi Dokumen:**
Dokumen ini berfungsi sebagai panduan instruksi resmi untuk memahami setiap fungsi bawaan (_built-in functions_), atribut, perangkat manipulasi DOM, logika, serta metode array yang digunakan di dalam berkas pemrograman `main.js`. [cite_start]Seluruh komponen yang dibedah di bawah ini dirancang agar memenuhi standar kelulusan level **Advanced (4 Poin)** sesuai dengan kriteria penilaian submission[cite: 48, 62, 76, 88].

---

### 1. PERINTAH DEKLARASI VARIABEL & KONSTANTA

Bagian mendasar untuk membuat tempat penyimpanan data di dalam memori komputer.

- **`const` (Constant)**
  - **Fungsi:** Digunakan untuk mendeklarasikan variabel yang nilainya bersifat absolut/tetap dan **tidak dapat diubah atau diisi ulang** di baris kode selanjutnya.
  - **Tujuan di Aplikasi:** Mengunci nama kunci database lokal (`STORAGE_KEY`), nama event (`RENDER_EVENT`), serta data identitas siswa agar aman dan tidak berubah secara tidak sengaja oleh fungsi lain.
- **`let`**
  - **Fungsi:** Digunakan untuk mendeklarasikan variabel yang nilainya bersifat dinamis dan **bisa diubah, ditimpa, atau diisi ulang** kapan saja sepanjang program berjalan.
  - **Tujuan di Aplikasi:** Menampung database array transaksi (`transactions`) serta status penanda mode edit form yang nilainya akan terus berubah secara reaktif mengikuti aksi pengguna.

---

### 2. ALAT PENGAMBIL ELEMEN HTML (DOM SELECTION)

[cite_start]Instruksi yang digunakan agar JavaScript dapat mengenali, menjangkau, dan memantau elemen yang ada di file HTML starter project[cite: 13].

- **`document.getElementById('nama_id')`**
  - **Fungsi:** Metode untuk mencari dan mengambil **satu elemen HTML spesifik** yang memiliki atribut `id` yang cocok. Metode ini sangat cepat karena `id` di dalam HTML harus bersifat unik (tidak boleh kembar).
  - [cite_start]**Tujuan di Aplikasi:** Menangkap elemen krusial seperti `#transactionForm`, `#incomeList`, dan `#expenseList` tanpa mengubah nilai ID bawaannya[cite: 103].
- **`document.querySelector('selektor_css')`**
  - **Fungsi:** Metode fleksibel untuk mencari elemen HTML pertama yang cocok menggunakan **simbol selektor CSS** (seperti tanda titik `.` untuk Class, atau tanda pagar `#` untuk ID).
  - [cite_start]**Tujuan di Aplikasi:** Menangkap elemen sapaan `.tracker-header__greeting` untuk mengubah identitas siswa[cite: 54].
- **`elemen.querySelector('selektor_css')`**
  - **Fungsi:** Memiliki kegunaan yang sama dengan querySelector biasa, namun ruang lingkup pencariannya dipersempit **hanya di dalam area elemen induk tertentu**, bukan di seluruh dokumen HTML.

---

### 3. ALAT PEMBUAT & PEMASANG ELEMEN (DOM MANIPULATION)

Instruksi untuk menciptakan, memodifikasi, dan menyuntikkan struktur HTML baru secara dinamis langsung lewat baris kode JavaScript murni[cite: 5, 37].

- **`document.createElement('nama_tag')`**
  - [cite_start]**Fungsi:** Perintah wajib untuk **menciptakan elemen tag HTML baru dari nol** (seperti membuat `div`, `h3`, `p`, atau `button`)[cite: 36]. Elemen ini awalnya baru hidup di memori RAM dan belum terlihat di layar sebelum ditempelkan.
  - [cite_start]**Penting:** Rubrik melarang penggunaan `element.innerHTML += "..."` saat menambah kartu karena dapat menghapus _event listener_ tombol yang sudah terpasang sebelumnya[cite: 36].
- **`elemen.setAttribute('nama_atribut', 'nilai')`**
  - **Fungsi:** Digunakan untuk **menyisipkan atau memasang atribut baru** ke dalam tag HTML.
  - [cite_start]**Tujuan di Aplikasi:** Memasang atribut penguji otomatis robot penilaian seperti `data-testid="transactionItem"`, `data-testid="transactionItemTitle"`, dll[cite: 24, 102]. [cite_start]Atribut ini dilarang keras untuk dihapus atau diubah nilainya[cite: 53, 102].
- **`elemen.classList.add('nama_class')`**
  - **Fungsi:** Perintah khusus untuk **menempelkan Class CSS** ke dalam elemen HTML secara instan, sehingga elemen tersebut langsung memiliki gaya tampilan visual sesuai dengan aturan file CSS[cite: 25].
- **`elemen.innerText`**
  - **Fungsi:** Mengisi atau mengubah **konten teks murni** di dalam suatu elemen HTML. Karakter simbol atau tag HTML yang dimasukkan ke sini akan dibaca mentah-mentah sebagai teks biasa.
- **`elemen.innerHTML`**
  - **Fungsi:** Mengisi konten teks sekaligus **menerjemahkan tag HTML** yang disisipkan di dalamnya. Digunakan ketika kita ingin memasukkan kode visual tambahan (seperti tag ikon font-awesome `<i>`).
- **`elemen.append(anak_elemen_1, anak_elemen_2)`**
  - **Fungsi:** Perintah untuk **memasukkan dan menyusun** beberapa elemen anak ke dalam elemen induk di urutan paling akhir/bawah.

---

### 4. PERINTAH EVENT MANAGEMENT (PENGAMAT AKSI USER)

Instruksi untuk membuat aplikasi menjadi interaktif dengan cara memantau pergerakan dan tindakan yang dilakukan oleh pengguna.

- **`document.dispatchEvent(new Event('nama_event'))`**
  - [cite_start]**Fungsi:** Perintah Advanced untuk **menembakkan atau menyiarkan sinyal/alarm kustom (Custom Event)** buatan kita sendiri agar didengar oleh seluruh sistem aplikasi[cite: 78].
  - [cite_start]**Tujuan di Aplikasi:** Mengirimkan sinyal pembaruan visual setiap kali terjadi perubahan data (tambah/hapus/edit)[cite: 78].
- **`elemen.addEventListener('nama_event', fungsi_dijalankan)`**
  - **Fungsi:** Berperan sebagai "satpam pengamat". [cite_start]Perintah ini bertugas **menunggu dan mendengarkan** kapan sebuah aksi (seperti `click`, `submit`, `input`) terjadi pada elemen tersebut, lalu otomatis menjalankan fungsi yang diperintahkan[cite: 36].
- **`event.preventDefault()`**
  - **Fungsi:** Perintah krusial untuk **menghentikan paksa aksi bawaan (default) browser**. Paling sering digunakan pada event `submit` formulir agar browser tidak melakukan penyegaran halaman (_reload/refresh_) secara otomatis saat tombol ditekan.

---

### 5. LOGIKA PENYIMPANAN DATA BROWSER (LOCAL STORAGE API)

[cite_start]Mekanisme untuk menitipkan data pada penyimpanan fisik web browser (Web Storage) agar data bersifat permanen dan tidak hilang saat halaman dimuat ulang[cite: 6, 65, 66].

- **`localStorage.setItem('kunci', 'data_string')`**
  - **Fungsi:** Perintah untuk **menyimpan dan mengunci data** ke dalam storage browser berdasarkan nama kunci (_key_) tertentu[cite: 70].
  - [cite_start]**Tujuan di Aplikasi:** Mengamankan array data transaksi agar tetap tersimpan meskipun browser di-refresh[cite: 66, 70].
- **`localStorage.getItem('kunci')`**
  - [cite_start]**Fungsi:** Perintah untuk **memanggil atau mengambil kembali** data yang berada di dalam storage browser menggunakan nama kunci yang sesuai[cite: 70].

---

### 6. PENGOLAH FORMAT DATA TRANSFORMATIF (JSON)

Menjembatani perbedaan format data antara JavaScript (Objek/Array) dan Local Storage (Teks String).

- **`JSON.stringify(data_objek_atau_array)`**
  - **Fungsi:** Mengubah data berbentuk objek atau array yang kompleks **menjadi sebaris teks string mati**[cite: 70]. Ini wajib dilakukan karena Local Storage hanya mampu menerima data bertipe teks murni[cite: 70].
- **`JSON.parse(teks_string_json)`**
  - **Fungsi:** Kebalikan dari stringify. Berfungsi untuk **menghidupkan kembali teks string JSON** menjadi struktur objek atau array asli JavaScript agar bisa diolah kembali menggunakan logika pemrograman[cite: 70].

---

### 7. PERANGKAT MANIPULASI DATA FORMULIR (INPUT COLUMN)

Instruksi khusus untuk mengontrol properti dan perilaku kotak input tempat pengguna mengetik data transaksi.

- **`inputElemen.value`**
  - **Fungsi:** Atribut properti untuk **mengintip, mengambil, atau mengubah isi teks** yang sedang diketik oleh user di dalam kotak input.
- **`teks.trim()`**
  - **Fungsi:** Berfungsi untuk **menghapus spasi kosong** yang tidak sengaja terketik di ujung depan maupun ujung belakang sebuah string teks agar data menjadi bersih dan valid.
- **`Number(data)`**
  - **Fungsi:** Berfungsi untuk **mengubah paksa tipe data teks (string) menjadi tipe data angka murni (Number)**[cite: 20]. Ini wajib digunakan karena semua inputan angka di HTML secara bawaan dibaca sebagai teks oleh JavaScript, sedangkan rubrik mewajibkan properti `amount` disimpan sebagai angka murni[cite: 20].
- **`formElemen.reset()`**
  - **Fungsi:** Perintah instan untuk **mengosongkan dan membersihkan kembali seluruh kolom ketikan** di dalam formulir, mengembalikannya ke posisi mode "Tambah" awal setelah pembaruan/penambahan selesai[cite: 75].
- **`inputElemen.focus()`**
  - **Fungsi:** Perintah untuk **mengarahkan kursor ketikan aktif pengguna** langsung melompat masuk ke dalam kotak inputan tertentu secara otomatis tanpa perlu diklik manual.

---

### 8. RUMUS PERULANGAN & PENYARINGAN DAFTAR (ARRAY METHODS)

Metode bawaan (_built-in methods_) yang sangat kuat untuk mengelola manipulasi data di dalam list array database transaksi.

- **`array.push(objek_baru)`**
  - **Fungsi:** Menambahkan atau memasukkan data/objek baru ke dalam **barisan paling akhir** di dalam sebuah array.
- **`array.findIndex(item => kondisi)`**
  - **Fungsi:** Menyisir isi array untuk **mencari posisi nomor urutan (index)** suatu data berdasarkan kondisi tertentu. [cite_start]Sangat penting digunakan pada fitur edit untuk mendeteksi nomor baris data lama yang mau ditimpa data baru[cite: 75].
- **`array.find(item => kondisi)`**
  - [cite_start]**Fungsi:** Menyisir array untuk **mengambil satu objek utuh pertama** yang memenuhi kondisi pencarian (misalnya mencari satu data transaksi berdasarkan kesamaan ID saat tombol edit ditekan)[cite: 74].
- **`array.filter(item => kondisi)`**
  - **Fungsi:** Menyaring isi array dan **menghasilkan sebuah array baru** yang hanya berisi data-data yang lolos sensor kondisi. [cite_start]Digunakan untuk membuang data (fitur hapus) dan menyaring data berdasarkan kecocokan judul (fitur kolom pencarian)[cite: 71, 87].
- **`array.forEach(item => perintah)`**
  - **Fungsi:** Perintah untuk **melakukan perulangan (looping)**, di mana JavaScript akan mendatangi dan mengeksekusi perintah pada setiap item di dalam array satu per satu secara berurutan. [cite_start]Digunakan untuk menghitung total matematika keuangan pada panel dasbor[cite: 64].

---

### 9. OPERATOR LOGIKA & MANIPULASI STRING DASAR

Fungsi pelengkap untuk memastikan akurasi data, validasi input, dan jalannya logika aplikasi.

- **`+new Date()`**
  - [cite_start]**Fungsi:** Mengubah informasi tanggal dan waktu saat ini secara instan menjadi **deretan angka milidetik (Timestamp)**[cite: 18]. [cite_start]Karena waktu selalu maju, deretan angka ini dijamin selalu unik setiap milidetiknya, sehingga sangat ideal digunakan sebagai pembuat **ID Unik Otomatis** sesuai tips dari rubrik tugas[cite: 18].
- **`===` (Strict Equality)**
  - **Fungsi:** Operator pembanding untuk memastikan apakah dua buah data nilainya **sama persis secara mutlak**, baik dari segi nilai datanya maupun tipe datanya.
- **`!==` (Strict Inequality)**
  - **Fungsi:** Operator pembanding untuk mengecek apakah dua buah data nilainya **tidak sama**.
- **`Kondisi ? Benar : Salah` (Ternary Operator)**
  - **Fungsi:** Bentuk ringkas dari penulisan logika pengkondisian `if-else` (jika-maka) yang dapat dituliskan hanya dalam satu baris kode tunggal. [cite_start]Sangat rapi digunakan pada fitur tombol "Ubah Tipe"[cite: 84].
- **`teks.toLowerCase()`**
  - **Fungsi:** Mengubah secara paksa semua karakter huruf di dalam teks menjadi **huruf kecil semuanya**. [cite_start]Digunakan pada fitur pencarian agar proses pencarian bersifat _case-insensitive_ (tidak sensitif terhadap perbedaan huruf besar/kecil)[cite: 87].

---

_Dokumen ini dirancang khusus sebagai referensi instruksional resmi pemenuhan Tugas Submission._
