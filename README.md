# Portfolio Feri Ramdani

Portfolio satu halaman berbasis Next.js App Router, JavaScript/JSX, Tailwind CSS, React Three Fiber/Three.js, Lucide React, dan Simple Icons. Komposisi dan aset robot mengikuti `feri-portfolio-all-assets.zip`; font, token, dan komponen visual mengikuti `feri-portfolio-design-system.zip`. Kode portfolio React lama tidak digunakan.

## Menjalankan

Gunakan Node.js 20.9 atau lebih baru.

```bash
npm install
npm run dev
```

Periksa kualitas dengan `npm run test`, `npm run lint`, `npm run build`, dan `npm run test:e2e`. Tes browser memerlukan Chromium Playwright (`npx playwright install chromium`). Secara default, `npm run dev` dan `npm run start` menggunakan port 3100 (`http://localhost:3100`).

## Struktur

- `src/app`: komposisi halaman, metadata, dan gaya global.
- `src/design-system`: CSS dan font lokal dari paket desain, beserta lisensinya.
- `src/content/site.js`: teks non-proyek dan penanda konten contoh.
- `src/features/projects`: sumber data JSON, validator, dan kartu proyek.
- `src/features/interaction`: state bersama robot dan Skills.
- `src/features/robot`: GLB Three.js di Hero dan pendamping desktop, morph ekspresi wajah lewat klik robot, PNG sebagai fallback, dan beam hologram.
- `src/features/skills`: daftar skill, pemetaan artikel, request Wikipedia, dan panel detail.
- `src/features/contact`: form demo dan tautan publik.
- `public/models` dan `public/images/robot`: aset dari ZIP konsep.

## Aturan tipografi

- Judul section (About Me, Currently, My Skills, My Journey, Projects, Beyond Coding, dan Contact) ditampilkan tegak tanpa rotasi, termasuk pada pengembangan berikutnya. Coretan dekoratif tetap mengikuti ilustrasi.
- Gunakan `src/components/typography/Description.jsx` untuk deskripsi dan `Eyebrow.jsx` untuk label kecil dengan format seperti Hello, World.

## Menambah proyek

Tambahkan satu objek ke `src/features/projects/data/projects.json`. Isi `id` unik, `title`, `summary`, `contribution`, `stack`, `category`, `image`, `demoUrl`, `codeUrl`, dan `isExample`. Pilih `category`: `featured` (Karya Pilihan), `personal` (Website & Personal), atau `experiments` (Eksperimen). Kartu serta kelompoknya tampil otomatis tanpa mengubah komponen. Label dan deskripsi kelompok ada di `src/features/projects/data/categories.json`.

Simpan gambar WebP di `public/images/projects/`, lalu isi `image` dengan path `/images/projects/nama-file.webp`. Screenshot ditampilkan utuh; `imageFit: "contain"` memberi ruang tambahan untuk cover logo. `imageAlt` dapat menjelaskan gambar secara spesifik. Isi `stack` hanya dengan teknologi yang diketahui (array kosong diperbolehkan). Versi ini tidak menyediakan tautan kunjungan proyek; `demoUrl` dan `codeUrl` diisi `null`. `contribution` tersedia lewat disclosure “Kontribusiku”. Jalankan `npm run test` dan `npm run build`; validator memeriksa ID, kategori, dan keberadaan gambar.

## Menambah skill

Tambahkan satu objek ke `src/features/skills/data/skills.json`. Isi `id` unik, `label`, `wikiTitle` (judul artikel Wikipedia), dan `color` (warna hex). Isi `iconPath` dengan path SVG logo dalam viewBox `0 0 24 24`; logo yang ada berasal dari Simple Icons, dengan perisai CSS3 dari versi 13 sesuai mockup. Jika tidak memakai path logo, isi `iconLabel` untuk ikon huruf (misalnya `JS` atau `Py`). Kartu dan panel detail membaca data yang sama, sehingga komponen tidak perlu diedit. Perubahan JSON tampil otomatis saat development; jalankan build dan deploy ulang untuk website produksi.

```json
{
  "id": "python",
  "label": "Python",
  "wikiTitle": "Python (programming language)",
  "color": "#f7d44a",
  "iconLabel": "Py"
}
```

## Menambah perjalanan

Tambahkan satu objek ke `src/features/portfolio/data/journey.json` dalam urutan yang ingin ditampilkan. Isi `id` unik, `period` (array baris tanggal), `title`, `organization`, `role`, `description`, `current`, dan `icon` (path gambar, misalnya `/images/journey/senja-solutions.webp`). Penomoran serta garis timeline mengikuti jumlah data secara otomatis. `current: true` memberi warna oranye pada titik perjalanan yang sedang berlangsung. Ikon setiap kartu dibaca dari `icon` di JSON. Simpan logo WebP transparan berukuran 256 × 256 di `public/images/journey/`. Komponen tidak perlu diedit saat menambah perjalanan. Tulis bulan Desember sebagai `Des`.

## Status sebelum publikasi

Versi ini adalah implementasi awal yang siap direview secara lokal. Bagian Currently/Beyond Coding dan sebagian copy masih contoh; semua ditandai di UI. Form kontak hanya demo dan tidak mengirim atau menyimpan data. Satu-satunya tautan profil yang ditampilkan adalah GitHub yang sudah diperiksa. Metadata memakai domain tujuan, tetapi `noindex` dan `robots` melarang indeksasi sampai konten faktual, tautan publik, serta hosting final dikonfirmasi. Model GLB merupakan prototipe resmi dari ZIP konsep dan belum sepenuhnya menyerupai ilustrasi robot pada mockup.
