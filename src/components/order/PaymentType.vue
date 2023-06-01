<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <ul class="cart__options options">
    <!-- <transition-group name="fade-out"> -->
      <li :class="['options__item', {'hidden' :
      ((deliveryType === 2 && payment.id === 2) || deliveryType === 2) && payment.id === 1 }]"
        v-for="payment in paymentData" :key="payment.id">
        <label class="options__label">
          <input class="options__radio sr-only" type="radio"
          name="pay"
          :value="payment.id"
          v-model="paymentType"
          @click="changePaymentType">
          <span class="options__value">
            {{ payment.title }}
          </span>
        </label>
      </li>
    <!-- </transition-group> -->
  </ul>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: ['paymentData', 'deliveryType'],
  setup(props, { emit }) {
    const paymentType = ref(1);

    const changePaymentType = (event) => {
      paymentType.value = Number(event.target.value);
      emit('updatePaymentType', paymentType.value);
    };

    watch(
      () => props.deliveryType,
      (newVal) => {
        if (newVal === 2) paymentType.value = 2;
        emit('updatePaymentType', paymentType.value);
      },
    );

    return {
      paymentType,
      changePaymentType,
    };
  },
});
</script>
