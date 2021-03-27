<template>
  <div class="offers-page">
    <top-bar>
      <template slot="main" />
      <template
        slot="extra"
      >
        <button
          class="app__button-raised"
          @click="isDrawerShown = true"
        >
          {{ 'offers-page.create-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'offers-page.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="list.length">
          <card-list
            v-slot="{ item }"
            :list="list">
            <offer-card
              :offer="item"
            />
          </card-list>
        </template>

        <template v-else>
          <no-data-message
            icon-name="ticket-percent"
            :title="'offers-page.no-list-title' | globalize"
            :message="'offers-page.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-cards-loader />
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'offers-page.create-token-title' | globalize }}
      </template>

      <create-offer-form />
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
import CreateOfferForm from '@/vue/forms/CreateOfferForm.vue'
import OfferCard from '@/vue/pages/Offers/OfferCard'

export default {
  name: 'offers-page',

  components: {
    NoDataMessage,
    CardList,
    ErrorMessage,
    SkeletonCardsLoader,
    TopBar,
    Drawer,
    CreateOfferForm,
    OfferCard,
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
