<template>
  <main class="content container">
    <h1 class="error-center">Страница не найдена</h1>
  </main>
</template>

<script>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

export default {
  setup() {
    const router = useRouter();

    onMounted(() => {
      router.push({ path: '/notFound' });
    });
  },
};
</script>
