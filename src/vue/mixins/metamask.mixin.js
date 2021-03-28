import Web3 from 'web3'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Bus } from '@/js/helpers/event-bus'
import config from '@/config'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { auctionABI } from '@/js/const/auctionAbi.const.js'
import { tokenABI } from '@/js/const/erc721.const.js'
import { wethAbi } from '@/js/const/weth.const.js'

export default {
  data: _ => ({
    isMetamaskProcessing: false,
    isMetamaskConnected: false,
    isMetamaskEnabled: false,
    isLoadedMetamask: false,
  }),

  computed: {},

  async created () {
    await this.enableMetamask()
    this.isLoadedMetamask = true
  },

  methods: {
    BN (value) {
      return new BigNumber(value)
    },
    toWei (value) {
      const amount = this.BN(value)
      const a = this.BN(10 ** 18)
      return amount.multipliedBy(a)
        .toFixed()
    },

    fromWei (value) {
      const amount = this.BN(value)
      const a = this.BN(10 ** 18)
      return amount.dividedBy(a)
        .toFixed()
    },
    async approve721 (account, auctionAddress, tokenId) {
      const contract = new window.web3.eth.Contract(
        tokenABI,
        config.TOKEN_ADDRESS
      )
      await contract.methods.approve(auctionAddress, tokenId).send({
        from: account,
      })
    },
    async approveErc20 (account, auctionAddress, amount) {
      const contract = new window.web3.eth.Contract(
        wethAbi,
        config.CURRENCY_ADDRESS
      )
      await contract.methods.approve(auctionAddress, amount).send({
        from: account,
      })
    },
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

      await this.checkIfMetamaskIsConnected()
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
        ids.map(id => this.getTokenDataById(id))
      )
      return tokens
    },

    async getTokenDataById (id) {
      const contract = new window.web3.eth.Contract(
        tokenABI,
        config.TOKEN_ADDRESS
      )
      const data = await contract.methods.tokensData(id).call()
      return { id, ...JSON.parse(data) }
    },

    async getOffers () {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const offerEvents = await contract.getPastEvents('AuctionCreated', { fromBlock: 0, toBlock: 'latest' })
      const offerIds = offerEvents.map(evt => evt.returnValues._auctionId)
      const offers = await Promise.all(
        offerIds.map(id => this.getOfferDataById(id))
      )
      return offers.filter(
        i => i.status === '2' || i.status === '3'
      )
    },

    async getOfferDataById (id) {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const status = await contract.methods.getStatus(id).call()
      const details = await contract.methods.getAuctionInfo(id).call()
      const tokenData = await this.getTokenDataById(details.tokenId)
      return {
        id,
        status,
        auctionDetails: details,
        tokenDetails: tokenData,
      }
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
      const startTime = moment(startDate).unix()
      const duration = moment(endDate).diff(moment(startDate), 'seconds')

      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const account = await this.getAccount()

      await this.approve721(account, config.AUCTION_ADDRESS, tokenId)

      const auction = contract.methods.createAuction(
        config.TOKEN_ADDRESS,
        tokenId,
        config.CURRENCY_ADDRESS,
        this.toWei(minPrice),
        this.toWei(priceForBuyNow),
        startTime,
        duration,
        30, // durationIncrement seconds
        this.BN(1e+16).multipliedBy(step), // bidIncrement
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

    async buyNow (auctionId, price) {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )

      const account = await this.getAccount()

      await this.approveErc20(account, config.AUCTION_ADDRESS, price)
      const auction = contract.methods.buyNow(auctionId)
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        auction.send({ from: account })
          .on('transactionHash', async () => {
            resolve()
          })
          .on('error', err => reject(err))
      })
    },

    async createBid (id, amount) {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const account = await this.getAccount()
      const price = this.toWei(amount)
      await this.approveErc20(account, config.AUCTION_ADDRESS, price)
      const auction = contract.methods.bid(
        id,
        price
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

    async claimRepayment (id) {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const account = await this.getAccount()
      const auction = contract.methods.claimRepayment(id)
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        auction.send({ from: account })
          .on('transactionHash', async () => {
            resolve()
          })
          .on('error', err => reject(err))
      })
    },

    async claimLot (id) {
      const contract = new window.web3.eth.Contract(
        auctionABI,
        config.AUCTION_ADDRESS
      )
      const account = await this.getAccount()
      const auction = contract.methods.claimLot(id)
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
