import type { Metadata } from 'next';
import '../src/ui/aviator.css';

export const metadata: Metadata = {
  title: 'AVIATOR',
  description: 'HAKKA Aviator application',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
