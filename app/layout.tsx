import './globals.css';
import type { Metadata } from 'next';
import { Inter, Krub } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] });
const krub = Krub({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
});

export const metadata: Metadata = {
  title: ':: Almost Win : เกมที่ไม่มีวันชนะ',
  description: 'สร้างเกมส์ มันสนุก มันสนิท มันสุดยอด',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
     
      <body className={krub.className} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
