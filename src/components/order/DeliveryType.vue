<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ul class="cart__options options">
    <li class="options__item" v-for="delivery in deliveryData" :key="delivery.id">
      <label class="options__label">
        <input class="options__radio sr-only"
        type="radio"
        name="delivery"
        :value="delivery.id"
        v-model="deliveryType"
        @click="changeDeliveryType">
        <span class="options__value">
          {{ delivery.title }} <b v-if="delivery.id !== 1">{{ totalPricePrettyDelivery }} ₽</b>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import numberFormat from '@/helpers/numberFormat';

export default defineComponent({
  props: ['deliveryData'],
  setup(props, { emit }) {
    const deliveryType = ref(1);

    const changeDeliveryType = (event) => {
      deliveryType.value = Number(event.target.value);
      emit('updateDeliveryType', deliveryType.value);
    };

    const totalPricePrettyDelivery = computed(() => numberFormat(props.deliveryData[1].price));

    return { deliveryType, totalPricePrettyDelivery, changeDeliveryType };
  },
});
</script>
