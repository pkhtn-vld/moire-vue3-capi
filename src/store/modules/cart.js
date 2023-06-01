import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  state() {
    return {
      userAccessKey: null,
      cartProductsData: [],
      cartProducts: [],
      loadingCart: true,
      loadingCartHeader: true,
      deletingCart: false,
    };
  },

  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const productInfo = state.cartProductsData.find((p) => p.id === item.productId).product;
        return {
          ...item,
          product: {
            ...productInfo,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts
        .reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartTotalNumber(state) {
      return state.cartProducts.length;
    },
    userAccessKey(state) {
      return state.userAccessKey;
    },
  },

  mutations: {
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { basketItemId, amount }) {
      const item = state.cartProducts.find((el) => el.productId === basketItemId);

      if (item) {
        item.amount = amount;
      }
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((el) => el.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.id,
        amount: item.quantity,
        colorId: item.color.color.code,
        colorTitle: item.color.color.title,
        sizeId: item.size.id,
        sizeTitle: item.size.title,
      }));
    },
    loadCartStatus(state, value) {
      state.loadingCart = value;
    },
    deletingCartStatus(state, value) {
      state.deletingCart = value;
    },
    loadCartHeaderStatus(state, value) {
      state.loadingCartHeader = value;
    },
  },

  actions: {
    loadCart(context) {
      return (new Promise((resolve) => { setTimeout(resolve, 1000); }))
        .then(() => axios
          .get(`${API_BASE_URL}/api/baskets`, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            if (!context.state.userAccessKey) {
              localStorage.setItem('userAccessKey', response.data.user.accessKey);
              context.commit('updateUserAccessKey', response.data.user.accessKey);
            }

            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
            context.commit('loadCartStatus', false);
            context.commit('loadCartHeaderStatus', false);
          }));
    },
    addProductToCart(context, {
      productId, colorId, sizeId, amount,
    }) {
      context.commit('loadCartHeaderStatus', true);
      return (new Promise((resolve) => { setTimeout(resolve, 1000); }))
        .then(() => axios
          .post(`${API_BASE_URL}/api/baskets/products`, {
            productId,
            colorId,
            sizeId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .catch(() => {
            context.commit('loadCartHeaderStatus', false);
          })
          .then((response) => {
            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
            context.commit('loadCartHeaderStatus', false);
          }));
    },
    updateCartProductAmount(context, {
      basketItemId, amount,
    }) {
      context.commit('updateCartProductAmount', { basketItemId, amount });
      if (amount < 1) {
        return;
      }

      // eslint-disable-next-line consistent-return
      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateUserAccessKey', response.data.user.accessKey);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, basketItemId) {
      context.commit('deletingCartStatus', true);
      setTimeout(() => axios.delete(`${API_BASE_URL}/api/baskets/products`, {
        data: {
          basketItemId,
        },
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
          context.commit('deletingCartStatus', false);
        }), 1000);
    },
  },
};
