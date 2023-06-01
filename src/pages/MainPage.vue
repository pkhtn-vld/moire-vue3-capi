<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <main class="content container">
    <transition name="fade-out" appear>
      <div class="content__top">

        <div class="content__row">
          <h1 class="content__title">
            Каталог
          </h1>
          <span class="content__info">
            {{ setCountFormat + setTotalNumberTitle }}
          </span>
          <label class="content__info--count">
            Показывать товаров:&nbsp;
            <select class="form__select--count"
              name="productsPerPage" v-model="productsPerPage">
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="12">12</option>
              <option value="18">18</option>
              <option value="24">24</option>
            </select>
          </label>
        </div>
      </div>
    </transition>

  <div class="content__catalog">

    <transition name="fade-out" appear>
      <ProductFilter
      v-model:price-from="filterPriceFrom"
      v-model:price-to="filterPriceTo"
      v-model:category-id="filterCategoryId"
      v-model:selected-color="filterColor"
      v-model:selected-material="filterMaterial"
      v-model:selected-season="filterSeason"
      v-model:first-page="firstPage"
      :max-product-price="currentMaxPrice"
      :min-product-price="currentMinPrice"
      :page='page'/>

    </transition>

    <section class="catalog" v-if="productsLoading">
      <PreloaderIndicator class="main-spinner" />
    </section>

    <section class="catalog container-alignment container-alignment--load-fail"
      v-if="productsLoadingFailed">
      <div class="error-container">
        <h2 class="product-error-position">
            Произошла ошибка при загрузке товаров
        </h2>
        <button class="button button--error" @click.prevent="loadProducts()">
          Попробовать ещё раз
        </button>
      </div>
    </section>

    <section class="catalog" v-if="!productsLoadingFailed && !productsLoading">
      <div class="empty-products-list" v-if="emptyProductsList">
        <h3>Не нашлось подходящих товаров <br>Попробуйте поменять параметры или
          <button class="filters-reset" @click.prevent="reset">
            сбросить фильтры
          </button>
        </h3>
      </div>
      <ProductsList :products="products" :products-per-page="productsPerPage"/>
      <BasePagination
      v-model="page"
      :count="countProducts"
      :per-page="productsPerPage"/>
    </section>
  </div>
</main>
</template>

<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-restricted-globals -->
<!-- eslint-disable no-undef -->
<script>
import {
  defineComponent, ref, watch, watchEffect, computed, onMounted, onUnmounted,
} from 'vue';
import ProductsList from '@/components/product/ProductsList.vue';
import ProductFilter from '@/components/product/ProductFilter.vue';
import PreloaderIndicator from '@/components/base/PreloaderIndicator.vue';
import BasePagination from '@/components/base/BasePagination.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';

export default defineComponent({
  components: {
    ProductsList, BasePagination, ProductFilter, PreloaderIndicator,
  },
  setup() {
    const filterPriceFrom = ref(0);
    const filterPriceTo = ref(0);
    const filterCategoryId = ref(0);
    const filterColor = ref(null);
    const filterMaterial = ref(null);
    const filterSeason = ref(null);

    const firstPage = ref(false);
    const page = ref(1);
    const productsPerPage = ref(6);

    const productsData = ref(null);
    const productsDataAll = ref(null);

    const productsLoading = ref(true);
    const productsLoadingFailed = ref(false);

    const emptyProductsList = ref(false);
    const currentMaxPrice = ref(null);
    const currentMinPrice = ref(null);
    const tweenedNumber = ref(0);

    const countProducts = computed(() => (
      productsData.value ? productsData.value.pagination.total : 0));

    const animatedCountTitle = computed(() => {
      if (productsDataAll.value !== null) {
        return tweenedNumber.value.toFixed(0);
      } return 0;
    });

    const setCountFormat = computed(() => {
      if (animatedCountTitle.value > 0) return animatedCountTitle.value;
      return 'нет';
    });

    const products = computed(() => (productsData.value
      ? productsData.value.items
      : []));

    function maxProductPrice() {
      if (productsDataAll.value !== null) {
        return Math.max(...productsDataAll.value.items.map((i) => i.price));
      }
      return '';
    }

    function minProductPrice() {
      if (productsDataAll.value !== null) {
        return Math.min(...productsDataAll.value.items.map((i) => i.price));
      }
      return '';
    }

    function loadProductsAll() {
      axios.get(`${API_BASE_URL}/api/products`, {
        params: {
          page: page.value,
          limit: countProducts.value,
          categoryId: filterCategoryId.value,
          minPrice: filterPriceFrom.value,
          maxPrice: filterPriceTo.value,
          colorIds: filterColor.value,
          materialIds: filterMaterial.value,
          seasonIds: filterSeason.value,
        },
      })
        .then((response) => {
          productsDataAll.value = response.data;

          if ((isFinite(minProductPrice())) === true) {
            currentMinPrice.value = minProductPrice();
          } else currentMinPrice.value = '';
          if ((isFinite(maxProductPrice())) === true) {
            currentMaxPrice.value = maxProductPrice();
          } else currentMaxPrice.value = '';
        });
    }

    function loadProducts() {
      productsLoading.value = true;
      productsLoadingFailed.value = false;
      emptyProductsList.value = false;
      let loadProductsTimer;
      clearTimeout(loadProductsTimer);
      loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            page: page.value,
            limit: productsPerPage.value,
            categoryId: filterCategoryId.value,
            minPrice: filterPriceFrom.value,
            maxPrice: filterPriceTo.value,
            colorIds: filterColor.value,
            materialIds: filterMaterial.value,
            seasonIds: filterSeason.value,
          },
        })
          .then((response) => {
            firstPage.value = false;
            productsData.value = response.data;
            if (productsData.value.items.length === 0) emptyProductsList.value = true;
            loadProductsAll();
          })
          .catch(() => {
            productsLoadingFailed.value = true;
          })
          .then(() => {
            productsLoading.value = false;
          });
      }, 1000);
    }

    function rotateArrow(event) {
      const formSelect = document.querySelector('.form__select');
      const formSelectCount = document.querySelectorAll('.form__select--count');
      formSelectCount.forEach((el) => {
        if (event.target === el) {
          el.parentNode.classList.toggle('activeArrow');
          formSelect.parentNode.classList.remove('activeArrow');
        } else if (event.target === formSelect) {
          formSelect.parentNode.classList.toggle('activeArrow');
          el.parentNode.classList.remove('activeArrow');
        } else {
          formSelect.parentNode.classList.remove('activeArrow');
          el.parentNode.classList.remove('activeArrow');
        }
      });
    }

    function reset() {
      filterCategoryId.value = 0;
      filterPriceFrom.value = '';
      filterPriceTo.value = '';
      filterColor.value = [];
      filterMaterial.value = [];
      filterSeason.value = [];
      emptyProductsList.value = false;
      window.location.hash = '';
    }

    watch(countProducts, (newValue) => {
      gsap.to(tweenedNumber, { duration: 0.5, value: newValue });
    });

    watchEffect(() => (productsData.value
      ? productsData.value.items
      : []));

    watchEffect(() => (productsData.value ? productsData.value.pagination.total : 0));

    watchEffect(() => {
      page.value;
      productsPerPage.value;
      filterPriceFrom.value;
      filterPriceTo.value;
      filterCategoryId.value;
      filterColor.value;
      filterMaterial.value;
      filterSeason.value;

      if (firstPage.value === true) page.value = 1;
      loadProducts();
    });

    onMounted(() => {
      document.body.addEventListener('click', rotateArrow);
    });
    onUnmounted(() => {
      document.body.removeEventListener('click', rotateArrow);
    });

    return {
      countProducts,
      currentMaxPrice,
      currentMinPrice,
      tweenedNumber,
      animatedCountTitle,

      products,
      productsData,
      productsDataAll,
      productsLoading,
      emptyProductsList,
      productsLoadingFailed,

      firstPage,
      page,
      productsPerPage,
      filterCategoryId,
      filterPriceFrom,
      filterPriceTo,
      filterColor,
      filterMaterial,
      filterSeason,
      setCountFormat,
      reset,
    };
  },
  computed: {
    setTotalNumberTitle,
  },
});

</script>
