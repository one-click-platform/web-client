<template>
  <div class="offer-card">
    <card>
      <card-logo
        slot="media"
        :img-url="offer.logoUrl"
        :logo-text="offer.name"
      />
      <template slot="header">
        {{ offer.name }}
      </template>
      <template slot="content">
        {{ offer.description }}
      </template>
      <template slot="actions">
        <template v-if="isBidOpened">
          <bid-form
            :offer="offer"
            @submit="$emit(EVENTS.bid)"
            @cancel="isBidOpened = false"
          />
        </template>
        <template v-else>
          <button
            class="app__button-flat"
            @click="isBidOpened = true"
          >
            {{ 'offer-card.bid' | globalize }}
          </button>
        </template>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'
import BidForm from '@/vue/forms/BidForm'

const EVENTS = {
  bid: 'bid',
}

export default {
  name: 'offer-card',
  components: {
    Card,
    CardLogo,
    BidForm,
  },

  props: {
    offer: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      EVENTS,
      isBidOpened: false,
    }
  },
}
</script>
