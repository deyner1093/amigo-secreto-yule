import { CreateRoomForm } from "@/components/CreateRoomForm";

export default function HomePage() {
  return (
    <main className="page-shell flex flex-1 flex-col gap-6">
      <header className="pt-4 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-yule-gold/80">
          Temporada de Yule
        </p>
        <h1 className="font-display mt-3 text-[2.35rem] leading-[1.05] text-yule-cream">
          Amigo Secreto
          <span className="mt-1 block text-yule-gold">para Yule</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[22rem] text-sm leading-relaxed text-yule-mist">
          Crea la sala, comparte el link por WhatsApp y deja que cada persona
          confirme desde el móvil. El sorteo es privado y justo.
        </p>
      </header>

      <section className="surface-card">
        <CreateRoomForm />
      </section>

      <p className="pb-4 text-center text-xs text-yule-mist/80">
        Optimizado para abrir desde WhatsApp en el teléfono.
      </p>
    </main>
  );
}
