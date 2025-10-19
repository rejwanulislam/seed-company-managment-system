'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/customers', label: 'Customers', icon: '👥' },
    { href: '/products', label: 'Products', icon: '📦' },
    { href: '/sales', label: 'Sales', icon: '💰' },
    { href: '/lowStockItems', label: 'Low Stock Items', icon: '⚠️' },
    { href: '/allOpration', label: 'All Opration', icon: '📈' },
  ];
  
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen fixed left-0 top-16">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === link.href
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}