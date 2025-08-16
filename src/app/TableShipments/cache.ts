// cache.ts
const CACHE_VERSION = "v1";
const KEY = (estado: string) => `envios:${estado}:${CACHE_VERSION}`;

type CachePayload = {
  ts: number;                         // cuándo guardé el cache
  maxTs: number;                      // mayor fecha_de_admision_timestamp_local
  rows: any[];                        // data
};

export function readCache(estado: string): CachePayload | null {
  try {
    const raw = localStorage.getItem(KEY(estado));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // sanity check mínimo
    if (!Array.isArray(parsed?.rows)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCache(estado: string, rows: any[]) {
  const maxTs = rows.reduce(
    (m, r) => Math.max(m, Number(r.fecha_de_admision_timestamp_local ?? 0)),
    0
  );
  const payload: CachePayload = { ts: Date.now(), maxTs, rows };
  try {
    localStorage.setItem(KEY(estado), JSON.stringify(payload));
  } catch {
    // Si se llena el localStorage, puedes limpiar el estado más viejo
  }
}


// 1) util
export function normalizeStr(v: any) {
  if (v == null) return "";
  return v
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes (á->a, ñ->n)
    .toLowerCase()
    .trim();
}
