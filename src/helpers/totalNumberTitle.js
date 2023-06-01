export default function setTotalNumberTitle() {
  const words = [' товар', ' товара', ' товаров'];
  let conditionValue;
  let index;

  if (this.$route.name === 'product' || this.$route.name === 'main') {
    conditionValue = this.countProducts;
  } else {
    conditionValue = this.totalNumber;
  }

  if (this.$store.state.order.orderInfo !== null) {
    conditionValue = this.$store.state.order.orderInfo.basket.items.length;
  }

  if (conditionValue % 10 === 1 && conditionValue % 100 !== 11) {
    index = 0;
  } else if
  ([2, 3, 4].includes(conditionValue % 10) && !([12, 13, 14].includes(conditionValue % 100))) {
    index = 1;
  } else {
    index = 2;
  }

  return `${words[index]}`;
}
