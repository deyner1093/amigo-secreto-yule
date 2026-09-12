import { CreateRoomForm } from "@/components/CreateRoomForm";

export default function HomePage() {
  return (
    <main className="page-shell flex flex-1 flex-col gap-8 pt-8">
      <header className="animate-in flex flex-col items-center text-center">
        <div className="hero-mark mb-5 text-xl" aria-hidden>
          ✶
        </div>
        <h1 className="font-display text-[2.55rem] leading-[1.05] text-yule-cream">
          Amigo Secreto
        </h1>
        <p className="mt-2 font-display text-lg italic text-yule-mist">
          para Yule
        </p>
      </header>

      <section className="surface-card animate-in" style={{ animationDelay: "80ms" }}>
        <CreateRoomForm />
      </section>
    </main>
  );
}
