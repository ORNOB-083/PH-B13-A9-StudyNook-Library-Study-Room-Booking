import RoomsClient from '../components/RoomsClient';

async function getAllRooms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, { cache: 'no-store' });
  const data = await res.json();
  return data || [];
}

export const metadata = {
  title: 'StudyNook – Available Rooms',
};

export default async function RoomsPage() {
  const rooms = await getAllRooms();
  return <RoomsClient rooms={rooms} />;
}