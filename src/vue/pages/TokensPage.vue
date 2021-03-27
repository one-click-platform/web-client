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
              @withdraw="withdraw"
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
      <skeleton-cards-loader />
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'tokens-page.create-token-title' | globalize }}
      </template>

      <create-token-form @submit="isDrawerShown = false" />
    </drawer>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import CardList from '@/vue/common/CardList'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateTokenForm from '@/vue/forms/CreateTokenForm.vue'
import TokenCard from '@/vue/pages/Tokens/TokenCard'

export default {
  name: 'tokens-page',

  components: {
    NoDataMessage,
    CardList,
    ErrorMessage,
    SkeletonCardsLoader,
    TopBar,
    Drawer,
    CreateTokenForm,
    TokenCard,
  },

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
    }
  },
  created () {
    this.isLoaded = true
  },
}
</script>
