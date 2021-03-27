<template>
  <div class="bid-form">
    <form
      novalidate
      class="bid-form__form-wrp"
      @submit.prevent="submit"
    >
      <input-field
        v-model="form.amount"
        @blur="touchField('form.amount')"
        name="bid.amount"
        type="number"
        class="bid-form__margin"
        :label="'offer-card.amount' | globalize"
        :error-message="getFieldErrorMessage('form.amount')"
        :disabled="formMixin.isDisabled"
      />

      <button
        v-ripple
        type="submit"
        class="app__button-flat"
        :disabled="formMixin.isDisabled"
        @click="$emit(EVENTS.cancel)"
      >
        <i class="mdi mdi-close" />
      </button>
      <button
        v-ripple
        type="submit"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'offer-card.bid' | globalize }}
      </button>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'

const EVENTS = {
  cancel: 'cancel',
  submitted: 'submitted',
}
export default {
  name: 'wallet-send',
  components: {},
  mixins: [FormMixin],
  props: {
    offer: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      EVENTS,
      form: {
        amount: '',
      },
    }
  },
  computed: {},
  watch: {},
  created () {},
  destroyed () {},
  validations () {
    return {
      form: {
        amount: { required },
      },
    }
  },
  methods: {
    submit () {
      if (!this.isFormValid()) return
      this.$emit(EVENTS.submitted)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.bid-form {
  width: 100%;
}

.bid-form__form-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bid-form__margin {
  margin-right: 1rem;
}
</style>
