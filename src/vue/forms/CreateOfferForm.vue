<template>
  <div class="create-offer-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.token"
            :label="'create-offer-form.token-lbl' | globalize"
            name="create-offer-form-token"
            @blur="touchField('form.token')"
            :disabled="formMixin.isDisabled"
          >
            // add options
          </select-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.minPrice"
            type="number"
            name="create-offer-form-min-price"
            :label="'create-offer-form.min-price-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            @blur="touchField('form.minPrice')"
            :error-message="getFieldErrorMessage('form.minPrice')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            type="number"
            v-model="form.priceForBuyNow"
            name="create-offer-form-price-for-buy-now"
            :label="'create-offer-form.price-for-buy-now-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            @blur="touchField('form.priceForBuyNow')"
            :error-message="getFieldErrorMessage('form.priceForBuyNow')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            type="number"
            v-model="form.step"
            name="create-offer-form-step"
            :label="'create-offer-form.step-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            @blur="touchField('form.step')"
            :error-message="getFieldErrorMessage('form.step')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <textarea-field
            name="create-offer-form-description"
            v-model="form.description"
            :label="'create-offer-form.desc-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            rows="8"
            :error-message="getFieldErrorMessage(
              'form.description',
              { length: DESCRIPTION_MAX_LENGTH }
            )"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          type="submit"
          :disabled="formMixin.isDisabled"
          class="app__button-raised"
        >
          {{ 'create-offer-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { required, maxLength } from '@validators'

const DESCRIPTION_MAX_LENGTH = 500

export default {
  name: 'create-offer-form',
  mixins: [FormMixin],

  data: _ => ({
    form: {
      token: '',
      minPrice: '',
      priceForBuyNow: '',
      step: '',
      description: '',
    },
    DESCRIPTION_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        token: {
          required,
        },
        minPrice: {
          required,
        },
        priceForBuyNow: {
          required,
        },
        step: {
          required,
        },
        logo: {
          required,
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        Bus.success('create-offer-form.offer-created-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },

}
</script>

<style lang="scss">
@import './app-form';

</style>
