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
            v-ripple
            class="app__button-flat"
            @click="isInfoOpened = true"
          >
            <i class="mdi mdi-information-outline" />
          </button>
          <button
            class="app__button-flat"
          >
            {{ 'offer-card.by-now' | globalize }}
          </button>
          <button
            class="app__button-flat"
            @click="isBidOpened = true"
          >
            {{ 'offer-card.bid' | globalize }}
          </button>
        </template>
      </template>
    </card>

    <drawer :is-shown.sync="isInfoOpened">
      <template slot="heading">
        {{ 'offer-card.details' | globalize }}
      </template>
      <div class="app__table asset-attributes-viewer__table-wrp">
        <table>
          <tbody>
            <tr>
              <td>
                {{ 'assets.asset-type' | globalize }}
              </td>
              <td>
                {{ 'assets.does-not-require-verification-title' | globalize }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </drawer>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'
import BidForm from '@/vue/forms/BidForm'
import Drawer from '@/vue/common/Drawer'

const EVENTS = {
  bid: 'bid',
}

export default {
  name: 'offer-card',
  components: {
    Card,
    CardLogo,
    BidForm,
    Drawer,
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
      isInfoOpened: false,
    }
  },
}
</script>
