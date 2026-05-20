/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdMeetingRoom, MdBookmarks, MdAddHome, MdLogout } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success('Logged out successfully');
    router.push('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 shadow-md bg-[#1D3557]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link href="/">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#A8DADC]">Study</span>
            <span className="text-[#E63946]">Nook</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-[#A8DADC] hover:text-white transition">
            Home
          </Link>
          <Link href="/rooms" className="text-sm font-medium text-[#A8DADC] hover:text-white transition">
            Rooms
          </Link>
          {user && (
            <>
              <Link href="/add-room" className="text-sm font-medium text-[#A8DADC] hover:text-white transition">
                Add Room
              </Link>
              <Link href="/my-listings" className="text-sm font-medium text-[#A8DADC] hover:text-white transition">
                My Listings
              </Link>
              <Link href="/my-bookings" className="text-sm font-medium text-[#A8DADC] hover:text-white transition">
                My Bookings
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-[#457B9D]/40 animate-pulse" />
          ) : user ? (
            // Profile Dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 group"
              >
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=457B9D&color=fff`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#A8DADC] group-hover:border-white transition"
                />
                <span className="text-sm text-[#A8DADC] font-medium group-hover:text-white transition hidden lg:block">
                  {user.name?.split(' ')[0]}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#A8DADC]/20 overflow-hidden"
                  >

                    <div className="px-4 py-3 border-b border-[#A8DADC]/20 bg-[#F1FAEE]">
                      <p className="text-sm font-bold text-[#1D3557] truncate">{user.name}</p>
                      <p className="text-xs text-[#457B9D] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link href="/my-listings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1D3557] hover:bg-[#F1FAEE] transition">
                        <MdMeetingRoom className="text-[#457B9D]" size={16} /> My Listings
                      </Link>
                      <Link href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1D3557] hover:bg-[#F1FAEE] transition">
                        <MdBookmarks className="text-[#457B9D]" size={16} /> My Bookings
                      </Link>
                    </div>

                    <div className="border-t border-[#A8DADC]/20">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#E63946] hover:bg-[#E63946]/5 transition w-full text-left"
                      >
                        <MdLogout size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login"
                className="text-sm font-medium border border-[#A8DADC] text-[#A8DADC] rounded-md px-4 py-1.5 hover:bg-[#A8DADC] hover:text-[#1D3557] transition">
                Login
              </Link>
              <Link href="/register"
                className="text-sm font-medium bg-[#E63946] text-white rounded-md px-4 py-1.5 hover:opacity-90 transition">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-[#A8DADC]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1D3557] px-4 pb-4 flex flex-col gap-3 border-t border-[#457B9D]/40 overflow-hidden"
          >
            {user && (
              <div className="flex items-center gap-3 py-3 border-b border-[#457B9D]/40">
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=457B9D&color=fff`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-[#A8DADC]"
                />
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-[#A8DADC]/70">{user.email}</p>
                </div>
              </div>
            )}

            <Link href="/" className="text-sm font-medium text-[#A8DADC]" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/rooms" className="text-sm font-medium text-[#A8DADC]" onClick={() => setMenuOpen(false)}>Rooms</Link>

            {user ? (
              <>
                <Link href="/add-room" className="text-sm font-medium text-[#A8DADC]" onClick={() => setMenuOpen(false)}>Add Room</Link>
                <Link href="/my-listings" className="text-sm font-medium text-[#A8DADC]" onClick={() => setMenuOpen(false)}>My Listings</Link>
                <Link href="/my-bookings" className="text-sm font-medium text-[#A8DADC]" onClick={() => setMenuOpen(false)}>My Bookings</Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-sm font-medium text-[#E63946] text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}