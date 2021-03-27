<template>
  <div>
    {{ time }}
  </div>
</template>

<script>
export default {
  name: 'wallet-send',
  components: {},
  mixins: [],
  props: {
    endTime: {
      type: [String, Number],
      required: true,
    },
  },
  data () {
    return {
      time: '',
      isLoaded: false,
      isLoadFailed: false,
      data: [],
      x: '',
      countDownDate: '',
    }
  },
  computed: {},
  watch: {
    endTime () {
      this.start()
    },
  },
  created () {
    this.start()
  },
  destroyed () {},
  methods: {
    start () {
      this.countDownDate = new Date(this.endTime).getTime()
      clearInterval(this.x)
      this.timer()
    },
    calcTime () {
      // Get today's date and time
      let now = new Date().getTime()

      // Find the distance between now and the count down date
      let distance = this.countDownDate - now

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24))
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Output the result in an element with id="demo"
      this.time = days + 'd ' + hours + ':' +
          minutes + ':' + seconds + ''

      // If the count down is over, write some text
      if (distance < 0) {
        this.time = '0:00:00'
        clearInterval(this.x)
        this.$emit('end')
      }
    },
    timer () {
      this.x = setInterval(this.calcTime, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
</style>
