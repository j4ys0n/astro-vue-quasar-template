<script setup lang="ts">
import { ref } from 'vue';

const menuOpen = ref(false);
const items = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '#' },
  { title: 'Pricing', path: '#' },
];
</script>

<template>
  <nav
    class="row items-center no-wrap q-px-lg q-py-sm bg-dark text-white"
    style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); position: sticky; top: 0; z-index: 100;"
  >
    <a
      href="/"
      class="text-h6 text-weight-bold text-white"
      style="text-decoration: none"
      >Astro Vue Template</a
    >

    <q-space />

    <!-- Desktop -->
    <div class="gt-sm row items-center" style="gap: 8px">
      <q-btn
        v-for="item in items"
        :key="item.title"
        flat
        no-caps
        :href="item.path"
        :label="item.title"
      />
      <q-btn color="primary" unelevated no-caps href="#" label="Get Started" />
    </div>

    <!-- Mobile -->
    <q-btn
      flat
      round
      dense
      icon="menu"
      class="lt-md"
      aria-label="Open navigation menu"
    >
      <q-menu v-model="menuOpen">
        <q-list style="min-width: 160px">
          <q-item
            v-for="item in items"
            :key="item.title"
            v-close-popup
            clickable
            :href="item.path"
          >
            <q-item-section>{{ item.title }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </nav>
</template>
