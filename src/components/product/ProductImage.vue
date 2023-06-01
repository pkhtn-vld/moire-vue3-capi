<template>
  <div class="img-container" :class="{'img-container-size-12' : sizeMultipleFour}">
    <PreloaderIndicator :class="['item-spinner', {'item-spinner-size-12' : sizeMultipleFour}]"
    v-show="!productsLoading"/>
    <transition name="fade" mode="out-in">
      <img :class="{'value--black' : selectedImage == 'img/image-not-found.png',
      'catalog__pic-size-12 img' : sizeMultipleFour}"
        :src="selectedImage" :alt="product.title" @load="loadList()" v-show="productsLoading">
    </transition>
    </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';

export default defineComponent({
  props: ['product', 'selectedColor', 'sizeMultipleFour'],
  components: { PreloaderIndicator },
  setup(props) {
    const productsLoading = ref(false);

    const loadList = () => {
      productsLoading.value = true;
    };

    const mainColor = computed(() => props.product.colors
      .find((i) => i.color.id === props.selectedColor));

    const selectedImage = computed(() => {
      if (mainColor.value.gallery !== null) {
        return mainColor.value.gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    });

    return {
      mainColor, selectedImage, productsLoading, loadList,
    };
  },
});
</script>
