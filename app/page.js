import Image from "next/image";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero></Hero>
      <WhyChooseUs></WhyChooseUs>
    </div>
  );
}
