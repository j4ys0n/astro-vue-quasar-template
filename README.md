# Astro + Vue 3 + Quasar Template

A production-ready marketing website template using Astro's islands architecture, Vue 3 components, and the Quasar component library for Material Design styling.

## 🚀 Features

- **Astro 5**: Fast static site generation with selective hydration.
- **Vue 3**: Composition API with `<script setup>` for interactive components.
- **Quasar**: Complete Material Design component library (used as a Vue plugin).
- **TypeScript**: Full type safety across Astro and Vue.
- **Islands Architecture**: Zero JavaScript by default, only loaded where needed.
- **SEO Optimized**: Automatic sitemap generation and static HTML rendering.
- **Dark Theme**: Pre-configured dark theme using Quasar's dark mode.

## 🛠️ Stack

- **Framework**: [Astro](https://astro.build/)
- **UI Framework**: [Vue 3](https://vuejs.org/)
- **Component Library**: [Quasar](https://quasar.dev/)
- **Icons**: [Material Icons](https://fonts.google.com/icons) (via `@quasar/extras`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Project Structure

```text
/
├── src/
│   ├── components/      # Vue components (.vue)
│   ├── css/
│   │   └── app.css      # Brand colors (CSS variables) + global styles
│   ├── layouts/         # Astro layouts (.astro)
│   ├── pages/           # Astro pages (file-based routing)
│   ├── vue-setup.ts     # Quasar/Vue initialization
│   └── env.d.ts         # TypeScript environment definitions
├── public/              # Static assets (favicons, etc.)
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🚥 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

### 3. Build for Production

```bash
npm run build
```

The static output will be in the `dist/` directory.

## 💡 Key Patterns

### Static Components

Use standard Vue components without any client directives in Astro files to render them as pure static HTML.

```astro
<Hero title="Hello" subtitle="World" />
```

### Interactive Components

Add `client:load` to components that require JavaScript interactivity (like menus, forms, or search).

```astro
<NavBar client:load />
```

### Quasar Integration

Quasar is registered as a Vue plugin in `src/vue-setup.ts`. A few details worth knowing:

- **Components are globally registered.** Every `<q-*>` component is available in any island without per-file imports. Plugins (`Notify`, `Dialog`, `Loading`, `LoadingBar`) and directives (`v-ripple`, `v-close-popup`, etc.) are registered there too.
- **No app shell.** Quasar's app-shell components (`QLayout`, `QPageContainer`, `QDrawer`) expect to wrap an entire single-page app, which doesn't fit Astro's islands model. Build the shell with regular HTML/Astro elements (see `Layout.astro` and `NavBar.vue`) and use Quasar components for the UI inside them.
- **SSR-safe.** The setup passes a minimal SSR context on the server so islands render to static HTML without touching browser globals, then hydrate on the client.
- **Prebuilt CSS.** `quasar/dist/quasar.css` is imported directly, so no Sass build step is required.

### Theming

Quasar's brand colors are exposed as CSS custom properties. Edit them in `src/css/app.css`:

```css
:root {
  --q-primary: #2563eb;
  --q-secondary: #64748b;
  --q-accent: #7c3aed;
  /* ...positive / negative / info / warning, plus --q-dark / --q-dark-page */
}
```

Dark mode is enabled in `src/vue-setup.ts` via `config: { dark: true }`, and `Layout.astro` adds the `body--dark` class for a flash-free first paint.

## 📄 License

MIT
