<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <aside class="filter">
    <form class="filter__form form" action="#"
    method="get" @submit.prevent="submit">

    <fieldset class="form__block">
      <legend class="form__legend">Цена</legend>
      <label class="form__label form__label--price">

        <input class="form__input"
        :placeholder="animatedPriceFrom"
        name="min-price" v-model.number="currentPriceFrom">

        <span class="form__value">От</span>
      </label>
      <label class="form__label form__label--price">

        <input class="form__input" type="text" :placeholder="animatedPriceTo"
        name="max-price" v-model.number="currentPriceTo">
        <span class="form__value">До</span>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Категория</legend>
      <label class="form__label form__label--select">
        <!-- <select class="form__select" type="text" name="category" -->
        <select class="form__select" name="category"
        v-model.number="currentCategoryId">
          <option value="0">Все категории</option>
          <option :value="category.id" v-for="category in categories"
          :key="category.id">
            {{ category.title }}
          </option>
        </select>
      </label>
    </fieldset>
    <fieldset class="form__block">
      <legend class="form__legend">Цвет</legend>
      <ul class="colors colors--black">
        <li class="colors__item" v-for="color in colors" :key="color.id">

          <label class="colors__label">
            <input class="colors__radio sr-only" type="checkbox" name="color"
            :value="color.id" v-model.number="currentColor">
            <span class="colors__value" :style="{ 'background-color': color.code }"
            :class="['colors__value', {'value--black' : color.code === '#ffffff'}]">
            </span>
          </label>
        </li>
      </ul>
    </fieldset>
    <fieldset class="form__block">
      <legend class="form__legend">Материал</legend>
      <ul class="check-list">
        <li class="check-list__item" v-for="material in materials" :key="material.id">
          <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox"
            name="material" :value="material.id" v-model="currentMaterial">
            <span class="check-list__desc">
              {{ material.title }}
              <span>{{ material.productsCount }}</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Коллекция</legend>
      <ul class="check-list">
        <li class="check-list__item" v-for="season in seasons" :key="season.id">
          <label class="check-list__label">
            <input class="check-list__check sr-only" type="checkbox"
            name="collection" :value="season.id" v-model="currentSeason">
            <span class="check-list__desc">
              {{ season.title }}
              <span>{{ season.productsCount }}</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <button class="filter__submit button button--primery" type="submit">
      Применить
    </button>
    <transition name="fade-out">
      <button class="filter__reset button button--second" type="button"
        @click.prevent="reset" v-show="resetButton()">
        Сбросить
      </button>
    </transition>
  </form>
  </aside>
</template>

<!-- eslint-disable no-undef -->
<script>
import {
  toRefs, reactive, computed, watch,
} from 'vue';
import setInputFormat from '@/helpers/inputFormat';
import * as axios from '@/store/axios';
import { useRoute } from 'vue-router';

export default {
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'selectedColor',
    'selectedMaterial',
    'selectedSeason',
    'firstPage',
    'maxProductPrice',
    'minProductPrice',
    'page',
  ],
  setup(props, { emit }) {
    const route = useRoute();
    const state = reactive({
      currentPriceFrom: '',
      currentPriceTo: '',
      currentCategoryId: +route.query.categoryId || 0,

      currentSeason: [],
      currentColor: [],
      currentMaterial: [],

      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null,
      currentPage: null,
      tweenedNumberFrom: 0,
      tweenedNumberTo: 0,
    });

    const categories = computed(() => (state.categoriesData ? state.categoriesData.items : []));
    const colors = computed(() => (state.colorsData ? state.colorsData.items : []));
    const materials = computed(() => (state.materialsData ? state.materialsData.items : []));
    const seasons = computed(() => (state.seasonsData ? state.seasonsData.items : []));
    const animatedPriceTo = computed(() => state.tweenedNumberTo.toFixed(0));
    const animatedPriceFrom = computed(() => state.tweenedNumberFrom.toFixed(0));

    const submit = () => {
      state.currentPage = true;
      emit('update:firstPage', state.currentPage);
      emit('update:priceFrom', state.currentPriceFrom);
      emit('update:priceTo', state.currentPriceTo);
      emit('update:categoryId', state.currentCategoryId);
      emit('update:selectedColor', state.currentColor);
      emit('update:selectedMaterial', state.currentMaterial);
      emit('update:selectedSeason', state.currentSeason);
      document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setTimeout(() => {
        window.location.hash = '';
      }, 1000);
    };

    const reset = () => {
      state.currentPage = true;
      emit('update:firstPage', state.currentPage);
      emit('update:priceFrom', '');
      emit('update:priceTo', '');
      emit('update:categoryId', 0);
      emit('update:selectedColor', []);
      emit('update:selectedMaterial', []);
      emit('update:selectedSeason', []);
      state.currentPriceFrom = '';
      state.currentPriceTo = '';
      state.currentCategoryId = 0;
      document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setTimeout(() => {
        window.location.hash = '';
      }, 1000);
    };

    const resetButton = () => {
      const {
        currentPriceFrom,
        currentPriceTo,
        currentCategoryId,
        currentColor,
        currentMaterial,
        currentSeason,
      } = state;
      return (
        currentPriceFrom !== ''
        || currentPriceTo !== ''
        || currentCategoryId !== 0
        || currentColor.length !== 0
        || currentMaterial.length !== 0
        || currentSeason.length !== 0
        || props.page !== 1
      );
    };

    watch(() => props.minProductPrice, (newValue) => {
      gsap.to(state, { duration: 0.5, tweenedNumberFrom: newValue });
    });

    watch(() => props.maxProductPrice, (newValue) => {
      gsap.to(state, { duration: 0.5, tweenedNumberTo: newValue });
    });

    watch(
      () => [
        props.priceFrom,
        props.priceTo,
        props.categoryId,
        props.selectedColor,
        props.selectedMaterial,
        props.selectedSeason,
      ],
      ([
        priceFrom, priceTo,
        categoryId, selectedColor,
        selectedMaterial,
        selectedSeason]) => {
        state.currentPriceFrom = priceFrom;
        state.currentPriceTo = priceTo;
        state.currentCategoryId = categoryId;
        state.currentColor = selectedColor;
        state.currentMaterial = selectedMaterial;
        state.currentSeason = selectedSeason;
      },
    );

    return {
      ...toRefs(state),
      categories,
      colors,
      materials,
      seasons,
      animatedPriceTo,
      animatedPriceFrom,
      submit,
      reset,
      resetButton,
    };
  },
  methods: {
    ...axios,
    setInputFormat,
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
  mounted() {
    this.setInputFormat('.form__input', 7);
  },
};

</script>
