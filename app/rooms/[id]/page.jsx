import RoomDetailsClient from '../../components/RoomDetailsClient';

async function getRoom(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function RoomDetailsPage({ params }) {
  const { id } = await params;
  
  const room = await getRoom(id);
  
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1FAEE]">
        <div className="text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-[#1D3557] text-xl font-bold">Room not found</p>
          <p className="text-[#457B9D] text-sm mt-2">The room you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }
  
  return <RoomDetailsClient room={room} />;
}