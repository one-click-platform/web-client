<template>
  <div class="tokens-page">
    <top-bar>
      <template slot="main" />
      <template
        slot="extra"
      >
        <button
          class="app__button-raised"
          @click="isDrawerShown = true"
        >
          {{ 'tokens-page.create-btn' | globalize }}
        </button>
        <button
          class="app__button-raised"
          @click="isWithdrawalDrawerShown = true"
        >
          {{ 'tokens-page.withdraw' | globalize }}
        </button>
      </template>
    </top-bar>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'tokens-page.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="list.length">
          <card-list
            v-slot="{ item }"
            :list="list"
          >
            <token-card
              :token="item"
            />
          </card-list>
        </template>

        <template v-else>
          <no-data-message
            icon-name="ticket-percent"
            :title="'tokens-page.no-list-title' | globalize"
            :message="'tokens-page.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <loader-midl />
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'tokens-page.create-token-title' | globalize }}
      </template>

      <create-token-form @submit="isDrawerShown = false" />
    </drawer>
    <drawer :is-shown.sync="isWithdrawalDrawerShown">
      <template slot="heading">
        {{ 'withdrawal-form.withdrawal' | globalize }}
      </template>
      <withdrawal-form
        @operation-submitted="closeWithdrawalDrawerAndEmitEvent()"
      />
    </drawer>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import CardList from '@/vue/common/CardList'
import ErrorMessage from '@/vue/common/ErrorMessage'
import LoaderMidl from '@/vue/common/LoaderMidl'
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateTokenForm from '@/vue/forms/CreateTokenForm.vue'
import TokenCard from '@/vue/pages/Tokens/TokenCard'
import WithdrawalForm from '@/vue/forms/WithdrawalForm'
import MetamaskMixin from '@/vue/mixins/metamask.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'tokens-page',

  components: {
    NoDataMessage,
    CardList,
    ErrorMessage,
    LoaderMidl,
    TopBar,
    Drawer,
    CreateTokenForm,
    TokenCard,
    WithdrawalForm,
  },
  mixins: [MetamaskMixin],

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
      isWithdrawalDrawerShown: false,
    }
  },
  async created () {
    try {
      this.list = await this.getTokens()
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
      this.isLoadFailed = true
    }
    this.isLoaded = true
  },
  methods: {
    closeWithdrawalDrawerAndEmitEvent () {
      this.isWithdrawalDrawerShown = false
    },
  },
}
</script>
