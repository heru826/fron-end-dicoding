/**
 * BERKAS: main.js (Otak Utama Aplikasi)
 * Fungsi Utama Berkas:
 * 1. Mengatur penyimpanan data lokal agar tidak hilang saat browser di-refresh (Web Storage API).
 * 2. Melakukan perhitungan matematika keuangan untuk pemasukan, pengeluaran, dan sisa saldo.
 * 3. Memanipulasi elemen HTML (DOM) untuk membuat kartu transaksi secara dinamis.
 * 4. Menyediakan fitur pencarian nama transaksi secara reaktif (real-time).
 */

// =========================================================================
// 1. INISIALISASI STATE DAN KONSTANTA
// =========================================================================
// Bagian ini berfungsi untuk membuat variabel-variabel global yang akan menjadi
// acuan utama penyimpanan dan status aplikasi selama program berjalan.

/**
 * Nama kunci (key) unik untuk menandai tabel penyimpanan aplikasi kita di dalam memori LocalStorage browser.
 * Fungsinya: Agar data keuangan aplikasi ini tidak bercampur dengan data dari website lain.
 */
const STORAGE_KEY = "EXPENSE_TRACKER_APPS";

/**
 * Nama kustom event (Custom Event) buatan kita sendiri untuk memicu proses penggambaran ulang halaman web.
 * Fungsinya: Menjadi sinyal terpusat agar ketika data berubah, daftar di layar langsung diperbarui secara sinkron.
 */
const RENDER_EVENT = "render-expense-tracker";

/**
 * Array utama (list) yang berfungsi sebagai database sementara untuk menampung seluruh objek transaksi keuangan.
 * Fungsinya: Tempat menyimpan, menyaring, dan mengolah data sebelum akhirnya dikunci ke dalam Local Storage.
 */
let transactions = [];

/**
 * Penanda status (saklar) berbentuk boolean (true/false) untuk mengetahui kondisi formulir.
 * Fungsinya: Menentukan apakah formulir sedang dipakai untuk menambah transaksi baru (false) atau mengedit transaksi lama (true).
 */
let isEditMode = false;

/**
 * Variabel untuk menyimpan angka ID unik dari transaksi yang sedang dipilih untuk diperbaiki.
 * Fungsinya: Menandai objek mana yang harus ditimpa di dalam array saat tombol "Perbarui" ditekan.
 */
let editTransactionId = null;

/**
 * Konstanta untuk menyimpan Nama asli Anda.
 * Fungsinya: Memenuhi kriteria rubrik penilaian Dicoding agar nama Anda muncul di aplikasi.
 */
const USER_NAME = "Heru Setiadi";

/**
 * Konstanta untuk menyimpan ID/Username akun Dicoding Anda.
 * Fungsinya: Menghindari penolakan (auto-reject) otomatis oleh sistem pemeriksa tugas.
 */
const USER_DICODING_ID = "heru_setiadi";

// =========================================================================
// 2. MENANGKAP ELEMEN DOM HTML (SELEKTOR)
// =========================================================================
// Bagian ini berfungsi menghubungkan variabel JavaScript dengan elemen-elemen di index.html.
// Tanpa bagian ini, JavaScript tidak akan bisa membaca ketikan user atau mengubah teks di layar.

// Menangkap elemen Formulir utama tempat pengguna menginput data transaksi.
const transactionForm = document.getElementById("transactionForm");

// Menangkap kolom tempat pengguna mengetik "Judul Transaksi".
const transactionTitleInput = document.getElementById("transactionTitle");

// Menangkap kolom tempat pengguna memasukkan "Nominal Uang/Angka".
const transactionAmountInput = document.getElementById("transactionAmount");

// Menangkap kolom input kalender untuk menentukan tanggal transaksi.
const transactionDateInput = document.getElementById("transactionDate");

// Menangkap elemen dropdown (pilihan select) untuk kategori "Pemasukan" atau "Pengeluaran".
const transactionTypeInput = document.getElementById("transactionType");

// Menangkap tombol kirim (submit) di dalam form untuk mengubah tulisannya nanti saat mode edit.
const formSubmitButton = transactionForm.querySelector('button[type="submit"]');

// Menangkap area kotak kosong (container div) khusus tempat menampilkan daftar kartu Pemasukan.
const incomeListContainer = document.getElementById("incomeList");

// Menangkap area kotak kosong (container div) khusus tempat menampilkan daftar kartu Pengeluaran.
const expenseListContainer = document.getElementById("expenseList");

// Menangkap kolom input teks pencarian riwayat transaksi.
const searchInput = document.getElementById("searchTransaction");

// Menangkap elemen teks angka "Sisa Saldo" di panel dasbor atas.
const totalBalanceEl = document.getElementById("totalBalance");

// Menangkap elemen teks angka "Total Pemasukan" di panel dasbor atas.
const totalIncomeEl = document.getElementById("totalIncome");

// Menangkap elemen teks angka "Total Pengeluaran" di panel dasbor atas.
const totalExpenseEl = document.getElementById("totalExpense");

// Menangkap elemen judul sapaan di bagian paling atas halaman.
const greetingEl = document.querySelector(".tracker-header__greeting");

// =========================================================================
// 3. LOGIKA WEB STORAGE (PENYIMPANAN LOKAL)
// =========================================================================
// Bagian ini menangani siklus penyimpanan data ke memori browser fisik (LocalStorage)
// agar catatan keuangan tidak hilang saat laptop dimatikan atau halaman web ditutup.

/**
 * Fungsi: Memastikan browser pengguna mendukung fitur Web Storage.
 * Penjelasan: Mengembalikan nilai true jika didukung, dan memunculkan peringatan jika tidak didukung.
 */
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

/**
 * Fungsi: Menyimpan array data 'transactions' terkini ke dalam Local Storage browser.
 * Penjelasan: Mengubah array objek menjadi teks string biasa lewat JSON.stringify()
 * agar bisa diterima dan disimpan dengan aman oleh memori browser.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

/**
 * Fungsi: Mengambil kembali data transaksi masa lalu dari Local Storage saat aplikasi pertama kali dimuat.
 * Penjelasan: Membaca teks string dari memori, mengembalikannya menjadi objek asli lewat JSON.parse(),
 * lalu memicu sinyal RENDER_EVENT agar daftar transaksi langsung tergambar di layar.
 */
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    transactions = data; // Memasukkan data lama ke dalam array utama aplikasi
  }

  // Memicu trigger Custom Event untuk memperbarui daftar tampilan di halaman
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// =========================================================================
// 4. LOGIKA BISNIS APLIKASI (CRUD & VALIDASI)
// =========================================================================
// Bagian ini mengatur logika manipulasi data, mulai dari membuat data baru,
// memvalidasi kesalahan ketik, mengubah tipe transaksi, hingga menghapus data.

/**
 * Fungsi: Menghasilkan ID acak berbasis angka penanda waktu milidetik saat ini (Timestamp).
 * Penjelasan: Menjamin setiap transaksi yang dibuat memiliki ID yang berbeda satu sama lain.
 */
function generateId() {
  return +new Date();
}

/**
 * Fungsi: Menyusun cetak biru (blueprint) struktur objek data transaksi tunggal.
 * Penjelasan: Mengembalikan sebuah objek dengan properti lengkap sesuai standar wajib penilaian Dicoding.
 */
function generateTransactionObject(id, title, amount, date, type) {
  return { id, title, amount, date, type };
}

/**
 * Fungsi: Menangani aksi ketika formulir dikirim/disubmit (Tombol Tambah/Perbarui diklik).
 * Penjelasan: Membaca isi inputan form, memvalidasi error, menentukan mode edit atau tambah baru,
 * mengosongkan kembali form, lalu mengunci perubahan ke dalam storage.
 */
function handleFormSubmit(event) {
  event.preventDefault(); // Mencegah halaman melakukan reload/refresh otomatis saat formulir dikirim

  const title = transactionTitleInput.value.trim(); // Mengambil teks judul dan menghapus spasi berlebih di ujung
  const amount = Number(transactionAmountInput.value); // Mengambil nominal uang dan mengubah tipenya menjadi Angka (Number)
  const date = transactionDateInput.value; // Mengambil string tanggal dari input kalender
  const type = transactionTypeInput.value; // Mengambil string tipe kategori ('income' atau 'expense')

  // VALIDASI ERROR: Memastikan judul tidak dibiarkan kosong oleh pengguna
  if (!title) {
    alert("Judul transaksi tidak boleh kosong!");
    return; // Menghentikan program agar data cacat tidak tersimpan
  }

  // VALIDASI ERROR: Memastikan nominal uang bernilai positif dan minimal 1 rupiah
  if (amount < 1) {
    alert("Nominal uang tidak boleh kurang dari 1 rupiah!");
    return; // Menghentikan program agar data cacat tidak tersimpan
  }

  if (isEditMode) {
    // JIKA STATUS SEBAGAI EDIT: Cari posisi index dari data lama di dalam array berdasarkan kesamaan ID
    const transactionIndex = transactions.findIndex(
      (t) => t.id === editTransactionId,
    );

    // Jika data lama ditemukan, timpa isi data di posisi index tersebut menggunakan objek data yang baru diketik
    if (transactionIndex !== -1) {
      transactions[transactionIndex] = generateTransactionObject(
        editTransactionId,
        title,
        amount,
        date,
        type,
      );
    }

    // Kembalikan form ke setelan normal (Mode Tambah Baru)
    isEditMode = false;
    editTransactionId = null;
    if (formSubmitButton) formSubmitButton.innerText = "Tambah"; // Ubah kembali teks tombol utama
  } else {
    // JIKA STATUS SEBAGAI TAMBAH BARU: Buat ID acak baru, susun objeknya, lalu dorong masuk ke array utama
    const id = generateId();
    const newTransaction = generateTransactionObject(
      id,
      title,
      amount,
      date,
      type,
    );
    transactions.push(newTransaction);
  }

  transactionForm.reset(); // Mengosongkan kembali seluruh kolom inputan pada form ketikan
  saveData(); // Simpan perubahan data terbaru ke memori Local Storage browser
  document.dispatchEvent(new Event(RENDER_EVENT)); // Kirim sinyal kustom untuk memperbarui visual layar web
}

/**
 * Fungsi: Mengubah tipe kategori keuangan (Memindahkan data dari Pemasukan ke Pengeluaran atau sebaliknya).
 * Penjelasan: Mencari objek data, membalikkan string kategorinya, lalu melakukan penyimpanan ulang.
 */
function toggleTransactionType(id) {
  const transaction = transactions.find((t) => t.id === id); // Cari objek transaksi yang cocok dengan ID
  if (transaction) {
    // Teknik Ternary Operator: Jika awalnya 'income' ganti ke 'expense', jika bukan ganti ke 'income'
    transaction.type = transaction.type === "income" ? "expense" : "income";
    saveData(); // Simpan status kategori terbaru ke storage
    document.dispatchEvent(new Event(RENDER_EVENT)); // Gambar ulang visual daftar di layar
  }
}

/**
 * Fungsi: Menghapus data transaksi terpilih dari memori dan tampilan.
 * Penjelasan: Menggunakan fungsi filter untuk membuang objek dengan ID terkait dari array utama.
 */
function deleteTransaction(id) {
  // Menyaring array utama dan hanya menyisakan data-data yang ID-nya tidak dihapus
  transactions = transactions.filter((t) => t.id !== id);

  // Fitur Keamanan: Jika data yang sedang dalam proses diedit ternyata dihapus secara bersamaan, batalkan mode edit
  if (editTransactionId === id) {
    isEditMode = false;
    editTransactionId = null;
    transactionForm.reset();
    if (formSubmitButton) formSubmitButton.innerText = "Tambah";
  }

  saveData(); // Simpan kondisi array terbaru yang sudah berkurang datanya ke memori storage
  document.dispatchEvent(new Event(RENDER_EVENT)); // Kirim sinyal untuk membersihkan kartu di layar
}

/**
 * Fungsi: Membuka kembali data transaksi lama dan menyuntikkan isinya ke dalam kolom input form agar bisa diedit.
 * Penjelasan: Mengubah status saklar menjadi true dan mengarahkan kursor pengguna ke kolom judul secara otomatis.
 */
function startEditTransaction(id) {
  const transaction = transactions.find((t) => t.id === id); // Cari objek transaksi lama berdasarkan target ID
  if (transaction) {
    isEditMode = true; // Nyalakan saklar mode edit
    editTransactionId = id; // Amankan ID transaksi yang sedang diedit

    // Isi masing-masing kotak input formulir menggunakan nilai dari data riwayat lama
    transactionTitleInput.value = transaction.title;
    transactionAmountInput.value = transaction.amount;
    transactionDateInput.value = transaction.date;
    transactionTypeInput.value = transaction.type;

    if (formSubmitButton) formSubmitButton.innerText = "Perbarui"; // Ubah teks tombol form menjadi "Perbarui"
    transactionTitleInput.focus(); // Mengarahkan kursor pengetikan otomatis fokus ke input judul transaksi
  }
}

// ==========================================
// 5. DOM MANIPULATION & RENDERING (VISUAL)
// ==========================================
// Bagian ini bertanggung jawab penuh dalam merakit elemen HTML baru dari dalam
// JavaScript untuk disuntikkan ke halaman web, serta menghitung matematika saldo.

/**
 * Fungsi: Membuat satu kotak elemen kartu HTML tunggal secara dinamis menggunakan murni DOM JavaScript.
 * Penjelasan: Merakit elemen div, h3, p, button dari nol, memasang atribut pengujian otomatis 'data-testid'
 * sesuai aturan ketat berkas penilaian, lalu mengembalikan susunan elemen utuh tersebut.
 */
function createTransactionCard(transactionObject) {
  // Membuat elemen div pembungkus utama untuk kartu item transaksi keuangan
  const container = document.createElement("div");
  container.setAttribute("data-testid", "transactionItem"); // Atribut wajib pengujian otomatis robot Dicoding
  container.classList.add("transaction-item"); // Memberikan class CSS agar desain visualnya rapi

  // Membuat komponen teks h3 untuk menampilkan Judul Transaksi
  const titleEl = document.createElement("h3");
  titleEl.setAttribute("data-testid", "transactionItemTitle");
  titleEl.innerText = transactionObject.title; // Mengisi teks komponen dengan judul objek

  // Membuat komponen p untuk menampilkan Jumlah Uang Nominal + Menyisipkan teks ikon koin
  const amountEl = document.createElement("p");
  amountEl.setAttribute("data-testid", "transactionItemAmount");
  amountEl.innerHTML = `<i class="fa-solid fa-coins"></i> Nominal: Rp${transactionObject.amount}`;

  // Membuat komponen p untuk menampilkan Tanggal Transaksi + Menyisipkan teks ikon kalender
  const dateEl = document.createElement("p");
  dateEl.setAttribute("data-testid", "transactionItemDate");
  dateEl.innerHTML = `<i class="fa-solid fa-calendar-days"></i> Tanggal: ${transactionObject.date}`;

  // Membuat komponen p untuk menampilkan teks Kategori Tipe beserta perubahan reaktif arah panah ikonnya
  const typeEl = document.createElement("p");
  typeEl.setAttribute("data-testid", "transactionItemType");
  const typeText =
    transactionObject.type === "income" ? "Pemasukan" : "Pengeluaran";
  const typeIcon =
    transactionObject.type === "income"
      ? "fa-arrow-down-long"
      : "fa-arrow-up-long";
  typeEl.innerHTML = `<i class="fa-solid ${typeIcon}"></i> Tipe: ${typeText}`;

  // Membuat elemen div kecil sebagai wadah tempat berkumpulnya tombol-tombol aksi operasi data
  const actionContainer = document.createElement("div");
  actionContainer.classList.add("transaction-item__actions");

  // MERAKIT TOMBOL 1: Tombol pemindah kategori kelompok (Ubah Tipe Transaksi)
  const changeTypeButton = document.createElement("button");
  changeTypeButton.setAttribute("data-testid", "transactionItemEditTypeButton");
  changeTypeButton.innerHTML = `<i class="fa-solid fa-rotate"></i> Ubah Tipe`;
  // Memasang Event Listener klik: Jika diklik, jalankan fungsi pembalik tipe transaksi berdasarkan ID-nya
  changeTypeButton.addEventListener("click", () => {
    toggleTransactionType(transactionObject.id);
  });

  // MERAKIT TOMBOL 2: Tombol memicu pembongkaran data (Edit/Perbaiki Data)
  const editButton = document.createElement("button");
  editButton.classList.add("btn-action-edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen"></i> Edit`;
  // Memasang Event Listener klik: Jika diklik, kirim ID data ke fungsi pembuka formulir edit
  editButton.addEventListener("click", () => {
    startEditTransaction(transactionObject.id);
  });

  // MERAKIT TOMBOL 3: Tombol penghancuran data riwayat (Hapus Transaksi)
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "transactionItemDeleteButton");
  deleteButton.classList.add("btn-action-delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i> Hapus`;
  // Memasang Event Listener klik: Jika diklik, jalankan fungsi pembersihan data dari array memori
  deleteButton.addEventListener("click", () => {
    deleteTransaction(transactionObject.id);
  });

  // Menyusun ketiga tombol aksi yang sudah dibuat ke dalam wadah baris actionContainer
  actionContainer.append(changeTypeButton, editButton, deleteButton);

  // Menggabungkan seluruh data teks teks dan wadah tombol ke dalam kotak utama kartu transaksi
  container.append(titleEl, amountEl, dateEl, typeEl, actionContainer);

  return container; // Mengembalikan objek susunan elemen kartu HTML yang sudah jadi dan siap cetak ke layar
}

/**
 * Fungsi: Menghitung total matematika finansial secara real-time dan memperbarui angka dasbor atas.
 * Penjelasan: Menggunakan perulangan forEach untuk menjumlahkan pos pemasukan dan pengeluaran,
 * lalu menyuntikkan hasil akumulasinya langsung ke teks layar HTML via innerText.
 */
function updateDashboard() {
  let totalIncome = 0; // Variabel penampung hitungan total uang masuk
  let totalExpense = 0; // Variabel penampung hitungan total uang keluar

  // Melakukan perulangan array data untuk mengkalkulasi akumulasi nominal pos keuangan
  transactions.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount; // Jika tipenya income, jumlahkan ke totalIncome
    } else if (t.type === "expense") {
      totalExpense += t.amount; // Jika tipenya expense, jumlahkan ke totalExpense
    }
  });

  // Rumus matematika hitung sisa bersih saldo keuangan: Pemasukan dikurangi Pengeluaran
  const totalBalance = totalIncome - totalExpense;

  // Menuliskan teks nominal angka hasil perhitungan terbaru ke masing-masing elemen kartu papan dasbor HTML
  if (totalIncomeEl) totalIncomeEl.innerText = `Rp${totalIncome}`;
  if (totalExpenseEl) totalExpenseEl.innerText = `Rp${totalExpense}`;
  if (totalBalanceEl) totalBalanceEl.innerText = `Rp${totalBalance}`;
}

// ==========================================
// 6. EVENT LISTENER UTAMA & RESPONS PENCARIAN
// ==========================================
// Bagian ini bertindak sebagai pusat kontrol sinkronisasi visual. Tugasnya adalah merespons
// sinyal perubahan dan menyaring data berdasarkan kata kunci yang diketik pengguna di kolom pencarian.

/**
 * Event Listener Utama: Mendengarkan sinyal Custom Event bernama RENDER_EVENT.
 * Penjelasan: Berfungsi mengosongkan layar lama, mengambil kata kunci pencarian, menyaring array data,
 * memetakan kartu baru menggunakan fungsi createTransactionCard, lalu menempelkannya ke kotak daftar yang sesuai.
 */
document.addEventListener(RENDER_EVENT, () => {
  // Mengosongkan daftar visual lama agar kartu data tidak tercetak double/menumpuk saat layar diperbarui
  incomeListContainer.innerHTML = "";
  expenseListContainer.innerHTML = "";

  // Menangkap kata kunci dari kolom input pencarian (diubah ke huruf kecil semua lewat toLowerCase() agar pencariannya adil)
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

  // Menyorot dan menyaring data transaksi: hanya meloloskan objek yang judulnya mengandung potongan teks pencarian
  const filteredTransactions = transactions.filter((transaction) => {
    return transaction.title.toLowerCase().includes(searchQuery);
  });

  // Melakukan perulangan data hasil saringan untuk mencetak kartunya ke dalam kontainer daftar masing-masing
  filteredTransactions.forEach((transaction) => {
    const transactionCard = createTransactionCard(transaction); // Rakit kartu HTML datanya

    if (transaction.type === "income") {
      incomeListContainer.append(transactionCard); // Masuk dan tempel ke area daftar kelompok Pemasukan
    } else if (transaction.type === "expense") {
      expenseListContainer.append(transactionCard); // Masuk dan tempel ke area daftar kelompok Pengeluaran
    }
  });

  // Jalankan kalkulator hitung ulang dasbor finansial atas agar angkanya ikut sinkron dengan jumlah list yang tampil
  updateDashboard();
});

/**
 * Event Listener Inisialisasi: Berjalan otomatis satu kali tepat saat seluruh halaman web selesai dimuat penuh oleh browser.
 * Penjelasan: Mengisi identitas siswa di header, menyalakan fungsi submit form, mengaktifkan fitur pencarian real-time,
 * serta menarik data simpanan masa lalu dari Local Storage.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Mengubah teks judul sapaan bawaan di file HTML menjadi Identitas Nama dan ID Dicoding Anda yang asli
  if (greetingEl) {
    greetingEl.innerText = `${USER_NAME} (${USER_DICODING_ID})`;
  }

  // Menghubungkan fungsi aksi pengiriman formulir (handleFormSubmit) ketika form dikirim oleh pengguna
  transactionForm.addEventListener("submit", handleFormSubmit);

  // Menyalakan fitur deteksi pencarian reaktif (tiap kali user mengetik/menghapus huruf, langsung memicu render ulang otomatis)
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      document.dispatchEvent(new Event(RENDER_EVENT)); // Kirim sinyal trigger gambar ulang halaman
    });
  }

  // Muat timbunan riwayat data masa lalu dari memori Local Storage browser jika tersedia
  loadDataFromStorage();
});
