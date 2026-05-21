/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client';
import {
  HiArrowRight, HiPhotograph, HiOfficeBuilding,
  HiUsers, HiCurrencyDollar, HiDocumentText
} from 'react-icons/hi';
import { MdMeetingRoom } from 'react-icons/md';

const AMENITIES = [
  { label: 'Whiteboard', icon: '📋' },
  { label: 'Projector', icon: '📽️' },
  { label: 'Wi-Fi', icon: '📶' },
  { label: 'Power Outlets', icon: '🔌' },
  { label: 'Quiet Zone', icon: '🤫' },
  { label: 'Air Conditioning', icon: '❄️' },
];

function FloatingInput({ id, label, type = 'text', value, onChange, icon: Icon, required = true }) {
  const [focused, setFocused] = useState(false);
  const active = focused || String(value).length > 0;

  return (
    <label
      htmlFor={id}
      className={`relative flex items-center gap-3 rounded-2xl px-5 pt-5 pb-4 border bg-white cursor-text transition-all duration-300 ${focused
          ? 'border-[#1D3557] shadow-md'
          : 'border-[#A8DADC]/50 hover:border-[#457B9D]/70 hover:shadow-sm'
        }`}
    >
      <Icon
        size={20}
        className={`shrink-0 transition-colors duration-300 mt-0.5 ${focused ? 'text-[#1D3557]' : 'text-[#457B9D]'
          }`}
      />
      <div className="flex-1 relative min-w-0">
        <motion.span
          animate={
            active
              ? { y: -14, scale: 0.75, color: focused ? '#1D3557' : '#457B9D' }
              : { y: 2, scale: 1, color: '#94a3b8' }
          }
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          className="absolute left-0 text-sm font-medium pointer-events-none select-none origin-left"
        >
          {label}
        </motion.span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full bg-transparent text-base text-[#1D3557] outline-none pt-5 font-medium caret-[#1D3557]"
          placeholder=" "
        />
      </div>
    </label>
  );
}

export default function AddRoomPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    hourlyRate: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const toggleAmenity = (label) => {
    setSelectedAmenities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedAmenities.length === 0) return toast.error('Please select at least one amenity');
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${tokenData?.token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
          hourlyRate: Number(form.hourlyRate),
          amenities: selectedAmenities,
          ownerEmail: user.email,
          ownerName: user.name,
          ownerImage: user.image,
          bookingCount: 0,
          createdAt: new Date(),
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'Failed to add room');
      toast.success('Room added successfully!');
      router.push('/my-listings');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1D3557] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1D3557] font-bold text-xl mb-4">Please login to add a room</p>
          <a href="/login" className="bg-[#1D3557] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#457B9D] transition">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1FAEE]">

      <div className="bg-[#1D3557] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-white mb-2"
          >
            Add a <span className="text-[#A8DADC]">Study Room</span>
          </motion.h1>
          <p className="text-[#A8DADC]/70">
            List your room and start earning today
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10"> {/* ✅ Increased x-gap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border border-[#A8DADC]/20 overflow-hidden"
        >
          <div className="h-1.5 bg-gradient-to-r from-[#1D3557] via-[#E63946] to-[#A8DADC]" />

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6"> {/* ✅ More padding inside the card */}
            <div>
              <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Room Name</p>
              <FloatingInput
                id="name"
                label="e.g. The Quiet Corner"
                value={form.name}
                onChange={handleChange}
                icon={MdMeetingRoom}
              />
            </div>

            <div>
              <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Description</p>
              <div className={`relative flex gap-3 rounded-2xl px-5 pt-5 pb-4 border bg-white transition-all duration-300 ${descFocused
                  ? 'border-[#1D3557] shadow-md'
                  : 'border-[#A8DADC]/50 hover:border-[#457B9D]/70'
                }`}>
                <HiDocumentText
                  size={20}
                  className={`shrink-0 mt-1 transition-colors duration-300 ${descFocused ? 'text-[#1D3557]' : 'text-[#457B9D]'
                    }`}
                />
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setDescFocused(false)}
                  required
                  rows={4}
                  placeholder="Describe your room — features, atmosphere, ideal for..."
                  className="w-full bg-transparent text-sm text-[#1D3557] outline-none resize-none caret-[#1D3557] placeholder-[#94a3b8]"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Image URL</p>
              <FloatingInput
                id="image"
                label="https://example.com/room.jpg"
                value={form.image}
                onChange={handleChange}
                icon={HiPhotograph}
              />
              {/* Image Preview */}
              <AnimatePresence>
                {form.image && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 rounded-2xl overflow-hidden border border-[#A8DADC]/30"
                  >
                    <img
                      src={form.image}
                      alt="Room preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* ✅ Increased gap from 4 to 6 */}
              <div>
                <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Floor</p>
                <FloatingInput
                  id="floor"
                  label="e.g. 3rd Floor"
                  value={form.floor}
                  onChange={handleChange}
                  icon={HiOfficeBuilding}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Capacity</p>
                <FloatingInput
                  id="capacity"
                  label="No. of people"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                  icon={HiUsers}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Hourly Rate ($)</p>
                <FloatingInput
                  id="hourlyRate"
                  label="e.g. 10"
                  type="number"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  icon={HiCurrencyDollar}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-3">
                Amenities <span className="text-[#457B9D] normal-case font-normal">(select all that apply)</span>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> {/* ✅ Kept gap balanced */}
                {AMENITIES.map(({ label, icon }) => (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => toggleAmenity(label)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all duration-200 ${selectedAmenities.includes(label)
                        ? 'bg-[#1D3557] text-white border-[#1D3557] shadow-md'
                        : 'bg-white text-[#457B9D] border-[#A8DADC]/50 hover:border-[#457B9D]'
                      }`}
                  >
                    <span>{icon}</span>
                    {label}
                    {selectedAmenities.includes(label) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-[#A8DADC]"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[#1D3557] to-[#457B9D] hover:shadow-[0_12px_32px_rgba(29,53,87,0.4)] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Adding Room...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Add Room <HiArrowRight size={18} />
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}