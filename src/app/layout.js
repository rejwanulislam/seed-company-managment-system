import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Seat Company Management System',
  description: 'Complete management system for seat company operations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Sidebar />
        <main className="ml-64 pt-20 p-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}