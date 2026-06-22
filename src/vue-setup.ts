import type { App } from "vue";
import * as Quasar from "quasar";
import {
  Quasar as QuasarPlugin,
  // Plugins (programmatic UI services)
  Notify,
  Dialog,
  Loading,
  LoadingBar,
  // Directives
  Ripple,
  ClosePopup,
  Intersection,
  Mutation,
  Morph,
  Scroll,
  TouchHold,
  TouchPan,
  TouchRepeat,
  TouchSwipe,
} from "quasar";

// Icon fonts + Quasar core styles.
// We import the prebuilt CSS so no Sass build step is required; brand colors are
// customized via CSS variables in `./css/app.css` (imported last so it wins).
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/dist/quasar.css";
import "./css/app.css";

// Register every Quasar component (`QBtn`, `QInput`, `QCard`, ...) globally so
// any `<q-*>` component works inside any island without per-file imports.
const components: Record<string, unknown> = Object.fromEntries(
  Object.entries(Quasar).filter(
    ([name, value]) =>
      name.startsWith("Q") &&
      name !== "Quasar" &&
      value != null &&
      (typeof value === "object" || typeof value === "function"),
  ),
);

const directives = {
  Ripple,
  ClosePopup,
  Intersection,
  Mutation,
  Morph,
  Scroll,
  TouchHold,
  TouchPan,
  TouchRepeat,
  TouchSwipe,
};

const options = {
  components,
  directives,
  plugins: { Notify, Dialog, Loading, LoadingBar },
  config: {
    // App-wide dark mode. Customize or remove to default to light.
    dark: true,
    loadingBar: { color: "primary" },
    notify: { position: "top-right" as const },
  },
};

export default (app: App) => {
  if (import.meta.env.SSR) {
    // On the server, Quasar's install path runs in "SSR server" mode and reads
    // request headers (for platform detection) plus fills in a `_meta`/`$q`
    // object on the context it is given. Astro doesn't provide a Quasar SSR
    // context for islands, so we pass a minimal placeholder. This keeps server
    // rendering free of `document`/`window` access.
    const ssrContext = { req: { headers: {} }, res: {} };
    // Vue's `app.use` types only allow a single options argument, but Quasar's
    // SSR install signature is `installQuasar(app, options, ssrContext)`.
    // @ts-expect-error -- pass the SSR context as Quasar's documented 3rd arg
    app.use(QuasarPlugin, options, ssrContext);
  } else {
    app.use(QuasarPlugin, options);
  }
};
