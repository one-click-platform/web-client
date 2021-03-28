<template>
  <div class="offer-card">
    <card>
      <card-logo
        slot="media"
        :img-url="offer.tokenDetails.logoUrl"
        :logo-text="offer.tokenDetails.name"
      />
      <template slot="header">
        {{ offer.tokenDetails.name }}
      </template>
      <template slot="subhead">
        {{ 'offers-page.price'| globalize }}
        {{ fromWei(
          +offer.auctionDetails.highestBid || offer.auctionDetails.startPrice
        ) | formatMoney }}<br>
        {{ 'offers-page.buy-now-price'| globalize }}
        {{ fromWei(offer.auctionDetails.buyNowPrice) | formatMoney }}<br>
        {{ 'offers-page.time-left'| globalize }}
        <timer
          :end-time="
            (
              +offer.auctionDetails.startTime + +offer.auctionDetails.duration
            )*1000
          " />
      </template>
      <template slot="content">
        {{ offer.tokenDetails.description }}
      </template>
      <template slot="actions">
        <template v-if="isBidOpened">
          <bid-form
            :offer="offer"
            @submitted="$emit(EVENTS.bid); isBidOpened = false"
            @cancel="isBidOpened = false"
          />
        </template>
        <template v-else-if="offer.status === '3'">
          <button
            v-if="account === offer.auctionDetails.creator ||
              account === offer.auctionDetails.currentBidder
            "
            class="app__button-flat"
            :disabled="isDisabled"
            @click="$emit(EVENTS.claim)"
          >
            {{ 'offer-card.claim' | globalize }}
          </button>
        </template>
        <template v-else>
          <button
            v-ripple
            class="app__button-flat"
            :disabled="isDisabled"
            @click="isInfoOpened = true"
          >
            <i class="mdi mdi-information-outline" />
          </button>
          <button
            class="app__button-flat"
            :disabled="isDisabled"
            @click="$emit(EVENTS.buyNow, offer.id)"
          >
            {{ 'offer-card.buy-now' | globalize }}
          </button>
          <button
            class="app__button-flat"
            :disabled="isDisabled"
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
                {{ 'offers-page.name'| globalize }}
              </td>
              <td>
                {{ offer.tokenDetails.name }}
              </td>
            </tr>
            <tr>
              <td>
                {{ 'offers-page.description'| globalize }}
              </td>
              <td>
                {{ offer.tokenDetails.description }}
              </td>
            </tr>
            <tr>
              <td>
                {{ 'offers-page.price'| globalize }}
              </td>
              <td>
                {{ fromWei(
                  +offer.auctionDetails.highestBid ||
                    offer.auctionDetails.startPrice
                ) | formatMoney }}
              </td>
            </tr>
            <tr>
              <td>
                {{ 'offers-page.buy-now-price'| globalize }}
              </td>
              <td>
                {{ fromWei(offer.auctionDetails.buyNowPrice) | formatMoney }}
              </td>
            </tr>
            <tr>
              <td>
                {{ 'offers-page.time-left'| globalize }}
              </td>
              <td>
                <timer
                  :end-time="
                    (
                      +offer.auctionDetails.startTime +
                      +offer.auctionDetails.duration
                    )*1000
                  " />
              </td>
            </tr>
            <tr>
              <td>
                {{ 'offers-page.step'| globalize }}
              </td>
              <td>
                {{
                  +fromWei(offer.auctionDetails.bidIncrement) * 100 |
                    formatMoney
                }}%
              </td>
            </tr><tr>
              <td>
                {{ 'offers-page.img-url'| globalize }}
              </td>
              <td>
                <a :href="offer.tokenDetails.logoUrl">
                  Img
                </a>
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
import MetamaskMixin from '@/vue/mixins/metamask.mixin'
import Timer from '@/vue/common/Timer'

const EVENTS = {
  bid: 'bid',
  buyNow: 'buy-now',
  claim: 'claim',
}

export default {
  name: 'offer-card',
  components: {
    Card,
    CardLogo,
    BidForm,
    Drawer,
    Timer,
  },
  mixins: [MetamaskMixin],

  props: {
    offer: {
      type: Object,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      account: '',
      EVENTS,
      isBidOpened: false,
      isInfoOpened: false,
    }
  },
  async created () {
    this.account = await this.getAccount()
  },
}
</script>
