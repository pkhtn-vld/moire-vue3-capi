<template>
    <ul class="catalog__list"
    :class="{'catalog__list-size-12' : sizeMultipleFour}">
    <ProductItem
    v-for="product in products"
    :product="product"
    :key="product.id"
    :size-multiple-four="sizeMultipleFour"
    :product-loading-modal="productLoading"
    @updateProductId="productId = $event"
    @updateColor="currentColor = $event"/>

    <ProductModal :product-id="productId" :current-color="currentColor"
    @updateProductLoading="productLoading = $event"
    @updateProductId="productId = $event"
    @updateCurrentColor="currentColor = $event"/>
    </ul>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ProductItem from '@/components/product/ProductItem.vue';
import ProductModal from './ProductModal.vue';

export default defineComponent({
  components: { ProductItem, ProductModal },
  props: ['products', 'productsPerPage'],
  setup(props) {
    const sizeMultipleFour = ref(false);
    const productId = ref(null);
    const currentColor = ref(0);
    const productLoading = ref(null);

    const isMultipleSize = () => {
      if (props.productsPerPage % 4 === 0) {
        sizeMultipleFour.value = true;
        return sizeMultipleFour.value;
      }
      return sizeMultipleFour.value;
    };

    isMultipleSize();

    return {
      sizeMultipleFour,
      productId,
      currentColor,
      productLoading,
    };
  },
});

</script>
