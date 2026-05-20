/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  HiSearch, HiLocationMarker, HiUsers, HiClock, 
  HiFilter, HiX, HiChevronLeft, HiChevronRight 
} from 'react-icons/hi';

const AMENITIES = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];
const ITEMS_PER_PAGE = 9;

function RoomCard({ room, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl 
                 transition-all duration-500 border border-[#A8DADC]/30 flex flex-col"
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
        <h3 className="text-xl font-bold text-[#1D3557] mb-2 line-clamp-2 hover:text-[#E63946] transition-colors duration-200">
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

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl border border-[#A8DADC]/30 flex items-center justify-center 
                   text-[#457B9D] hover:bg-[#1D3557] hover:text-white transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl font-semibold transition-colors duration-200 ${
            currentPage === page
              ? 'bg-[#1D3557] text-white'
              : 'border border-[#A8DADC]/30 text-[#457B9D] hover:bg-[#F1FAEE]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl border border-[#A8DADC]/30 flex items-center justify-center 
                   text-[#457B9D] hover:bg-[#1D3557] hover:text-white transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiChevronRight size={18} />
      </button>
    </div>
  );
}

function RoomsClient({ rooms }) {
  const [search, setSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxRate, setMaxRate] = useState(100);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedAmenities([]);
    setMaxRate(100);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return rooms.filter(room => {
      const matchSearch = room.name.toLowerCase().includes(search.toLowerCase());
      const matchAmenities = selectedAmenities.every(a => room.amenities.includes(a));
      const matchRate = room.hourlyRate <= maxRate;
      return matchSearch && matchAmenities && matchRate;
    });
  }, [rooms, search, selectedAmenities, maxRate]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRooms = filtered.slice(startIndex, endIndex);

  useMemo(() => {
    if (currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE)) {
      // eslint-disable-next-line react-hooks/set-state-in-render
      setCurrentPage(1);
    }
  }, [filtered.length, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasFilters = search || selectedAmenities.length > 0 || maxRate < 100;

  return (
    <div className="min-h-screen bg-[#F1FAEE]">

      <div className="bg-[#1D3557] py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Available <span className="text-[#A8DADC]">Study Rooms</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#A8DADC]/80 text-lg"
          >
            {rooms.length} rooms available — find yours now
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center border border-[#A8DADC]/20"
        >
          <div className="flex items-center gap-3 flex-1 bg-[#F1FAEE] rounded-xl px-4 py-2.5">
            <HiSearch className="text-[#457B9D] shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search by room name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent w-full text-sm text-[#1D3557] placeholder-[#457B9D]/60 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#457B9D] hover:text-[#E63946]">
                <HiX size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${filterOpen ? 'bg-[#1D3557] text-white' : 'bg-[#F1FAEE] text-[#1D3557] border border-[#A8DADC]'}`}
          >
            <HiFilter size={16} />
            Filters
            {selectedAmenities.length > 0 && (
              <span className="bg-[#E63946] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {selectedAmenities.length}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-[#E63946] font-medium hover:opacity-80 transition px-2"
            >
              <HiX size={14} /> Clear
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-[#A8DADC]/20 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#1D3557] uppercase tracking-widest mb-4">
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map(amenity => (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
                          selectedAmenities.includes(amenity)
                            ? 'bg-[#1D3557] text-white border-[#1D3557]'
                            : 'bg-[#F1FAEE] text-[#457B9D] border-[#A8DADC]'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:w-64">
                  <h4 className="text-sm font-bold text-[#1D3557] uppercase tracking-widest mb-4">
                    Max Hourly Rate: <span className="text-[#E63946]">${maxRate}/hr</span>
                  </h4>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={maxRate}
                    onChange={e => setMaxRate(Number(e.target.value))}
                    className="w-full accent-[#1D3557]"
                  />
                  <div className="flex justify-between text-xs text-[#457B9D] mt-1">
                    <span>$1/hr</span>
                    <span>$100/hr</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#457B9D]">
            Showing <span className="font-bold text-[#1D3557]">{currentRooms.length}</span> of {filtered.length} rooms
          </p>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-[#1D3557] mb-2">No rooms found</h3>
            <p className="text-[#457B9D] text-sm mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters}
              className="bg-[#1D3557] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#457B9D] transition">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {currentRooms.map((room, i) => (
                  <RoomCard key={room._id} room={room} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RoomsClient;