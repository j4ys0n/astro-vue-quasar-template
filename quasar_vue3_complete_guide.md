# Quasar + Vue 3 Complete Application Guide

Version: 2026-06-22  
Primary target: Quasar v2 with Vue 3, Vite, TypeScript, Vue Router, Pinia  
Audience: engineers building production SPA/SSR/PWA/admin/platform apps

Primary sources used:

- Quasar CLI: https://quasar.dev/start/quasar-cli/
- Quasar component index: https://quasar.dev/components/
- Quasar GitHub repository: https://github.com/quasarframework/quasar
- Quasar `quasar.config`: https://quasar.dev/quasar-cli-vite/quasar-config-file/
- Quasar boot files: https://quasar.dev/quasar-cli-vite/boot-files/
- Quasar Pinia integration: https://quasar.dev/quasar-cli-vite/state-management-with-pinia/
- Quasar routing with layouts and pages: https://quasar.dev/layout/routing-with-layouts-and-pages/
- Quasar layout: https://quasar.dev/layout/layout/
- Quasar drawer: https://quasar.dev/layout/drawer/
- Quasar Screen plugin: https://quasar.dev/options/screen-plugin/
- Quasar color palette: https://quasar.dev/style/color-palette/
- Quasar Sass variables: https://quasar.dev/style/sass-scss-variables/
- Quasar Dark plugin: https://quasar.dev/quasar-plugins/dark/
- Quasar Dialog plugin: https://quasar.dev/quasar-plugins/dialog/
- Quasar Loading plugin: https://quasar.dev/quasar-plugins/loading/
- Quasar Loading Bar plugin: https://quasar.dev/quasar-plugins/loading-bar/
- Quasar Notify plugin: https://quasar.dev/quasar-plugins/notify/
- Quasar Local/Session Storage: https://quasar.dev/quasar-plugins/web-storage/
- Quasar Table: https://quasar.dev/vue-components/table/
- Quasar Form: https://quasar.dev/vue-components/form/
- Quasar Input: https://quasar.dev/vue-components/input/
- Quasar Select: https://quasar.dev/vue-components/select/
- Vue `<script setup>`: https://vuejs.org/api/sfc-script-setup.html
- Vue lifecycle hooks: https://vuejs.org/api/composition-api-lifecycle.html
- Pinia core concepts: https://pinia.vuejs.org/core-concepts/
- Vuex status: https://vuex.vuejs.org/

---

## 1. Mental model

Quasar is not just a component library. It is a Vue application framework plus a large UI system. Treat it as four layers:

1. **Runtime layer**: Quasar CLI, Vite, app modes, `quasar.config`, boot files, router, store initialization.
2. **Shell layer**: `QLayout`, `QHeader`, `QFooter`, `QDrawer`, `QPageContainer`, `QPage`, global navigation, app-level theme, global loading, global notifications.
3. **Feature layer**: pages, feature components, tables, forms, dialogs, workflows, API-backed views, CRUD modules, dashboards.
4. **Design-system layer**: colors, typography, spacing, buttons, cards, form field conventions, base components, reusable composables, shared services.

The biggest mistake in Quasar apps is treating each page as an island. A production app should centralize theme, route metadata, storage keys, API behavior, validation helpers, loading behavior, dialog patterns, notification patterns, and entity-state patterns.

Use Quasar components for UI primitives, Vue for component composition, Pinia for shared application state, services for network/domain logic, composables for reusable behavior, and boot files for app startup wiring.

---

## 2. Recommended stack

For new projects:

```txt
Quasar CLI + Vite
Vue 3
TypeScript
Vue Router
Pinia
<script setup>
SCSS or Sass variables
Axios or fetch wrapper
Vitest + Vue Test Utils + Playwright/Cypress
```

Pinia is the practical default for Vue 3 state. Vuex 3/4 is still maintained, but Pinia is the current official default store direction for Vue. Use Vuex only for an existing codebase where migration cost is higher than the benefit.

Use Composition API and `<script setup>` for most new components because it reduces boilerplate and gives cleaner TypeScript inference.

---

## 3. Project creation

Official Quasar CLI currently lists Node.js v22+ and PNPM v11+ recommended for Quasar CLI projects.

```bash
pnpm create quasar@latest
```

Pick:

```txt
App with Quasar CLI
Vue 3
TypeScript
Pinia
Vue Router
ESLint/Prettier as needed
```

Common package scripts:

```json
{
  "scripts": {
    "dev": "quasar dev",
    "build": "quasar build",
    "build:ssr": "quasar build -m ssr",
    "build:pwa": "quasar build -m pwa",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test:unit": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

## 4. Production folder structure

A small Quasar app can survive with the scaffolded structure. A platform or admin app needs stricter boundaries.

```txt
src/
  assets/
    logo.svg
    illustrations/
  boot/
    api.ts
    auth.ts
    i18n.ts
    theme.ts
    analytics.ts
  components/
    base/
      BaseAsyncButton.vue
      BaseConfirmDialog.vue
      BaseEmptyState.vue
      BaseErrorState.vue
      BasePageHeader.vue
      BaseSectionCard.vue
      BaseStatusChip.vue
      BaseTableToolbar.vue
    app/
      AppDrawerNav.vue
      AppHeader.vue
      AppThemeToggle.vue
      AppUserMenu.vue
    users/
      UserEditorDialog.vue
      UserRoleSelect.vue
  composables/
    useAsyncTask.ts
    useConfirm.ts
    useDebouncedRef.ts
    useEntityTable.ts
    useFormSubmit.ts
    usePersistentQuasarDark.ts
    useServerPagination.ts
  css/
    app.scss
    quasar.variables.sass
    tokens.scss
  layouts/
    MainLayout.vue
    AuthLayout.vue
    EmptyLayout.vue
    MarketingLayout.vue
  pages/
    dashboard/
      DashboardPage.vue
    users/
      UsersPage.vue
      UserDetailPage.vue
    auth/
      LoginPage.vue
  router/
    index.ts
    routes.ts
    guards.ts
  services/
    api.ts
    auth.service.ts
    users.service.ts
    errors.ts
  stores/
    app.store.ts
    auth.store.ts
    users.store.ts
  types/
    api.ts
    auth.ts
    user.ts
  utils/
    dates.ts
    formatters.ts
    ids.ts
    scroll.ts
    storageKeys.ts
```

Rules:

- **Pages orchestrate**. They wire stores, services, and components together.
- **Components render**. They should be reusable and receive data via props or stores.
- **Stores own shared state**. Do not turn every local form field into global state.
- **Services talk to APIs**. Do not put `fetch`/Axios logic directly in button click handlers.
- **Composables share behavior**. Do not copy loading/error/pagination logic into every page.
- **Boot files wire the app**. Use them for router guards, API clients, i18n, analytics, and startup defaults.
- **Base components enforce design consistency**. They should be boring, stable, and small.

---

## 5. `quasar.config.ts`

`quasar.config` is the app switchboard. Use it to declare boot files, global CSS, extras, framework config, plugins, directives, animations, build options, dev server behavior, app modes, SSR/PWA/Electron/Capacitor settings, and framework-level defaults.

A strong baseline:

```ts
// quasar.config.ts
import { configure } from 'quasar/wrappers'

export default configure((ctx) => ({
  css: ['app.scss'],

  extras: [
    'roboto-font',
    'material-icons',
    'material-symbols-outlined'
  ],

  boot: [
    'api',
    'auth',
    'theme',
    'i18n',
    'analytics'
  ],

  framework: {
    config: {
      dark: 'auto',
      notify: {
        position: 'top-right',
        timeout: 4000,
        actions: [{ icon: 'close', color: 'white' }]
      },
      loading: {
        delay: 250
      }
    },

    plugins: [
      'Dialog',
      'Notify',
      'Loading',
      'LoadingBar',
      'LocalStorage',
      'SessionStorage',
      'Cookies',
      'Meta',
      'AppFullscreen',
      'AppVisibility'
    ],

    directives: [
      'ClosePopup',
      'Ripple',
      'Intersection',
      'Mutation',
      'Morph',
      'Scroll',
      'ScrollFire',
      'TouchHold',
      'TouchPan',
      'TouchRepeat',
      'TouchSwipe'
    ]
  },

  build: {
    vueRouterMode: 'history',
    env: {
      API_BASE_URL: JSON.stringify(process.env.API_BASE_URL ?? '')
    }
  },

  devServer: {
    open: false
  }
}))
```

Guidelines:

- Include only icon packs and extras you actually use.
- Register global Quasar plugins once here.
- Keep boot file order deliberate. API before auth is typical; theme before analytics is often useful.
- Use env values through `build.env` or Vite environment patterns, not magic strings in components.
- Prefer centralized Quasar config defaults for `Notify`, `Loading`, and dark mode.

---

## 6. Boot files

Boot files run during app startup. They can access `app`, `router`, and the store instance. They can also export named utilities for use outside Vue components.

### 6.1 API boot file

```ts
// src/boot/api.ts
import { defineBoot } from '#q-app'
import axios, { AxiosError } from 'axios'
import { Notify, LoadingBar } from 'quasar'

export const api = axios.create({
  baseURL: process.env.API_BASE_URL || '/api',
  timeout: 30_000
})

api.interceptors.request.use((config) => {
  LoadingBar.start()

  const token = localStorage.getItem('auth.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    LoadingBar.stop()
    return response
  },
  (error: AxiosError<{ message?: string }>) => {
    LoadingBar.stop()

    const message =
      error.response?.data?.message ||
      error.message ||
      'Request failed'

    Notify.create({
      type: 'negative',
      message
    })

    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})
```

Use the named export in services:

```ts
// src/services/users.service.ts
import { api } from 'src/boot/api'
import type { User, UserInput } from 'src/types/user'

export const usersService = {
  async list(params: { page: number; rowsPerPage: number; filter?: string }) {
    const { data } = await api.get<{ rows: User[]; rowsNumber: number }>('/users', { params })
    return data
  },

  async create(input: UserInput) {
    const { data } = await api.post<User>('/users', input)
    return data
  },

  async update(id: string, input: UserInput) {
    const { data } = await api.put<User>(`/users/${id}`, input)
    return data
  },

  async remove(id: string) {
    await api.delete(`/users/${id}`)
  }
}
```

### 6.2 Auth boot file

```ts
// src/boot/auth.ts
import { defineBoot } from '#q-app'
import { useAuthStore } from 'src/stores/auth.store'

export default defineBoot(({ router }) => {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.ready) {
      await auth.restoreSession()
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return {
        path: '/auth/login',
        query: { redirect: to.fullPath }
      }
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { path: '/' }
    }
  })
})
```

### 6.3 Theme boot file

```ts
// src/boot/theme.ts
import { defineBoot } from '#q-app'
import { Dark, LocalStorage } from 'quasar'

const DARK_MODE_KEY = 'app.darkMode'

type DarkMode = true | false | 'auto'

export default defineBoot(() => {
  const saved = LocalStorage.getItem<DarkMode>(DARK_MODE_KEY)
  Dark.set(saved ?? 'auto')
})

export function persistDarkMode(value: DarkMode) {
  LocalStorage.set(DARK_MODE_KEY, value)
  Dark.set(value)
}
```

### 6.4 Boot file rules

Good boot-file responsibilities:

- configure Axios/fetch clients
- attach route guards
- initialize i18n
- initialize analytics
- initialize theme
- register third-party Vue plugins
- expose globally configured service instances

Bad boot-file responsibilities:

- page-specific data fetching
- feature business logic
- form validation logic
- table filtering logic
- long-running workflows that block app startup unnecessarily

---

## 7. Routing, layouts, and pages

Quasar apps usually use layouts as route parents and pages as children. A layout contains the shell; the page renders inside `<router-view />` within `QPageContainer`.

```ts
// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('src/pages/dashboard/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('src/pages/users/UsersPage.vue'),
        meta: { title: 'Users' }
      },
      {
        path: 'users/:id',
        name: 'user-detail',
        component: () => import('src/pages/users/UserDetailPage.vue'),
        meta: { title: 'User Detail' }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('src/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/auth/LoginPage.vue'),
        meta: { title: 'Log in' }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue')
  }
]
```

Route metadata should drive page titles, breadcrumbs, and permission checks.

```ts
// src/router/guards.ts
import type { Router } from 'vue-router'
import { useMeta } from 'quasar'

export function installTitleGuard(router: Router) {
  router.afterEach((to) => {
    document.title = `${String(to.meta.title ?? 'App')} · Platform`
  })
}
```

For SSR, prefer Quasar Meta instead of directly writing `document.title` inside route guards because `document` is client-only.

---

## 8. Main application shell

### 8.1 Main layout

```vue
<!-- src/layouts/MainLayout.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useAppStore } from 'src/stores/app.store'
import AppDrawerNav from 'src/components/app/AppDrawerNav.vue'
import AppUserMenu from 'src/components/app/AppUserMenu.vue'
import AppThemeToggle from 'src/components/app/AppThemeToggle.vue'

const $q = useQuasar()
const route = useRoute()
const app = useAppStore()

const pageTitle = computed(() => String(route.meta.title ?? 'Platform'))
const miniDrawer = computed(() => $q.screen.gt.sm && app.drawerMini)
</script>

<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Toggle navigation"
          @click="app.toggleDrawer()"
        />

        <q-toolbar-title>{{ pageTitle }}</q-toolbar-title>

        <AppThemeToggle class="q-mr-sm" />
        <AppUserMenu />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="app.drawerOpen"
      show-if-above
      bordered
      :mini="miniDrawer"
      :width="280"
      :breakpoint="900"
      class="bg-grey-1 text-grey-9"
    >
      <AppDrawerNav />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
```

### 8.2 Drawer nav

```vue
<!-- src/components/app/AppDrawerNav.vue -->
<script setup lang="ts">
const navItems = [
  { label: 'Dashboard', icon: 'dashboard', to: '/', exact: true },
  { label: 'Users', icon: 'group', to: '/users' },
  { label: 'Settings', icon: 'settings', to: '/settings' }
]
</script>

<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-item-label header>Platform</q-item-label>

      <q-item
        v-for="item in navItems"
        :key="item.to"
        clickable
        v-ripple
        :to="item.to"
        :exact="item.exact"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>
```

### 8.3 Auth layout

```vue
<!-- src/layouts/AuthLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
```

```vue
<!-- src/pages/auth/LoginPage.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.store'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const formRef = ref()

const form = reactive({
  email: '',
  password: ''
})

async function submit() {
  const ok = await formRef.value?.validate()
  if (!ok) return

  await auth.login(form)
  await router.replace(String(route.query.redirect || '/'))
}
</script>

<template>
  <q-page class="row items-center justify-center bg-grey-2 q-pa-md">
    <q-card class="full-width" style="max-width: 420px">
      <q-card-section>
        <div class="text-h5">Log in</div>
        <div class="text-body2 text-grey-7">Access your workspace.</div>
      </q-card-section>

      <q-form ref="formRef" @submit.prevent="submit">
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            autocomplete="email"
            outlined
            :rules="[val => !!val || 'Email is required']"
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            autocomplete="current-password"
            outlined
            :rules="[val => !!val || 'Password is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Log in"
            type="submit"
            color="primary"
            :loading="auth.loggingIn"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
```

---

## 9. Responsive design

Quasar gives you several ways to build responsive UIs:

- `QLayout`, `QDrawer`, and breakpoints for app shell behavior.
- `$q.screen` for behavior changes in JavaScript/templates.
- Quasar CSS visibility classes for show/hide behavior.
- Quasar flex/grid helpers for layout.
- `QResponsive` for fixed aspect-ratio containers.
- `QResizeObserver` and `QScrollObserver` for measured behavior.
- `QTable` grid mode for mobile-friendly data display.

### 9.1 Use CSS first, `$q.screen` when behavior changes

Use CSS classes for appearance-only changes:

```vue
<div class="row q-col-gutter-md">
  <div class="col-12 col-md-6 col-lg-4">
    <MetricCard />
  </div>
</div>
```

Use `$q.screen` when component behavior changes:

```vue
<q-table
  :dense="$q.screen.lt.md"
  :grid="$q.screen.lt.sm"
  :rows="rows"
  :columns="columns"
  row-key="id"
/>
```

### 9.2 Breakpoint strategy

A practical app breakpoint strategy:

```txt
xs/sm: mobile first, single column, drawer overlay, table grid mode
md: tablet/small laptop, two columns, drawer normal if space allows
lg/xl: desktop, dense data views, splitters, persistent drawer, sticky filters
```

### 9.3 Mobile drawer behavior

```vue
<q-drawer
  v-model="app.drawerOpen"
  show-if-above
  bordered
  :breakpoint="1024"
  :overlay="$q.screen.lt.md"
>
  <AppDrawerNav />
</q-drawer>
```

### 9.4 Responsive cards

```vue
<div class="row q-col-gutter-md">
  <div
    v-for="metric in metrics"
    :key="metric.key"
    class="col-12 col-sm-6 col-lg-3"
  >
    <q-card flat bordered>
      <q-card-section>
        <div class="text-caption text-grey-7">{{ metric.label }}</div>
        <div class="text-h5">{{ metric.value }}</div>
      </q-card-section>
    </q-card>
  </div>
</div>
```

### 9.5 `QResponsive`

Use `QResponsive` when you need arbitrary content to keep an aspect ratio:

```vue
<q-responsive :ratio="16 / 9" class="rounded-borders overflow-hidden">
  <iframe
    src="https://example.com/embed"
    class="fit"
    title="Embedded report"
  />
</q-responsive>
```

Use `QImg` ratio directly for images instead of wrapping `QImg` in `QResponsive`.

---

## 10. State management

### 10.1 What belongs in Pinia

Use Pinia for:

- authenticated user
- permissions
- app shell state
- dark mode choice
- tenant/workspace selection
- cached entity lists needed across pages
- websocket connection status
- notification/inbox counts
- feature preferences

Do not use Pinia for:

- every field in a local form
- ephemeral hover/open state unless shared
- one-off local component toggles
- huge immutable payloads that are only used by one component

### 10.2 App store

```ts
// src/stores/app.store.ts
import { defineStore } from 'pinia'

export type DarkMode = true | false | 'auto'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawerOpen: true,
    drawerMini: false,
    darkMode: 'auto' as DarkMode,
    globalBusy: false,
    pageActions: [] as Array<{ label: string; icon?: string; action: string }>
  }),

  getters: {
    hasPageActions: (state) => state.pageActions.length > 0
  },

  actions: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },

    setDrawer(open: boolean) {
      this.drawerOpen = open
    },

    setDrawerMini(value: boolean) {
      this.drawerMini = value
    },

    setDarkMode(value: DarkMode) {
      this.darkMode = value
    },

    setGlobalBusy(value: boolean) {
      this.globalBusy = value
    },

    setPageActions(actions: Array<{ label: string; icon?: string; action: string }>) {
      this.pageActions = actions
    }
  }
})
```

### 10.3 Auth store

```ts
// src/stores/auth.store.ts
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { authService } from 'src/services/auth.service'
import type { User } from 'src/types/user'

const TOKEN_KEY = 'auth.token'

type LoginInput = {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ready: false,
    loggingIn: false,
    user: null as User | null,
    token: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name ?? 'User'
  },

  actions: {
    async restoreSession() {
      this.token = LocalStorage.getItem<string>(TOKEN_KEY)

      if (this.token) {
        try {
          this.user = await authService.me()
        } catch {
          this.logout()
        }
      }

      this.ready = true
    },

    async login(input: LoginInput) {
      this.loggingIn = true
      try {
        const result = await authService.login(input)
        this.token = result.token
        this.user = result.user
        LocalStorage.set(TOKEN_KEY, result.token)
      } finally {
        this.loggingIn = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      LocalStorage.remove(TOKEN_KEY)
    }
  }
})
```

### 10.4 Entity store pattern

```ts
// src/stores/users.store.ts
import { defineStore } from 'pinia'
import { usersService } from 'src/services/users.service'
import type { User, UserInput } from 'src/types/user'

export const useUsersStore = defineStore('users', {
  state: () => ({
    rows: [] as User[],
    rowsNumber: 0,
    loading: false,
    saving: false,
    filter: '',
    pagination: {
      page: 1,
      rowsPerPage: 25,
      rowsNumber: 0,
      sortBy: 'createdAt',
      descending: true
    }
  }),

  actions: {
    async fetch() {
      this.loading = true
      try {
        const result = await usersService.list({
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          filter: this.filter
        })

        this.rows = result.rows
        this.rowsNumber = result.rowsNumber
        this.pagination.rowsNumber = result.rowsNumber
      } finally {
        this.loading = false
      }
    },

    async create(input: UserInput) {
      this.saving = true
      try {
        await usersService.create(input)
        await this.fetch()
      } finally {
        this.saving = false
      }
    },

    async update(id: string, input: UserInput) {
      this.saving = true
      try {
        await usersService.update(id, input)
        await this.fetch()
      } finally {
        this.saving = false
      }
    },

    async remove(id: string) {
      await usersService.remove(id)
      await this.fetch()
    }
  }
})
```

### 10.5 Vuex equivalent for legacy projects

Vuex uses state, getters, mutations, and actions. If your team already uses Vuex, keep mutations for deterministic writes and actions for async workflows.

```ts
import { createStore } from 'vuex'

export const store = createStore({
  state: () => ({
    drawerOpen: true
  }),

  mutations: {
    setDrawerOpen(state, value: boolean) {
      state.drawerOpen = value
    }
  },

  actions: {
    toggleDrawer({ commit, state }) {
      commit('setDrawerOpen', !state.drawerOpen)
    }
  }
})
```

For new Quasar + Vue 3 code, prefer Pinia unless you have a concrete reason to use Vuex.

---

## 11. Composables and central utilities

### 11.1 Async task wrapper

```ts
// src/composables/useAsyncTask.ts
import { ref } from 'vue'
import { Notify } from 'quasar'

export function useAsyncTask(defaultErrorMessage = 'Operation failed') {
  const loading = ref(false)
  const error = ref<unknown>(null)

  async function run<T>(task: () => Promise<T>, successMessage?: string): Promise<T | undefined> {
    loading.value = true
    error.value = null

    try {
      const result = await task()

      if (successMessage) {
        Notify.create({ type: 'positive', message: successMessage })
      }

      return result
    } catch (err) {
      error.value = err
      Notify.create({ type: 'negative', message: defaultErrorMessage })
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
```

### 11.2 Confirmation wrapper

```ts
// src/composables/useConfirm.ts
import { Dialog } from 'quasar'

export function useConfirm() {
  function confirmDelete(message = 'This cannot be undone.') {
    return new Promise<boolean>((resolve) => {
      Dialog.create({
        title: 'Delete item?',
        message,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Delete',
          color: 'negative',
          flat: false
        },
        cancel: {
          label: 'Cancel',
          flat: true
        }
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
        .onDismiss(() => resolve(false))
    })
  }

  return { confirmDelete }
}
```

### 11.3 Server pagination composable

```ts
// src/composables/useServerPagination.ts
import { ref } from 'vue'

export function useServerPagination(defaultRowsPerPage = 25) {
  const filter = ref('')
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    rowsPerPage: defaultRowsPerPage,
    rowsNumber: 0,
    sortBy: 'createdAt',
    descending: true
  })

  return { filter, loading, pagination }
}
```

### 11.4 Date utilities

```ts
// src/utils/dates.ts
import { date } from 'quasar'

export function formatDateTime(value: string | number | Date | null | undefined) {
  if (!value) return '—'
  return date.formatDate(value, 'YYYY-MM-DD HH:mm')
}

export function formatShortDate(value: string | number | Date | null | undefined) {
  if (!value) return '—'
  return date.formatDate(value, 'MMM D, YYYY')
}

export function addDays(value: Date, days: number) {
  return date.addToDate(value, { days })
}
```

### 11.5 Formatters

```ts
// src/utils/formatters.ts
export function formatNumber(value: number | null | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat().format(value)
}

export function formatCurrency(value: number | null | undefined, currency = 'USD') {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

export function truncate(value: string, max = 80) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}
```

---

## 12. Theme system

### 12.1 Brand colors

Quasar components are designed around these brand colors:

```txt
primary
secondary
accent
dark
positive
negative
info
warning
```

Define them once in `src/css/quasar.variables.sass`.

```sass
// src/css/quasar.variables.sass
$primary   : #2563eb
$secondary : #0f172a
$accent    : #7c3aed
$dark      : #0b1220
$positive  : #16a34a
$negative  : #dc2626
$info      : #0284c7
$warning   : #d97706
```

Use semantic colors in components:

```vue
<q-btn color="primary" label="Save" />
<q-banner class="bg-warning text-white">Payment method expiring.</q-banner>
<q-chip color="positive" text-color="white" icon="check">Active</q-chip>
```

Avoid scattering raw hex values:

```vue
<!-- Avoid -->
<q-btn style="background: #2563eb" />

<!-- Prefer -->
<q-btn color="primary" />
```

### 12.2 Design tokens

Create application-level tokens for surfaces, borders, radii, density, and z-index.

```scss
// src/css/tokens.scss
:root {
  --app-radius-sm: 6px;
  --app-radius-md: 10px;
  --app-radius-lg: 16px;
  --app-border-color: rgba(15, 23, 42, 0.12);
  --app-page-max-width: 1440px;
  --app-card-padding: 16px;
}

.body--dark {
  --app-border-color: rgba(255, 255, 255, 0.14);
}
```

Use tokens in base components:

```vue
<template>
  <q-card flat bordered class="base-section-card">
    <slot />
  </q-card>
</template>

<style scoped lang="scss">
.base-section-card {
  border-radius: var(--app-radius-md);
}
</style>
```

### 12.3 Dark mode

```vue
<!-- src/components/app/AppThemeToggle.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { Dark, LocalStorage } from 'quasar'
import { useAppStore, type DarkMode } from 'src/stores/app.store'

const KEY = 'app.darkMode'
const app = useAppStore()

const model = computed({
  get: () => app.darkMode,
  set: (value: DarkMode) => {
    app.setDarkMode(value)
    LocalStorage.set(KEY, value)
    Dark.set(value)
  }
})
</script>

<template>
  <q-btn-dropdown flat dense icon="contrast" label="Theme">
    <q-list dense style="min-width: 160px">
      <q-item clickable v-close-popup @click="model = false">
        <q-item-section>Light</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="model = 'auto'">
        <q-item-section>System</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="model = true">
        <q-item-section>Dark</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
```

Dark-mode rules:

- Use `Dark.set(true | false | 'auto')` for app-level control.
- Use `.body--dark` selectors for custom dark CSS.
- Do not manually add `dark` prop everywhere if global dark mode already handles it.
- Use `dark` prop when a component must force dark styling independent of app mode.
- For SSR, be careful with `auto` because client preference may not be known during server render.

### 12.4 Typography

Use Quasar typography classes first:

```vue
<div class="text-h4">Dashboard</div>
<div class="text-subtitle1 text-grey-7">Operational overview</div>
<div class="text-body2">Updated 3 minutes ago</div>
<div class="text-caption text-grey-6">Internal only</div>
```

Application convention:

```txt
Page title: text-h4 or text-h5
Section title: text-h6
Card title: text-subtitle1 or text-subtitle2
Metadata: text-caption text-grey-6/7
Body: text-body1/text-body2
```

### 12.5 Spacing

Use Quasar spacing utilities instead of one-off margins:

```vue
<q-page padding>
  <div class="q-gutter-y-lg">
    <BasePageHeader />
    <DashboardMetrics />
    <RecentActivity />
  </div>
</q-page>
```

Common spacing convention:

```txt
q-pa-md: default page/card padding
q-pa-lg: spacious desktop sections
q-gutter-sm: tight button/icon rows
q-gutter-md: normal form/card spacing
q-gutter-lg: page section spacing
```

---

## 13. Base components

Base components make the app consistent and DRY.

### 13.1 Page header

```vue
<!-- src/components/base/BasePageHeader.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>

<template>
  <div class="row items-start justify-between q-gutter-md">
    <div class="row items-center q-gutter-sm">
      <q-icon v-if="icon" :name="icon" size="32px" color="primary" />
      <div>
        <div class="text-h5 text-weight-medium">{{ title }}</div>
        <div v-if="subtitle" class="text-body2 text-grey-7">{{ subtitle }}</div>
      </div>
    </div>

    <div v-if="$slots.actions" class="row q-gutter-sm">
      <slot name="actions" />
    </div>
  </div>
</template>
```

### 13.2 Async button

```vue
<!-- src/components/base/BaseAsyncButton.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  icon?: string
  color?: string
  loading?: boolean
  disable?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  color: 'primary',
  loading: false,
  disable: false,
  type: 'button'
})
</script>

<template>
  <q-btn
    :type="type"
    :label="label"
    :icon="icon"
    :color="color"
    :loading="loading"
    :disable="disable || loading"
    unelevated
    no-caps
  >
    <slot />
  </q-btn>
</template>
```

### 13.3 Empty state

```vue
<!-- src/components/base/BaseEmptyState.vue -->
<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  message?: string
}>()
</script>

<template>
  <div class="column items-center text-center q-pa-xl text-grey-7">
    <q-icon :name="icon || 'inbox'" size="56px" class="q-mb-md" />
    <div class="text-h6 text-grey-9">{{ title }}</div>
    <div v-if="message" class="text-body2 q-mt-xs" style="max-width: 420px">
      {{ message }}
    </div>
    <div v-if="$slots.actions" class="q-mt-md row q-gutter-sm">
      <slot name="actions" />
    </div>
  </div>
</template>
```

### 13.4 Status chip

```vue
<!-- src/components/base/BaseStatusChip.vue -->
<script setup lang="ts">
const props = defineProps<{
  status: 'active' | 'inactive' | 'pending' | 'error'
}>()

const statusMap = {
  active: { color: 'positive', icon: 'check_circle', label: 'Active' },
  inactive: { color: 'grey', icon: 'pause_circle', label: 'Inactive' },
  pending: { color: 'warning', icon: 'schedule', label: 'Pending' },
  error: { color: 'negative', icon: 'error', label: 'Error' }
} as const
</script>

<template>
  <q-chip
    dense
    square
    :color="statusMap[status].color"
    text-color="white"
    :icon="statusMap[status].icon"
  >
    {{ statusMap[status].label }}
  </q-chip>
</template>
```

---

## 14. Buttons and actions

### 14.1 `QBtn`

Use `QBtn` for all primary actions, secondary actions, icon actions, submit actions, and route actions.

```vue
<q-btn label="Save" color="primary" icon="save" />
<q-btn label="Cancel" flat color="primary" />
<q-btn icon="delete" flat round color="negative" aria-label="Delete" />
<q-btn label="Users" to="/users" icon="group" flat />
```

Button hierarchy:

```txt
Primary action: color="primary" unelevated
Destructive action: color="negative"
Secondary action: flat color="primary"
Tertiary/icon action: flat round dense
Toolbar action: flat dense
Navigation action: to="..." rather than href when routing internally
```

### 14.2 Loading buttons

```vue
<q-btn
  label="Save changes"
  color="primary"
  type="submit"
  :loading="saving"
  :disable="saving"
/>
```

### 14.3 Button group

```vue
<q-btn-group unelevated>
  <q-btn color="primary" label="Day" />
  <q-btn color="primary" label="Week" />
  <q-btn color="primary" label="Month" />
</q-btn-group>
```

### 14.4 Button toggle

```vue
<script setup lang="ts">
import { ref } from 'vue'
const viewMode = ref<'list' | 'grid'>('list')
</script>

<template>
  <q-btn-toggle
    v-model="viewMode"
    unelevated
    toggle-color="primary"
    :options="[
      { label: 'List', value: 'list', icon: 'view_list' },
      { label: 'Grid', value: 'grid', icon: 'grid_view' }
    ]"
  />
</template>
```

### 14.5 Dropdown button

```vue
<q-btn-dropdown color="primary" label="Create">
  <q-list>
    <q-item clickable v-close-popup @click="createUser">
      <q-item-section avatar><q-icon name="person_add" /></q-item-section>
      <q-item-section>User</q-item-section>
    </q-item>
    <q-item clickable v-close-popup @click="createTeam">
      <q-item-section avatar><q-icon name="group_add" /></q-item-section>
      <q-item-section>Team</q-item-section>
    </q-item>
  </q-list>
</q-btn-dropdown>
```

### 14.6 Floating action button

Use `QFab` for mobile-heavy secondary action clusters, not as a default desktop action pattern.

```vue
<q-page-sticky position="bottom-right" :offset="[24, 24]">
  <q-fab color="primary" icon="add" direction="up">
    <q-fab-action color="primary" icon="person_add" label="User" @click="createUser" />
    <q-fab-action color="secondary" icon="group_add" label="Team" @click="createTeam" />
  </q-fab>
</q-page-sticky>
```

---

## 15. Icons, images, and media

### 15.1 Icons

Use one primary icon family for visual consistency. Material Icons or Material Symbols are the easiest default in Quasar.

```vue
<q-icon name="settings" size="24px" />
<q-icon name="sym_o_settings" size="24px" />
```

Icon conventions:

```txt
Navigation: simple line/filled icons
Status: semantic icons, paired with color
Danger: delete/error/warning icons with negative/warning color
Buttons: icon + label for primary actions, icon-only only when obvious and aria-labeled
```

### 15.2 QImg

Use `QImg` for app images because it provides loading, placeholder, error, ratio, fit, and caption patterns.

```vue
<q-img
  src="~assets/hero.jpg"
  :ratio="16 / 9"
  fit="cover"
  spinner-color="primary"
>
  <template #error>
    <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
      Image unavailable
    </div>
  </template>

  <div class="absolute-bottom text-subtitle2">
    Product overview
  </div>
</q-img>
```

### 15.3 Avatars

```vue
<q-avatar size="40px" color="primary" text-color="white">
  JJ
</q-avatar>

<q-avatar size="40px">
  <q-img :src="user.avatarUrl" />
</q-avatar>
```

### 15.4 Video

```vue
<q-video :ratio="16 / 9" src="https://www.youtube.com/embed/..." />
```

---

## 16. Lists, menus, navigation, tabs

### 16.1 Lists and items

Use `QList`/`QItem` for navigation, menus, dense metadata lists, and mobile-friendly collections.

```vue
<q-list bordered separator>
  <q-item v-for="user in users" :key="user.id" clickable :to="`/users/${user.id}`">
    <q-item-section avatar>
      <q-avatar color="primary" text-color="white">{{ user.initials }}</q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ user.name }}</q-item-label>
      <q-item-label caption>{{ user.email }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <BaseStatusChip :status="user.status" />
    </q-item-section>
  </q-item>
</q-list>
```

### 16.2 Menus

```vue
<q-btn flat round icon="more_vert" aria-label="More actions">
  <q-menu>
    <q-list dense style="min-width: 180px">
      <q-item clickable v-close-popup @click="edit">
        <q-item-section avatar><q-icon name="edit" /></q-item-section>
        <q-item-section>Edit</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="archive">
        <q-item-section avatar><q-icon name="archive" /></q-item-section>
        <q-item-section>Archive</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup class="text-negative" @click="remove">
        <q-item-section avatar><q-icon name="delete" /></q-item-section>
        <q-item-section>Delete</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</q-btn>
```

Use `v-close-popup` on clickable menu items unless the menu should remain open.

### 16.3 Tabs

Use `QRouteTab` for route navigation.

```vue
<q-tabs align="left" dense active-color="primary" indicator-color="primary">
  <q-route-tab to="/settings/profile" label="Profile" />
  <q-route-tab to="/settings/billing" label="Billing" />
  <q-route-tab to="/settings/security" label="Security" />
</q-tabs>
```

Use `QTabPanels` for local in-page panels.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('overview')
</script>

<template>
  <q-tabs v-model="tab">
    <q-tab name="overview" label="Overview" />
    <q-tab name="activity" label="Activity" />
  </q-tabs>

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="overview">Overview</q-tab-panel>
    <q-tab-panel name="activity">Activity</q-tab-panel>
  </q-tab-panels>
</template>
```

---

## 17. Cards, banners, chips, badges, tooltips

### 17.1 Cards

```vue
<q-card flat bordered>
  <q-card-section>
    <div class="text-h6">Workspace health</div>
    <div class="text-body2 text-grey-7">Last 24 hours</div>
  </q-card-section>

  <q-separator />

  <q-card-section>
    <MetricGrid />
  </q-card-section>

  <q-card-actions align="right">
    <q-btn flat color="primary" label="View details" />
  </q-card-actions>
</q-card>
```

### 17.2 Banner

```vue
<q-banner rounded class="bg-warning text-white">
  <template #avatar>
    <q-icon name="warning" />
  </template>
  API usage is approaching the monthly limit.
  <template #action>
    <q-btn flat color="white" label="Review" />
  </template>
</q-banner>
```

### 17.3 Chip

```vue
<q-chip color="primary" text-color="white" icon="label">Enterprise</q-chip>
<q-chip outline color="negative" icon="error">Failed</q-chip>
```

### 17.4 Badge

```vue
<q-btn flat round icon="notifications">
  <q-badge v-if="count" floating color="negative">{{ count }}</q-badge>
</q-btn>
```

### 17.5 Tooltip

```vue
<q-btn flat round icon="help" aria-label="Help">
  <q-tooltip anchor="bottom middle" self="top middle">
    This setting controls workspace-level access.
  </q-tooltip>
</q-btn>
```

Do not put critical information only in tooltips. Tooltips are helpers, not primary content.

---

## 18. Forms

### 18.1 Form rules

Quasar `QForm` coordinates validation for Quasar form children that use Quasar's internal validation rules.

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const form = reactive({
  name: '',
  email: '',
  role: null as string | null,
  enabled: true
})

const roles = ['Admin', 'Manager', 'Viewer']

async function submit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  // save
}

function reset() {
  form.name = ''
  form.email = ''
  form.role = null
  form.enabled = true
  formRef.value?.resetValidation()
}
</script>

<template>
  <q-form ref="formRef" class="q-gutter-md" @submit.prevent="submit" @reset.prevent="reset">
    <q-input
      v-model="form.name"
      label="Name"
      outlined
      lazy-rules
      :rules="[
        val => !!val || 'Name is required',
        val => val.length >= 2 || 'Use at least 2 characters'
      ]"
    />

    <q-input
      v-model="form.email"
      label="Email"
      type="email"
      outlined
      lazy-rules
      :rules="[
        val => !!val || 'Email is required',
        val => /.+@.+\..+/.test(val) || 'Enter a valid email'
      ]"
    />

    <q-select
      v-model="form.role"
      :options="roles"
      label="Role"
      outlined
      emit-value
      map-options
      :rules="[val => !!val || 'Role is required']"
    />

    <q-toggle v-model="form.enabled" label="Enabled" />

    <div class="row q-gutter-sm justify-end">
      <q-btn label="Reset" type="reset" flat />
      <q-btn label="Save" type="submit" color="primary" />
    </div>
  </q-form>
</template>
```

### 18.2 Input types

Use `QInput` for:

```txt
text
textarea
email
password
number
search
tel
url
masked input
debounced input
prefix/suffix fields
append/prepend icons
counter fields
```

```vue
<q-input v-model="search" outlined dense debounce="300" placeholder="Search">
  <template #prepend>
    <q-icon name="search" />
  </template>
  <template #append>
    <q-btn v-if="search" flat dense round icon="close" @click="search = ''" />
  </template>
</q-input>
```

### 18.3 Select patterns

```vue
<q-select
  v-model="selectedUsers"
  :options="userOptions"
  label="Users"
  outlined
  multiple
  use-chips
  emit-value
  map-options
  option-value="id"
  option-label="name"
/>
```

Remote search select:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { usersService } from 'src/services/users.service'

const selected = ref(null)
const options = ref<Array<{ id: string; name: string }>>([])
const loading = ref(false)

async function filterUsers(value: string, update: (fn: () => void) => void) {
  loading.value = true
  try {
    const result = await usersService.search(value)
    update(() => {
      options.value = result
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-select
    v-model="selected"
    :options="options"
    :loading="loading"
    use-input
    hide-selected
    fill-input
    input-debounce="300"
    option-value="id"
    option-label="name"
    label="Search users"
    outlined
    @filter="filterUsers"
  />
</template>
```

### 18.4 Checkbox, radio, toggle, option group

```vue
<q-checkbox v-model="form.accepted" label="I accept the terms" />

<q-radio v-model="form.plan" val="basic" label="Basic" />
<q-radio v-model="form.plan" val="pro" label="Pro" />

<q-toggle v-model="form.enabled" label="Enabled" />

<q-option-group
  v-model="form.features"
  type="checkbox"
  :options="[
    { label: 'Audit logging', value: 'audit' },
    { label: 'SSO', value: 'sso' }
  ]"
/>
```

### 18.5 Sliders and ranges

```vue
<q-slider v-model="retentionDays" :min="1" :max="365" label-always />
<q-range v-model="priceRange" :min="0" :max="1000" label-always />
```

### 18.6 Date and time

```vue
<q-input v-model="form.dueDate" label="Due date" outlined readonly>
  <template #append>
    <q-icon name="event" class="cursor-pointer">
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date v-model="form.dueDate" mask="YYYY-MM-DD">
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Close" color="primary" flat />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-icon>
  </template>
</q-input>
```

### 18.7 File picker and uploader

Use `QFile` when the app handles upload manually. Use `QUploader` when you want the component to manage upload behavior.

```vue
<q-file
  v-model="file"
  label="Import CSV"
  outlined
  accept=".csv,text/csv"
  counter
>
  <template #prepend>
    <q-icon name="upload_file" />
  </template>
</q-file>
```

### 18.8 Form UX rules

- Use `outlined` or `filled` consistently; do not mix styles randomly.
- Put labels on fields; placeholders are not replacements for labels.
- Use `lazy-rules` for forms where validating on every keystroke is noisy.
- Use debounced remote validation for expensive checks.
- Show field-level errors near the field.
- Show global submit errors as `Notify`, banner, or error card.
- Disable submit while saving.
- Use `autocomplete` attributes on auth/payment/profile fields.
- Use `aria-label` on icon-only buttons.

---

## 19. Dialogs, popups, and overlays

### 19.1 When to use which overlay

```txt
Dialog plugin: quick confirm/prompt/choice, programmatic, reusable custom modal
QDialog: complex local modal tied to page template
QMenu: anchored action list or lightweight menu
QPopupProxy: context-dependent popup that changes behavior between desktop/mobile
QPopupEdit: inline editing inside tables/content
Tooltip: short hint
BottomSheet: mobile action menu
```

### 19.2 Confirm dialog

```ts
import { Dialog } from 'quasar'

export function confirmArchive(name: string) {
  return new Promise<boolean>((resolve) => {
    Dialog.create({
      title: 'Archive user?',
      message: `Archive ${name}?`,
      cancel: true,
      persistent: true,
      ok: { label: 'Archive', color: 'warning' }
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false))
      .onDismiss(() => resolve(false))
  })
}
```

### 19.3 Custom dialog component

```vue
<!-- src/components/users/UserEditorDialog.vue -->
<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useUsersStore } from 'src/stores/users.store'
import type { User } from 'src/types/user'

const props = defineProps<{
  user?: User
}>()

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const users = useUsersStore()
const formRef = ref()

const form = reactive({
  name: '',
  email: '',
  role: 'Viewer'
})

watchEffect(() => {
  if (props.user) {
    form.name = props.user.name
    form.email = props.user.email
    form.role = props.user.role
  }
})

async function submit() {
  const ok = await formRef.value?.validate()
  if (!ok) return

  if (props.user) {
    await users.update(props.user.id, form)
  } else {
    await users.create(form)
  }

  onDialogOK()
}
</script>

<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 640px; max-width: 95vw">
      <q-card-section>
        <div class="text-h6">{{ user ? 'Edit user' : 'Create user' }}</div>
      </q-card-section>

      <q-form ref="formRef" @submit.prevent="submit">
        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Name" outlined :rules="[v => !!v || 'Required']" />
          <q-input v-model="form.email" label="Email" outlined :rules="[v => !!v || 'Required']" />
          <q-select v-model="form.role" :options="['Admin', 'Manager', 'Viewer']" label="Role" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="onDialogCancel" />
          <q-btn type="submit" color="primary" label="Save" :loading="users.saving" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
```

Open it from anywhere:

```ts
import { Dialog } from 'quasar'
import UserEditorDialog from 'src/components/users/UserEditorDialog.vue'
import type { User } from 'src/types/user'

export function openUserEditor(user?: User) {
  return Dialog.create({
    component: UserEditorDialog,
    componentProps: { user }
  })
}
```

### 19.4 Inline popup edit

```vue
<q-td :props="props">
  {{ props.row.name }}
  <q-popup-edit v-model="props.row.name" buttons v-slot="scope">
    <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
  </q-popup-edit>
</q-td>
```

Use inline editing only for low-risk values. For destructive or multi-field edits, use a dialog.

---

## 20. Loading and feedback

### 20.1 Loading hierarchy

```txt
Initial unknown content: QSkeleton
Local panel loading: QInnerLoading
Button submit: QBtn loading prop
Page route/API progress: LoadingBar or QAjaxBar
Blocking global operation: Loading plugin
Background success/error: Notify
```

### 20.2 Skeleton

```vue
<q-card flat bordered>
  <q-card-section>
    <q-skeleton type="text" width="40%" />
    <q-skeleton type="text" width="70%" />
    <q-skeleton type="rect" height="180px" class="q-mt-md" />
  </q-card-section>
</q-card>
```

### 20.3 Inner loading

```vue
<q-card flat bordered class="relative-position">
  <q-card-section>
    <UserStats :stats="stats" />
  </q-card-section>

  <q-inner-loading :showing="loading">
    <q-spinner size="42px" color="primary" />
  </q-inner-loading>
</q-card>
```

Make sure the parent has `relative-position`, and put `QInnerLoading` as the last child.

### 20.4 Loading plugin

```ts
import { Loading } from 'quasar'

export async function runBlockingTask() {
  Loading.show({ message: 'Preparing export...' })
  try {
    // expensive task
  } finally {
    Loading.hide()
  }
}
```

### 20.5 Loading bar

```ts
import { LoadingBar } from 'quasar'

LoadingBar.start()
try {
  await fetchData()
} finally {
  LoadingBar.stop()
}
```

### 20.6 Notify

```ts
import { Notify } from 'quasar'

Notify.create({ type: 'positive', message: 'Saved' })
Notify.create({ type: 'negative', message: 'Save failed' })
Notify.create({ type: 'warning', message: 'Check the highlighted fields' })
Notify.create({ type: 'info', message: 'Sync started' })
```

Notification rules:

- Use notifications for transient feedback.
- Use banners/cards for persistent problems.
- Do not show success notifications for every tiny change.
- Use specific error messages when possible.
- Avoid stacking too many notifications during batch operations.

---

## 21. Tables and data grids

`QTable` is the main Quasar data component. It supports filtering, sorting, selection, pagination, server-side pagination, grid mode, custom rows/cells, sticky headers/columns, virtual scroll, popup editing, fullscreen, column picker, loading state, and custom top/bottom slots.

### 21.1 Column definitions

```ts
import type { QTableColumn } from 'quasar'
import type { User } from 'src/types/user'
import { formatDateTime } from 'src/utils/dates'

export const userColumns: QTableColumn<User>[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true
  },
  {
    name: 'role',
    label: 'Role',
    field: 'role',
    align: 'left',
    sortable: true
  },
  {
    name: 'createdAt',
    label: 'Created',
    field: 'createdAt',
    align: 'left',
    sortable: true,
    format: (value) => formatDateTime(value)
  },
  {
    name: 'actions',
    label: '',
    field: 'id',
    align: 'right'
  }
]
```

### 21.2 Server-side table page

```vue
<!-- src/pages/users/UsersPage.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { Dialog } from 'quasar'
import BasePageHeader from 'src/components/base/BasePageHeader.vue'
import BaseEmptyState from 'src/components/base/BaseEmptyState.vue'
import UserEditorDialog from 'src/components/users/UserEditorDialog.vue'
import { useUsersStore } from 'src/stores/users.store'
import { userColumns } from './userColumns'
import type { User } from 'src/types/user'

const users = useUsersStore()

onMounted(() => {
  users.fetch()
})

function onRequest(props: { pagination: typeof users.pagination; filter?: string }) {
  users.pagination = props.pagination
  users.filter = props.filter ?? ''
  users.fetch()
}

function createUser() {
  Dialog.create({ component: UserEditorDialog })
}

function editUser(user: User) {
  Dialog.create({ component: UserEditorDialog, componentProps: { user } })
}
</script>

<template>
  <q-page padding>
    <div class="q-gutter-y-lg">
      <BasePageHeader
        title="Users"
        subtitle="Manage workspace users, roles, and access."
        icon="group"
      >
        <template #actions>
          <q-btn color="primary" icon="person_add" label="Create user" @click="createUser" />
        </template>
      </BasePageHeader>

      <q-table
        v-model:pagination="users.pagination"
        :rows="users.rows"
        :columns="userColumns"
        :filter="users.filter"
        :loading="users.loading"
        :grid="$q.screen.lt.md"
        row-key="id"
        flat
        bordered
        @request="onRequest"
      >
        <template #top-right>
          <q-input
            v-model="users.filter"
            dense
            outlined
            debounce="300"
            placeholder="Search users"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round icon="more_vert" aria-label="User actions">
              <q-menu>
                <q-list dense style="min-width: 160px">
                  <q-item clickable v-close-popup @click="editUser(props.row)">
                    <q-item-section avatar><q-icon name="edit" /></q-item-section>
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>

        <template #item="props">
          <div class="q-pa-xs col-12 col-sm-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="row items-center justify-between">
                  <div>
                    <div class="text-subtitle1">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-7">{{ props.row.email }}</div>
                  </div>
                  <q-btn flat round icon="edit" @click="editUser(props.row)" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <template #no-data>
          <BaseEmptyState
            title="No users found"
            message="Create a user or change your search filter."
          >
            <template #actions>
              <q-btn color="primary" label="Create user" @click="createUser" />
            </template>
          </BaseEmptyState>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
```

### 21.3 Selection

Set `row-key`; selection depends on it.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const selected = ref([])
</script>

<template>
  <q-table
    v-model:selected="selected"
    selection="multiple"
    row-key="id"
    :rows="rows"
    :columns="columns"
  />
</template>
```

### 21.4 Virtual scroll

For large client-side lists, use virtual scroll and set a max height.

```vue
<q-table
  virtual-scroll
  :rows="rows"
  :columns="columns"
  row-key="id"
  :pagination="{ rowsPerPage: 0 }"
  :rows-per-page-options="[0]"
  table-style="max-height: 70vh"
/>
```

For truly large datasets, prefer server-side pagination/sort/filter. Do not ship 100k rows to the browser unless there is a concrete reason.

### 21.5 Sticky header

```vue
<q-table
  flat
  bordered
  :rows="rows"
  :columns="columns"
  row-key="id"
  table-header-class="bg-grey-2"
  table-style="max-height: 70vh"
  class="sticky-header-table"
/>
```

```scss
.sticky-header-table {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: white;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }
}

.body--dark .sticky-header-table {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: var(--q-dark);
  }
}
```

### 21.6 Table rules

- Always set `row-key`.
- Put table column definitions in a separate file when they get large.
- Use `format` for display formatting, not for state mutation.
- Use `body-cell-*` slots for targeted customization.
- Use `body` slot only when you need full row control.
- Use grid mode for mobile data cards.
- Use server-side pagination for large data.
- Use `debounce` on table filters.
- Avoid dense tables on mobile; use grid/card mode.
- Put destructive row actions behind a menu or confirmation.

---

## 22. Splitters, scroll areas, and workspace UIs

### 22.1 Splitter

Use `QSplitter` for IDE-like panes, inbox/detail layouts, analytics dashboards, file explorers, and workflow builders.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const left = ref(280)
const bottom = ref(65)
</script>

<template>
  <q-page class="column no-wrap">
    <q-splitter
      v-model="left"
      unit="px"
      :limits="[220, 520]"
      class="col"
    >
      <template #before>
        <q-scroll-area class="fit">
          <ProjectTree />
        </q-scroll-area>
      </template>

      <template #after>
        <q-splitter
          v-model="bottom"
          horizontal
          :limits="[35, 85]"
          class="fit"
        >
          <template #before>
            <EditorCanvas />
          </template>

          <template #after>
            <q-scroll-area class="fit">
              <LogPanel />
            </q-scroll-area>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </q-page>
</template>
```

### 22.2 Scroll area

```vue
<q-scroll-area style="height: 400px">
  <q-list>
    <q-item v-for="item in items" :key="item.id">
      <q-item-section>{{ item.label }}</q-item-section>
    </q-item>
  </q-list>
</q-scroll-area>
```

Use `QScrollArea` for controlled scroll zones. Do not wrap the entire app in scroll areas unless you need custom scroll behavior.

### 22.3 Page sticky

```vue
<q-page-sticky position="bottom-right" :offset="[24, 24]">
  <q-btn fab color="primary" icon="add" @click="create" />
</q-page-sticky>
```

### 22.4 Page scroller

```vue
<q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
  <q-btn fab icon="keyboard_arrow_up" color="primary" />
</q-page-scroller>
```

---

## 23. Local storage, session storage, and cookies

### 23.1 Storage rules

Use LocalStorage for:

- dark mode preference
- drawer compact preference
- last selected workspace
- non-sensitive view settings
- table column visibility

Use SessionStorage for:

- one-tab temporary state
- unsaved wizard progress
- redirect-after-login state
- non-sensitive short-lived state

Use Cookies for:

- SSR-readable values
- server-auth/session flows
- small values needed on both client and server

Do not store highly sensitive tokens in local storage if your threat model includes XSS. Use secure HTTP-only cookies where possible for auth tokens.

### 23.2 Typed storage wrapper

```ts
// src/utils/storage.ts
import { LocalStorage } from 'quasar'

export function getStored<T>(key: string, fallback: T): T {
  const value = LocalStorage.getItem<T>(key)
  return value == null ? fallback : value
}

export function setStored<T>(key: string, value: T) {
  try {
    LocalStorage.set(key, value)
  } catch (error) {
    console.warn(`Failed to write LocalStorage key ${key}`, error)
  }
}
```

### 23.3 Persisted table preferences

```ts
// src/composables/useVisibleColumns.ts
import { ref, watch } from 'vue'
import { LocalStorage } from 'quasar'

export function useVisibleColumns(key: string, defaults: string[]) {
  const visibleColumns = ref<string[]>(LocalStorage.getItem<string[]>(key) ?? defaults)

  watch(visibleColumns, (value) => {
    LocalStorage.set(key, value)
  }, { deep: true })

  return { visibleColumns }
}
```

---

## 24. Dates and time

Use Quasar date utils for basic formatting and manipulation. For complex timezone rules, recurring schedules, calendar math, or timezone database needs, use a specialized library.

```ts
import { date } from 'quasar'

const now = new Date()
const tomorrow = date.addToDate(now, { days: 1 })
const startOfMonth = date.startOfDate(now, 'month')
const label = date.formatDate(now, 'YYYY-MM-DD HH:mm')
```

Practical conventions:

```txt
Store API dates as ISO strings.
Convert to Date objects only at boundaries where needed.
Format in components or display utilities.
Do not rely on browser Date parsing for ambiguous date strings.
Use explicit masks for QDate/QTime.
```

---

## 25. Scrolling

Use Quasar scroll utilities when scroll target detection matters.

```ts
import { scroll } from 'quasar'

const { getScrollTarget, setVerticalScrollPosition } = scroll

export function scrollToElement(el: Element, duration = 250) {
  const target = getScrollTarget(el)
  const offset = el.getBoundingClientRect().top
  setVerticalScrollPosition(target, offset, duration)
}
```

### 25.1 Scroll observer

```vue
<script setup lang="ts">
import { ref } from 'vue'
const elevated = ref(false)

function onScroll(info: { position: number }) {
  elevated.value = info.position > 8
}
</script>

<template>
  <q-header :elevated="elevated">
    <q-toolbar>...</q-toolbar>
  </q-header>
  <q-scroll-observer @scroll="onScroll" />
</template>
```

### 25.2 Infinite scroll

```vue
<script setup lang="ts">
async function loadMore(index: number, done: (stop?: boolean) => void) {
  const hasMore = await fetchNextPage()
  done(!hasMore)
}
</script>

<template>
  <q-infinite-scroll @load="loadMore" :offset="250">
    <ItemCard v-for="item in items" :key="item.id" :item="item" />
    <template #loading>
      <div class="row justify-center q-my-md">
        <q-spinner color="primary" size="32px" />
      </div>
    </template>
  </q-infinite-scroll>
</template>
```

---

## 26. Lifecycle and component behavior

Use Vue lifecycle hooks intentionally.

```txt
setup: create refs, computed values, local functions, watchers
onMounted: DOM-dependent code, observers, third-party widgets, initial client-only reads
watch/watchEffect: sync route params, filters, query strings, store values
nextTick: wait for DOM update after state change
onUnmounted: cleanup timers, observers, event listeners, sockets
```

```vue
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const panelRef = ref<HTMLElement | null>(null)
let intervalId: number | undefined

onMounted(() => {
  intervalId = window.setInterval(refresh, 30_000)
})

onUnmounted(() => {
  if (intervalId) window.clearInterval(intervalId)
})

watch(
  () => route.params.id,
  async (id) => {
    await load(String(id))
    await nextTick()
    panelRef.value?.scrollIntoView({ behavior: 'smooth' })
  },
  { immediate: true }
)

async function refresh() {}
async function load(id: string) {}
</script>
```

Rules:

- Do not mutate state inside `onUpdated` unless you fully understand the loop risk.
- Clean up listeners and timers.
- For route-driven pages, watch route params instead of assuming component remount.
- Use `nextTick` only when you specifically need DOM after render.
- Guard browser-only APIs in SSR mode.

---

## 27. Directives: close-popup, ripple, mutation, morph, scroll, touch

### 27.1 Close popup

```vue
<q-menu>
  <q-list>
    <q-item clickable v-close-popup @click="select('a')">
      <q-item-section>Option A</q-item-section>
    </q-item>
  </q-list>
</q-menu>
```

### 27.2 Ripple

```vue
<q-item clickable v-ripple>
  <q-item-section>Clickable row</q-item-section>
</q-item>
```

### 27.3 Mutation

Use mutation when you specifically need to react to DOM tree changes. Prefer Vue reactivity first.

```vue
<script setup lang="ts">
function onMutation(mutationList: MutationRecord[]) {
  console.log('DOM changed', mutationList)
}
</script>

<template>
  <div v-mutation="onMutation">
    <slot />
  </div>
</template>
```

Use cases:

- integrating third-party DOM libraries
- detecting externally inserted content
- measuring content changes not represented in Vue state

### 27.4 Morph

Use morph for element-to-element visual transformations where a normal transition is not enough.

```vue
<script setup lang="ts">
import { ref } from 'vue'
const expanded = ref(false)
</script>

<template>
  <div>
    <q-card
      v-if="!expanded"
      v-morph:card:dashboard="{ duration: 300 }"
      class="cursor-pointer"
      @click="expanded = true"
    >
      <q-card-section>Compact card</q-card-section>
    </q-card>

    <q-card
      v-else
      v-morph:card:dashboard="{ duration: 300 }"
      class="fixed-center"
      style="width: 80vw; max-width: 900px"
    >
      <q-card-section>Expanded card</q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" @click="expanded = false" />
      </q-card-actions>
    </q-card>
  </div>
</template>
```

Morph rules:

- Use stable morph group names.
- Keep source and target structure simple.
- Do not morph complex forms with active input focus unless tested carefully.
- Prefer standard Vue transitions for simple enter/leave.

### 27.5 Touch directives

Use touch directives for mobile gestures:

```vue
<script setup lang="ts">
function onSwipe({ direction }: { direction: 'left' | 'right' | 'up' | 'down' }) {
  if (direction === 'left') next()
  if (direction === 'right') previous()
}

function next() {}
function previous() {}
</script>

<template>
  <div v-touch-swipe.mouse="onSwipe" class="fit">
    <CarouselContent />
  </div>
</template>
```

---

## 28. Quasar composables

### 28.1 `useQuasar`

Use `useQuasar()` to access `$q` in Composition API.

```ts
import { useQuasar } from 'quasar'

const $q = useQuasar()

$q.notify({ type: 'positive', message: 'Saved' })
$q.dark.set(true)
console.log($q.screen.lt.md)
```

### 28.2 `useDialogPluginComponent`

Use for custom Dialog plugin components. See the dialog section.

### 28.3 `useMeta`

```vue
<script setup lang="ts">
import { useMeta } from 'quasar'

useMeta({
  title: 'Users',
  meta: {
    description: {
      name: 'description',
      content: 'Manage workspace users'
    }
  }
})
</script>
```

### 28.4 Timer composables

Use Quasar timer composables for auto-cleaned intervals/timeouts in Vue components.

```ts
import { useInterval } from 'quasar'

const { registerInterval } = useInterval()

registerInterval(() => {
  refresh()
}, 30_000)
```

---

## 29. Utility APIs

### 29.1 Color utils

Use color utils for dynamic color computation.

```ts
import { colors } from 'quasar'

const { getPaletteColor, lighten, luminosity } = colors

const primary = getPaletteColor('primary')
const lighter = lighten(primary, 15)
const contrast = luminosity(primary) > 0.5 ? 'black' : 'white'
```

### 29.2 DOM utils

Use DOM utils for dimensions and offset logic when components need measurement.

### 29.3 Formatter utils

Use formatter utils for file sizes and simple formatting when available; use `Intl` for locale-aware currency/numbers.

### 29.4 Type checking utils

Use type checking utils sparingly; TypeScript should be your main guard at build time.

### 29.5 EventBus

Use an event bus only for narrow cross-cutting UI signals. Prefer Pinia for shared state. Event buses are useful for things like “refresh current table” or “open global command palette,” but they become hard to trace if overused.

---

## 30. API integration pattern

### 30.1 Types

```ts
// src/types/api.ts
export type PageRequest = {
  page: number
  rowsPerPage: number
  sortBy?: string
  descending?: boolean
  filter?: string
}

export type PageResponse<T> = {
  rows: T[]
  rowsNumber: number
}
```

### 30.2 Error normalizer

```ts
// src/services/errors.ts
import { AxiosError } from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message || error.message || fallback
  }

  if (error instanceof Error) return error.message

  return fallback
}
```

### 30.3 API resource service

```ts
// src/services/resource.service.ts
import { api } from 'src/boot/api'
import type { PageRequest, PageResponse } from 'src/types/api'

export function createResourceService<T, Input>(basePath: string) {
  return {
    async list(params: PageRequest) {
      const { data } = await api.get<PageResponse<T>>(basePath, { params })
      return data
    },

    async get(id: string) {
      const { data } = await api.get<T>(`${basePath}/${id}`)
      return data
    },

    async create(input: Input) {
      const { data } = await api.post<T>(basePath, input)
      return data
    },

    async update(id: string, input: Partial<Input>) {
      const { data } = await api.patch<T>(`${basePath}/${id}`, input)
      return data
    },

    async remove(id: string) {
      await api.delete(`${basePath}/${id}`)
    }
  }
}
```

---

## 31. Authentication and permissions

### 31.1 Route metadata

```ts
{
  path: 'admin',
  component: () => import('src/pages/admin/AdminPage.vue'),
  meta: {
    requiresAuth: true,
    permission: 'admin:read',
    title: 'Admin'
  }
}
```

### 31.2 Permission guard

```ts
// src/boot/auth.ts
import { defineBoot } from '#q-app'
import { useAuthStore } from 'src/stores/auth.store'

export default defineBoot(({ router }) => {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.ready) await auth.restoreSession()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    const permission = to.meta.permission
    if (typeof permission === 'string' && !auth.hasPermission(permission)) {
      return { path: '/forbidden' }
    }
  })
})
```

### 31.3 Permission helper component

```vue
<!-- src/components/app/CanAccess.vue -->
<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth.store'

defineProps<{ permission: string }>()
const auth = useAuthStore()
</script>

<template>
  <slot v-if="auth.hasPermission(permission)" />
</template>
```

Usage:

```vue
<CanAccess permission="users:write">
  <q-btn color="primary" label="Create user" />
</CanAccess>
```

---

## 32. SSR, SPA, PWA, Capacitor, Electron, BEX

Quasar can target multiple app modes from one project. Architect your app so mode-specific behavior stays at the edges.

### 32.1 SPA

Use SPA for:

- dashboards
- SaaS apps
- admin consoles
- authenticated apps where SEO is not central

### 32.2 SSR

Use SSR for:

- marketing pages needing SEO
- public content pages
- faster perceived first render
- Open Graph/Twitter card metadata

SSR rules:

- Do not access `window`, `document`, `localStorage`, or browser-only APIs during server render.
- Use Quasar Cookies when the server needs access to client state.
- Use `useMeta` for page metadata.
- Guard client-only widgets with `process.env.CLIENT`, `onMounted`, or `QNoSsr`.
- Watch for hydration mismatches with random IDs, dates, and browser-specific state.

### 32.3 PWA

Use PWA when the app should be installable, offline-tolerant, or cache-heavy. Be strict with service worker cache rules. Authenticated API responses should usually not be cached blindly.

### 32.4 Capacitor

Use Capacitor mode for mobile apps that need native APIs, push notifications, camera, files, biometrics, or app store distribution. Keep native access behind services/composables.

### 32.5 Electron

Use Electron for desktop apps needing local file access, native menus, tray behavior, or long-running desktop workflows. Keep renderer code separate from preload/main responsibilities.

### 32.6 Browser extension

Use BEX mode when building browser extensions. Treat background/content/app bridge communication as an API boundary.

---

## 33. Performance

### 33.1 App loading

- Lazy-load route pages.
- Avoid global imports of large third-party libraries.
- Use Quasar tree-shaking and auto-import behavior correctly.
- Register only needed icon packs and extras.
- Keep boot files lean.
- Avoid blocking startup on non-critical API calls.

### 33.2 Tables and lists

- Server-side paginate large datasets.
- Use `virtual-scroll` for large client-side lists.
- Set table max height for virtual scroll.
- Debounce filters.
- Avoid expensive formatter functions in large tables.
- Avoid deep watchers on large row arrays.

### 33.3 Forms

- Avoid `reactive-rules` unless rules truly change dynamically.
- Use lazy validation for long forms.
- Debounce remote validation.
- Split large forms into sections.

### 33.4 Rendering

- Prefer computed values over recalculating in templates.
- Avoid inline object/function creation in hot loops when it matters.
- Use stable keys.
- Do not put `v-if` and `v-for` on the same element; compute filtered lists first.
- Avoid unnecessary global state updates.

### 33.5 Loading UX

- Use skeletons when first loading content.
- Use inner loading for panel refreshes.
- Use button loading for submits.
- Use global loading only for truly blocking operations.

---

## 34. Accessibility

Quasar gives you UI primitives, but accessibility still depends on your implementation.

Rules:

- Add `aria-label` to icon-only buttons.
- Use real labels for form fields.
- Do not rely on color alone to communicate state.
- Preserve keyboard navigation in menus/dialogs/tables.
- Use semantic headings in pages.
- Keep focus behavior predictable after dialogs close.
- Use sufficient contrast in custom themes.
- Do not hide important content only in tooltips.
- Ensure click targets are large enough on mobile.
- Use `caption`, helper text, or error messages for form guidance.

Examples:

```vue
<q-btn flat round icon="delete" aria-label="Delete user" />

<q-input
  v-model="email"
  label="Email"
  type="email"
  autocomplete="email"
  :rules="[v => !!v || 'Email is required']"
/>
```

---

## 35. Security

### 35.1 XSS

Never pass untrusted content into HTML-rendering props. Quasar Dialog supports HTML messages, but HTML must be sanitized by you. Prefer plain text.

```ts
Dialog.create({
  title: 'Safe',
  message: userSuppliedText
})
```

Avoid:

```ts
Dialog.create({
  title: 'Unsafe',
  message: userSuppliedHtml,
  html: true
})
```

### 35.2 Auth storage

- Prefer secure HTTP-only cookies for high-value auth sessions when possible.
- If using local storage tokens, reduce XSS risk aggressively.
- Clear auth state on 401/403 where appropriate.
- Do not log tokens.
- Do not put secrets in front-end env vars.

### 35.3 File uploads

- Enforce file type/size on server, not only in `QFile`/`QUploader`.
- Do not trust client MIME type.
- Show clear upload progress and failures.

### 35.4 Electron/Capacitor

- Treat desktop/mobile native bridges as privileged APIs.
- Keep bridge methods narrow.
- Validate renderer requests.

---

## 36. Testing

### 36.1 Unit test services and stores

```ts
import { describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from 'src/stores/app.store'

describe('app store', () => {
  it('toggles drawer', () => {
    setActivePinia(createPinia())
    const app = useAppStore()

    const initial = app.drawerOpen
    app.toggleDrawer()

    expect(app.drawerOpen).toBe(!initial)
  })
})
```

### 36.2 Component tests

Test base components and feature components with stable props. Do not snapshot huge Quasar DOM output unless the snapshot is useful.

### 36.3 E2E tests

Use Playwright or Cypress for:

- login flow
- CRUD flows
- table filtering/sorting/pagination
- dialog confirmation
- responsive drawer behavior
- permissions/forbidden routes

### 36.4 Visual review

For design-system work, manually verify:

```txt
light mode
dark mode
mobile/tablet/desktop
empty/loading/error/content states
keyboard navigation
long labels and overflow
```

---

## 37. Deployment

### 37.1 SPA deployment

Build:

```bash
pnpm quasar build
```

Deploy the `dist/spa` output to static hosting. Configure your server/CDN to serve `index.html` for unknown paths when using history router mode.

Nginx example:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 37.2 SSR deployment

Use SSR mode when the server must render pages. Make sure environment variables, cookies, and server runtime behavior are configured for the deployment target.

### 37.3 PWA deployment

Validate service worker behavior in production-like hosting. Test updates, cache invalidation, offline behavior, login/logout, and API caching.

---

## 38. Complete CRUD feature blueprint

A production CRUD feature should include:

```txt
types/<entity>.ts
services/<entity>.service.ts
stores/<entity>.store.ts
pages/<entity>/<EntityListPage>.vue
pages/<entity>/<EntityDetailPage>.vue
components/<entity>/<EntityEditorDialog>.vue
components/<entity>/<EntityStatusChip>.vue
components/<entity>/<EntityFilters>.vue
```

### 38.1 Types

```ts
export type User = {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Viewer'
  status: 'active' | 'inactive' | 'pending' | 'error'
  createdAt: string
}

export type UserInput = {
  name: string
  email: string
  role: User['role']
}
```

### 38.2 Feature module checklist

For each feature page:

- route added with title and permissions
- page uses `QPage`
- loading state exists
- empty state exists
- error state exists
- mobile state exists
- table has `row-key`
- filters are debounced
- actions are permission-gated
- dialogs are reusable
- service owns API calls
- store owns shared state
- destructive action confirms
- success/failure feedback exists
- dark mode verified

---

## 39. Component-by-component practical index

This is not a prop dump. It is a practical map of what each component is for and how to think about it in an app.

### Ajax Bar / Loading Bar
Use for top-of-page request progress. Best for route changes and API calls. Do not use as the only feedback for long blocking operations.

### Avatar
User photos, initials, bot/app icons, list row identity.

### Badge
Notification count, unread count, small status markers. Avoid long text.

### Banner
Persistent contextual messages. Good for warnings, plan limits, missing setup, degraded service.

### Bar / Toolbar
Dense horizontal action bars, mobile bars, page toolbars.

### Breadcrumbs
Use in deep admin hierarchies. Avoid for shallow apps.

### Button / Button Group / Button Dropdown / Button Toggle
Use for actions and mode selection. Keep button hierarchy consistent.

### Card
Primary content container. Use flat/bordered for app UIs, elevated for overlays or marketing blocks.

### Carousel
Feature tours, images, onboarding. Avoid hiding critical information in carousel-only UI.

### Chat Message
Message timelines, AI chat, support conversations.

### Chip
Tags, filters, statuses, compact selections.

### Circular Progress / Linear Progress
Known progress or indeterminate local progress.

### Color Picker
Theme builders, labels, design tools. Avoid exposing if users do not need precise color control.

### Dialog
Complex local modal. Use Dialog plugin for quick programmatic prompts.

### Editor
WYSIWYG text. Sanitize HTML server-side before rendering stored user content.

### Expansion Item
Settings groups, filter groups, navigation groups, FAQ sections.

### Floating Action Button
Mobile-heavy action clusters. Avoid using as the only action on desktop.

### Form / Field / Input / Select
Core data-entry components. Standardize appearance and validation behavior.

### File picker / Uploader
File input and upload workflows. Validate on server.

### Radio / Checkbox / Toggle / Option Group
Selection controls. Use radios for one-of-many, checkboxes for multiple, toggle for on/off.

### Slider / Range
Numeric configuration where visual adjustment is useful.

### Date / Time Picker
Use explicit masks. Be careful with timezone-sensitive values.

### Icon
Consistent visual language. Use accessible labels for icon-only interactive controls.

### Img
Managed images with ratio/loading/error states.

### Infinite Scroll
Feeds and activity logs. Avoid for data users need to sort/filter/export.

### Inner Loading
Panel-level loading overlay.

### Intersection
Lazy-load content, animate when visible, track visibility. Do not overuse for core content.

### Knob
Compact numeric controls or dashboards. Avoid if normal slider/input is clearer.

### List & List Items
Navigation, menus, mobile collections, settings lists.

### Markup Table
Static tables without QTable features.

### Menu
Anchored actions and short option lists.

### No SSR
Protect client-only components in SSR builds.

### Observers
Resize/scroll measurement without hand-written browser observers.

### Pagination
Use with lists and tables when users need explicit page control.

### Parallax
Marketing/visual sections. Avoid in dense apps unless it serves a clear purpose.

### Popup Edit
Low-risk inline edits.

### Popup Proxy
Picker/popup abstraction that adapts between desktop and mobile.

### Pull to Refresh
Mobile refresh pattern.

### Rating
Reviews, scoring, preference selection.

### Responsive
Aspect-ratio wrapper.

### Scroll Area
Custom scroll containers.

### Separator
Visual grouping. Use sparingly.

### Skeleton
Initial loading placeholder.

### Slide Item
Swipeable list actions on mobile.

### Slide Transition
Simple show/hide transitions.

### Space
Toolbar spacing helper.

### Spinners
Indeterminate loading indicators.

### Splitter
Resizable panes and workspaces.

### Stepper
Multi-step forms and workflows. Use when steps are meaningful and not too many.

### Table
Data grids, admin lists, server pagination, selection, inline actions.

### Tabs / Tab Panels
Route tabs or local content switching.

### Timeline
Audits, activity, history.

### Toolbar
Headers and action bars.

### Tooltip
Short helper text.

### Tree
Hierarchies, file browsers, permission trees.

### Video
Embedded videos.

### Virtual Scroll
Large same-shape lists.

---

## 40. Design-system conventions

### 40.1 Button convention

```txt
Create/save/confirm: primary
Cancel/back: flat
Delete/destructive: negative
Warning action: warning
Info action: info
Icon-only: flat round dense + aria-label
```

### 40.2 Field convention

```txt
Default: outlined
Dense: table filters and compact toolbars only
Validation: lazy-rules unless realtime validation is useful
Error: field-level for field errors, Notify/banner for global errors
```

### 40.3 Table convention

```txt
Desktop: QTable
Mobile: grid mode or QList cards
Large data: server-side pagination
Destructive row actions: menu + confirm
```

### 40.4 Dialog convention

```txt
Quick confirm: Dialog plugin
Reusable form modal: Dialog plugin + custom component
Page-specific complex modal: QDialog in page/component
Mobile action list: BottomSheet
```

### 40.5 Loading convention

```txt
First page load: skeleton
Refresh panel: inner loading
Submit: button loading
Global export/import: loading plugin
API route progress: loading bar
```

### 40.6 State convention

```txt
Component-local state: refs/reactive in component
Feature-shared state: feature Pinia store
Global app state: app/auth/workspace stores
Reusable behavior: composable
Network behavior: service
```

---

## 41. Anti-patterns

Avoid:

- API calls inside templates or random button handlers.
- Copy-pasted table pagination logic in every page.
- Copy-pasted dialog markup in every page.
- Raw hex colors in components.
- Mixing `filled`, `outlined`, and `standout` inputs randomly.
- Using global state for every local field.
- Unbounded tables with thousands of rows.
- `html: true` with untrusted content.
- Icon-only buttons without labels.
- Dialogs for long multi-page workflows.
- Watchers that mutate the same state they watch without guards.
- Boot files that block startup with non-critical work.
- Menus that do not close after selection.
- Dense desktop patterns copied directly to mobile.
- Storing secrets in frontend env variables.

---

## 42. Opinionated production defaults

Use this as the default unless a project has special needs:

```txt
Quasar mode: SPA for authenticated SaaS/admin; SSR only for SEO/public pages.
State: Pinia.
Component style: <script setup lang="ts">.
Inputs: outlined.
Buttons: unelevated primary, flat secondary.
Tables: QTable with server pagination for API resources.
Mobile tables: grid mode.
Theme: brand colors in quasar.variables.sass, app tokens in CSS variables.
Dark mode: global Dark plugin with persisted user choice.
Dialogs: Dialog plugin for confirms and reusable form dialogs.
Loading: skeleton + inner loading + button loading + LoadingBar.
Storage: Quasar LocalStorage/SessionStorage wrappers for non-sensitive UI state.
Routing: layouts as route parents, lazy-loaded pages.
Services: one service per API resource.
Composables: async task, confirmation, pagination, persisted prefs.
```

---

## 43. Starter implementation order

Build a new app in this order:

1. Create Quasar project with Vue 3, TypeScript, Router, Pinia.
2. Configure `quasar.config` plugins, icon pack, boot files, framework defaults.
3. Define theme colors in `quasar.variables.sass`.
4. Add app CSS tokens and dark-mode CSS tokens.
5. Create `MainLayout`, `AuthLayout`, drawer nav, header, user menu, theme toggle.
6. Add route metadata and auth guard.
7. Add `api.ts` boot file and service layer.
8. Add app/auth/workspace stores.
9. Create base components: page header, section card, async button, empty state, status chip.
10. Create composables: async task, confirm, server pagination, visible columns.
11. Build one complete CRUD feature as the reference implementation.
12. Copy the reference feature pattern for other features.
13. Add testing for stores, services, base components, and e2e critical flows.
14. Verify light/dark/responsive states.
15. Build and deploy.

---

## 44. Reference code bundle: minimal production skeleton

```txt
src/
  boot/api.ts
  boot/auth.ts
  boot/theme.ts
  components/base/BasePageHeader.vue
  components/base/BaseAsyncButton.vue
  components/base/BaseEmptyState.vue
  components/app/AppDrawerNav.vue
  components/app/AppThemeToggle.vue
  layouts/MainLayout.vue
  layouts/AuthLayout.vue
  pages/users/UsersPage.vue
  pages/users/userColumns.ts
  components/users/UserEditorDialog.vue
  services/users.service.ts
  stores/app.store.ts
  stores/auth.store.ts
  stores/users.store.ts
  utils/dates.ts
  utils/formatters.ts
```

This skeleton gives you:

- real shell
- real routing
- central state
- central API
- theme persistence
- table pattern
- form/dialog pattern
- loading and notification pattern
- mobile table grid pattern
- reusable base components

---

## 45. Quick lookup: user goal to Quasar tool

```txt
Build app shell: QLayout, QHeader, QDrawer, QPageContainer, QPage
Build navigation: QList, QItem, QTabs, QRouteTab, QBreadcrumbs
Build dashboards: QCard, QTable, QLinearProgress, QCircularProgress, QChip
Build data admin: QTable, QPagination, QPopupEdit, QMenu, QDialog
Build forms: QForm, QInput, QSelect, QCheckbox, QRadio, QToggle, QDate, QTime
Build dialogs: Dialog plugin, QDialog, useDialogPluginComponent
Build loading: QSkeleton, QInnerLoading, Loading plugin, LoadingBar, QSpinner
Build responsive UI: Screen plugin, Flex Grid, visibility classes, QResponsive, QResizeObserver
Build desktop workspaces: QSplitter, QScrollArea, QTree, QTabs
Build mobile gestures: Touch directives, PullToRefresh, SlideItem, BottomSheet
Persist UI preferences: LocalStorage, SessionStorage, Cookies
Manage metadata: Meta plugin, useMeta
Animate: Transitions, SlideTransition, Morph directive/util
Observe DOM: Mutation directive, Intersection directive, ResizeObserver, ScrollObserver
Format data: Date utils, Color utils, Formatter utils
```

---

## 46. Final implementation philosophy

A Quasar app scales when its UI patterns are boring and predictable:

- one layout system
- one theme system
- one API layer
- one state pattern
- one dialog pattern
- one table pattern
- one form pattern
- one loading pattern
- one error pattern

That is the difference between “using Quasar components” and building a real Quasar platform.
