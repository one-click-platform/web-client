<template>
  <div class="create-token-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.name"
            @blur="touchField('form.name')"
            name="create-token-form-name"
            :disabled="formMixin.isDisabled"
            :label="'create-token-form.name-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.name')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            name="create-token-form-logo"
            v-model="form.logo"
            :note="'create-token-form.logo-note' | globalize"
            :label="'create-token-form.logo-lbl' | globalize"
            :min-width="120"
            :min-height="120"
            :max-size="LOGO_MAX_SIZE"
            :disabled="formMixin.isDisabled"
            @blur="touchField('form.logo')"
            :error-message="getFieldErrorMessage('form.logo')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <textarea-field
            name="create-token-form-desc"
            v-model="form.description"
            :label="'create-token-form.desc-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.description',
              { length: DESCRIPTION_MAX_LENGTH }
            )"
            rows="8"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          type="submit"
          :disabled="formMixin.isDisabled"
          class="app__button-raised"
        >
          {{ 'create-token-form.submit-btn' | globalize }}
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

const LOGO_MAX_SIZE = 5
const DESCRIPTION_MAX_LENGTH = 500

export default {
  name: 'create-token-form',
  mixins: [FormMixin],

  data: _ => ({
    form: {
      name: '',
      description: '',
      logo: null,
    },
    LOGO_MAX_SIZE,
    DESCRIPTION_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
        logo: {
          required,
        },
      },
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        Bus.success('create-token-form.offer-created-msg')
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
