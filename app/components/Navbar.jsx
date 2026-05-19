'use client';
import Link from 'next/link';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 shadow-md bg-[#1D3557]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#A8DADC]">Study</span>
            <span className="text-[#E63946]">Nook</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-[#A8DADC] hover:opacity-80 transition">
            Home
          </Link>
          <Link href="/rooms" className="text-sm font-medium text-[#A8DADC] hover:opacity-80 transition">
            Rooms
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm font-medium border border-[#A8DADC] text-[#A8DADC] rounded-md px-4 py-1.5 hover:opacity-80 transition">
            Login
          </Link>
          <Link href="/register"
            className="text-sm font-medium bg-[#E63946] text-white rounded-md px-4 py-1.5 hover:opacity-90 transition">
            Register
          </Link>
        </div>

        <button
          className="md:hidden text-[#A8DADC]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#1D3557] px-4 pb-4 flex flex-col gap-4">
          <Link href="/"
            className="text-sm font-medium text-[#A8DADC]"
            onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/rooms"
            className="text-sm font-medium text-[#A8DADC]"
            onClick={() => setMenuOpen(false)}>
            Rooms
          </Link>
          <Link href="/login"
            className="text-sm font-medium border border-[#A8DADC] text-[#A8DADC] rounded-md px-4 py-1.5 text-center"
            onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link href="/register"
            className="text-sm font-medium bg-[#E63946] text-white rounded-md px-4 py-1.5 text-center"
            onClick={() => setMenuOpen(false)}>
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}