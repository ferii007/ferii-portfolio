import './globals.css';

export const metadata = {
  title: 'Feri Ramdani | Developer Portfolio',
  description: 'Portfolio Feri Ramdani: karya, kemampuan, perjalanan, dan cerita di balik kode.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
