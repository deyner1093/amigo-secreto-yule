/**
 * Genera un derangement (nadie se saca a sí mismo) usando el algoritmo de Sattolo.
 * Produce un ciclo hamiltoniano: A→B→C→…→A.
 */
export function derange<T>(items: T[]): T[] {
  if (items.length < 2) {
    throw new Error("Se necesitan al menos 2 participantes para el sorteo.");
  }

  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    [result[i], result[j]] = [result[j], result[i]];
  }

  // Verificación de seguridad (Sattolo no debería fallar)
  for (let i = 0; i < items.length; i += 1) {
    if (result[i] === items[i]) {
      return derange(items);
    }
  }

  return result;
}

/** Mapa giverId → recipientName */
export function buildSecretSantaAssignments(
  participants: Array<{ id: string; name: string }>,
): Record<string, string> {
  const names = participants.map((p) => p.name);
  const recipients = derange(names);
  const assignments: Record<string, string> = {};

  participants.forEach((participant, index) => {
    assignments[participant.id] = recipients[index];
  });

  return assignments;
}
