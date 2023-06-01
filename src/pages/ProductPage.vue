<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div>
    <main class="content container container-alignment" v-if="productLoading">
      <svg class="spinner page-spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </main>
    <main class="content container container-alignment" v-else-if="!productData">
      <div class="error-container">
        <h2 class="product-error-position">
          Произошла ошибка при загрузке товаров
        </h2>
        <button class="button button--primery" @click.prevent="loadProduct()">
          Попробовать ещё раз
        </button>
      </div>
    </main>

    <main class="content container" v-else>
      <div class="content__top">
        <ul class="breadcrumbs">
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{name: 'main'}">
              Каталог
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link"
            :to="{ name: 'main', query: { 'categoryId': product.category.id } }">
              {{ category.title }}
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link">
              {{ product.title }}
            </a>
          </li>
        </ul>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
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
            <form class="form" action="#" method="POST" @submit.prevent="addToCart">
              <div class="item__row item__row--center">
                <div class="form__counter">
                  <button type="button" aria-label="Убрать один товар"
                  @click.prevent="decreaseСount()">
                    <svg width="12" height="12" fill="currentColor">
                      <use xlink:href="#icon-minus"></use>
                    </svg>
                  </button>

                  <input class="count" type="text"
                  name="count" v-model.number="productAmount">

                  <button type="button" aria-label="Добавить один товар"
                  @click.prevent="increaseСount()">
                    <svg width="12" height="12" fill="currentColor">
                      <use xlink:href="#icon-plus"></use>
                    </svg>
                  </button>
                </div>

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
                    <select class="form__select" name="category"
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
              :disabled="sizeError" v-if="!productAddSending">
                В корзину
              </button>
              <button class="item__button button button--primery transperent" type="submit"
              :disabled="productAddSending" v-if="productAddSending">
                В корзину
                <PreloaderIndicator class="page-spinner-mini"/>
              </button>
              <transition-group name="fade" tag="div">
                  <h3 class="item-load-position item-load-succsess" v-show="productAdded"
                  :key="1">Товар успешно добавлен!</h3>
                  <h3 class="item-load-position" v-show="productAddSending"
                  :key="2">Добавляем товар в корзину...</h3>
                  <h3 class="item-load-position item-load-error" v-show="sizeError"
                  :key="3">У выбранного товара нет такого размера</h3>
              </transition-group>
            </form>
          </div>
        </div>

        <div class="item__desc">
          <ul class="tabs">
            <li class="tabs__item">
              <a class="tabs__link"
              :class="{ 'tabs__link--current': tabActiveId === 1 }"
          @click.prevent="isTabActive(1)" href="#">
                Информация о товаре
              </a>
            </li>
            <li class="tabs__item">
              <a class="tabs__link"
              :class="{ 'tabs__link--current': tabActiveId === 2 }"
          @click.prevent="isTabActive(2)" href="#">
                Доставка и возврат
              </a>
            </li>
          </ul>

          <transition name="fade" mode="out-in">
            <div class="item__content" :key="1" v-show="tabActiveId === 1">
              <h3>Состав:</h3>

              <p>
                60% хлопок<br>
                30% полиэстер<br>
              </p>

              <h3>Уход:</h3>

              <p>
                Машинная стирка при макс. 30ºC короткий отжим<br>
                Гладить при макс. 110ºC<br>
                Не использовать машинную сушку<br>
                Отбеливать запрещено<br>
                Не подвергать химчистке<br>
              </p>

            </div>
          </transition>

          <transition name="fade" mode="out-in">
            <div class="item__content" :key="2" v-show="tabActiveId === 2">
              <h3>Доставка:</h3>

              <p>
                1. Курьерская доставка по Москве и Московской области – 1200 ₽<br>
                2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь
              </p>

              <h3>Возврат:</h3>

              <p>
                Любой возврат должен быть осуществлен в течение 30 дней с момента отгрузки.<br>
                Возвраты в магазине БЕСПЛАТНО.<br>
                Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране,
                в которой Вы осуществили покупку.<br>
                БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
                Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов,
                позвоните по телефону 8 800 600 90 09
              </p>

            </div>
          </transition>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import {
  defineComponent, ref, computed, watch, onMounted, onUpdated, onUnmounted,
} from 'vue';
import { mapActions } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import numberFormat from '@/helpers/numberFormat';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import setInputFormat from '@/helpers/inputFormat';
import ProductImage from '@/components/product/ProductImage.vue';
import { loadProduct, addToCart } from '@/store/axios';

export default defineComponent({
  components: { ProductImage, PreloaderIndicator },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const productAmount = ref(1);
    const currentSizeId = ref(0);
    const productData = ref(null);
    const selectedColor = ref(+route.params.colorId);
    const productLoading = ref(false);
    const loadImg = ref(false);

    const productAdded = ref(false);
    const productAddSending = ref(false);
    const tabActiveId = ref(1);
    const sizeError = ref(false);
    const activeArrow = ref(false);

    const product = computed(() => productData.value);
    const totalPricePretty = computed(() => numberFormat(product.value.price));

    const viewImage = computed(() => {
      if (product.value.colors[0].gallery !== null) {
        return product.value.colors[0].gallery[0].file.url;
      }
      return 'img/image-not-found.png';
    });

    const category = computed(() => productData.value.category);

    let countImg = 0;

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
    function isTabActive(value) {
      tabActiveId.value = value;
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
    function rotateArrow(event) {
      if (event.target === document.querySelector('.form__select')) {
        activeArrow.value = !activeArrow.value;
      } else activeArrow.value = false;
    }

    watch(currentSizeId, () => {
      if (currentSizeId.value !== 0) {
        sizeError.value = false;
      }
    });
    watch(selectedColor, (value) => {
      route.query.color = null;
      router.push({ name: 'product', params: { id: product.value.id }, query: { color: value } });
    });
    watch(productAmount, () => {
      if (productAmount.value === 0 || productAmount.value === '') productAmount.value = 1;
    });

    onMounted(() => {
      document.body.addEventListener('click', rotateArrow);
    });
    onUpdated(() => {
      setInputFormat('.count', 2);
    });
    onUnmounted(() => {
      document.body.removeEventListener('click', rotateArrow);
    });

    return {
      ...mapActions(['addProductToCart']),
      addToCart,
      increaseСount,
      decreaseСount,
      viewImageExtra,
      isActiveImage,
      isTabActive,
      loadImgList,
      rotateArrow,
      setInputFormat,

      productAmount,
      currentSizeId,
      productData,
      selectedColor,
      productLoading,
      loadImg,

      productAdded,
      productAddSending,
      tabActiveId,
      sizeError,
      activeArrow,

      totalPricePretty,
      viewImage,
      product,
      category,
    };
  },
  methods: {
    loadProduct,
  },
  watch: {
    '$route.params.id': {
      handler() {
        if (this.$route.params.id) {
          this.loadProduct();
        }
      },
      immediate: true,
    },
  },
});

</script>
