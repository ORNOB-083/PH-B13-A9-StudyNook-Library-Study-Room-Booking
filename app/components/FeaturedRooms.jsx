import FeaturedRoomsClient from './FeaturedRoomsClient';

async function getRooms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {cache: 'no-store'});
  const data = await res.json();
  return data.slice(0, 6);
}

export default async function FeaturedRooms() {
  const rooms = await getRooms();
  return <FeaturedRoomsClient rooms={rooms} />;
}