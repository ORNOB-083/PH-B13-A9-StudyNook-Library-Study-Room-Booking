"use client";
import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiMail, HiPhone, HiLocationMarker, HiArrowUp } from 'react-icons/hi';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1D3557] text-[#A8DADC] relative overflow-hidden">
      
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E63946] via-[#A8DADC] to-[#457B9D]" />

      <div className="absolute top-20 right-0 w-72 h-72 bg-[#457B9D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#E63946]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-[#A8DADC]">Study</span>
              <span className="text-[#E63946]">Nook</span>
            </h2>
            <p className="text-sm text-[#A8DADC]/80 leading-relaxed">
              Discover, book, and manage the perfect study room. 
              Built for students who value focus and productivity.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#457B9D] flex items-center justify-center hover:bg-[#E63946] hover:border-[#E63946] hover:scale-110 transition-all duration-300 text-[#A8DADC] hover:text-white">
                <FaFacebook size={16} />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#457B9D] flex items-center justify-center hover:bg-[#E63946] hover:border-[#E63946] hover:scale-110 transition-all duration-300 text-[#A8DADC] hover:text-white">
                <FaXTwitter size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#457B9D] flex items-center justify-center hover:bg-[#E63946] hover:border-[#E63946] hover:scale-110 transition-all duration-300 text-[#A8DADC] hover:text-white">
                <FaLinkedin size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-[#457B9D] flex items-center justify-center hover:bg-[#E63946] hover:border-[#E63946] hover:scale-110 transition-all duration-300 text-[#A8DADC] hover:text-white">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'All Rooms', href: '/rooms' },
                { label: 'Add a Room', href: '/add-room' },
                { label: 'My Bookings', href: '/my-bookings' },
                { label: 'My Listings', href: '/my-listings' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-[#A8DADC]/70 hover:text-[#E63946] hover:translate-x-1.5 transition-all duration-200 inline-block">
                    <span className="mr-2 text-[#E63946] opacity-50">→</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              About
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '#' },
                { label: 'How It Works', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'FAQs', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-[#A8DADC]/70 hover:text-[#E63946] hover:translate-x-1.5 transition-all duration-200 inline-block">
                    <span className="mr-2 text-[#E63946] opacity-50">→</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-[#457B9D]/20 text-[#E63946]">
                  <HiMail size={16} />
                </div>
                <span className="text-sm text-[#A8DADC]/80 break-all">support@studynook.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-[#457B9D]/20 text-[#E63946]">
                  <HiPhone size={16} />
                </div>
                <span className="text-sm text-[#A8DADC]/80">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-[#457B9D]/20 text-[#E63946]">
                  <HiLocationMarker size={16} />
                </div>
                <span className="text-sm text-[#A8DADC]/80 leading-snug">
                  123 Library Avenue,<br />Academic City, CA 90210
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-[#457B9D]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A8DADC]/50 text-center sm:text-left">
            © {new Date().getFullYear()} StudyNook. All rights reserved.
          </p>
          <p className="text-xs text-[#A8DADC]/50 text-center sm:text-left">
            Designed for scholars, built with ❤️
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-[#A8DADC]/70 hover:text-[#E63946] hover:gap-3 transition-all duration-200"
            aria-label="Scroll to top"
          >
            Back to top <HiArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}