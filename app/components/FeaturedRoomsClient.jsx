/* eslint-disable @next/next/no-img-element */
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiLocationMarker, HiUsers, HiArrowRight } from 'react-icons/hi';

function RoomCard({ room, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.01 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-[#A8DADC]/30 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#1D3557] text-sm font-bold px-4 py-2 rounded-2xl shadow">
          ${room.hourlyRate}/hr
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-[#1D3557] mb-2 line-clamp-2 transition-colors duration-200 hover:text-[#E63946]">
          {room.name}
        </h3>
        
        <p className="text-[#457B9D] text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
          {room.description}
        </p>

        <div className="flex items-center gap-5 text-sm text-[#457B9D] mb-6">
          <span className="flex items-center gap-1.5">
            <HiLocationMarker className="text-[#E63946]" size={18} />
            {room.floor}
          </span>
          <span className="flex items-center gap-1.5">
            <HiUsers className="text-[#E63946]" size={18} />
            Up to {room.capacity}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 3).map((a, i) => (
            <span 
              key={i} 
              className="text-xs bg-[#F1FAEE] text-[#457B9D] px-3 py-1.5 rounded-xl border border-[#A8DADC]/30"
            >
              {a}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs bg-[#1D3557]/5 text-[#1D3557] px-3 py-1.5 rounded-xl">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-auto">
          <Link 
            href={`/rooms/${room._id}`}
            className="w-full block text-center bg-[#1D3557] hover:bg-[#E63946] text-white py-3.5 rounded-2xl font-semibold transition-colors duration-200"
          >
            View Room Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedRoomsClient({ rooms }) {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#F0F9FF] via-[#F1FAEE] to-[#ECFDF5]">
      
      <div className="absolute inset-0 bg-[radial-gradient(at_top_left,#457B9D08_0%,transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#457B9D]/10 border border-[#A8DADC]/40 text-[#457B9D] text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
            Available Now
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D3557] mb-4">
            Featured Study <span className="text-[#E63946]">Rooms</span>
          </h2>
          <p className="text-[#457B9D] text-lg max-w-xl mx-auto">
            Handpicked premium rooms updated in real-time. Find your perfect study space.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, i) => (
            <RoomCard key={room._id} room={room} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link 
            href="/rooms"
            className="inline-flex items-center gap-3 bg-[#1D3557] hover:bg-[#457B9D] text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Explore All Rooms
            <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedRoomsClient;