<template>
  <li class="cart__order">
    <h3>{{ item.product.title }}</h3>
    <b>{{ totalPricePretty }} ₽</b>
    <span>Артикул: {{ item.product.id }}</span>
    <span>Количество: {{ item.quantity }}</span>
    <span>Размер: {{ item.size.title }}</span>
    <span class="cart__order-item">
      Цвет:
      <i :class="['colors__value', 'cart__order-item-color',
        { 'value--black': item.color.color.code === '#ffffff' }]"
        :style="'background-color:' + item.color.color.code"></i>
      {{ item.color.color.title }}
    </span>
  </li>
</template>

<script>
import { defineComponent, computed } from 'vue';
import numberFormat from '@/helpers/numberFormat';

export default defineComponent({
  props: ['item'],
  setup(props) {
    const totalPricePretty = computed(() => numberFormat(
      props.item.product.price * props.item.quantity,
    ));

    return {
      totalPricePretty,
    };
  },
});
</script>
