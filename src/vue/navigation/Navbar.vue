<template>
  <nav class="navbar">
    <div class="navbar__title-wrapper">
      <template v-if="$route.meta.pageSubnameTranslationId">
        <h3 class="navbar__sub-title">
          {{ $route.meta.pageSubnameTranslationId | globalize }}
        </h3>
      </template>
      <h2 class="navbar__title">
        {{ pageNameTranslationId | globalize }}
      </h2>
    </div>

    <div class="navbar__passport-wrp">
      {{ address }}
    </div>
  </nav>
</template>

<script>
import config from '@/config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import MetamaskMixin from '@/vue/mixins/metamask.mixin'

export default {
  name: 'navbar',
  mixins: [MetamaskMixin],
  data: _ => ({
    config,
    address: '',
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isLoggedIn,
    ]),
    pageNameTranslationId () {
      const pageNamePath = this.$route.matched
        .find(path => path.meta.pageNameTranslationId)
      if (pageNamePath) {
        return pageNamePath.meta.pageNameTranslationId
      } else {
        return ''
      }
    },
  },
  async created () {
    this.address = await this.getAccount()
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.navbar {
  width: 100%;
  background-color: $col-app-content-background;
  padding: 3.3rem $content-padding-right 2.1rem $content-padding-left;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include respond-to-custom($sidebar-hide-bp) {
    padding:
      3.3rem $content-side-paddings-sm
      2.1rem $content-side-paddings-sm + 5.2rem;
  }
}

.navbar__title {
  color: $col-text-page-heading;
  font-size: 4rem;
  line-height: 1.5;
  font-weight: 400;
  min-width: 15rem;

  @include respond-to-custom($sidebar-hide-bp) {
    font-size: 3.2rem;
  }
}

.navbar__sub-title {
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  font-weight: 400;
}
</style>
