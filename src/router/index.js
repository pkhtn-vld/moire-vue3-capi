import { createRouter, createWebHashHistory } from 'vue-router';
// import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const routes = [
  {
    name: 'main', component: MainPage, path: '/', meta: { depth: 1 },
  },
  {
    name: 'product', component: ProductPage, path: '/product/:id', meta: { depth: 2 },
  },
  {
    name: 'cart', component: CartPage, path: '/cart/', meta: { depth: 3 },
  },
  {
    name: 'order', component: OrderPage, path: '/order/', meta: { depth: 4 },
  },
  {
    name: 'orderInfo', component: OrderInfoPage, path: '/order/:id', meta: { depth: 5 },
  },
  {
    name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*', meta: { depth: 6 },
    // name: 'notFound', component: NotFoundPage, path: '/:catchAll(.*)', meta: { depth: 6 },
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

export default router;
