<template>
  <router-link class="header__cart" aria-label="Корзина с товарами"
  :to="{name: 'cart', state: {goToPage: true}}">
    <svg width="19" height="24" id="icon-cart" viewbox="0 0 19 24">
<!-- eslint-disable-next-line max-len -->
      <path fill="#000" fill-rule="evenodd" clip-rule="evenodd" d="M9.895.752c-2.6 0-4.779 1.955-4.779 4.45v.684H4.094a2.5 2.5 0 00-2.497 2.372l-.65 12.686a2.5 2.5 0 002.496 2.628h12.903a2.5 2.5 0 002.497-2.628l-.65-12.686a2.5 2.5 0 00-2.497-2.372h-1.023v-.685c0-2.494-2.178-4.45-4.778-4.45zm4.778 8.362a.854.854 0 01-.5 1.55.856.856 0 01-.5-1.55V6.886H6.116v2.228a.855.855 0 01-.5 1.55.856.856 0 01-.5-1.55V6.886H4.094a1.5 1.5 0 00-1.499 1.423l-.65 12.686a1.5 1.5 0 001.498 1.577h12.903a1.5 1.5 0 001.498-1.577l-.65-12.686a1.5 1.5 0 00-1.498-1.423h-1.023v2.228zm-1-3.228v-.685c0-1.868-1.653-3.45-3.778-3.45-2.126 0-3.779 1.582-3.779 3.45v.685h7.557z"></path>
    </svg>
    <span class="header__count header__count--preload"
      aria-label="Количество товаров" v-if="loadingCartHeader">
    <section class="catalog h-500 item-alignment" v-if="loadingCartHeader">
      <PreloaderIndicator class="header-spinner"/>
    </section>
    </span>
    <span class="header__count" aria-label="Количество товаров" v-else>
      {{ $store.state.cart.cartProducts.length }}
    </span>
  </router-link>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default defineComponent({
  components: { PreloaderIndicator },
  setup() {
    const store = useStore();
    const loadingCartHeader = computed(() => store.state.cart.loadingCartHeader);

    return { loadingCartHeader };
  },
});
</script>
