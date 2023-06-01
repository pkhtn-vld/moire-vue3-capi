<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <li class="cart__item product">
    <div class="product__container-preload" v-if="deletingProduct">
      <PreloaderIndicator class="spinner cart-spinner"/>
    </div>

    <template v-else>
      <div class="product__pic">
        <transition name="fade" mode="out-in">
          <img :src="selectedImage" width="120" height="120"
          :alt="item.product.title" @load="loadList()" v-show="productsLoading">
        </transition>
        <PreloaderIndicator class="cart-spinner-img" v-show="!productsLoading"/>
      </div>
      <h3 class="product__title">
        {{ item.product.title }}
      </h3>
      <p class="product__info product__info--size">
        Размер: {{ item.sizeTitle }}
      </p>
      <p class="product__info product__info--color">
        Цвет:
        <span>
          <i :class="['colors__value',
          {'value--black' : item.colorId === '#ffffff'}]"
          :style="'background-color:' + item.colorId"></i>
          {{ item.colorTitle }}
        </span>
      </p>
      <span class="product__code">
        Артикул: {{ item.productId }}
      </span>

      <div class="product__counter form__counter">
        <button type="button" aria-label="Убрать один товар"
        @click.prevent="decreaseСount()">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-minus"></use>
          </svg>
        </button>

        <input type="text" @input.prevent="" class="count" v-model.number="amount" name="count">

        <button type="button" aria-label="Добавить один товар"
        @click.prevent="increaseСount()">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-plus"></use>
          </svg>
        </button>
      </div>

      <b class="product__price">
        {{ totalPricePretty }} ₽
      </b>

      <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
      @click.prevent="deleteItem(item.productId)">
        <svg width="20" height="20" id="icon-close" viewbox="0 0 18 18">
          <path d="M17 1L1 17m16 0L1 1" stroke="#9D9D9D" stroke-width=".8"></path>
        </svg>
      </button>
    </template>
  </li>
</template>

<!-- eslint-disable no-undef -->
<script>
import { useStore } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import setInputFormat from '@/helpers/inputFormat';
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default defineComponent({
  props: ['item'],
  components: { PreloaderIndicator },
  setup(props, { emit }) {
    const store = useStore();
    const productsLoading = ref(false);
    const deletingProduct = ref(false);
    const tweenedNumber = ref(0);

    const animatedItemPrice = computed(() => tweenedNumber.value.toFixed(0));
    const totalPricePretty = computed(() => numberFormat(animatedItemPrice.value));
    const productPrice = computed(() => props.item.amount * props.item.product.price);

    const amount = computed({
      get: () => props.item.amount,
      set: (value) => {
        store.dispatch('updateCartProductAmount', { basketItemId: props.item.productId, amount: value });
      },
    });

    const mainColor = computed(() => props.item.product.colors
      .find((i) => i.color.code === props.item.colorId));

    const selectedImage = computed(() => {
      if (mainColor.value.gallery !== null) {
        return mainColor.value.gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    });

    const loadingDeletingCart = computed(() => store.state.cart.deletingCart);

    watch(productPrice, (newValue) => {
      gsap.to(tweenedNumber, { duration: 0.5, value: newValue });
    });

    watch(amount, () => {
      if (amount.value === 0 || amount.value === '') amount.value = 1;
    });

    function increaseСount() {
      amount.value += 1;
    }

    function decreaseСount() {
      if (amount.value > 1) {
        amount.value -= 1;
      }
    }

    async function deleteItem(id) {
      deletingProduct.value = true;
      await store.dispatch('deleteCartProduct', id);
    }

    function loadList() {
      productsLoading.value = true;
      emit('updateProductLoading', true);
      gsap.to(
        tweenedNumber,
        { duration: 0.5, value: (props.item.amount * props.item.product.price) },
      );
    }

    return {
      productsLoading,
      deletingProduct,
      tweenedNumber,
      totalPricePretty,
      productPrice,
      animatedItemPrice,
      amount,
      mainColor,
      selectedImage,
      loadingDeletingCart,
      increaseСount,
      decreaseСount,
      deleteItem,
      loadList,
      setInputFormat,
    };
  },
  updated() {
    this.setInputFormat('.count', 2);
  },
});
</script>
