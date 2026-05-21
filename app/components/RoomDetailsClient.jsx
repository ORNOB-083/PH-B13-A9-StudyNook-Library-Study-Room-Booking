/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client';
import {
  HiLocationMarker, HiUsers, HiClock, HiStar,
  HiX, HiCheckCircle, HiCalendar, HiTrash, HiPencil,
  HiPhotograph, HiOfficeBuilding, HiDocumentText, HiCurrencyDollar
} from 'react-icons/hi';
import { MdMeetingRoom } from 'react-icons/md';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const AMENITY_ICONS = {
  'Wi-Fi': '📶', 'Whiteboard': '📋', 'Projector': '📽️',
  'Power Outlets': '🔌', 'Quiet Zone': '🤫', 'Air Conditioning': '❄️',
};

const AMENITIES = [
  { label: 'Whiteboard', icon: '📋' },
  { label: 'Projector', icon: '📽️' },
  { label: 'Wi-Fi', icon: '📶' },
  { label: 'Power Outlets', icon: '🔌' },
  { label: 'Quiet Zone', icon: '🤫' },
  { label: 'Air Conditioning', icon: '❄️' },
];

export default function RoomDetailsClient({ room: initialRoom }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [room, setRoom] = useState(initialRoom);
  const [bookingModal, setBookingModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');
  const [booking, setBooking] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    name: room.name,
    description: room.description,
    image: room.image,
    floor: room.floor,
    capacity: room.capacity,
    hourlyRate: room.hourlyRate,
  });
  const [editAmenities, setEditAmenities] = useState(room.amenities || []);
  const [updating, setUpdating] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const availableEndTimes = TIME_SLOTS.filter(t => t > startTime);
  const totalCost = startTime && endTime
    ? (parseInt(endTime) - parseInt(startTime)) * room.hourlyRate
    : 0;

  const isOwner = user?.email === room.ownerEmail;

  const handleBookNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!date || !startTime || !endTime) return toast.error('Please fill all fields');
    setBooking(true);
    const { data: tokenData } = await authClient.token();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData?.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          roomId: room._id,
          roomName: room.name,
          roomImage: room.image,
          userId: user.id,
          userEmail: user.email,
          date,
          startTime,
          endTime,
          totalCost,
          note,
          status: 'confirmed',
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'Booking failed');
      toast.success('Room booked successfully!');
      setRoom(prev => ({ ...prev, bookingCount: (prev.bookingCount || 0) + 1 }));
      setBookingModal(false);
      setDate(''); setStartTime(''); setEndTime(''); setNote('');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setBooking(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${room._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenData?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'Delete failed');
      toast.success('Room deleted successfully');
      router.push('/my-listings');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  const toggleEditAmenity = (label) => {
    setEditAmenities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editAmenities.length === 0) return toast.error('Select at least one amenity');
    setUpdating(true);
    const { data: tokenData } = await authClient.token();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${room._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({
          ...editForm,
          capacity: Number(editForm.capacity),
          hourlyRate: Number(editForm.hourlyRate),
          amenities: editAmenities,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'Update failed');
      toast.success('Room updated successfully');
      setRoom(prev => ({
        ...prev, ...editForm,
        capacity: Number(editForm.capacity),
        hourlyRate: Number(editForm.hourlyRate),
        amenities: editAmenities,
      }));
      setEditModal(false);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1FAEE]">

      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557]/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-2"
          >
            {room.name}
          </motion.h1>
          <div className="flex items-center gap-4 text-[#A8DADC] text-sm flex-wrap">
            <span className="flex items-center gap-1"><HiLocationMarker className="text-[#E63946]" />{room.floor}</span>
            <span className="flex items-center gap-1"><HiUsers className="text-[#E63946]" />{room.capacity} people</span>
            <span className="flex items-center gap-1"><MdMeetingRoom className="text-[#E63946]" />{room.bookingCount} bookings</span>
          </div>
        </div>

        {isOwner && (
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditModal(true)}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-[#1D3557] px-4 py-2 rounded-xl text-sm font-bold hover:bg-white transition shadow-lg"
            >
              <HiPencil size={15} /> Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDeleteModal(true)}
              className="flex items-center gap-2 bg-[#E63946]/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#E63946] transition shadow-lg"
            >
              <HiTrash size={15} /> Delete
            </motion.button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#A8DADC]/20"
          >
            <h2 className="text-lg font-bold text-[#1D3557] mb-3">About This Room</h2>
            <p className="text-[#457B9D] leading-relaxed">{room.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#A8DADC]/20"
          >
            <h2 className="text-lg font-bold text-[#1D3557] mb-4">Room Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <HiLocationMarker />, label: 'Floor', value: room.floor },
                { icon: <HiUsers />, label: 'Capacity', value: `${room.capacity} people` },
                { icon: <HiClock />, label: 'Rate', value: `$${room.hourlyRate}/hr` },
                { icon: <HiStar />, label: 'Bookings', value: room.bookingCount },
                { icon: <HiCheckCircle />, label: 'Status', value: 'Available' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F1FAEE] rounded-xl p-4 text-center">
                  <div className="flex justify-center text-[#E63946] mb-2 text-xl">{item.icon}</div>
                  <p className="text-xs text-[#457B9D] mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-[#1D3557]">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#A8DADC]/20"
          >
            <h2 className="text-lg font-bold text-[#1D3557] mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map((a, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-[#A8DADC]/20 border border-[#A8DADC]/40 text-[#457B9D] px-4 py-2 rounded-xl text-sm font-medium"
                >
                  <span>{AMENITY_ICONS[a] || '✓'}</span> {a}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1 space-y-4">

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#A8DADC]/20 sticky top-24"
          >
            <div className="text-center mb-6">
              <p className="text-3xl font-extrabold text-[#1D3557]">
                ${room.hourlyRate}
                <span className="text-base font-normal text-[#457B9D]">/hr</span>
              </p>
              <p className="text-sm text-[#457B9D] mt-1">Flexible hourly booking</p>
            </div>

            <motion.button
              onClick={handleBookNow}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#E63946] text-white py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#E63946]/20 mb-4"
            >
              {user ? 'Book Now' : 'Login to Book'}
            </motion.button>

            <div className="space-y-3 text-sm text-[#457B9D]">
              <div className="flex items-center gap-2"><HiCheckCircle className="text-green-500 shrink-0" />Instant confirmation</div>
              <div className="flex items-center gap-2"><HiCheckCircle className="text-green-500 shrink-0" />Free cancellation</div>
              <div className="flex items-center gap-2"><HiCheckCircle className="text-green-500 shrink-0" />No hidden fees</div>
            </div>
          </motion.div>

          {room.owner && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#A8DADC]/20"
            >
              <p className="text-xs font-bold text-[#1D3557]/50 uppercase tracking-widest mb-3">
                Listed By
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={room.owner.image || `https://ui-avatars.com/api/?name=${room.owner.name}&background=1D3557&color=fff`}
                  alt={room.owner.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#A8DADC]"
                />
                <div>
                  <p className="text-sm font-bold text-[#1D3557]">{room.owner.name}</p>
                  <p className="text-xs text-[#457B9D]">{room.owner.email}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {bookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={e => e.target === e.currentTarget && setBookingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1D3557]">Book Room</h2>
                  <p className="text-sm text-[#457B9D]">{room.name}</p>
                </div>
                <button onClick={() => setBookingModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1FAEE] text-[#457B9D] hover:bg-[#E63946]/10 hover:text-[#E63946] transition">
                  <HiX size={18} />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2 block">Date</label>
                  <div className="flex items-center gap-3 bg-[#F1FAEE] border border-[#A8DADC]/40 rounded-2xl px-4 py-3 focus-within:border-[#457B9D] transition">
                    <HiCalendar className="text-[#457B9D]" size={18} />
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="bg-transparent w-full text-sm text-[#1D3557] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2 block">Start Time</label>
                  <select
                    value={startTime}
                    onChange={e => { setStartTime(e.target.value); setEndTime(''); }}
                    required
                    className="w-full bg-[#F1FAEE] border border-[#A8DADC]/40 rounded-2xl px-4 py-3 text-sm text-[#1D3557] outline-none focus:border-[#457B9D] transition"
                  >
                    <option value="">Select start time</option>
                    {TIME_SLOTS.slice(0, -1).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2 block">End Time</label>
                  <select
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                    disabled={!startTime}
                    className="w-full bg-[#F1FAEE] border border-[#A8DADC]/40 rounded-2xl px-4 py-3 text-sm text-[#1D3557] outline-none focus:border-[#457B9D] transition disabled:opacity-50"
                  >
                    <option value="">Select end time</option>
                    {availableEndTimes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <AnimatePresence>
                  {totalCost > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-[#1D3557] rounded-2xl px-4 py-3 flex items-center justify-between"
                    >
                      <span className="text-[#A8DADC] text-sm font-medium">Total Cost</span>
                      <span className="text-white font-extrabold text-lg">${totalCost}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2 block">Special Note (optional)</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    placeholder="Any special requirements..."
                    className="w-full bg-[#F1FAEE] border border-[#A8DADC]/40 rounded-2xl px-4 py-3 text-sm text-[#1D3557] outline-none focus:border-[#457B9D] transition resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={booking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-[#1D3557] to-[#457B9D] text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                >
                  {booking ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Booking...
                    </span>
                  ) : 'Confirm Booking'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={e => e.target === e.currentTarget && setDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#E63946]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiTrash className="text-[#E63946]" size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-[#1D3557] mb-2">Delete Room?</h3>
                <p className="text-sm text-[#457B9D]">
                  Are you sure you want to delete{' '}
                  <span className="font-bold text-[#1D3557]">{room.name}</span>?
                  This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 py-3 rounded-2xl border border-[#A8DADC] text-[#457B9D] font-semibold text-sm hover:bg-[#F1FAEE] transition"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleDelete}
                  disabled={deleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-2xl bg-[#E63946] text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : 'Yes, Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8 overflow-y-auto"
            onClick={e => e.target === e.currentTarget && setEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#A8DADC]/20">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1D3557]">Edit Room</h2>
                  <p className="text-sm text-[#457B9D]">{room.name}</p>
                </div>
                <button onClick={() => setEditModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1FAEE] text-[#457B9D] hover:bg-[#E63946]/10 hover:text-[#E63946] transition">
                  <HiX size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                <div>
                  <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Room Name</p>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[#A8DADC]/50 bg-white focus-within:border-[#1D3557] transition">
                    <MdMeetingRoom className="text-[#457B9D]" size={18} />
                    <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required className="w-full bg-transparent text-sm text-[#1D3557] outline-none" placeholder="Room name" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Description</p>
                  <div className="flex gap-3 rounded-2xl px-4 py-3 border border-[#A8DADC]/50 bg-white focus-within:border-[#1D3557] transition">
                    <HiDocumentText className="text-[#457B9D] mt-0.5 shrink-0" size={18} />
                    <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} required rows={3} className="w-full bg-transparent text-sm text-[#1D3557] outline-none resize-none" placeholder="Description" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Image URL</p>
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-[#A8DADC]/50 bg-white focus-within:border-[#1D3557] transition">
                    <HiPhotograph className="text-[#457B9D]" size={18} />
                    <input value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} className="w-full bg-transparent text-sm text-[#1D3557] outline-none" placeholder="Image URL" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Floor</p>
                    <div className="flex items-center gap-2 rounded-2xl px-3 py-3 border border-[#A8DADC]/50 bg-white focus-within:border-[#1D3557] transition">
                      <HiOfficeBuilding className="text-[#457B9D] shrink-0" size={16} />
                      <input value={editForm.floor} onChange={e => setEditForm({ ...editForm, floor: e.target.value })} className="w-full bg-transparent text-sm text-[#1D3557] outline-none" placeholder="Floor" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Capacity</p>
                    <div className="flex items-center gap-2 rounded-2xl px-3 py-3 border border-[#A8DADC]/50 bg-white focus-within:border-[#1D3557] transition">
                      <HiUsers className="text-[#457B9D] shrink-0" size={16} />
                      <input type="number" value={editForm.capacity} onChange={e => setEditForm({ ...editForm, capacity: e.target.value })} className="w-full bg-transparent text-sm text-[#1D3557] outline-none" placeholder="Cap" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-2">Rate $</p>
                    <div className="flex items-center gap-2 rounded-2xl px-3 py-3 border border-[#A8DADC]/50 bg-white focus-within:border-[#1D3557] transition">
                      <HiCurrencyDollar className="text-[#457B9D] shrink-0" size={16} />
                      <input type="number" value={editForm.hourlyRate} onChange={e => setEditForm({ ...editForm, hourlyRate: e.target.value })} className="w-full bg-transparent text-sm text-[#1D3557] outline-none" placeholder="Rate" />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#1D3557] uppercase tracking-widest mb-3">Amenities</p>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES.map(({ label, icon }) => (
                      <button key={label} type="button" onClick={() => toggleEditAmenity(label)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          editAmenities.includes(label)
                            ? 'bg-[#1D3557] text-white border-[#1D3557]'
                            : 'bg-white text-[#457B9D] border-[#A8DADC]/50 hover:border-[#457B9D]'
                        }`}>
                        <span>{icon}</span> {label}
                        {editAmenities.includes(label) && <span className="ml-auto text-[#A8DADC]">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={updating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#1D3557] to-[#457B9D] hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating...
                    </span>
                  ) : 'Update Room'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}