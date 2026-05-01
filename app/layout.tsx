import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FutureSelf Studio',
  description: 'Upload a photo and generate an anime-realism inspirational transformation.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
