<template>
  <div>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        Errormsg
      </template>

      <template v-else>
        <template v-if="data">
          Assets
        </template>

        <template v-else>
          No data
        </template>
      </template>
    </template>

    <template v-else>
      Loader...
    </template>
  </div>
</template>

<script>
export default {
  name: 'wallet-send',
  components: {},
  mixins: [],
  props: {},
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      data: [],
    }
  },
  computed: {},
  watch: {},
  created () {},
  destroyed () {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
</style>
