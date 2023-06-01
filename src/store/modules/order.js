import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  state() {
    return {
      orderInfo: null,
      deliveryData: '',
      paymentData: '',
    };
  },

  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    updateDeliveryData(state, data) {
      state.deliveryData = data;
    },
    updatePaymentTypes(state, data) {
      state.paymentData = data;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.rootGetters.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadDeliveryTypes(context) {
      return axios.get(`${API_BASE_URL}/api/deliveries`, {
      })
        .then((response) => {
          context.commit('updateDeliveryData', response.data);
        });
    },
    loadPaymentTypes(context) {
      return axios.get(`${API_BASE_URL}/api/payments`, {
        params: {
          deliveryTypeId: 1,
        },
      })
        .then((response) => {
          context.commit('updatePaymentTypes', response.data);
        });
    },
  },
};
