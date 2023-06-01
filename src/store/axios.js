/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { API_BASE_URL } from '@/config';

// ProductFilter

export const loadCategories = function loadCategories() {
  axios.get(`${API_BASE_URL}/api/productCategories`)
    .then((response) => {
      this.categoriesData = response.data;
    });
};

export const loadColors = function loadColors() {
  axios.get(`${API_BASE_URL}/api/colors`)
    .then((response) => {
      this.colorsData = response.data;
    });
};

export const loadMaterials = function loadMaterials() {
  axios.get(`${API_BASE_URL}/api/materials`)
    .then((response) => {
      this.materialsData = response.data;
    });
};

export const loadSeasons = function loadSeasons() {
  axios.get(`${API_BASE_URL}/api/seasons`)
    .then((response) => {
      this.seasonsData = response.data;
    });
};

// ProductModal

export const loadProductModal = function loadProduct() {
  this.productLoading = true;
  this.loadError = false;
  this.$emit('updateProductLoading', this.productLoading);
  setTimeout(() => {
    axios.get(`${API_BASE_URL}/api/products/${this.productId}`)
      .then((response) => {
        this.product = response.data;
      })
      .catch(() => {
        this.productLoading = false;
        this.loadError = true;
        this.$emit('updateProductLoading', this.productLoading);
      })
      .then(() => {
        this.productLoading = false;
        this.$emit('updateProductLoading', this.productLoading);
      });
  }, 1000);
};

export const addToCartModal = function addToCart() {
  this.productAdded = false;
  this.productAddSending = true;

  this.addProductToCart({
    productId: this.product.id,
    amount: this.productAmount,
    colorId: this.selectedColor,
    sizeId: this.currentSizeId,
  })
    .then(() => {
      this.productAdded = true;
      this.productAddSending = false;
      this.productSelected = true;
      // таймаут на исчезновение подсказки о добавлении товара
      setTimeout(() => {
        this.productAdded = false;
      }, 2000);
    })
    .catch(() => {
      this.sizeError = true;
      this.productAddSending = false;
    });
};

// ProductPage

export const loadProduct = function loadProduct() {
  this.productLoading = true;
  setTimeout(() => {
    axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
      .then((response) => {
        this.productData = response.data;
        this.selectedColor = +this.$route.query.color || this.productData.colors[0].color.id;
      })
      .catch(() => {
      })
      .then(() => {
        this.productLoading = false;
      });
  }, 0);
};

export const addToCart = function addToCart() {
  this.productAdded = false;
  this.productAddSending = true;

  this.addProductToCart({
    productId: this.product.id,
    amount: this.productAmount,
    colorId: this.selectedColor,
    sizeId: this.currentSizeId,
  })
    .then(() => {
      this.productAdded = true;
      this.productAddSending = false;
    })
    .catch(() => {
      this.sizeError = true;
      this.productAddSending = false;
    });
};

// OrderPage

export const sendOrder = function order() {
  this.formError = {};
  this.formErrorMessage = '';
  this.orderSending = true;
  setTimeout(() => {
    axios
      .post(`${API_BASE_URL}/api/orders`, {
        ...this.formData,
        deliveryTypeId: this.deliveryType,
        paymentTypeId: this.paymentType,
      }, {
        params: {
          userAccessKey: this.$store.state.cart.userAccessKey,
        },
      })
      .then((response) => {
        this.$store.commit('resetCart');
        this.$store.commit('updateOrderInfo', response.data);
        this.formData = {};
        this.orderSending = false;
        this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
      })
      .catch((error) => {
        this.formError = error.response.data.error.request || {};
        this.formErrorMessage = error.response.data.error.message;
        this.orderSending = false;
      });
  }, 1000);
};
