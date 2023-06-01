<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div>
    <transition name="modal" mode="out-in">
      <main class="popup container-alignment visible" v-if="productLoading">
          <svg class="spinner modal-spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
      </main>
    </transition>

    <transition name="modal" mode="out-in">
      <main class="popup container-alignment" v-if="loadError"
      :class="{'visible' : loadError}">
        <div class="error-container modal-error-container">
          <button class="product__del button-del button-abs"
          type="button" aria-label="Закрыть модальное окно"
            @click.prevent="closeModalError">
            <svg width="20" height="20" id="icon-close" viewbox="0 0 18 18">
              <path d="M17 1L1 17m16 0L1 1" stroke="#9D9D9D" stroke-width=".8"></path>
            </svg>
          </button>
          <h2 class="product-error-position modal-text-color">
            Произошла ошибка при загрузке товара
          </h2>
          <button class="button button--primery" @click.prevent="loadProductModal()">
            Попробовать ещё раз
          </button>
        </div>
      </main>
    </transition>

    <transition name="modal" mode="out-in">
      <main class="popup popup-main" v-if="product" :class="{'visible' : activeModal}">

        <section class="item modal-item">
          <div class="item__pics pics">
            <div class="pics__wrapper--modal">
              <transition name="image" mode="out-in">
                <ProductImage class="product-page__image" :product="product"
                :selectedColor="selectedColor" :key="selectedColor"/>
              </transition>
            </div>
            <ul class="pics__list" v-show="loadImg">
              <li class="pics__item" v-for="color in product.colors" :key="color.id">
                <label>
                  <div class="pics__link"
                  :class="{ 'pics__link--current': isActiveImage(color.color.id) }">
                    <input class="product-page__image-input"
                      type="radio"
                      :value="color.color.id"
                      v-model="selectedColor"/>

                    <transition name="fade" mode="out-in">
                      <img width="98" height="98" @load="loadImgList"
                      :class="{'value--black' : viewImageExtra(color) == 'img/image-not-found.png'}"
                      :src="viewImageExtra(color)" :alt="color.title" v-show="loadImg">
                    </transition>
                  </div>
                </label>
              </li>
            </ul>
            <ul class="pics__list" v-show="!loadImg">
              <li class="pics__item" v-for="color in product.colors" :key="color.id">
                <label>
                  <div class="pics__link">
                    <input class="product-page__image-input"
                      type="radio"/>
                      <PreloaderIndicator class="modal-spinner-mini" v-show="!loadImg"/>
                  </div>
                </label>
              </li>
            </ul>
          </div>

          <div class="item__info">
            <span class="item__code">Артикул: {{ product.id }}</span>
            <h2 class="item__title">
              {{ product.title }}
            </h2>
            <div class="item__form">
              <form class="form" action="#" method="POST" @submit.prevent="addToCartModal">

                <div class="item__row item__row--center">
                  <b class="item__price">
                    {{ totalPricePretty }} ₽
                  </b>
                </div>

                <div class="item__row">
                  <fieldset class="form__block">
                    <legend class="form__legend">Цвет</legend>
                    <ul class="colors colors--black">
                      <li class="colors__item" v-for="option in product.colors"
                      :key="option.color.id" @updateColor="selectedColor = $event">
                        <label class="colors__label">
                          <input class="colors__radio sr-only" type="radio"
                          name="color-item" :value="option.color.id" v-model.number="selectedColor">
                          <span :class="['colors__value',
                          {'value--black' : option.color.code === '#ffffff'}]"
                          :style="{ 'background-color': option.color.code }">
                          </span>
                        </label>
                      </li>
                    </ul>
                  </fieldset>
                  <fieldset class="form__block">
                    <legend class="form__legend">Размер</legend>
                    <label class="form__label form__label--small form__label--select"
                    :class="{activeArrow, 'error-size' : sizeError}">
                      <select class="form__select-modal" name="category"
                      v-model.number="currentSizeId">
                        <option hidden value="0">Выберите размер</option>
                        <option :value="size.id" v-for="size in product.sizes" :key="size.id">
                          {{ size.title }}
                        </option>
                      </select>
                    </label>
                  </fieldset>
                </div>

                <button class="item__button button button--primery" type="submit"
                :disabled="sizeError" v-if="!productAddSending && !productSelected">
                  В корзину
                </button>

                <button class="item__button button button--primery transperent" type="submit"
                :disabled="productAddSending" v-if="productAddSending">
                  В корзину
                <PreloaderIndicator class="page-spinner-mini"/>
                </button>

                <button class="item__button button button--cart"
                @click.prevent="goToCart" @keypress.enter="navigate"
                v-if="!productAddSending && productSelected">
                  Перейти в корзину
                </button>

                <transition name="fade-out" mode="out-in">
                  <h3 class="item-load-position item-load-succsess" v-show="productAdded">
                    Товар успешно добавлен!
                  </h3>
                </transition>
                <transition name="fade-out" mode="out-in">
                  <h3 class="item-load-position" v-show="productAddSending">
                    Добавляем товар в корзину...
                  </h3>
                </transition>
                <transition name="fade-out" mode="out-in">
                  <h3 class="item-load-position item-load-error" v-show="sizeError">
                    У выбранного товара нет такого размера
                  </h3>
                </transition>

              </form>
            </div>
          </div>

          <button class="product__del button-del button-abs"
          type="button" aria-label="Закрыть модальное окно"
            @click.prevent="closeModal">
            <svg width="20" height="20" id="icon-close" viewbox="0 0 18 18">
              <path d="M17 1L1 17m16 0L1 1" stroke="#9D9D9D" stroke-width=".8"></path>
            </svg>
          </button>
        </section>
      </main>
    </transition>
  </div>
</template>

<!-- eslint-disable no-return-assign -->
<script>
import {
  defineComponent, ref, computed, watch, onUnmounted, onMounted, onUpdated,
} from 'vue';
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import ProductImage from '@/components/product/ProductImage.vue';
import { loadProductModal, addToCartModal } from '@/store/axios';

let countImg = 0;

export default defineComponent({
  components: { ProductImage, PreloaderIndicator },
  props: ['productId', 'currentColor'],
  emits: ['updateProductLoading', 'updateProductId', 'updateCurrentColor'],
  setup(props, { emit }) {
    const productAmount = ref(1);
    const currentSizeId = ref(0);
    const product = ref(null);
    const selectedColor = ref(0);

    const productLoading = ref(false);
    const productAdded = ref(false);
    const productAddSending = ref(false);
    const productSelected = ref(false);
    const loadError = ref(false);
    const loadImg = ref(false);

    const sizeError = ref(false);
    const activeArrow = ref(false);
    const activeModal = ref(false);

    const totalPricePretty = computed(() => numberFormat(product.value.price));
    const viewImage = computed(() => {
      if (product.value !== null) {
        if (product.value.colors[0].gallery !== null) {
          return product.value.colors[0].gallery[0].file.url;
        }
      }
      return 'img/image-not-found.png';
    });

    function increaseСount() {
      productAmount.value += 1;
    }

    function decreaseСount() {
      if (productAmount.value > 1) productAmount.value -= 1;
    }

    function viewImageExtra(color) {
      if (color.gallery !== null) {
        return color.gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    }

    function isActiveImage(colorId) {
      return selectedColor.value === colorId;
    }

    function rotateArrow(event) {
      if (event.target === document.querySelector('.form__select-modal')) {
        activeArrow.value = !activeArrow.value;
      } else activeArrow.value = false;
    }

    function closeModal() {
      activeModal.value = false;
      product.value = null;
      productAmount.value = 1;
      currentSizeId.value = 0;
      selectedColor.value = 0;
      emit('updateProductId', null);
      emit('updateCurrentColor', 0);
    }

    function closeModalError() {
      loadError.value = false;
      emit('updateProductId', null);
      emit('updateCurrentColor', 0);
    }

    function loadImgList() {
      countImg += 1;
      if (+document.querySelector('.pics__list').childElementCount === +countImg) {
        loadImg.value = true;
        countImg = 0;
        return true;
      }
      loadImg.value = false;
      return false;
    }

    function closeModalClickPast(event) {
      if (event.target === document.querySelector('.popup-main')) {
        closeModal();
      }
    }

    async function goToCart() {
      await closeModal();
      setTimeout(() => {
        this.$router.replace('/cart/');
      }, 300);
    }

    watch(currentSizeId, () => {
      if (currentSizeId.value !== 0) sizeError.value = false;
      productSelected.value = false;
    });

    watch(selectedColor, () => productSelected.value = false);

    watch(activeModal, () => {
      const paddingRightBody = window.innerWidth - document.body.clientWidth;
      if (activeModal.value === true) {
        document.body.style.overflowY = 'hidden';
        document.body.style.paddingRight = `${paddingRightBody}px`;
      } else {
        setTimeout(() => {
          document.body.style.overflowY = 'visible';
          document.body.style.paddingRight = '0';
        }, 400);
      }
    });

    onMounted(() => document.body.addEventListener('click', rotateArrow));

    onUpdated(() => document.body.addEventListener('click', closeModalClickPast));

    onUnmounted(() => {
      document.body.removeEventListener('click', rotateArrow);
      document.body.removeEventListener('click', closeModalClickPast);
    });

    return {
      ...mapActions(['addProductToCart']),
      addToCartModal,
      increaseСount,
      decreaseСount,
      viewImageExtra,
      isActiveImage,
      rotateArrow,
      closeModal,
      closeModalError,
      loadImgList,
      closeModalClickPast,
      goToCart,

      productAmount,
      currentSizeId,
      product,
      selectedColor,

      productLoading,
      productAdded,
      productAddSending,
      productSelected,
      loadError,
      loadImg,

      sizeError,
      activeArrow,
      activeModal,

      totalPricePretty,
      viewImage,
    };
  },
  methods: {
    loadProductModal,
  },
  watch: {
    productId() {
      if (this.productId !== null) {
        this.loadProductModal();
        this.activeModal = true;
      }
    },
    currentColor() {
      this.selectedColor = this.currentColor;
    },
  },
});

</script>

<style>
.popup {
  position: fixed;
  display: none;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.visible {
  display: flex;
}

.modal-item {
  position: relative;
  max-width: 48%;
  padding: 30px;
  background-color: #fff;
}

.button-abs {
  grid-column: unset;
  position: absolute;
  top: 0px;
  right: 28px;
}

.bgc-white {
  background-color: #fff;
}

.modal-spinner {
  width: 200px;
  height: 200px;
  top: 38%;
  left: 45%;
}

.modal-text-color {
  color: #fff;
}

.modal-error-container {
  position: relative;
  padding: 30px;
}

</style>
