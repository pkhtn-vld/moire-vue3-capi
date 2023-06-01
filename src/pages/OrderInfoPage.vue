<template>
  <main class="content container" v-if="orderInfo">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart', state: {goToPage: true}}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту
            придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
            <li class="dictionary__item" v-if="orderInfo.comment">
              <span class="dictionary__key">
                Комментарий к заказу
              </span>
              <span class="dictionary__value">
                {{ orderInfo.comment }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Статус заказа
              </span>
              <span class="dictionary__value">
                {{ orderInfo.status.title }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderInfoCheckoutItem
            v-for="item in orderInfo.basket.items"
            :key="item.id"
            :item="item"/>
          </ul>

          <div class="cart__total">
            <p v-show="deliveryPrice != 0">Доставка: <b>{{ deliveryPricePretty }} ₽</b></p>
            <p v-show="deliveryPrice == 0">Доставка: <b>бесплатно</b></p>
            <p>
              Заказ: <b>{{ orderInfo.basket.items.length }}</b>
              {{ setTotalNumberTitle }} на сумму
              <b>
                {{ totalPricePrettyTotal }} ₽
              </b>
            </p>
            <p>Итого: <b>{{ totalPricePrettyAll }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import {
  defineComponent, watch, onMounted, computed,
} from 'vue';
import { useStore, mapGetters } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import numberFormat from '@/helpers/numberFormat';
import setTotalNumberTitle from '@/helpers/totalNumberTitle';
import OrderInfoCheckoutItem from '@/components/orderInfo/OrderInfoCheckoutItem.vue';

export default defineComponent({
  components: { OrderInfoCheckoutItem },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { products, totalPrice, totalNumber } = mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalNumber: 'cartTotalNumber',
    });

    const orderInfo = computed(() => store.state.order.orderInfo);

    const totalPricePrettyAll = computed(() => (
      orderInfo.value ? numberFormat(orderInfo.value.totalPrice) : 0));

    const deliveryPrice = computed(() => (
      orderInfo.value ? orderInfo.value.deliveryType.price : 0));

    const totalPricePrettyTotal = computed(() => (
      orderInfo.value ? numberFormat(
        orderInfo.value.totalPrice - deliveryPrice.value,
      ) : 0));

    const deliveryPricePretty = computed(() => (
      numberFormat(deliveryPrice.value)
    ));

    function replaceErrorRoute() {
      store.dispatch('loadOrderInfo', route.params.id).catch(() => {
        router.push('/notFound');
      });
    }

    watch(
      () => route.path,
      (newPath) => {
        if (
          newPath !== `/order/${route.params.id}`
          && newPath !== '/'
          && newPath !== '/cart/'
        ) {
          router.push({ name: 'notFound' });
        }
      },
      { immediate: true },
    );

    onMounted(() => {
      replaceErrorRoute();
    });

    return {
      orderInfo,
      products,
      totalPrice,
      totalNumber,
      totalPricePrettyAll,
      totalPricePrettyTotal,
      deliveryPrice,
      deliveryPricePretty,
    };
  },
  computed: {
    setTotalNumberTitle,
  },
});

</script>
