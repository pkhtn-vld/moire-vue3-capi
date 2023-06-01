import BaseFormField from '@/components/base/BaseFormField.vue';

export default {
  props: ['title', 'error', 'placeholder', 'modelValue'],
  components: { BaseFormField },
  computed: {
    dataValue: {
      get() {
        return this.modelValue;
      },
      set(modelValue) {
        this.$emit('update:modelValue', modelValue);
      },
    },
  },
};
