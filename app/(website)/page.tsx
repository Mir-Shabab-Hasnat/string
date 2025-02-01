import { Hero } from "@/components/landing/Hero";
import Logo from "@/components/Logo";


export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <Hero />
      <Logo  size={5}/>
    </div>
  );
}
