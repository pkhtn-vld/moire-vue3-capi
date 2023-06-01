<template>
  <div>
    <TheHeader />

    <router-view v-slot="{ Component }">
      <transition :name="routeTransitionDirection" mode="out-in">
        <component :is="Component" :key="$route.name"/>
      </transition>
    </router-view>

    <TheFooter />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

export default defineComponent({
  components: {
    TheHeader,
    TheFooter,
  },
  setup() {
    const routeTransitionDirection = ref('slide-left-');
    const router = useRouter();
    const store = useStore();

    const loadCart = () => store.dispatch('loadCart');
    const updateUserAccessKey = (payload) => store.commit('updateUserAccessKey', payload);

    router.afterEach((to, from) => {
      const toDepth = to.meta.depth;
      const fromDepth = from.meta.depth;

      if (fromDepth === undefined) {
        routeTransitionDirection.value = '';
      } else {
        routeTransitionDirection.value = toDepth < fromDepth ? 'slide-right-' : 'slide-left-';
      }
      setTimeout(() => window.scrollTo(0, 0), 700);
    });

    onMounted(() => {
      const userAccessKey = localStorage.getItem('userAccessKey');
      if (userAccessKey) {
        updateUserAccessKey(userAccessKey);
      }
      loadCart();
    });

    return {
      routeTransitionDirection,
      loadCart,
      updateUserAccessKey,
    };
  },
});
</script>

<style>
.slide-left--enter-active,
.slide-left--leave-active,
.slide-right--enter-active,
.slide-right--leave-active {
  transition: transform .7s ease-in-out, opacity .7s ease-in-out
}

.slide-left--enter-from,
.slide-right--leave-to {
  opacity: 0;
  transform: translate3d(100%,0,0)
}

.slide-right--enter-from,
.slide-left--leave-to {
  opacity: 0;
  transform: translate3d(-100%,0,0)
}

</style>
