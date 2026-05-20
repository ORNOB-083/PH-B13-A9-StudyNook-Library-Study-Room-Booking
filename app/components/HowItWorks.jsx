'use client';
import { motion } from 'framer-motion';
import { HiSearch, HiCalendar, HiCheckCircle, HiArrowRight } from 'react-icons/hi';

const steps = [
  {
    icon: <HiSearch size={28} />,
    step: '01',
    title: 'Browse Rooms',
    description: 'Explore available study rooms filtered by floor, capacity, amenities and hourly rate.',
    color: '#457B9D',
  },
  {
    icon: <HiCalendar size={28} />,
    step: '02',
    title: 'Pick a Slot',
    description: 'Choose your preferred date and time slot. See real-time availability instantly.',
    color: '#1D3557',
  },
  {
    icon: <HiCheckCircle size={28} />,
    step: '03',
    title: 'Confirm & Study',
    description: 'Book with one click, get instant confirmation and walk into your reserved room.',
    color: '#A8DADC',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Radiant Blue Gradient Background - No Red */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_#A8DADC_20%,_#457B9D_60%,_#1D3557_100%)]" />
      
      {/* Subtle animated glow overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#F1FAEE]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-[#A8DADC]/15 blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#F1FAEE]/20 backdrop-blur-md border border-[#F1FAEE]/30 text-[#F1FAEE] text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#F1FAEE] mb-4 drop-shadow-md">
            How It <span className="text-[#A8DADC]">Works</span>
          </h2>
          <p className="text-[#F1FAEE]/90 text-lg max-w-xl mx-auto drop-shadow-sm">
            Get your perfect study room in three simple steps — no hassle, no waiting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#F1FAEE]/60 via-[#A8DADC] to-[#F1FAEE]/60 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ y: -8 }}
              className="relative z-10 bg-[#F1FAEE]/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#A8DADC]/30 text-center group"
            >
              <span className="absolute top-4 right-4 text-5xl font-extrabold text-[#1D3557]/10 select-none">
                {step.step}
              </span>

              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${step.color}20`, color: step.color }}
              >
                {step.icon}
              </motion.div>

              <h3 className="text-xl font-bold text-[#1D3557] mb-3">{step.title}</h3>
              <p className="text-[#457B9D] text-sm leading-relaxed">{step.description}</p>

              {i < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-6 text-[#457B9D]">
                  <HiArrowRight size={20} className="rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}