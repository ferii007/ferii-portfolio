# Portfolio Feri Ramdani

Portfolio satu halaman berbasis Next.js App Router, JavaScript/JSX, Tailwind CSS, React Three Fiber/Three.js, Lucide React, dan Simple Icons. Tampilan mengikuti empat mockup yang disetujui pada 12 Oktober 2026 dan Design System v1 (`feri-portfolio-design-system`); nilai tokennya digabung ke `src/design-system/css/tokens.css`. Robot memakai GLB yang sudah disempurnakan dari ZIP konsep. Kode portfolio React lama tidak digunakan.

## Menjalankan

Gunakan Node.js 20.9 atau lebih baru.

```bash
npm install
npm run dev
```

Butuh Node 20.9 atau lebih baru (`.nvmrc` memakai 22; jalankan `nvm use`). Periksa kualitas dengan `npm run test`, `npm run lint`, `npm run build`, dan `npm run test:e2e`. Test e2e juga menjalankan audit aksesibilitas axe (WCAG 2.2 AA) di `/` dan `/en` untuk desktop dan mobile, plus alur keyboard dari skip link. GitHub Actions (`.github/workflows/ci.yml`) menjalankan lint, unit test, `npm audit` untuk dependensi production, build, dan e2e di setiap push dan pull request. Tes browser memerlukan Chromium Playwright (`npx playwright install chromium`) atau Chrome terpasang lewat `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Secara default, `npm run dev` dan `npm run start` menggunakan port 3100 (`http://localhost:3100`).

## Struktur

- `src/app`: dua root layout, `(id)` untuk `/` dan `(en)/en` untuk `/en`, plus 404 global, robots, sitemap, manifest, dan ikon.
- `src/constants/languages.js`, `src/constants/languages/{id,en}.js`, `src/constants/localization.js`, `src/context/LocalizationProvider.jsx`: lokalisasi dengan pola yang sama seperti `rebill_backoffice_fe` (lihat bagian Bahasa).
- `src/lib/seo.js`: metadata, hreflang, dan JSON-LD per bahasa, disusun dari constants. `src/lib/journey.js` memformat periode dan role Journey; `useReducedMotion` dan `text.js` adalah helper bersama.
- `src/design-system`: CSS dan font lokal dari paket desain, beserta lisensinya.
- `src/constants/site.js`: satu-satunya tempat untuk fakta tetap yang sama di semua bahasa: nama, role, URL situs, sosial media, warna tema, judul dan anchor section, label menu, judul buku, dan kartu Currently/Beyond. Ubah di sini, dan semua halaman, metadata, manifest, serta JSON-LD ikut berubah.
- `src/components/doodles/Doodle.jsx`, `layout/Section.jsx`, `layout/Logo.jsx`, `paper/Tape.jsx`: markup yang dipakai berulang (spark, panah, garis bawah, judul section, logo, tape). `fp-img` dan `fp-overlay` di `appearance.css` adalah utilitas CSS bersama.
- `src/features/projects`: sumber data JSON, validator, dan kartu proyek.
- `src/features/interaction`: state bersama robot dan Skills.
- `src/features/robot`: GLB Three.js di Hero dan pendamping desktop, morph ekspresi wajah lewat klik robot, PNG sebagai fallback, dan beam hologram.
- `src/features/skills`: daftar skill, pemetaan artikel, request Wikipedia, dan panel detail.
- `src/features/contact`: form simulasi lokal (tidak mengirim atau menyimpan data) serta tautan GitHub dan LinkedIn.
- `public/models` dan `public/images/robot`: aset dari ZIP konsep.

## Aturan tipografi

- Judul section (About Me, Currently, My Skills, My Journey, Projects, Beyond Coding, dan Contact) ditampilkan tegak tanpa rotasi, termasuk pada pengembangan berikutnya. Coretan dekoratif tetap mengikuti ilustrasi.
- Gunakan `src/components/typography/Description.jsx` untuk deskripsi dan `Eyebrow.jsx` untuk label kecil dengan format seperti Hello, World.
- Judul section memakai kelas `section-title` (tambahkan `section-title--dash` bila tidak ada eyebrow); catatan tulisan tangan memakai `hand-note`. Permukaan kertas, tape, pin, dan print memakai `fp-paper`, `fp-tape`, `fp-pin`, `fp-print` di `appearance.css`.

## Bahasa

Situs tersedia dalam Bahasa Indonesia (`/`) dan Inggris (`/en`). Teks yang berbeda per bahasa ada di `src/constants/languages/id.js` dan `en.js`; teks yang sama di semua bahasa ada di `src/constants/site.js`. Nama dan role ditulis sebagai `{firstName}`, `{name}`, `{nickname}`, `{role}` dan diisi otomatis. Periode Journey adalah tanggal di `journey.json` yang diformat per bahasa. Unit test gagal kalau ada teks yang sama di semua bahasa, teks ganda, atau nama/role yang diketik langsung. Semua teks sebagai objek datar dengan key `snake_case`, sama seperti `rebill_backoffice_fe`. Komponen server membaca `getLocalization(language).text.nama_key`; komponen client memakai `useLocalization()`. Placeholder ditulis `{nama}` dan diisi dengan `interpolate`. `\n` di dalam teks berarti pindah baris (catatan tulisan tangan dan label ilustrasi). Gaya bahasanya santai, bukan bahasa baku.

Teks untuk data JSON memakai key yang dibentuk dari `id` record: `project_<id>_contribution`, `category_<id>_title` dan `_note`, `journey_<id>_title`, `_description`, dan `_role` (hanya bila role-nya perlu diterjemahkan) (tanda `-` di `id` menjadi `_`). `npm run test` gagal bila key di `id.js` dan `en.js` tidak sama, placeholder berbeda, atau ada record yang belum punya teks.

Tombol ID/EN di header dan menu mobile adalah tautan biasa ke halaman bahasa lain, sehingga mesin pencari menemukan keduanya. Pilihan bahasa juga disimpan di `localStorage` dengan key `localization`.

## Menambah proyek

Tambahkan satu objek ke `src/features/projects/data/projects.json`. Isi `id` unik, `title`, `summary`, `stack`, `category`, `image`, `demoUrl`, `codeUrl`, dan `isExample`. Pilih `category`: `featured` (Karya Pilihan), `personal` (Website & Personal), atau `experiments` (Eksperimen). Tulis deskripsi kartunya sebagai `project_<id>_contribution` di `id.js` dan `en.js`. Kartu serta kelompoknya tampil otomatis tanpa mengubah komponen. Kelompok didefinisikan di `src/features/projects/data/categories.json`, dengan label dan catatannya di file bahasa; `layout: "pairs"` menata kelompok sebagai pasangan print dan cerita. Proyek baru tampil ringkas; isi `presentation: "feature"` hanya untuk karya yang ingin dicetak besar.

Simpan gambar WebP di `public/images/projects/`, lalu isi `image` dengan path `/images/projects/nama-file.webp`. Screenshot ditampilkan utuh; `imageFit: "contain"` memberi ruang tambahan untuk cover logo. Teks alt khusus dapat ditulis sebagai `project_<id>_image_alt` di file bahasa. Isi `stack` hanya dengan teknologi yang diketahui (array kosong diperbolehkan). Versi ini tidak menyediakan tautan kunjungan proyek; `demoUrl` dan `codeUrl` diisi `null`. Teks `project_<id>_contribution` selalu tampil sebagai deskripsi kartu. `summary` tidak ditampilkan. Jalankan `npm run test` dan `npm run build`; validator memeriksa ID, kategori, dan keberadaan gambar.

## Menambah skill

Tambahkan satu objek ke `src/features/skills/data/skills.json`. Isi `id` unik, `label`, `wikiTitle` (judul artikel Wikipedia), dan `color` (warna hex). Isi `iconPath` dengan path SVG logo dalam viewBox `0 0 24 24`; logo yang ada berasal dari Simple Icons, dengan perisai CSS3 dari versi 13 sesuai mockup. Jika tidak memakai path logo, isi `iconLabel` untuk ikon huruf (misalnya `JS` atau `Py`). Logo gelap dapat diberi `colorOnHolo` agar terbaca di panel navy. Kartu dan panel detail membaca data yang sama, sehingga komponen tidak perlu diedit. Perubahan JSON tampil otomatis saat development; jalankan build dan deploy ulang untuk website produksi.

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

Tambahkan satu objek ke `src/features/portfolio/data/journey.json` dalam urutan yang ingin ditampilkan. Isi `id` unik, `organization`, `period` (`{ "start": "2021-12", "end": null }`; `end: null` berarti masih berlangsung, cukup `start: "2021"` untuk satu tahun), `roles` untuk jabatan tetap (misalnya `["Web Developer", "Software Engineer"]`), dan `icon` (path gambar, misalnya `/images/journey/senja-solutions.webp`). Penomoran serta garis timeline mengikuti jumlah data secara otomatis. Periode yang masih berlangsung memberi warna oranye pada titik perjalanannya, dan nama bulan otomatis mengikuti bahasa. Ikon setiap kartu dibaca dari `icon` di JSON. Simpan logo WebP transparan berukuran 256 × 256 di `public/images/journey/`. `scene` (opsional) menampilkan ilustrasi vignette di kiri kartu, dengan `icon` sebagai logo asli di atasnya; kosongkan `icon` bila scene sudah memuat ikonnya. Tulis `journey_<id>_title`, `_description` (boleh memakai `{year}`, `{firstRole}`, `{lastRole}`), dan `_role` bila tidak ada `roles`, di kedua file bahasa. Komponen tidak perlu diedit saat menambah perjalanan.

## Status sebelum publikasi

Desain dari Header sampai Footer sudah memakai aset paket ImageGen. Indexing sudah aktif: `robots.txt` mengizinkan crawling, metadata `index, follow`, dan sitemap memuat kedua bahasa dengan hreflang. Setelah deploy ke Vercel, verifikasi domain di Google Search Console lalu submit `https://feriramdani.my.id/sitemap.xml`. Yang sengaja ditunda: form kontak masih simulasi lokal (tidak mengirim atau menyimpan data), proyek belum punya tautan demo/kode, dan kartu Beyond Coding belum punya konten.
