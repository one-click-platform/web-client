<template>
  <div class="create-offer-form">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'create-offer-form.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="tokens.length">
          <form
            novalidate
            class="app__form"
            @submit.prevent="isFormValid() && submit()"
          >
            <div class="app__form-row">
              <div class="app__form-field">
                <select-field
                  v-model="form.tokenId"
                  :label="'create-offer-form.token-lbl' | globalize"
                  name="create-offer-form-token"
                  @blur="touchField('form.tokenId')"
                  :disabled="formMixin.isDisabled"
                  :error-message="getFieldErrorMessage('form.tokenId')"
                >
                  <option
                    v-for="token in tokens"
                    :key="token.id"
                    :value="token.id"
                  >
                    {{ token.name }}
                  </option>
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
                <date-field
                  v-model="form.startDate"
                  :disabled="formMixin.isDisabled"
                  :placeholder="'create-offer-form.start-date-lbl' | globalize"
                  @blur="touchField('form.startDate')"
                  :error-message="getFieldErrorMessage('form.startDate')"
                  :disable-before="moment().subtract(1, 'days').toISOString()"
                />
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <date-field
                  v-model="form.endDate"
                  :disabled="formMixin.isDisabled"
                  :placeholder="'create-offer-form.end-date-lbl' | globalize"
                  @blur="touchField('form.endDate')"
                  :error-message="getFieldErrorMessage('form.endDate')"
                  :disable-before="moment(form.startDate)
                    .subtract(1, 'days').toISOString()
                  "
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
        </template>
      </template>
    </template>
    <template v-else>
      <loader message-id="create-offer-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { required, maxLength } from '@validators'
import moment from 'moment'
import MetamaskMixin from '@/vue/mixins/metamask.mixin'

const DESCRIPTION_MAX_LENGTH = 500

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'create-offer-form',
  mixins: [FormMixin, MetamaskMixin],

  data: _ => ({
    tokens: [],
    form: {
      tokenId: '',
      minPrice: '',
      priceForBuyNow: '',
      step: '',
      description: '',
    },
    isLoaded: false,
    isLoadFailed: false,
    DESCRIPTION_MAX_LENGTH,
    moment,
  }),

  validations () {
    return {
      form: {
        tokenId: {
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
        startDate: {
          required,
        },
        endDate: {
          required,
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  created () {
    this.getTokens()
  },

  methods: {
    async getTokens () {
      try {
        this.tokens = [{
          logoUrl: '',
          name: 'Name',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula gravida ullamcorper. Quisque gravida nec ex ac condimentum. Aenean consectetur libero et augue pellentesque molestie. Sed est tellus, pellentesque ut tortor ut, egestas laoreet est. Nunc pretium nisi at tortor feugiat, nec tristique nulla pellentesque. Mauris condimentum libero tellus, ac tincidunt enim pretium eget. Proin eleifend bibendum sapien, semper venenatis lorem faucibus vitae.',
        },
        {
          logoUrl: '',
          name: 'Name',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula gravida ullamcorper. Quisque gravida nec ex ac condimentum. Aenean consectetur libero et augue pellentesque molestie. Sed est tellus, pellentesque ut tortor ut, egestas laoreet est. Nunc pretium nisi at tortor feugiat, nec tristique nulla pellentesque. Mauris condimentum libero tellus, ac tincidunt enim pretium eget. Proin eleifend bibendum sapien, semper venenatis lorem faucibus vitae.',
        },
        {
          logoUrl: '',
          name: 'Name',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula gravida ullamcorper. Quisque gravida nec ex ac condimentum. Aenean consectetur libero et augue pellentesque molestie. Sed est tellus, pellentesque ut tortor ut, egestas laoreet est. Nunc pretium nisi at tortor feugiat, nec tristique nulla pellentesque. Mauris condimentum libero tellus, ac tincidunt enim pretium eget. Proin eleifend bibendum sapien, semper venenatis lorem faucibus vitae.',
        }]
      } catch (e) {
        ErrorHandler.process(e)
        this.isLoadFailed = true
      }
      this.isLoaded = true
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.createOffer(
          this.form.tokenId,
          this.form.minPrice,
          this.form.priceForBuyNow,
          this.form.startDate,
          this.form.endDate,
          this.form.step,
          this.form.description
        )
        Bus.success('create-offer-form.offer-created-msg')
        this.$emit(EVENTS.submit)
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
