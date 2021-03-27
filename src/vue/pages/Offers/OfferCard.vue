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
        <button
          class="app__button-flat"
          @click="$emit(EVENTS.bid)"
        >
          {{ 'offer-card.bid' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'

const EVENTS = {
  bid: 'bid',
}

export default {
  name: 'offer-card',
  components: {
    Card,
    CardLogo,
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
    }
  },
}
</script>
