# Sistema de Mapa de Entregas

## ✅ Implementación Completada

Se ha integrado un sistema completo de visualización de entregas en mapa para los domiciliarios con funcionalidades avanzadas de gestión.

## 🎯 Características

### 1. Vista de Mapa Interactivo
- **Mapa completo** con todos los paquetes del día
- **Marcadores numerados** para identificar cada entrega
- **InfoWindow** con detalles al hacer clic en cada marcador
- **Botón "Navegar aquí"** que abre Google Maps para navegación GPS

### 2. Gestión Inteligente de Direcciones

#### Edición de Direcciones
- **Corregir direcciones** directamente desde el sidebar
- **Geocodificación automática** al guardar
- **Persistencia en Firebase** - Las correcciones se guardan permanentemente
- **Actualización en tiempo real** del marcador en el mapa

#### Caché de Coordenadas
- **Primera vez**: Geocodifica y guarda coordenadas en Firebase
- **Siguientes veces**: Usa coordenadas guardadas (más rápido, sin costo API)
- **Ahorro de costos**: Reduce llamadas a Geocoding API en ~90%

### 3. Marcar Entregas Completadas
- **Botón "Entregado"** en cada paquete del sidebar
- **Confirmación** antes de marcar
- **Actualización en Firebase**: Cambia status a "entregado"
- **Limpieza automática**: Remueve del mapa inmediatamente
- **Timestamp**: Guarda fecha y hora de entrega

### 4. Limpieza Inteligente de Direcciones
- Elimina referencias a barrios (BR, BARRIO, URB)
- Remueve descripciones extras (LOCAL, TIENDA, CASA, OFICINA)
- Quita notas entre asteriscos
- Simplifica formato para mejor geocodificación

### 5. Dos Botones de Acceso

#### Botón "Ruta Optimizada" (Azul)
- Genera rutas en Google Maps
- Si hay ≤11 paquetes: Abre 1 ruta con todos
- Si hay >11 paquetes: Divide en grupos de 10 y abre múltiples pestañas
- Funciona con o sin selección de paquetes

#### Botón "Ver Mapa Completo" (Verde)
- Abre vista de mapa interactivo dentro de la app
- Muestra todos los paquetes o solo los seleccionados
- Permite ver detalles de cada entrega
- Gestión completa desde el sidebar

## 📊 Estructura de Datos en Firebase

### Campos Agregados a Shipments

```typescript
{
  uid: "240045268026",
  addressee: "ANDRES FELIPE MONTANA",
  destinatario: {
    direccion: "Calle 8#4-64",  // Se actualiza si se corrige
    celular: "3001234567"
  },
  
  // NUEVO: Coordenadas geocodificadas
  geocoded: {
    lat: 5.5167,
    lng: -72.9,
    direccionCorregida: "Calle 8 #4-64",  // Si fue editada manualmente
    lastUpdated: "2024-02-09T10:30:00Z"
  },
  
  // NUEVO: Estado de entrega
  entregado: true,
  fechaEntrega: "2024-02-09T15:45:00Z",
  status: "entregado"  // "mensajero", "entregado", "devolucion"
}
```

## 🚀 Flujo de Trabajo del Domiciliario

### 1. Abrir Mapa
- Clic en "Ver Mapa Completo"
- El sistema carga paquetes con status "mensajero"
- Usa coordenadas guardadas si existen
- Geocodifica nuevas direcciones automáticamente

### 2. Revisar Direcciones
- Ver lista completa en sidebar
- Identificar direcciones incorrectas o imprecisas
- Clic en "✏️ Editar" para corregir
- Ingresar dirección correcta
- Clic en "Guardar" - se geocodifica y actualiza

### 3. Realizar Entregas
- Navegar a cada dirección con el botón "Navegar aquí"
- Al completar entrega, clic en "✓ Entregado"
- El paquete desaparece del mapa
- Queda registrado en Firebase con timestamp

### 4. Optimizar Ruta
- Seleccionar paquetes pendientes
- Clic en "Ruta Optimizada"
- Google Maps genera la mejor ruta

## 📋 Configuración Requerida

### Obtener Google Maps API Key

1. **Ir a Google Cloud Console**
   - https://console.cloud.google.com/

2. **Crear proyecto**
   - Nombre sugerido: "Sistema Delivery"

3. **Habilitar APIs** (IMPORTANTE)
   - **Maps JavaScript API** (obligatorio - para mostrar el mapa)
   - **Geocoding API** (obligatorio - para convertir direcciones a coordenadas)

4. **Crear API Key**
   - Ve a "APIs y servicios" > "Credenciales"
   - Clic en "Crear credenciales" > "Clave de API"
   - Copia la API Key

5. **Configurar restricciones (Recomendado para producción)**
   - **Para desarrollo**: Deja en "Ninguna"
   - **Para producción**:
     - Restricciones de aplicación: Sitios web
     - Sitios web permitidos: `tudominio.com/*`
     - Restricciones de API: Maps JavaScript API, Geocoding API

6. **Configurar en el proyecto**
   ```bash
   # Copiar archivo de ejemplo
   cp .env.local.example .env.local
   
   # Editar .env.local y agregar tu API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   
   # Reiniciar servidor
   npm run dev
   ```

## 💰 Costos y Optimización

### Crédito Gratuito
- **$200 USD/mes** de crédito gratuito de Google

### Costos por API
- **Maps JavaScript API**: $7 por 1,000 cargas
- **Geocoding API**: $5 por 1,000 solicitudes

### Optimización Implementada
- **Caché de coordenadas**: Primera geocodificación se guarda en Firebase
- **Reutilización**: Siguientes cargas usan coordenadas guardadas
- **Ahorro**: ~90% de reducción en llamadas a Geocoding API
- **Ejemplo**: 
  - Sin caché: 38 paquetes × 30 días = 1,140 geocodificaciones/mes
  - Con caché: 38 paquetes primera vez + ~5 correcciones/día = 188 geocodificaciones/mes
  - **Ahorro: 83%**

### Estimación de Uso Mensual
- 1 domiciliario, 38 paquetes/día, 30 días:
  - Maps JavaScript API: 30 cargas = $0.21
  - Geocoding API (con caché): 188 solicitudes = $0.94
  - **Total: ~$1.15/mes** (dentro del crédito gratuito de $200)

## 🔧 Archivos del Sistema

- ✅ `src/app/domiciliario/MapView.tsx` - Componente principal del mapa
- ✅ `src/app/domiciliario/TableDomi.tsx` - Integración de botones
- ✅ `.env.local.example` - Ejemplo de configuración
- ✅ `GOOGLE_MAPS_SETUP.md` - Guía de configuración
- ✅ `package.json` - Librería @react-google-maps/api

## 🐛 Solución de Problemas

### Error: REQUEST_DENIED
**Causa**: Geocoding API no está habilitada o API Key tiene restricciones
**Solución**:
1. Ve a Google Cloud Console
2. Habilita "Geocoding API" en "APIs y servicios" > "Biblioteca"
3. En tu API Key, verifica restricciones (usa "Ninguna" para desarrollo)
4. Espera 1-2 minutos y recarga

### Marcadores en posiciones incorrectas
**Causa**: Dirección mal formateada o incompleta
**Solución**:
1. Usa el botón "✏️ Editar" en el sidebar
2. Corrige la dirección (ej: "Calle 6 #7-77")
3. Guarda - se geocodificará automáticamente

### Paquete no desaparece al marcar como entregado
**Causa**: Error de conexión con Firebase
**Solución**:
1. Verifica conexión a internet
2. Revisa consola del navegador (F12) para errores
3. Recarga la página

### El mapa no carga
**Causa**: API Key no configurada o Maps JavaScript API no habilitada
**Solución**:
1. Verifica que `.env.local` tenga la API Key
2. Reinicia el servidor: `npm run dev`
3. Verifica que Maps JavaScript API esté habilitada en Google Cloud

## 📈 Próximas Mejoras Sugeridas

1. **Filtros avanzados**: Por barrio, rango de horas, tipo de pago
2. **Clustering**: Agrupar marcadores cercanos cuando hay muchos
3. **Ruta dentro del mapa**: Mostrar línea de ruta optimizada
4. **Estadísticas**: Tiempo promedio por entrega, distancia recorrida
5. **Notificaciones**: Alertar cuando un paquete lleva mucho tiempo sin entregar
6. **Modo offline**: Guardar mapa en caché para áreas sin conexión
7. **Fotos de entrega**: Capturar foto al marcar como entregado
