/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client';
import Link from 'next/link';
import {
    HiLocationMarker, HiUsers, HiCurrencyDollar,
    HiPencil, HiTrash, HiX, HiCheck, HiPhotograph,
    HiOfficeBuilding, HiDocumentText
} from 'react-icons/hi';
import { MdMeetingRoom } from 'react-icons/md';
import { SyncLoader } from 'react-spinners';

const AMENITIES = [
    { label: 'Whiteboard', icon: '📋' },
    { label: 'Projector', icon: '📽️' },
    { label: 'Wi-Fi', icon: '📶' },
    { label: 'Power Outlets', icon: '🔌' },
    { label: 'Quiet Zone', icon: '🤫' },
    { label: 'Air Conditioning', icon: '❄️' },
];

export default function MyListingsPage() {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [editModal, setEditModal] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editAmenities, setEditAmenities] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [descFocused, setDescFocused] = useState(false);

    async function fetchRooms() {
        await Promise.resolve();
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/rooms/owner/${user.email}`
            );
            const data = await res.json();
            setRooms(data);
        } catch {
            toast.error('Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user?.email) return;

        let isMounted = true;

        Promise.resolve().then(() => {
            if (isMounted) {
                fetchRooms();
            }
        });

        return () => {
            isMounted = false;
        };
    }, [user?.email]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/rooms/${deleteModal._id}`,
                { method: 'DELETE' }
            );
            const data = await res.json();
            if (!res.ok) return toast.error(data.error || 'Delete failed');
            toast.success('Room deleted successfully');
            setDeleteModal(null);
            fetchRooms();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setDeleting(false);
        }
    };

    const openEditModal = (room) => {
        setEditForm({
            name: room.name,
            description: room.description,
            image: room.image,
            floor: room.floor,
            capacity: room.capacity,
            hourlyRate: room.hourlyRate,
        });
        setEditAmenities(room.amenities || []);
        setEditModal(room);
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
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/rooms/${editModal._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...editForm,
                        capacity: Number(editForm.capacity),
                        hourlyRate: Number(editForm.hourlyRate),
                        amenities: editAmenities,
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) return toast.error(data.error || 'Update failed');
            toast.success('Room updated successfully');
            setEditModal(null);
            fetchRooms();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setUpdating(false);
        }
    };

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
                        aria-label="Loading your listings"
                        data-testid="loader"
                    />
                    <p className="text-[#457B9D] font-medium animate-pulse">Loading your listings...</p>
                </div>
            </motion.div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F1FAEE] flex items-center justify-center">
                <p className="text-[#1D3557] font-bold text-xl">Please login to view your listings</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1FAEE]">

            <div className="bg-[#1D3557] py-16 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-extrabold text-white mb-2"
                        >
                            My <span className="text-[#A8DADC]">Listings</span>
                        </motion.h1>
                        <p className="text-[#A8DADC]/70">
                            You have {rooms.length} room{rooms.length !== 1 ? 's' : ''} listed
                        </p>
                    </div>
                    <Link
                        href="/add-room"
                        className="flex items-center gap-2 bg-[#E63946] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                    >
                        + Add New Room
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-10">
                {rooms.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <p className="text-6xl mb-4">🏠</p>
                        <h3 className="text-xl font-bold text-[#1D3557] mb-2">No listings yet</h3>
                        <p className="text-[#457B9D] mb-6">Start by adding your first study room</p>
                        <Link href="/add-room"
                            className="bg-[#1D3557] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#457B9D] transition">
                            Add a Room
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room, i) => (
                            <motion.div
                                key={room._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-[#A8DADC]/30 flex flex-col"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557]/50 to-transparent" />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#1D3557] text-sm font-bold px-4 py-2 rounded-2xl shadow">
                                        ${room.hourlyRate}/hr
                                    </div>
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
                                        <span className="flex items-center gap-1.5">
                                            <MdMeetingRoom className="text-[#E63946]" size={18} />
                                            {room.bookingCount} bookings
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {room.amenities?.slice(0, 3).map((a, i) => (
                                            <span
                                                key={i}
                                                className="text-xs bg-[#F1FAEE] text-[#457B9D] px-3 py-1.5 rounded-xl border border-[#A8DADC]/30"
                                            >
                                                {a}
                                            </span>
                                        ))}
                                        {room.amenities?.length > 3 && (
                                            <span className="text-xs bg-[#1D3557]/5 text-[#1D3557] px-3 py-1.5 rounded-xl">
                                                +{room.amenities.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => openEditModal(room)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#457B9D] text-[#457B9D] text-sm font-semibold hover:bg-[#457B9D] hover:text-white transition-colors duration-200"
                                        >
                                            <HiPencil size={16} /> Edit
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setDeleteModal(room)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E63946]/30 text-[#E63946] text-sm font-semibold hover:bg-[#E63946] hover:text-white transition-colors duration-200"
                                        >
                                            <HiTrash size={16} /> Delete
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {deleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                        onClick={e => e.target === e.currentTarget && setDeleteModal(null)}
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
                                    <span className="font-bold text-[#1D3557]">{deleteModal.name}</span>?
                                    This cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal(null)}
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
                        onClick={e => e.target === e.currentTarget && setEditModal(null)}
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
                                    <p className="text-sm text-[#457B9D]">{editModal.name}</p>
                                </div>
                                <button
                                    onClick={() => setEditModal(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1FAEE] text-[#457B9D] hover:bg-[#E63946]/10 hover:text-[#E63946] transition"
                                >
                                    <HiX size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <HiCheck size={18} /> Update Room
                                        </span>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}