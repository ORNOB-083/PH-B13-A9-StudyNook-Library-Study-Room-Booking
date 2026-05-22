'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiArrowRight, HiBookOpen, HiStar, HiUsers } from 'react-icons/hi';
import { authClient } from '../../lib/auth-client'; 

export default function Hero() {
  const router = useRouter();
  const { data: session } = authClient.useSession(); 

  const handleListRoom = () => {
    if (session?.user) {
      router.push('/my-bookings');
    } else {
      router.push('/login');       
    }
  };

  return (
    <section
      className="relative min-h-screen md:min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D3557]/95 via-[#1D3557]/80 to-[#457B9D]/70" />

      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-5 md:top-24 md:left-10 w-40 h-40 md:w-64 md:h-64 rounded-full bg-[#A8DADC]/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-5 md:bottom-24 md:right-10 w-48 h-48 md:w-80 md:h-80 rounded-full bg-[#E63946]/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 md:mb-8"
        >
          <span className="flex items-center gap-2 bg-[#457B9D]/20 backdrop-blur-md border border-[#A8DADC]/40 text-[#A8DADC] text-xs font-semibold px-4 py-1.5 md:px-5 md:py-2 rounded-full tracking-widest uppercase shadow-lg">
            <HiBookOpen size={14} />
            Your Library, Your Space
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 md:mb-6 tracking-tight"
        >
          Find Your{' '}
          <span className="relative inline-block">
            <span className="text-[#A8DADC]">Perfect</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -bottom-1 left-0 w-full h-1 bg-[#E63946] rounded-full origin-left"
            />
          </span>{' '}
          <br className="hidden sm:block" />
          Study Room
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[#A8DADC] text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2"
        >
          Browse and book quiet, private study rooms in your library.
          List your own room and earn — all from one sleek dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-10 md:mb-16"
        >
          <Link href="/rooms"
            className="group flex items-center justify-center gap-2 bg-[#E63946] text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-semibold shadow-lg shadow-[#E63946]/30 hover:shadow-[#E63946]/50 hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[200px] text-sm sm:text-base">
            Explore Rooms
            <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <button
            onClick={handleListRoom}
            className="flex items-center justify-center gap-2 border-2 border-[#A8DADC] text-[#A8DADC] px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-semibold backdrop-blur-sm hover:bg-[#A8DADC] hover:text-[#1D3557] hover:border-transparent transition-all duration-300 w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
          >
            List Your Room
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto"
        >
          {[
            { value: '60+', label: 'Study Rooms', icon: <HiBookOpen size={20} /> },
            { value: '1.2k+', label: 'Bookings Made', icon: <HiUsers size={20} /> },
            { value: '4.9★', label: 'Avg. Rating', icon: <HiStar size={20} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white/5 backdrop-blur-md border border-[#A8DADC]/20 p-3 md:p-4 rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex justify-center text-[#A8DADC] mb-1 md:mb-2">{stat.icon}</div>
              <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#A8DADC] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-[#F1FAEE] to-transparent pointer-events-none" />
    </section>
  );
}