# 🚀 Guía Rápida: Best Practices Real Estate (Next.js)

### ⚡ Rendimiento y Core
*   **ISR (Incremental Static Regeneration):** Para páginas de propiedades (carga instantánea).
*   **SSR (Server-Side Rendering):** Solo para resultados de búsqueda altamente dinámicos.
*   **Intercepting Routes:** Vistas rápidas de propiedades en modales sin perder la lista.
*   **Server Actions:** Gestión de formularios y filtros sin APIs adicionales.
*   **Suspense & Skeletons:** Evita spinners; usa esqueletos de carga por componente.

### 📸 Imágenes y Contenido
*   **Next/Image:** Prioridad (`priority`) en el Hero; `sizes` responsivos siempre.
*   **Lazy Loading:** Galerías diferidas hasta que el usuario haga scroll.
*   **Blur Placeholders:** Mejora la percepción de velocidad.
*   **Formato AVIF/WebP:** Forzado desde el servidor de imágenes.

### 🔍 Navegación y Estructura (Slugs)
*   **SEO-Friendly Slugs:** Usa `/propiedad/hermosa-casa-campestre-poblado` en lugar de `/propiedad/id-123`.
*   **Normalización de Slugs:** Convierte títulos a minúsculas, elimina tildes y usa guiones. Almacénalos en la BD para queries rápidas.
*   **Canonical URLs:** Asegura que cada propiedad tenga un `link rel="canonical"` para evitar penalizaciones por contenido duplicado.
*   **Breadcrumbs:** Implementa migas de pan (Home > Venta > Medellín) para mejorar el rastreo de Google.

### 📈 SEO, Metadata y Open Graph
*   **Metadata Dinámica:** Usa `generateMetadata()` de Next.js para inyectar títulos y descripciones únicas basadas en los datos de la propiedad.
*   **Vercel OG (Dynamic Images):** Genera automáticamente una imagen de previsualización (Open Graph) que incluya el precio, la foto principal y el logo para cuando se comparta en WhatsApp/FB.
*   **Twitter Cards:** Configura `twitter:card` como `summary_large_image` para maximizar el impacto visual en redes.
*   **Robots & Sitemap:** Genera un `sitemap.xml` dinámico que se actualice cada vez que subas una nueva propiedad.

### 🔍 Filtros y Búsqueda

### 💾 Datos y Backend (Supabase)
*   **Full-Text Search:** Búsqueda avanzada por barrios o amenidades.
*   **RLS (Row Level Security):** Privacidad estricta de leads y datos de agentes.
*   **Real-time:** Notificación instantánea de cambios en estado (Vendido/Reservado).
*   **Pagination:** Paginación por cursor o offset desde el servidor.

### ✨ Funcionalidades "Wow"
*   **Mortgage Calculator:** Widget integrado en cada vista de propiedad.
*   **Compare Tool:** Selección de 2-3 casas para ver tabla comparativa.
*   **Favoritos:** Autenticación rápida (Apple/Google) para guardar casas.
*   **Street View:** Integración directa con Google Maps Street View API.
*   **360 Tours:** Embeber recorridos virtuales (Matterport/CloudPano).
