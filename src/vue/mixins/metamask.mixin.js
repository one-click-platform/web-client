import Web3 from 'web3'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Bus } from '@/js/helpers/event-bus'
import config from '@/config'
import moment from 'moment'
import { auctionABI } from '@/js/const/auctionAbi.const.js'
import { tokenABI } from '@/js/const/tokenAbi.const.js'

const MAIN_CHAIN_ID = '0x1'
const MAIN_NETWORK_TYPE = 'main'

export default {
  data: _ => ({
    isMetamaskProcessing: false,
    isMetamaskConnected: false,
    isMetamaskEnabled: false,
    isMainNet: false,
    isLoadedMetamask: false,
  }),

  computed: {},

  async created () {
    await this.enableMetamask()
    this.isLoadedMetamask = true
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

    async createToken (data) {
      const contract = new window.web3.eth.Contract(
        tokenABI,
        config.TOKEN_ADDRESS
      )
      const account = await this.getAccount()
      const mint = contract.methods.mint(account, JSON.stringify(data))

      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        mint.send({ from: account })
          .on('transactionHash', async () => {
            resolve()
          })
          .on('error', err => reject(err))
      })
    },

    async getTokens () {
      const contract = new window.web3.eth.Contract(
        tokenABI,
        config.TOKEN_ADDRESS
      )
      const account = await this.getAccount()
      const ids = await contract.methods.tokensOfOwner(account).call()
      const tokens = await Promise.all(
        ids.map(async id => {
          const data = await contract.methods.tokensData(id).call()
          return { id, ...JSON.parse(data) }
        })
      )
      return tokens
    },

    async getOffers () {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const offerEvents = await contract.getPastEvents('AuctionCreated', { fromBlock: 0, toBlock: 'latest' })
      const offerIds = offerEvents.map(evt => evt.returnValues._id)

      const offers = await Promise.all(
        offerIds.map(id => this.getOfferDataById(id))
      )
      return offers.filter(i => i.status === 2) // 2 active status
    },

    async getOfferDataById (id) {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
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

      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const account = await this.getAccount()

      const auction = contract.methods.createAuction(
        config.TOKEN_ADDRESS,
        tokenId,
        config.CURRENCY_ADDRESS,
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
