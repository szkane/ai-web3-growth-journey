import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

// 配置网站元数据
export const metadata: Metadata = {
  title: {
    default: 'AI Web3 Growth Journey',
    template: '%s | AI Web3 Growth Journey',
  },
  description: 'AI Web3 Growth Journey',
  keywords: ['AI Web3 Growth Journey', 'AI Web3', 'Web3', 'development', 'startup'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
