<template>
  <div class="token-card">
    <card>
      <card-logo
        slot="media"
        :img-url="token.logoUrl"
        :logo-text="token.name"
      />
      <template slot="header">
        {{ token.name }}
      </template>
      <template slot="content">
        {{ token.description }}
      </template>
      <template slot="actions">
        <!-- <button
          class="app__button-flat"
          @click="$emit(EVENTS.details)"
        >
          {{ 'token-card.details' | globalize }}
        </button> -->
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'

const EVENTS = {
  details: 'details',
}

export default {
  name: 'token-card',
  components: {
    Card,
    CardLogo,
  },

  props: {
    token: {
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
