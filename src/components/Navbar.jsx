'use client';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Seat Company</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Management System</span>
          </div>
        </div>
      </div>
    </nav>
  );
}