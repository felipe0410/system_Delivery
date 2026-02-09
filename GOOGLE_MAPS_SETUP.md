# Configuración de Google Maps API

## Pasos para obtener tu API Key:

### 1. Ir a Google Cloud Console
Visita: https://console.cloud.google.com/

### 2. Crear o seleccionar un proyecto
- Si no tienes proyecto, crea uno nuevo
- Dale un nombre como "Sistema Delivery"

### 3. Habilitar APIs
Ve a "APIs y servicios" > "Biblioteca" y habilita:
- **Maps JavaScript API** (obligatorio)
- **Geocoding API** (obligatorio para coordenadas reales)

### 4. Crear credenciales
1. Ve a "APIs y servicios" > "Credenciales"
2. Clic en "Crear credenciales" > "Clave de API"
3. Copia la API Key generada

### 5. Restringir la API Key (Opcional - Hazlo después)
**IMPORTANTE:** Si ves el error "ApiTargetBlockedMapError", deja las restricciones en "Ninguna" por ahora.

Para seguridad en producción:
- **Restricciones de aplicación**: Sitios web
- **Restricciones de sitios web**: Agrega tu dominio (ej: `tudominio.com/*`)
- **Restricciones de API**: Selecciona solo "Maps JavaScript API"

**Nota:** Para desarrollo local, es mejor NO poner restricciones o agregar `localhost:3000/*` y `127.0.0.1:3000/*`

### 6. Configurar en tu proyecto
1. Copia el archivo `.env.local.example` a `.env.local`
2. Reemplaza `tu_api_key_aqui` con tu API Key real
3. Reinicia el servidor de desarrollo

```bash
cp .env.local.example .env.local
# Edita .env.local y agrega tu API Key
npm run dev
```

## Costos
- Google Maps ofrece **$200 USD de crédito mensual gratis**
- Maps JavaScript API: $7 por cada 1,000 cargas de mapa
- Con el crédito gratuito puedes hacer ~28,000 cargas de mapa al mes sin costo

## Nota importante
- **NO** subas tu `.env.local` a Git (ya está en .gitignore)
- **NO** compartas tu API Key públicamente
- Usa restricciones para proteger tu API Key

## Alternativa sin API Key (Temporal)
Si no quieres usar API Key por ahora, el mapa mostrará posiciones simuladas alrededor de Aquitania.
Para producción, necesitarás la API Key para obtener coordenadas reales de las direcciones.


## 🔧 Solución de Problemas

### ❌ Error: "ApiTargetBlockedMapError"
**Este es el error más común.** Significa que tu API Key tiene restricciones que bloquean localhost.

**Solución:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a "APIs y servicios" > "Credenciales"
4. Haz clic en tu API Key
5. En "Restricciones de aplicación", selecciona **"Ninguna"**
6. Guarda los cambios
7. Espera 1-2 minutos y recarga la página

### ⚠️ Warning: "Marker is deprecated"
Este es solo un aviso, **no afecta la funcionalidad**. Los marcadores funcionarán correctamente. Google recomienda usar AdvancedMarkerElement en el futuro, pero Marker seguirá funcionando.

### 🗺️ El mapa no carga
- Verifica que la API Key esté en `.env.local`
- Reinicia el servidor: `npm run dev`
- Verifica que Maps JavaScript API esté habilitada en Google Cloud Console
- Revisa la consola del navegador (F12) para ver errores específicos

### 📍 Marcadores en posiciones incorrectas
Actualmente usa posiciones simuladas. Para coordenadas reales:
1. Habilita "Geocoding API" en Google Cloud Console
2. Implementa geocodificación de direcciones (próxima mejora)
