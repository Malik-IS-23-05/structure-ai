import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WorkArea } from "@/components/WorkArea"; // <--- Импортируем

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      
      <main className="container mx-auto px-4 pb-20"> {/* Добавил pb-20 для отступа снизу */}
        <Hero />

        {/* Рабочая область */}
        <div className="flex flex-col items-center min-h-[50vh] transition-all duration-500 mt-8">
           <WorkArea />
        </div>
      </main>
    </div>
  );
}