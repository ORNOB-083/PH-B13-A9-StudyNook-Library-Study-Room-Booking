'use client';

import { motion } from 'framer-motion';
import { HiBookOpen, HiClock, HiUsers } from 'react-icons/hi';

const features = [
  {
    icon: <HiBookOpen size={32} />,
    title: 'Find the Perfect Study Spot',
    description: 'Browse real-time availability and book quiet rooms that suit your study style — from private cubicles to group spaces.',
  },
  {
    icon: <HiClock size={32} />,
    title: 'Effortless Booking',
    description: 'Reserve your room in seconds with our conflict-checking system. No double bookings, no hassle.',
  },
  {
    icon: <HiUsers size={32} />,
    title: 'Earn from Your Space',
    description: 'List your unused room and turn it into an income stream. Manage everything from your dashboard.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#F1FAEE] dark:bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D3557] dark:text-[#e2e8f0]">
            Why <span className="text-[#E63946]">StudyNook</span>?
          </h2>
          <p className="text-[#457B9D] dark:text-[#94a3b8] text-lg mt-3 max-w-2xl mx-auto">
            We blend smart scheduling with community sharing — making study time better for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
              className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-[#A8DADC]/30 dark:border-[#334155] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-[#A8DADC]/40 dark:bg-[#334155] flex items-center justify-center text-[#E63946] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1D3557] dark:text-[#e2e8f0] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#457B9D] dark:text-[#94a3b8] text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}