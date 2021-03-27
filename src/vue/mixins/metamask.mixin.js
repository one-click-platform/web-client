import Web3 from 'web3'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Bus } from '@/js/helpers/event-bus'
import config from '@/config'
import moment from 'moment'
import { auctionABI } from '@/js/const/auctionAbi.const.js'

const MAIN_CHAIN_ID = '0x1'
const MAIN_NETWORK_TYPE = 'main'

export default {
  data: _ => ({
    isMetamaskProcessing: false,
    isMetamaskConnected: false,
    isMetamaskEnabled: false,
    isMainNet: false,
  }),

  computed: {},

  async created () {
    await this.enableMetamask()
  },

  methods: {
    async connectMetamask () {
      await this.enableMetamask()
      if (this.isMetamaskConnected || !this.isMetamaskEnabled) return

      if (this.isMetamaskEnabled) {
        const { ethereum } = window
        const opts = {
          method: 'eth_requestAccounts',
        }

        try {
          this.isMetamaskProcessing = true
          await ethereum.request(opts)
        } catch (e) {
          ErrorHandler.processWithoutFeedback(e)
        }
        this.isMetamaskProcessing = false
      } else {
        Bus.error('metamask-mixin.not-installed-error-msg')
      }
    },

    async enableMetamask () {
      const { ethereum } = window
      if (!ethereum) return

      window.web3 = new Web3(ethereum)
      this.isMetamaskEnabled = true

      ethereum.on('accountsChanged', async () => {
        await this.checkIfMetamaskIsConnected()
      })

      ethereum.on('chainChanged', async () => {
        this.checkIfMainnet()
      })

      await this.checkIfMainnet()
      await this.checkIfMetamaskIsConnected()
    },

    async checkIfMainnet () {
      // If we use testing instance, we'd count any network as main but in case
      // of Buy offer we need to use only main net
      this.isMainNet = config.ETHEREUM_NETWORK_TYPE === MAIN_NETWORK_TYPE
        ? window.ethereum.chainId === MAIN_CHAIN_ID
        : true
      if (!this.isMainNet) {
        Bus.error('metamask-mixin.chain-error')
      }
    },

    async checkIfMetamaskIsConnected () {
      if (!window.ethereum) return
      this.isMetamaskConnected = Boolean(await this.getAccount())
    },

    async getAccount () {
      if (!this.isMetamaskEnabled) return

      const accounts = await window.web3.eth.getAccounts()

      if (!accounts.length) this.isMetamaskConnected = false

      return accounts[0]
    },

    async createToken () {
      const contract = new window.web3.eth.Contract('ABI')
      const account = await this.getAccount()

      const t = contract.methods.createToken()

      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        t.send({ from: account })
          .on('transactionHash', async () => {
            resolve()
          })
          .on('error', err => reject(err))
      })
    },

    async getOffers () {
      const contract = new window.web3.eth.Contract(auctionABI)
      const offerEvents = await contract.getPastEvents('AuctionCreated', { fromBlock: 0, toBlock: 'latest' })
      const offerIds = offerEvents.map(evt => evt.returnValues._id)

      const offers = await Promise.all(
        offerIds.map(id => this.getOfferDataById(id))
      )
      return offers.filter(i => i.status === 2) // 2 active status
    },

    async getOfferDataById (id) {
      const contract = new window.web3.eth.Contract(auctionABI)
      const status = contract.getStatus(id)
      const details = contract.getAuctionInfo(id)
      return { status, ...details }
    },

    async createOffer (
      tokenId,
      minPrice,
      priceForBuyNow,
      startDate,
      endDate,
      step,
      description
    ) {
      const startTime = (moment(startDate).unix() / 1000).toFixed()
      const duration = moment(endDate).diff(moment(startDate), 'seconds')

      const contract = new window.web3.eth.Contract(auctionABI)
      const account = await this.getAccount()

      const auction = contract.methods.createAuction(
        '0xCebdFCB1df185395c59e4C4Eac88397D22e042Db', // assetAddress
        tokenId || 1,
        '0xCebdFCB1df185395c59e4C4Eac88397D22e042Db', // currencyAddress
        minPrice,
        priceForBuyNow,
        startTime,
        duration,
        30, // durationIncrement seconds
        step, // bidIncrement
        description,
      )

      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        auction.send({ from: account })
          .on('transactionHash', async () => {
            resolve()
          })
          .on('error', err => reject(err))
      })
    },
  },
}
