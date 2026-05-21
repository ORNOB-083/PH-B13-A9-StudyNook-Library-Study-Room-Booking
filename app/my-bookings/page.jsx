/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client';
import { HiCalendar, HiClock, HiCurrencyDollar, HiX, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { MdMeetingRoom } from 'react-icons/md';
import { SyncLoader } from 'react-spinners';

export default function MyBookingsPage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelModal, setCancelModal] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bookings/user/${user.email}`
            );
            const data = await res.json();
            setBookings(data);
        } catch {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.email) return;
        Promise.resolve().then(() => fetchBookings());
    }, [user?.email]);


    const handleCancel = async () => {
        setCancelling(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bookings/${cancelModal._id}/cancel`,
                { method: 'PATCH' }
            );
            const data = await res.json();
            if (!res.ok) return toast.error(data.error || 'Cancellation failed');
            toast.success('Booking cancelled');
            setCancelModal(null);
            fetchBookings();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setCancelling(false);
        }
    };

    const isFuture = (date) => new Date(date) >= new Date(new Date().toDateString());

    if (isPending || loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="min-h-screen bg-[#F1FAEE] flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-5">
                    <SyncLoader
                        color="#1D3557"
                        size={14}
                        margin={8}
                        aria-label="Loading your bookings"
                        data-testid="loader"
                    />
                    <p className="text-[#457B9D] font-medium animate-pulse">
                        Loading your bookings...
                    </p>
                </div>
            </motion.div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
                <p className="text-[#1D3557] font-bold text-xl">Please login to view your bookings</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1FAEE]">

            <div className="bg-[#1D3557] py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-white mb-2"
                    >
                        My <span className="text-[#A8DADC]">Bookings</span>
                    </motion.h1>
                    <p className="text-[#A8DADC]/70">
                        You have {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10">
                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <p className="text-6xl mb-4">📭</p>
                        <h3 className="text-xl font-bold text-[#1D3557] mb-2">No bookings yet</h3>
                        <p className="text-[#457B9D] mb-6">You have no bookings yet.</p>
                        <a href="/rooms"
                            className="bg-[#1D3557] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#457B9D] transition">
                            Explore Rooms
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking, i) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#A8DADC]/20 flex flex-col"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={booking.roomImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'}
                                        alt={booking.roomName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557]/60 to-transparent" />

                                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed'
                                        ? 'bg-green-500/90 text-white'
                                        : 'bg-[#E63946]/90 text-white'
                                        }`}>
                                        {booking.status === 'confirmed'
                                            ? <><HiCheckCircle size={12} /> Confirmed</>
                                            : <><HiExclamationCircle size={12} /> Cancelled</>
                                        }
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-base font-bold text-[#1D3557] mb-3 flex items-center gap-2">
                                        <MdMeetingRoom className="text-[#457B9D]" />
                                        {booking.roomName}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                                            <HiCalendar className="text-[#E63946] shrink-0" size={15} />
                                            <span>{new Date(booking.date).toLocaleDateString('en-US', {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                                            <HiClock className="text-[#E63946] shrink-0" size={15} />
                                            <span>{booking.startTime} – {booking.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#457B9D]">
                                            <HiCurrencyDollar className="text-[#E63946] shrink-0" size={15} />
                                            <span className="font-bold text-[#1D3557]">${booking.totalCost}</span>
                                        </div>
                                    </div>

                                    {booking.note && (
                                        <p className="text-xs text-[#457B9D]/70 bg-[#F1FAEE] rounded-xl px-3 py-2 mb-4 italic">
                                            &quot;{booking.note}&quot;
                                        </p>
                                    )}

                                    <div className="mt-auto">
                                        {booking.status === 'confirmed' && isFuture(booking.date) ? (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setCancelModal(booking)}
                                                className="w-full py-2.5 rounded-xl text-sm font-bold text-[#E63946] border border-[#E63946]/30 hover:bg-[#E63946] hover:text-white transition-all duration-300"
                                            >
                                                Cancel Booking
                                            </motion.button>
                                        ) : (
                                            <div className={`w-full py-2.5 rounded-xl text-sm font-bold text-center ${booking.status === 'cancelled'
                                                ? 'bg-[#E63946]/10 text-[#E63946]'
                                                : 'bg-[#F1FAEE] text-[#457B9D]'
                                                }`}>
                                                {booking.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {cancelModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                        onClick={(e) => e.target === e.currentTarget && setCancelModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-[#E63946]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <HiExclamationCircle className="text-[#E63946]" size={32} />
                                </div>
                                <h3 className="text-xl font-extrabold text-[#1D3557] mb-2">Cancel Booking?</h3>
                                <p className="text-sm text-[#457B9D]">
                                    Are you sure you want to cancel your booking for{' '}
                                    <span className="font-bold text-[#1D3557]">{cancelModal.roomName}</span>?
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancelModal(null)}
                                    className="flex-1 py-3 rounded-2xl border border-[#A8DADC] text-[#457B9D] font-semibold text-sm hover:bg-[#F1FAEE] transition"
                                >
                                    Keep Booking
                                </button>
                                <motion.button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 py-3 rounded-2xl bg-[#E63946] text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
                                >
                                    {cancelling ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Cancelling...
                                        </span>
                                    ) : 'Yes, Cancel'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}