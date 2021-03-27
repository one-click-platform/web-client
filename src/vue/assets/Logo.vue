<template>
  <router-link
    class="logotype"
    :to="vueRoutes.tokens">
    4+2
  </router-link>
</template>

<script>
import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'

export default {
  data: _ => ({
    vueRoutes,
    config,
  }),
}
</script>

<style lang="scss">
@import '@/scss/variables';

.logotype {
  font-size: 4rem;
  line-height: 1.5;
  font-weight: 400;
  color: $col-primary;
  text-decoration: none;
}
</style>
