<template>
  <div class="metamask-form">
    <template v-if="isMetamaskEnabled">
      <template v-if="true">
        <div class="metamask-form__metamask-status">
          <p class="metamask-form__metamask-status-title">
            {{ 'metamask-form.status-title' | globalize }}
          </p>
          <i
            class="mdi metamask-form__status-icon"
            :class="iconStyles"
          />
        </div>
        <div
          v-if="!isMetamaskConnected"
          class="metamask-form__actions">
          <button
            v-if="isSkipButtonShown"
            v-ripple
            type="submit"
            class="app__button-raised"
            @click="$emit(EVENTS.skipMetamask)"
          >
            {{ 'metamask-form.skip-metamask' | globalize }}
          </button>
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            @click="connectMetamask"
            :disabled="isMetamaskProcessing"
          >
            <template
              v-if="isMetamaskProcessing">
              {{ 'metamask-form.enable-metamask-connecting-btn' | globalize }}
            </template>
            <template
              v-else>
              {{ 'metamask-form.connect-metamask-btn' | globalize }}
            </template>
          </button>
        </div>
        <div class="metamask-form__description">
          {{ 'metamask-form.description-msg' | globalize }}
        </div>
      </template>
      <template v-else>
        <error-message
          class="metamask-form__error-message"
          :message="'metamask-form.network-error-msg' | globalize"
        />
        <button
          v-ripple
          v-if="isSkipButtonShown"
          type="submit"
          class="app__button-raised"
        >
          {{ 'metamask-form.skip-metamask' | globalize }}
        </button>
      </template>
    </template>
    <no-data-message
      v-else
      icon-name="alert-circle"
      :title="'metamask-form.no-data-title' | globalize"
      :message="'metamask-form.no-data-message' | globalize"
    />
  </div>
</template>

<script>
import ErrorMessage from '@/vue/common/ErrorMessage'
import NoDataMessage from '@/vue/common/NoDataMessage'

import MetamaskMixin from '@/vue/mixins/metamask.mixin'

import config from '@/config'

const EVENTS = {
  skipMetamask: 'skip-metamask',
}

export default {
  name: 'metamask-form',

  components: {
    ErrorMessage,
    NoDataMessage,
  },

  mixins: [MetamaskMixin],

  props: {
    isSkipButtonShown: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    EVENTS,
    config,
  }),

  computed: {
    iconStyles () {
      return this.isMetamaskConnected
        ? ['mdi-emoticon-cool-outline', 'metamask-form__status-icon--success']
        : ['mdi-emoticon-sad-outline', 'metamask-form__status-icon--error']
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.metamask-form__status-icon {
  font-size: 10rem;

  &--success {
    color: $col-success;
  }

  &--error {
    color: $col-error-message-icon-color;
  }
}

.metamask-form__metamask-status {
  text-align: center;
  margin-bottom: 2rem;
}

.metamask-form__metamask-status-title {
  font-weight: 700;
  font-style: normal;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.metamask-form__actions {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.metamask-form__error-message {
  margin-bottom: 2rem;
}

.metamask-form__description {
  display: flex;
  justify-content: center;
}
</style>
