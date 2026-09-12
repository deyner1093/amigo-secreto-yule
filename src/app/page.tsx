import { CreateRoomForm } from "@/components/CreateRoomForm";

export default function HomePage() {
  return (
    <main className="page-shell flex flex-1 flex-col gap-8 pt-10">
      <header className="text-center">
        <h1 className="font-display text-[2rem] leading-tight text-yule-cream">
          Amigo Secreto
        </h1>
        <p className="mt-1 text-[1.0625rem] text-yule-mist">para Yule</p>
      </header>

      <section className="surface-card">
        <CreateRoomForm />
      </section>
    </main>
  );
}
