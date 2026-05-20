import Image from "next/image";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero></Hero>
      <FeaturesSection></FeaturesSection>
    </div>
  );
}
