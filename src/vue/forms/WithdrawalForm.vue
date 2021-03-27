<template>
  <div class="withdrawal">
    <template v-if="isLoaded">
      <template v-if="assets.length">
        <form
          @submit.prevent="isFormValid() && showConfirmation()"
          novalidate
        >
          <div class="app__form-row withdrawal__form-row">
            <div class="app__form-field">
              <select-field
                name="withdrawal-asset"
                :value="form.asset"
                @input="setAssetByCode"
                :disabled="formMixin.isDisabled"
                :label="'withdrawal-form.asset' | globalize"
              >
                <option
                  v-for="asset in assets"
                  :key="asset.code"
                  :value="asset.code"
                >
                  {{ asset.code }}
                </option>
              </select-field>
            </div>
          </div>

          <div class="app__form-actions">
            <button
              v-ripple
              v-if="!formMixin.isConfirmationShown"
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
            >
              {{ 'withdrawal-form.withdraw-btn' | globalize }}
            </button>
            <form-confirmation
              v-else
              @ok="hideConfirmation() || submit()"
              @cancel="hideConfirmation()"
            />
          </div>
        </form>
      </template>
    </template>
    <template v-else-if="isFailed">
      {{ 'withdrawal-form.can-not-load-assets' | globalize }}
    </template>
    <template v-else>
      <loader message-id="withdrawal-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import MetamaskMixin from '@/vue/mixins/metamask.mixin'
import Loader from '@/vue/common/Loader'

import { vueRoutes } from '@/vue-router/routes'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
} from '@validators'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'withdrawal-form',
  components: {
    Loader,
  },
  mixins: [FormMixin, MetamaskMixin],
  props: {},
  data: () => ({
    isLoaded: false,
    isFailed: false,
    assets: [],
    form: {
      asset: '',
    },
    vueRoutes,
  }),
  validations () {
    return {
      form: {
        asset: { required },
      },
    }
  },
  computed: {},
  watch: {},
  async created () {
    try {
      this.assets = [
        {
          code: '1Name',
        },
        {
          code: '121Name',
        },
        {
          code: '121Na1Name',
        },
        {
          code: '1NameName',
        },
      ]
      this.isLoaded = true
    } catch (error) {
      this.isFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    setAssetByCode (code) {
      this.form.asset = code
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        Bus.success('withdrawal-form.withdraw-success')
        this.$emit(EVENTS.operationSubmitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.withdrawal__form-row {
  margin-bottom: 2.5rem;
}

.withdrawal__form-field-description {
  margin-top: 0.7rem;
  opacity: 0.7;
}

.withdrawal__form-field-description--error {
  color: $col-error;
}

.withdrawal__fee-table {
  width: 100%;
  font-size: 1.2rem;
}

.withdrawal__fee-table tr {
  height: 2rem;
}

.withdrawal__fee-table td:last-child {
  text-align: right;
}

.withdrawal__fee-tbody {
  color: $col-text-secondary;
}

.withdrawal__total-fee-row {
  color: $col-text;
  font-weight: 600;
}

.withdrawal__data--loading {
  opacity: 0.4;
}
</style>
