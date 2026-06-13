# Habit Tracker

Aplikasi web untuk tracking kebiasaan harian, dilengkapi fitur sosial (postingan), reminder, streak, dan dashboard progress.

**Stack:** React + TypeScript (Frontend) · Laravel + PHP (Backend) · MySQL 8 · Docker

---

## Prasyarat

Pastikan sudah terinstall di laptopmu:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (sudah include Docker Compose)
- Git

---

## Cara Menjalankan

### 1. Clone repository

```bash
git clone <url-repo>
cd habit-tracker1
```

### 2. Buat file `.env`

```bash
cp backend/.env.example backend/.env
```

Lalu buka `backend/.env` dan isi variabel berikut:

| Variabel | Keterangan |
|---|---|
| `APP_KEY` | Generate dengan `php artisan key:generate` atau biarkan kosong, akan di-generate otomatis |
| `JWT_SECRET` | Generate dengan `php artisan jwt:secret` atau isi string acak panjang |
| `MAIL_USERNAME` | Email Gmail untuk kirim OTP |
| `MAIL_PASSWORD` | App Password Gmail (bukan password biasa) |
| `MAIL_FROM_ADDRESS` | Sama dengan `MAIL_USERNAME` |
| `GOOGLE_CLIENT_ID` | Dari Google Cloud Console (opsional, untuk login Google) |
| `GOOGLE_CLIENT_SECRET` | Dari Google Cloud Console (opsional) |

> Variabel lain seperti `DB_HOST`, `DB_DATABASE`, dll sudah terisi default dan langsung bisa dipakai.

### 3. Jalankan Docker

```bash
docker compose up --build
```

Proses pertama kali akan memakan waktu beberapa menit untuk build image.

### 4. Jalankan migrasi database

Buka terminal **baru** (biarkan terminal Docker tetap berjalan), lalu:

```bash
docker compose exec php php artisan migrate --seed
```

### 5. Buka di browser

```
http://localhost:5173
```

---

## Akun Default (dari Seeder)

| Role | Email | Password |
|---|---|---|
| Admin | admin@habittracker.com | password123 |
| User | user@habittracker.com | password123 |

> Panel admin tersedia di `http://localhost:5173/admin`

---

## Akses dari Device / Laptop Lain (Satu Jaringan)

Jika ingin anggota lain mengakses server yang sudah berjalan di laptopmu:

**1. Cari IP lokal laptopmu:**
```bash
# Linux/Mac
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows (PowerShell)
ipconfig
```

**2. Izinkan port di firewall (Windows):**
```powershell
# Jalankan PowerShell sebagai Administrator
netsh advfirewall firewall add rule name="HabitTracker" dir=in action=allow protocol=TCP localport=5173
```

**3. Anggota lain buka browser:**
```
http://<IP_laptopmu>:5173
```

> Mereka perlu **register akun baru** karena database ada di laptopmu. Data (termasuk foto postingan) sepenuhnya tersimpan di servermu.

---

## Perintah Berguna

```bash
# Menjalankan ulang tanpa rebuild
docker compose up

# Stop semua container
docker compose down

# Reset database (hapus semua data lalu migrate ulang)
docker compose exec php php artisan migrate:fresh --seed

# Melihat log backend
docker compose logs php -f

# Masuk ke shell container backend
docker compose exec php bash
```

---


# Cara Penggunaan Web

## 1. Login Admin / User

1. Buka halaman web.
2. Masukkan email dan password.
3. Tekan tombol Login.
4. Sistem akan memverifikasi akun.
5. Pengguna diarahkan ke dashboard.

---

## 2. Mengelola Habit

1. Buka menu Habit.
2. Tambah habit baru.
3. Edit data habit bila diperlukan.
4. Hapus habit jika sudah tidak digunakan.

---

## 3. Checklist Harian

1. Buka daftar habit.
2. Pilih habit yang ingin diselesaikan.
3. Klik tombol checklist.
4. Sistem menyimpan aktivitas harian.
5. Progress dan streak diperbarui otomatis.

---

## 4. Melihat Current Streak dan Longest Streak

* *Current Streak* menunjukkan hari berturut-turut habit berhasil diselesaikan.
* *Longest Streak* menunjukkan streak terpanjang yang pernah dicapai.

---

## 5. Mengatur Reminder

1. Pilih habit.
2. Atur waktu reminder.
3. Simpan pengaturan.
4. Sistem akan mengirim notifikasi sesuai jadwal.

---

## 6. Melihat Summary

Dashboard menampilkan ringkasan seperti:

* Total habit
* Habit selesai hari ini
* Current streak
* Longest streak
* Average progress
* Aktivitas mingguan

---

## 7. Share Progress

1. Pilih habit.
2. Tekan tombol Share Progress.
3. Sistem menampilkan data progress.
4. Tambahkan caption.
5. Bagikan ke posting wall.

---

## 8. Posting Wall

1. Masuk ke halaman Feed.
2. Buat postingan baru.
3. Tambahkan judul, caption, dan gambar.
4. Pilih habit yang ingin dibagikan.
5. Posting akan tampil di feed.

---

# Fitur Utama Web

## Authentication

Digunakan untuk login, registrasi, dan pengelolaan akses pengguna.

## CRUD Habit

Digunakan untuk menambah, mengubah, dan menghapus habit.

## Checklist Harian

Digunakan untuk mencatat penyelesaian habit setiap hari.

## Auto Complete

Digunakan untuk mempercepat pencatatan habit yang selesai.

## Current Streak dan Longest Streak

Digunakan untuk menghitung konsistensi pengguna.

## Reminder dan Notifikasi

Digunakan untuk mengingatkan pengguna menjalankan habit.

## Share Progress

Digunakan untuk membagikan progress habit kepada pengguna lain.

## Posting Wall

Digunakan untuk membagikan pencapaian dalam bentuk postingan.

## Summary

Digunakan untuk menampilkan laporan akhir dan statistik habit.

---

# Alur Penggunaan Aplikasi Web

text
Login
  ↓
Dashboard
  ↓
Membuat Habit
  ↓
Atur Reminder
  ↓
Checklist Harian
  ↓
Perhitungan Progress
  ↓
Perhitungan Streak
  ↓
Share Progress
  ↓
Posting Wall
  ↓
Summary