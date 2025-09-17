import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import DashboardHeader from '@/components/dashboard/header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Finance Dashboard',
  description: 'A modern financial dashboard to view and manage your data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.variable}>
      <body className='antialiased min-h-screen bg-background font-body'>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
