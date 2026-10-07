import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GroundTruthProvider } from '@/context/GroundTruthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GroundTruth — Evidence-Guided Drought Verification Intelligence',
  description:
    'Operational decision support for disaster/relief administration. Deterministic epistemic prioritization, field ground-truthing, and dynamic re-planning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden bg-white text-slate-900 font-sans">
        <GroundTruthProvider>
          {children}
        </GroundTruthProvider>
      </body>
    </html>
  );
}
