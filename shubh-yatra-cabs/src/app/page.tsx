import {Header} from "@/components/Header";
import {Hero} from "@/components/Hero";
import RouteCard from "@/components/RouteCard";
import { popularRoutes } from "@/lib/routes";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Hero />
        <section id="routes" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-6 text-2xl font-bold">Popular routes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularRoutes.map((route) => (
              <RouteCard key={route.slug} route={route} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}