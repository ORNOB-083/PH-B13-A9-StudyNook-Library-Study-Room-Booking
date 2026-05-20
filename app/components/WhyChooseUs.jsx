'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  HiShieldCheck, HiLightningBolt, HiClock,
  HiUserGroup, HiStar, HiSupport
} from 'react-icons/hi';

const features = [
  {
    icon: <HiShieldCheck size={24} />,
    title: 'Secure Booking',
    description: 'JWT-protected accounts with HTTP-only cookies keep your bookings and data fully secure.',
    color: '#457B9D',
  },
  {
    icon: <HiLightningBolt size={24} />,
    title: 'Instant Confirmation',
    description: 'No waiting. Book a room and receive instant confirmation with zero delay.',
    color: '#E63946',
  },
  {
    icon: <HiClock size={24} />,
    title: 'Flexible Hours',
    description: 'Book rooms from 8 AM to 8 PM in hourly slots that fit your schedule perfectly.',
    color: '#A8DADC',
  },
  {
    icon: <HiUserGroup size={24} />,
    title: 'For Every Group',
    description: 'Solo pods to 12-person seminar suites — find the right room for every study need.',
    color: '#1D3557',
  },
  {
    icon: <HiStar size={24} />,
    title: 'Top Rated Rooms',
    description: 'Every room is rated by real users so you always know what you are booking.',
    color: '#457B9D',
  },
  {
    icon: <HiSupport size={24} />,
    title: '24/7 Support',
    description: 'Our support team is always available to help with bookings, listings or anything else.',
    color: '#E63946',
  },
];

export default function WhyChooseUs() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#F8F1E9] via-[#F1FAEE] to-[#E8F0E8]">
      
      <div className="absolute inset-0 bg-[radial-gradient(#457B9D_0.8px,transparent_1px)] bg-[length:50px_50px] opacity-[0.03]" />

      <div className="max-w-6xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#457B9D]/20 border border-[#A8DADC]/40 text-[#457B9D] text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
            Why StudyNook
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] mb-4">
            Why Choose <span className="text-[#E63946]">Us?</span>
          </h2>
          <p className="text-[#457B9D] text-lg max-w-xl mx-auto">
            We built StudyNook with students in mind — fast, reliable and beautifully simple.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="relative bg-white/95 backdrop-blur-sm border border-[#A8DADC]/30 rounded-2xl p-6 cursor-default overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <motion.div
                animate={{ opacity: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at top left, ${feature.color}15, transparent 70%)` }}
              />

              <motion.div
                animate={{ scale: hovered === i ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-[#1D3557] font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-[#457B9D] text-sm leading-relaxed">{feature.description}</p>

              <motion.div
                animate={{ scaleX: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full"
                style={{ backgroundColor: feature.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}