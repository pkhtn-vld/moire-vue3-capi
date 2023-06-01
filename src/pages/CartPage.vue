<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ setCountFormat() + setTotalNumberTitle }}
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <PreloaderIndicator class="cart-spinner-main"
          v-show="!loadCartSuccess"/>
          <ul class="cart__list" v-show="loadCartSuccess">
            <CartItem v-for="item in products" :key="item.productId" :item="item"
            @updateProductLoading ="loadCartSuccess = $event"/>
          </ul>
          <transition name="fade">
            <h3 v-show="loadCartSuccess && setTotalPrice() === 0">
              В корзине пока пусто. Чтобы выбрать товары перейдите в
              <router-link :to="{name: 'main'}" custom v-slot="{ navigate }">
                <button class="filters-reset" @click="navigate"
                @keypress.enter="navigate" role="link">каталог</button>
              </router-link>
            </h3>
          </transition>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price" v-if="setTotalPrice() === 0">
            Ничего не выбрано
          </p>
          <p class="cart__price" v-if="setTotalPrice() > 0">
            Итого: <span >{{ totalPricePretty }} ₽</span>
          </p>

          <router-link class="cart__button button button--primery" type="submit"
            v-show="totalNumber > 0" :to="{name: 'order'}">
              Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<!-- eslint-disable no-undef -->
<script>
import { useStore } from 'vuex';
import CartItem from '@/components/cart/CartItem.vue';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import numberFormat from '@/helpers/numberFormat';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';
import {
  defineComponent, ref, computed, watch, onMounted, onUpdated,
} from 'vue';

export default defineComponent({
  components: { PreloaderIndicator, CartItem },
  setup() {
    const store = useStore();
    const loadCartSuccess = ref(false);
    const productsEmpty = ref(false);
    const tweenedNumber = ref(0);
    const commonCartPrice = ref(0);

    const products = computed(() => store.getters.cartDetailProducts);
    const totalPrice = computed(() => store.getters.cartTotalPrice);
    const totalNumber = computed(() => store.getters.cartTotalNumber);

    const loadingCart = computed(() => store.state.cart.loadingCart);
    const animatedTotalPrice = computed(() => tweenedNumber.value.toFixed(0));

    function isProductsEmpty() {
      if (products.value?.length === 0) {
        loadCartSuccess.value = true;
      }
    }

    function setTotalPrice() {
      if (+animatedTotalPrice.value === 0) {
        commonCartPrice.value = totalPrice.value;
        return commonCartPrice.value;
      }
      return animatedTotalPrice.value;
    }

    const totalPricePretty = computed(() => numberFormat(setTotalPrice()));

    function setCountFormat() {
      if (totalNumber.value > 0) {
        return totalNumber.value;
      }
      return 'нет';
    }

    watch(
      commonCartPrice,
      (newValue) => {
        gsap.to(tweenedNumber, { duration: 0.5, value: newValue });
      },
    );

    watch(totalPrice, () => {
      commonCartPrice.value = totalPrice.value;
    });

    onMounted(() => {
      if (window.history.state.goToPage) {
        isProductsEmpty();
      }
      window.history.state.goToPage = false;
    });

    onUpdated(() => {
      isProductsEmpty();
    });

    return {
      loadCartSuccess,
      productsEmpty,
      tweenedNumber,
      commonCartPrice,
      totalPricePretty,
      loadingCart,
      animatedTotalPrice,
      isProductsEmpty,
      setTotalPrice,
      setCountFormat,
      totalNumber,
      products,
    };
  },
  computed: {
    setTotalNumberTitle,
  },
});

</script>
