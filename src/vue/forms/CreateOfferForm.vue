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
        <template v-else>
          <no-data-message
            icon-name="alert-circle"
            :title="'create-offer-form.no-data-title' | globalize"
            :message="'create-offer-form.no-data-message' | globalize"
          />
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
import { required } from '@validators'
import moment from 'moment'
import MetamaskMixin from '@/vue/mixins/metamask.mixin'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

const DESCRIPTION_MAX_LENGTH = 500

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'create-offer-form',
  components: { NoDataMessage, Loader },
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
      },
    }
  },

  async created () {
    try {
      this.tokens = await this.getTokens()
    } catch (e) {
      ErrorHandler.process(e)
      this.isLoadFailed = true
    }
    this.isLoaded = true
  },

  methods: {
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
