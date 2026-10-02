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
- `src/features/robot`: PNG robot di Hero, GLB pendamping desktop setelah scroll, ekspresi, dan beam hologram.
- `src/features/skills`: daftar skill, pemetaan artikel, request Wikipedia, dan panel detail.
- `src/features/contact`: form demo dan tautan publik.
- `public/models` dan `public/images/robot`: aset dari ZIP konsep.

## Menambah proyek

Tambahkan satu objek ke `src/features/projects/data/projects.json`. Kartu akan muncul otomatis tanpa mengubah komponen. Isi `id` unik, `title`, `summary`, `contribution`, `stack`, `image`, `demoUrl`, `codeUrl`, dan `isExample`. Gunakan `null` untuk gambar atau tautan yang belum tersedia. Jika `image` diisi, simpan file di `public/images/projects/` lalu gunakan path `/images/projects/nama-file.webp`. Jalankan `npm run test` dan `npm run build`; validator akan menolak ID ganda, data wajib kosong, URL tidak valid, atau gambar yang tidak ada.

## Status sebelum publikasi

Versi ini adalah implementasi awal yang siap direview secara lokal. Proyek, bagian Currently/Journey/Beyond Coding, dan sebagian copy masih contoh; semua ditandai di UI. Form kontak hanya demo dan tidak mengirim atau menyimpan data. Satu-satunya tautan profil yang ditampilkan adalah GitHub yang sudah diperiksa. Metadata memakai domain tujuan, tetapi `noindex` dan `robots` melarang indeksasi sampai konten faktual, tautan publik, serta hosting final dikonfirmasi. Model GLB merupakan prototipe resmi dari ZIP konsep dan belum sepenuhnya menyerupai ilustrasi robot pada mockup.
