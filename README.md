# 🎯 FocusMonitor - Screen Time & Focus Management System

FocusMonitor adalah aplikasi berbasis web full-stack yang dirancang untuk membantu pengguna melacak *screen time*, mengelola tingkat fokus menggunakan teknik Pomodoro, serta menetapkan target produktivitas harian. Aplikasi ini memisahkan hak akses antara pengguna biasa (User) dan Administrator.

## 🔗 Tautan Penting
- **Source Code (GitHub):** [https://github.com/AnnoFah/DP-7]
- **Live Demo / Publish Web:** [shiny-clafoutis-d1eca6.netlify.app]

---

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Recharts, React Router, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database & Auth:** Supabase (PostgreSQL)

---

## 🧪 Tabel Pengujian Aplikasi (Quality Aspects)

Pengujian ini dilakukan untuk memastikan aplikasi berjalan sesuai dengan kebutuhan spesifikasi (*Requirements*) yang telah ditentukan.

### 1. Aspek Fungsionalitas (*Functional Suitability*)
Menguji apakah fitur-fitur utama sistem berjalan sesuai dengan logika bisnis yang diharapkan.

| ID Test | Skenario Pengujian | Ekspektasi Hasil | Status |
| :--- | :--- | :--- | :--- |
| **F-01** | Pengguna mendaftar akun baru via halaman Register | Akun berhasil dibuat dan data masuk ke tabel `profiles` di Supabase. | ✅ Pass |
| **F-02** | Pengguna melakukan Login dengan kredensial yang benar | Sistem memberikan token JWT dan mengarahkan pengguna ke halaman Dashboard. | ✅ Pass |
| **F-03** | Pengguna menginput aktivitas baru dengan durasi | Data aktivitas tersimpan, dan sistem otomatis menentukan kategori (Produktif/Hiburan) berdasarkan nama aplikasi. | ✅ Pass |
| **F-04** | Sistem mendeteksi distraksi lebih dari 360 menit (6 jam) dalam sehari | Sistem secara otomatis mencatat pelanggaran ke dalam tabel `warning_logs`. | ✅ Pass |
| **F-05** | Pengguna menjalankan Timer Mode Fokus (Pomodoro) | Timer berjalan mundur dengan presisi, dan siklus bertambah saat timer mencapai 00:00. | ✅ Pass |
| **F-06** | Admin mengirimkan notifikasi massal ke seluruh pengguna | Data notifikasi tersimpan dan muncul di halaman Notifikasi masing-masing pengguna. | ✅ Pass |

### 2. Aspek Keamanan (*Security & Privacy*)
Menguji hak akses pengguna dan perlindungan data.

| ID Test | Skenario Pengujian | Ekspektasi Hasil | Status |
| :--- | :--- | :--- | :--- |
| **S-01** | Pengguna dengan role `user` mencoba mengakses URL `/admin` | Sistem menolak akses dan mengalihkan (redirect) pengguna kembali ke Dashboard User. | ✅ Pass |
| **S-02** | Akses data aktivitas tanpa token JWT (Akses API Endpoint langsung) | Backend menolak permintaan dan mengembalikan status HTTP 401 Unauthorized. | ✅ Pass |
| **S-03** | Isolasi data pengguna (Row Level Security Supabase) | Pengguna hanya dapat melihat aktivitas, target, dan catatan miliknya sendiri. Tidak bisa melihat data pengguna lain. | ✅ Pass |

### 3. Aspek Usability & Efisiensi
Menguji kemudahan penggunaan dan respons antarmuka.

| ID Test | Skenario Pengujian | Ekspektasi Hasil | Status |
| :--- | :--- | :--- | :--- |
| **U-01** | Merender grafik (Chart) Laporan Mingguan & Bulanan di Dashboard | Grafik `Recharts` termuat dengan baik dan menampilkan kalkulasi *Focus Score* yang akurat. | ✅ Pass |
| **U-02** | Interaksi form tambah aktivitas dan target | Menampilkan *toast notification* (Pop-up Sukses/Gagal) sebagai umpan balik visual setelah form disubmit. | ✅ Pass |
| **U-03** | Mengakses aplikasi setelah token kedaluwarsa atau dihapus | Aplikasi secara otomatis mengeluarkan pengguna (Force Logout) dan mengarahkan ke halaman Login. | ✅ Pass |
