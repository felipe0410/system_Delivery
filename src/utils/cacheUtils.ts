// Utilidades para manejo de caché de datos de entregas

const CACHE_KEYS = {
  MAPA: "mapa_entregas_cache",
  DOMICILIARIO: "domiciliario_data_cache",
};

const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

/**
 * Limpia todos los cachés de entregas
 * Usar cuando se actualicen datos importantes (entregas, direcciones, etc.)
 */
export const clearAllCache = () => {
  Object.values(CACHE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  console.log("🗑️ Todos los cachés limpiados");
};

/**
 * Limpia un caché específico
 */
export const clearCache = (cacheKey: string) => {
  localStorage.removeItem(cacheKey);
  console.log(`🗑️ Caché ${cacheKey} limpiado`);
};

/**
 * Verifica si un caché es válido
 */
export const isCacheValid = (cacheKey: string): boolean => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;

    const { timestamp } = JSON.parse(cached);
    const now = Date.now();
    return now - timestamp < CACHE_DURATION;
  } catch (error) {
    console.error("Error verificando caché:", error);
    return false;
  }
};

/**
 * Obtiene datos del caché si son válidos
 */
export const getCachedData = <T>(cacheKey: string): T | null => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp < CACHE_DURATION) {
      const minutesRemaining = Math.round((CACHE_DURATION - (now - timestamp)) / 1000 / 60);
      console.log(`✅ Cargando desde caché (válido por ${minutesRemaining} minutos más)`);
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error leyendo caché:", error);
    return null;
  }
};

/**
 * Guarda datos en caché
 */
export const setCachedData = <T>(cacheKey: string, data: T): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`💾 Datos guardados en caché por 8 horas`);
  } catch (error) {
    console.error("Error guardando caché:", error);
  }
};

export { CACHE_KEYS, CACHE_DURATION };
