<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <li class="catalog__card" :class="{'catalog__card-size-12' : sizeMultipleFour}">
    <router-link class="catalog__pic"
    :to="{name: 'product', params: {id: product.id}, query: {color: selectedColor}}"
    :class="{'catalog__pic-size-12' : sizeMultipleFour}">
    <transition name="image" mode="out-in">
      <ProductImage :product="product" :selected-color="selectedColor"
      :size-multiple-four="sizeMultipleFour" :key="selectedColor"/>
    </transition>
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{name: 'product', params:{id: product.id}}">
        {{ product.title }}
      </router-link>
    </h3>

    <div class="catalog-container-middle"
    :class="{'catalog-container-middle-size-12' : sizeMultipleFour}">
      <span class="catalog__price" :class="{'catalog__price-size-12' : sizeMultipleFour}">
        {{ totalPricePretty }} ₽
      </span>
    </div>

    <div class="catalog-container-bottom"
      :class="{'catalog-container-bottom-size-12' : sizeMultipleFour}">
      <ProductColors :product="product" @updateColor="selectedColor = $event"
      :size-multiple-four="sizeMultipleFour"/>

      <button class="button button-shop"
      @click.prevent="chooseProduct(product.id), changeColor(selectedColor)"
      v-if="!productAddSending && !sizeMultipleFour">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M14 13.1v-1.1h-9.4l0.6-1.1 9.2-0.9 1.6-6h-12.3l-0.7-3h-3v1h2.2l2.1
          8.4-1.3 2.6v1.5c0 0.8 0.7 1.5 1.5 1.5s1.5-0.7 1.5-1.5-0.7-1.5-1.5-1.5h7.5v1.5c0 0.8
          0.7 1.5 1.5 1.5s1.5-0.7 1.5-1.5c0-0.7-0.4-1.2-1-1.4zM4 5h10.7l-1.1 4-8.4 0.9-1.2-4.9z">
          </path>
        </svg>
      </button>

      <button class="button button-shop"
        v-if="!productAddSending && sizeMultipleFour"
        :class="{'button-shop-size-12' : sizeMultipleFour}"
        @click.prevent="chooseProduct(product.id), changeColor(selectedColor)">
        Купить
      </button>

      <button class="button button-shop" type="submit"
        :class="{'button-shop-size-12' : sizeMultipleFour}"
        v-if="productAddSending" :disabled="productAddSending">
        <PreloaderIndicator class="page-spinner-item-mini"/>
      </button>
    </div>
  </li>
</template>

<script>
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import ProductColors from './ProductColors.vue';
import ProductImage from './ProductImage.vue';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default defineComponent({
  components: {
    ProductColors,
    ProductImage,
    PreloaderIndicator,
  },
  props: ['product', 'sizeMultipleFour', 'productLoadingModal'],
  setup(props, { emit }) {
    const selectedColor = ref(props.product.colors[0].color.id);
    const sizeError = ref(false);
    const currentSizeId = ref(0);
    const productData = ref(null);
    const productAdded = ref(false);
    const productAddSending = ref(false);

    const totalPricePretty = computed(() => numberFormat(props.product.price));

    const chooseProduct = (event) => {
      emit('updateProductId', event);
      productAddSending.value = true;
    };

    const changeColor = (color) => {
      emit('updateColor', color);
    };

    watch(currentSizeId, () => {
      if (currentSizeId.value !== 0) {
        sizeError.value = false;
      }
    });

    watch(() => props.productLoadingModal, () => {
      if (props.productLoadingModal === false) productAddSending.value = false;
    });

    const { addProductToCart } = mapActions(['addProductToCart']);

    return {
      selectedColor,
      sizeError,
      currentSizeId,
      productData,
      productAdded,
      productAddSending,
      totalPricePretty,
      chooseProduct,
      changeColor,
      addProductToCart,
    };
  },
});

</script>
