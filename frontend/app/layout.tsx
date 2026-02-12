import type { Metadata } from 'next';
import { DM_Sans, Noto_Sans_TC } from 'next/font/google';
import localFont from 'next/font/local';
import type React from 'react';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { AuthInitializer } from '@/components/auth-initializer';
import ConditionalFooter from '@/components/conditional-footer';
import ConditionalNavbar from '@/components/conditional-navbar';
import ScrollToTop from '@/components/scroll-to-top';
import { ThemeProvider } from '@/components/theme-provider';
import 'react-toastify/dist/ReactToastify.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
});

const nasalization = localFont({
  src: '../public/fonts/nasalization-rg.woff2',
  variable: '--font-nasalization',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ACROSS',
  description: '專業的網路安全防護服務平台',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-TW"
      suppressHydrationWarning
      className={`${dmSans.variable} ${notoSansTC.variable} ${nasalization.variable}`}
    >
      <body className="font-sans">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthInitializer />
            <div className="min-h-screen flex flex-col">
              {/* <Navbar /> */}
              {/* 條件式navbar，管理系統隱藏，設定頁面才顯示navbar */}
              <ConditionalNavbar />
              <main className="flex-1 relative">{children}</main>
              {/* <Footer /> */}
              {/* 條件式footer，管理系統隱藏，設定頁面才顯示footer */}
              <ConditionalFooter />
            </div>
            <ScrollToTop />
            <Toaster />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
