<template>
  <transition name="fade-out" appear>
    <div :class="['cart__block', {'cart__block-preload' : products.length === 0}]">

      <PreloaderIndicator class="order-spinner" v-if="products.length === 0"/>

      <transition name="fade-out">
        <ul class="cart__orders"  v-if="products.length > 0">
          <OrderCheckoutItem v-for="item in products"
          :key="item.productId" :item="item"/>
        </ul>
      </transition>

      <transition name="fade-out">
        <div class="cart__total"  v-if="products.length > 0">
            <p v-show="deliveryPrice != 0">Доставка: <b>{{ totalPricePrettyDelivery }} ₽</b></p>
            <p v-show="deliveryPrice == 0">Доставка: <b>бесплатно</b></p>
          <p>Заказ: <b>{{ totalNumber }}</b> {{ setTotalNumberTitle }} на сумму
            <b>{{ totalPricePretty }} ₽</b>
          </p>
          <p>
            Итого: <b>{{ totalPricePrettyAll }} ₽</b>
          </p>
        </div>
      </transition>

        <button class="cart__button button button--primery" type="submit"
        v-show="(totalNumber > 0) && !orderSending" :disabled="orderSending"
        v-if="products.length > 0">
          Оформить заказ
        </button>

        <button class="cart__button button button--primery transperent" type="submit"
        v-show="orderSending" :disabled="orderSending">
        Оформить заказ
          <PreloaderIndicator class="page-spinner-mini"/>
        </button>
    </div>
  </transition>
</template>

<!-- eslint-disable no-undef -->
<script>
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import { useStore } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';
import PreloaderIndicator from '../base/PreloaderIndicator.vue';
import OrderCheckoutItem from './OrderCheckoutItem.vue';

export default defineComponent({
  components: { PreloaderIndicator, OrderCheckoutItem },
  props: ['orderSending', 'deliveryData', 'deliveryType'],
  computed: {
    setTotalNumberTitle,
  },
  setup(props) {
    // Работа с vuex
    const store = useStore();
    const products = computed(() => store.getters.cartDetailProducts);
    const totalPrice = computed(() => store.getters.cartTotalPrice);
    const totalNumber = computed(() => store.getters.cartTotalNumber);

    // Работа с общей ценой
    const tweenedNumber = ref(0);
    const commonInfoPrice = ref(0);
    const animatedInfoPrice = computed(() => tweenedNumber.value.toFixed(0));
    const totalPricePretty = computed(() => numberFormat(totalPrice.value));

    function setInfoPrice() {
      if (+animatedInfoPrice.value === 0) {
        commonInfoPrice.value = totalPrice.value;
        return commonInfoPrice.value;
      }
      return animatedInfoPrice.value;
    }
    const totalPricePrettyAll = computed(() => numberFormat(setInfoPrice()));

    // Работа с ценой доставки
    const tweenedNumberDelivery = ref(0);
    const commonDeliveryPrice = ref(0);
    const deliveryPrice = computed(() => props.deliveryData[props.deliveryType - 1]?.price);
    const animatedDeliveryPrice = computed(() => tweenedNumberDelivery.value.toFixed(0));

    function setDeliveryPrice() {
      if (+animatedDeliveryPrice.value === 0) {
        if (deliveryPrice.value) commonDeliveryPrice.value = deliveryPrice.value;
        return commonDeliveryPrice.value;
      }
      return animatedDeliveryPrice.value;
    }
    const totalPricePrettyDelivery = computed(() => numberFormat(
      setDeliveryPrice(deliveryPrice.value),
    ));

    // Отслеживание изменений
    watch(
      () => commonInfoPrice.value,
      (newValue) => {
        gsap.to(tweenedNumber, { duration: 0.5, value: newValue });
      },
    );

    watch(
      () => commonDeliveryPrice.value,
      (newValue) => {
        gsap.to(tweenedNumberDelivery, { duration: 0.5, value: newValue });
      },
    );

    watch(
      () => deliveryPrice.value,
      () => {
        commonInfoPrice.value = totalPrice.value + +deliveryPrice.value;
      },
    );

    watch(
      () => props.deliveryType,
      () => {
        if (props.deliveryType === 1) {
          tweenedNumberDelivery.value = 0;
        }
      },
    );

    return {
      products,
      totalPrice,
      totalNumber,
      totalPricePrettyAll,
      totalPricePretty,
      totalPricePrettyDelivery,
      deliveryPrice,
      animatedInfoPrice,
      animatedDeliveryPrice,
    };
  },
});

</script>
