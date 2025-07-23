<!-- # 🌟 Corplan Web - Atlantis NG

Una aplicación Angular moderna basada en el template premium **Atlantis NG** de PrimeTek, diseñada para la gestión integral de ventas, cobranzas y administración de clientes.

## 📋 Tabla de Contenidos

- [🎯 Acerca de Atlantis NG](#-acerca-de-atlantis-ng)
- [🏗️ Estructura del Proyecto](#%EF%B8%8F-estructura-del-proyecto)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🌍 Environments](#-environments)
- [🧩 Componentes Reutilizables](#-componentes-reutilizables)
- [📱 Funcionalidades Principales](#-funcionalidades-principales)
- [🎨 Tecnologías](#-tecnologías)
- [📱 Características](#-características)

---

## 🎯 Acerca de Atlantis NG

**Atlantis NG** es un template premium de aplicación Angular desarrollado por PrimeTek, que ofrece una experiencia de usuario moderna y profesional. Este proyecto utiliza los siguientes componentes de Atlantis:

### 🔧 Componentes de Atlantis NG en Uso:

- ✅ **Layout System**: Sistema de navegación responsive con múltiples orientaciones de menú
- ✅ **Dark/Light Mode**: Soporte completo para temas claros y oscuros
- ✅ **Component Themes**: 17 temas integrados basados en PrimeNG
- ✅ **Responsive Design**: Diseño completamente adaptable a dispositivos móviles
- ✅ **Template Pages**: Páginas prediseñadas para login, errores y landing
- ✅ **PrimeIcons**: Librería completa de iconos modernos
- ✅ **SASS Support**: Sistema de estilos completamente customizable

---

## 🏗️ Estructura del Proyecto

```
corplan-web/
├── 📁 public/                    # Recursos estáticos
│   ├── 🖼️ images/               # Imágenes, avatares, iconos
│   └── 📄 layout/               # Estilos del layout
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 common/           # 🎯 Componentes reutilizables
│   │   │   ├── 📁 components/   # Filtros, tablas, búsqueda
│   │   │   └── 📁 services/     # Servicios compartidos
│   │   ├── 📁 pages/            # Páginas principales
│   │   │   ├── 📁 clientes/     # Gestión de clientes
│   │   │   ├── 📁 ventas/       # Módulo de ventas
│   │   │   ├── 📁 cobranzas/    # Módulo de cobranzas
│   │   │   └── 📁 auth/         # Autenticación
│   │   ├── 📁 layout/           # Layout principal de Atlantis
│   │   └── 📁 interceptors/     # Interceptores HTTP
│   ├── 📁 environments/         # Configuraciones por ambiente
│   └── 📁 assets/              # Recursos del proyecto
├── 📄 angular.json             # Configuración de Angular CLI
├── 📄 package.json             # Dependencias del proyecto
└── 📄 tailwind.config.js       # Configuración de Tailwind CSS
```

---

## 🚀 Inicio Rápido

### 📋 Prerrequisitos

- Node.js 18+
- Angular CLI 19+
- npm o yarn

### ⚡ Instalación

```bash
# 1️⃣ Clonar el repositorio
git clone [url-del-repositorio]
cd corplan-web

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

---

## 🌍 Environments

El proyecto soporta múltiples ambientes de ejecución:

### 🔧 Comandos Disponibles:

| Ambiente           | Comando              | Descripción                  |
| ------------------ | -------------------- | ---------------------------- |
| 🏠 **Development** | `npm start`          | Ambiente local de desarrollo |
| 🧪 **Beta**        | `npm run start:beta` | Ambiente de testing/staging  |
| 🚀 **Production**  | `npm run start:prod` | Ambiente de producción       |

### 📦 Builds de Distribución:

```bash
# 🏗️ Build para desarrollo
npm run build

# 🧪 Build para beta
npm run build:beta

# 🔄 Build para release candidate
npm run build:rc

# 🚀 Build para producción
npm run build:prod
```

### ⚙️ Configuración de Environments:

```
src/environments/
├── environment.ts        # 🏠 Desarrollo
├── environment.beta.ts   # 🧪 Beta/Staging
├── environment.rc.ts     # 🔄 Release Candidate
└── environment.prod.ts   # 🚀 Producción
```

---

## 🧩 Componentes Reutilizables

### 🎯 Componentes Centrales para Reutilización

Estos componentes están diseñados para ser utilizados consistentemente en todas las pantallas:

#### 🔍 **FilterGroup Component**

- **Ubicación**: `src/app/common/components/filter-group.ts`
- **Propósito**: Sistema de filtros unificado para todas las vistas
- **Características**:
    - ✅ Filtros dinámicos por dropdown
    - ✅ Filtros de rango de fechas
    - ✅ Sincronización con query parameters
    - ✅ Botón "Limpiar filtros"
    - ✅ Diseño responsive

```typescript
// 💡 Ejemplo de uso
<filter-group
  [filters]="availableFilters"
  [useDateFilters]="true"
  [queryParams]="currentParams"
  (selectedFilters)="onFilterChange($event)"
  (clearFilters)="onClearFilters()">
</filter-group>
```

#### 📊 **CustomerList Component (Tabla Universal)**

- **Ubicación**: `src/app/common/components/list.ts`
- **Propósito**: Tabla reutilizable para mostrar cualquier tipo de datos
- **Características**:
    - ✅ Vista de tabla para desktop
    - ✅ Vista de cards para móvil
    - ✅ Ordenamiento multcolumna
    - ✅ Selección múltiple con checkboxes
    - ✅ Menú contextual por fila
    - ✅ Componentes personalizables (tags, imágenes)

```typescript
// 💡 Ejemplo de uso
<customer-list
  [customers]="dataList"
  [cols]="tableColumns"
  [showCheckbox]="true"
  [hasContextualMenu]="true"
  (onSort)="handleSort($event)"
  (selectedItems)="handleSelection($event)"
  (openItem)="openDetail($event)">
</customer-list>
```

#### 🔍 **Search Input (Integrado en FilterGroup)**

- **Características**:
    - ✅ Búsqueda en tiempo real
    - ✅ Debounce para optimización
    - ✅ Sincronización con URL
    - ✅ Placeholder personalizable
    - ✅ Íconos integrados

#### 🎛️ **Otros Componentes Reutilizables:**

| Componente               | Archivo                 | Propósito                      |
| ------------------------ | ----------------------- | ------------------------------ |
| 🛒 **CartSummary**       | `cart-summary.ts`       | Resumen de carrito de compras  |
| ✅ **ConfirmationModal** | `confirmation-modal.ts` | Modal de confirmación estándar |
| 🧭 **Header**            | `header.ts`             | Cabecera de páginas            |
| 🍔 **ButtonWithMenu**    | `button-with-menu.ts`   | Botón con menú desplegable     |

---

## 📱 Funcionalidades Principales

### 🏢 **Módulos de Negocio:**

- 👥 **Clientes**: Gestión completa de clientes y prospectos
- 💰 **Ventas**: Catálogo de productos y gestión de ventas
- 💳 **Cobranzas**: Seguimiento de pagos y gestión de cobranzas
- 📈 **Actualizaciones**: Módulo de actualizaciones de artículos

### ⚙️ **Funcionalidades Técnicas:**

- 🔐 Autenticación y autorización
- 📱 Diseño responsive para mobile y desktop
- 🌙 Modo oscuro/claro
- 🔄 Lazy loading de módulos
- 📊 Tablas con paginación y filtros
- 🗺️ Integración con Google Maps
- 📄 Exportación de datos

---

## 🎨 Tecnologías

### 🚀 **Core Technologies:**

- **Angular 19** - Framework principal
- **TypeScript** - Lenguaje de programación
- **PrimeNG 19** - Librería de componentes UI
- **Tailwind CSS** - Framework de estilos
- **PrimeFlex** - Utilidades CSS

### 📦 **Dependencias Principales:**

```json
{
    "@angular/core": "^19.0.0",
    "primeng": "^19.0.8",
    "@primeng/themes": "^19.0.6",
    "primeicons": "^7.0.0",
    "tailwindcss": "^3.4.17",
    "chart.js": "4.4.2",
    "@angular/google-maps": "^19.2.11"
}
```

---

## 📱 Características

### ⭐ **Características de Atlantis NG:**

- 🎨 **17 Temas de Componentes** - Variedad de estilos predefinidos
- 📐 **7 Orientaciones de Menú** - Static, Overlay, Slim, Drawer, etc.
- 🌓 **Modo Claro/Oscuro** - Cambio dinámico de tema
- 📱 **Completamente Responsive** - Optimizado para todos los dispositivos
- 🎯 **Touch Optimized** - Experiencia táctil mejorada para móviles
- 🧩 **Compatibilidad con PrimeBlocks** - Bloques de UI modulares
- 🎭 **Archivo Figma** - Diseños disponibles para diseñadores

### 🔧 **Scripts de Desarrollo:**

```bash
# 🎨 Formateo de código
npm run format              # Formatear archivos
npm run format:check       # Verificar formato

# 🔍 Linting
npm run lint               # Ejecutar ESLint

# 🧪 Testing
npm run test               # Ejecutar pruebas unitarias

# 👀 Desarrollo con watch
npm run watch              # Build con observador de cambios
```

---

<div align="center">

**🚀 Desarrollado con Atlantis NG y Angular 19**

_Para más información sobre Atlantis NG, visita: [primeng.org/templates/atlantis](https://primeng.org/templates/atlantis)_

</div> -->
