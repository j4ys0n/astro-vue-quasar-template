<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="q-py-xl q-px-md text-center">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <h1 class="text-h2 text-weight-bold q-mb-md">
          {{ title }}
        </h1>
        <p class="text-h5 text-grey-5 q-mb-xl">
          {{ subtitle }}
        </p>
        <div class="row justify-center items-center" style="gap: 16px">
          <q-btn
            size="lg"
            color="primary"
            unelevated
            no-caps
            label="Get Started"
            icon-right="arrow_forward"
            href="#"
          />
          <q-btn
            size="lg"
            color="primary"
            outline
            no-caps
            label="Learn More"
            href="#"
          />
        </div>
      </div>
    </div>
  </div>
</template>
