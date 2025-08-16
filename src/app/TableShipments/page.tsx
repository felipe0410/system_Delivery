"use client";
import * as React from "react";
import { Tabs, Tab, Typography, Box, Paper, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { collection, onSnapshot, query, where, orderBy, limit, getDocs, startAfter, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { readCache, writeCache } from "./cache"; // <-- helpers de arriba

const LazyBasicTable = React.lazy(() => import("./Table"));

type TabConf = { title: string; estado: "existentes"|"todos"|"oficina"|"devolucion"|"mensajero"|"entregado" };
const TABS: TabConf[] = [
  { title: "Existentes", estado: "existentes" },
  { title: "Todos los envíos", estado: "todos" },
  { title: "Envíos agencia", estado: "oficina" },
  { title: "Devoluciones", estado: "devolucion" },
  { title: "Mensajero", estado: "mensajero" },
  { title: "Entregas", estado: "entregado" },
];

export default function BasicTabs() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = React.useState(0);
  const estado = TABS[tab].estado;

  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // para “Todos”
  const [pagCursor, setPagCursor] = React.useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const [newCount, setNewCount] = React.useState(0); // banner “N nuevos”

  // cache de unsub por estado
  const unsubRef = React.useRef<Map<string, () => void>>(new Map());
  const last45Days = React.useMemo(() => Date.now() - 45 * 24 * 60 * 60 * 1000, []);

  // Limpia listeners al desmontar
  React.useEffect(() => {
    return () => {
      unsubRef.current.forEach((u) => u());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      unsubRef.current.clear();
    };
  }, []);

  // Carga desde cache + revalida
  const loadTabData = React.useCallback(async () => {
    setLoading(true);
    setNewCount(0);

    // 1) pinta desde cache si existe
    const cached = readCache(estado);
    if (cached?.rows?.length) {
      setRows(cached.rows);
      setLoading(false);
    } else {
      setRows([]);
    }

    // 2) cierra suscripción anterior de este estado (si existía)
    if (unsubRef.current.has(estado)) {
      unsubRef.current.get(estado)!();
      unsubRef.current.delete(estado);
    }

    const tableRef = collection(db, "envios");

    // 3) Estados vivos -> tiempo real
    if (estado === "existentes" || estado === "mensajero" || estado === "oficina" || estado === "entregado" || estado === "devolucion") {
      const q = query(
        tableRef,
        estado === "existentes"
          ? where("status", "in", ["mensajero", "oficina"])
          : where("status", "==", estado),
        where("fecha_de_admision_timestamp_local", ">=", last45Days),
        orderBy("fecha_de_admision_timestamp_local", "desc"),
        limit(500)
      );
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRows(docs);
        writeCache(estado, docs); // <-- ¡actualiza cache!
        setLoading(false);
      });
      unsubRef.current.set(estado, unsub);
      return;
    }

    // 4) “Todos” -> no tiempo real: revalida, guarda cursor y calcula “nuevos”
    if (estado === "todos") {
      // revalidación base
      const q = query(
        tableRef,
        where("fecha_de_admision_timestamp_local", ">=", last45Days),
        orderBy("fecha_de_admision_timestamp_local", "desc"),
        limit(800) // pon tu page size inicial
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRows(docs);
      writeCache(estado, docs);

      const last = snap.docs[snap.docs.length - 1] ?? null;
      setPagCursor(last);
      setHasMore(Boolean(last));
      setLoading(false);

      // Head-check para “N nuevos”: compara contra cache.maxTs
      const maxCached = cached?.maxTs ?? 0;
      if (maxCached) {
        const headQ = query(
          tableRef,
          where("fecha_de_admision_timestamp_local", ">", maxCached),
          orderBy("fecha_de_admision_timestamp_local", "desc"),
          limit(200)
        );
        const headSnap = await getDocs(headQ);
        const newer = headSnap.size;
        if (newer > 0) setNewCount(newer); // muestra banner “N nuevos”
      }
    }
  }, [estado, last45Days]);

  React.useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  // Paginación para “Todos”
  const loadMore = React.useCallback(async () => {
    if (estado !== "todos" || !pagCursor) return;
    const tableRef = collection(db, "envios");
    const q = query(
      tableRef,
      where("fecha_de_admision_timestamp_local", ">=", last45Days),
      orderBy("fecha_de_admision_timestamp_local", "desc"),
      startAfter(pagCursor),
      limit(200)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setRows((prev) => {
      const merged = [...prev, ...docs];
      writeCache(estado, merged);
      return merged;
    });
    const last = snap.docs[snap.docs.length - 1] ?? null;
    setPagCursor(last);
    setHasMore(Boolean(last));
  }, [estado, pagCursor, last45Days]);

  // Botón para **prepending** los “N nuevos” en “Todos”
  const loadNewHead = React.useCallback(async () => {
    if (estado !== "todos") return;
    const tableRef = collection(db, "envios");
    // toma el max actual en pantalla (o del cache)
    const maxOnScreen = rows.reduce(
      (m, r) => Math.max(m, Number(r.fecha_de_admision_timestamp_local ?? 0)),
      0
    );
    const headQ = query(
      tableRef,
      where("fecha_de_admision_timestamp_local", ">", maxOnScreen),
      orderBy("fecha_de_admision_timestamp_local", "desc"),
      limit(200)
    );
    const snap = await getDocs(headQ);
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (docs.length) {
      setRows((prev) => {
        // prepend sin duplicar
        const known = new Set(prev.map((x) => x.id));
        const uniques = docs.filter((x) => !known.has(x.id));
        const merged = [...uniques, ...prev];
        writeCache(estado, merged);
        return merged;
      });
    }
    setNewCount(0);
  }, [estado, rows]);

  return (
    <Box sx={{ p: "2%" }}>
      <Paper sx={{ borderRadius: 4, p:'1%' }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              aria-label="tabs envíos"
              variant={small ? "scrollable" : "standard"}
              scrollButtons={small ? "auto" : false}
            >
              {TABS.map((t, i) => (
                <Tab
                  key={t.title}
                  label={t.title}
                  id={`tab-${i}`}
                  aria-controls={`tabpanel-${i}`}
                  onMouseEnter={() => { import("./Table"); }}
                />
              ))}
            </Tabs>
          </Box>

          <div role="tabpanel" id={`tabpanel-${tab}`} aria-labelledby={`tab-${tab}`}>
            <Typography sx={{ color: "#0A0F37", fontFamily: "Nunito", fontSize: 30, fontWeight: 900, mb: 2 }}>
              {TABS[tab].title}
            </Typography>

            {/* Banner de nuevos para “Todos” */}
            {estado === "todos" && newCount > 0 && (
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <button
                  onClick={loadNewHead}
                  style={{ padding: "6px 12px", borderRadius: 12, border: "1px solid #1976d2", background: "white", cursor: "pointer" }}
                >
                  {newCount} nuevos — Mostrar
                </button>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <React.Suspense fallback={<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>}>
                <LazyBasicTable tableData={rows} />
              </React.Suspense>
            )}

            {estado === "todos" && hasMore && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <button
                  onClick={loadMore}
                  style={{ padding: "8px 16px", borderRadius: 12, border: "1px solid #ccc", cursor: "pointer", background: "white" }}
                >
                  Cargar más
                </button>
              </Box>
            )}
          </div>
        </Box>
      </Paper>
    </Box>
  );
}
