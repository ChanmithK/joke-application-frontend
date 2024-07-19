import Image from "next/image";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <div>
      <h1>
        <Navbar type="user" />
        <HeroSection />
      </h1>
    </div>
  );
}
