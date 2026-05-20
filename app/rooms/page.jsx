import RoomsClient from '../components/RoomsClient';

async function getAllRooms() {
  const res = await fetch('http://localhost:8000/rooms', { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export const metadata = {
  title: 'StudyNook – Available Rooms',
};

export default async function RoomsPage() {
  const rooms = await getAllRooms();
  return <RoomsClient rooms={rooms} />;
}