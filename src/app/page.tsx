import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WorkArea } from "@/components/WorkArea";
import { FAQ } from "@/components/FAQ";     // <--- Импорт
import { Footer } from "@/components/Footer"; // <--- Импорт

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      
      <main className="container mx-auto px-4 pb-10 pt-24">
        <Hero />

        <div className="flex flex-col items-center transition-all duration-500">
           <WorkArea />
        </div>

        {/* Добавляем блоки вниз */}
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}