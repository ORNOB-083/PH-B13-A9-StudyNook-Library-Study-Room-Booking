"use client";
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#F1FAEE] dark:bg-[#0f172a] px-4 py-12">
      <div className="text-center max-w-lg w-full">
        
        <div className="flex justify-center mb-6">
          <h1 className="text-8xl font-extrabold text-[#1D3557] dark:text-[#e2e8f0]">404</h1>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-[#A8DADC] dark:bg-[#1e293b] flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-[#1D3557] dark:text-[#94a3b8]" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-[#1D3557] dark:text-[#e2e8f0] mb-3">
          Page Not Found
        </h2>
        
        <p className="text-[#457B9D] dark:text-[#94a3b8] mb-8 text-lg max-w-sm mx-auto leading-relaxed">
          Oops! It seems the study room you&apos;re looking for doesn&apos;t exist.
          <br />
          <span className="text-sm opacity-75">
            The page may have been moved or deleted.
          </span>
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E63946] hover:bg-[#c6313d] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span>Back to Home</span>
          <span className="text-xl">→</span>
        </Link>

        <div className="mt-6">
          <button 
            onClick={() => window.history.back()} 
            className="text-sm text-[#457B9D] dark:text-[#94a3b8] hover:text-[#1D3557] dark:hover:text-white transition"
          >
            ← Go back to previous page
          </button>
        </div>

      </div>
    </div>
  );
}