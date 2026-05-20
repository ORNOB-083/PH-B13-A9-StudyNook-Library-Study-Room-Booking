import Image from "next/image";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorks from "./components/HowItWorks";
import FeaturedRooms from "./components/FeaturedRooms";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero></Hero>
      <FeaturedRooms></FeaturedRooms>
      <HowItWorks></HowItWorks>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
}
