<template>
   <ul class="catalog__pagination pagination">
          <li class="pagination__item">

            <a :class="['pagination__link', 'pagination__link--arrow',
            {'pagination__link--disabled': page === 1}]"
            href="#"
            @click.prevent="previousPage(page)"
            aria-label="Предыдущая страница">

            <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-left"></use>
              </svg>
            </a>
          </li>

          <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
            <a :class="['pagination__link', {'pagination__link--current': pageNumber === page}]"
            href="#"
            @click.prevent="paginate(pageNumber)">
            {{ pageNumber }}
            </a>
          </li>
          <li class="pagination__item">
            <a
            :class="['pagination__link', 'pagination__link--arrow',
            {'pagination__link--disabled': page === pages}]"
            href="#"
            @click.prevent="nextPage(page)"
            aria-label="Следующая страница">
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </a>
          </li>
        </ul>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: ['modelValue', 'count', 'perPage', 'productsLoading'],
  setup(props, { emit }) {
    const smoothScroll = () => {
      setTimeout(() => {
        document.body.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 0);
    };

    const paginate = (newPage) => {
      emit('update:modelValue', newPage);
      smoothScroll();
    };

    const nextPage = (newPage) => {
      if (newPage < Math.ceil(props.count / props.perPage)) {
        emit('update:modelValue', newPage + 1);
        smoothScroll();
      }
    };

    const previousPage = (newPage) => {
      if (newPage > 1) {
        emit('update:modelValue', newPage - 1);
        smoothScroll();
      }
    };

    const page = computed(() => props.modelValue);
    const pages = computed(() => Math.ceil(props.count / props.perPage));

    return {
      page,
      pages,
      paginate,
      nextPage,
      previousPage,
    };
  },
});
</script>
