import { RoomApp } from "@/components/RoomApp";

type PageProps = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ admin?: string }>;
};

export default async function SalaPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const query = await searchParams;

  return (
    <main className="page-shell flex flex-1 flex-col">
      <RoomApp
        code={code.toUpperCase()}
        initialAdminToken={query.admin ?? null}
      />
    </main>
  );
}
