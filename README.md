# 🎼 Tempo | Sistema de Gestión de Eventos Musicales

**Tempo** es una plataforma integral diseñada para músicos y directores de agrupaciones que necesitan centralizar su logística, agenda y repertorio en una única herramienta inteligente. Olvida las hojas de cálculo y los mensajes dispersos; gestiona tus bolos de forma profesional.

---

## 🚀 Características Principales

### 📅 Gestión de Agenda Inteligente (Fase 2 & 3)
* **Timeline Dinámico:** Visualización cronológica de próximos eventos con estados de confirmación en tiempo real.
* **Detector de Colisiones:** Lógica algorítmica avanzada para evitar solapamientos de horarios. Basado en la validación matemática:
    $$(StartA < EndB) \land (EndA > StartB)$$
* **Vista Dual:** Alterna entre un listado detallado (*Timeline*) y una cuadrícula mensual (*Calendario*) para una planificación estratégica.

### 🎵 Biblioteca de Repertorio (Fase 4)
* **Gestión M:N:** Relación robusta entre eventos y partituras, permitiendo reutilizar el catálogo global en diferentes fechas.
* **Setlists Personalizados:** Control total sobre el orden de interpretación para cada actuación.
* **Acceso Directo:** Vinculación de archivos PDF para que los músicos accedan a sus partituras desde cualquier dispositivo.

### 🔍 Optimización de Flujo (Fase 5)
* **Filtros Avanzados:** Búsqueda instantánea por nombre de evento, lugar o agrupación musical.
* **Diseño Responsive:** Interfaz moderna construida con **Tailwind CSS**, optimizada para tablets y smartphones durante ensayos y conciertos.

---

## 🛠️ Stack Tecnológico

| Tecnología | Propósito |
| :--- | :--- |
| **React 18** | Biblioteca principal para la interfaz de usuario. |
| **Vite** | Tooling de última generación para un desarrollo rápido. |
| **TypeScript** | Tipado estático para asegurar la robustez del código. |
| **Supabase** | Backend as a Service (PostgreSQL + RLS) para persistencia segura. |
| **Tailwind CSS** | Estilizado modular y utilitario. |
| **Lucide React** | Set de iconografía consistente y ligera. |
| **date-fns** | Manipulación y formateo de fechas y calendarios. |
