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

      <create-offer-form @submit="isDrawerShown = false" />
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
  async created () {
    await this.getOffers()
    this.isLoaded = true
  },
  methods: {
    async getOffers () {
      try {
        this.list = [{
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
        console.error(e)
      }
    },
  },
}
</script>
