# Amigo Secreto para Yule

Aplicación web **mobile-first** para organizar un amigo secreto (Yule / Navidad) con link de WhatsApp, confirmaciones en tiempo real, sorteo derangement (nadie se saca a sí mismo) y revelación privada tipo sobre navideño.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Firebase Firestore (opcional) o almacenamiento local en desarrollo

## Arranque rápido (local sin DB)

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin `DATABASE_URL`, las salas viven en memoria / `.data/rooms.json`.

## Producción (Vercel + Neon)

En Vercel configura la variable `DATABASE_URL` (Postgres). Con eso las salas persisten entre visitantes.

La base claimable de Neon caduca en **72 horas** si no la reclamas:
https://neon.new/claim/01a097c1-6ff3-77cb-a3ef-ca258882eb0f

## Firebase (opcional)

Si prefieres Firebase en lugar de Postgres, rellena `NEXT_PUBLIC_FIREBASE_*` (sin `DATABASE_URL`).

## Flujo

1. **Admin** pega nombres, elige si participa, crea la sala y comparte el link / WhatsApp.
2. **Participantes** abren el link, tocan su nombre y confirman (“Listo”).
3. Cuando todos están listos, el admin pulsa **Realizar Sorteo Final**.
4. Cada persona abre su **Sobre de Yule** y ve solo su amigo secreto.

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Crear sala |
| `/sala/[code]?admin=TOKEN` | Vista admin / lobby |
| `/sala/[code]` | Vista participante |

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run start` — servir build
