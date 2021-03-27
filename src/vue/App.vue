<template>
  <div
    id="app"
    v-if="isAppInitialized"
    :key="lang">
    <template v-if="isNavigationRendered">
      <div
        class="app__container"
        :class="{'app__container--fixed': isSidebarOpen}"
      >
        <sidebar
          @open="isSidebarOpen = true"
          @close="isSidebarOpen = false"
        />

        <div
          class="app__main-content"
          :class="{'app__container--fixed': isSidebarOpen}"
        >
          <div class="app__navbar">
            <navbar />
          </div>

          <div class="app__main">
            <router-view />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import Navbar from '@/vue/navigation/Navbar.vue'
import Sidebar from '@/vue/navigation/Sidebar.vue'

import { api } from '@/api'

import {
  mapGetters,
  mapMutations,
} from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'
import { i18n } from '@/i18n'

export default {
  name: 'app',

  components: {
    Navbar,
    Sidebar,
  },

  data: () => ({
    isAppInitialized: false,
    vueRoutes,
    lang: i18n.language,
    isSidebarOpen: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isLoggedIn,
      vuexTypes.token,
    ]),
    isNavigationRendered () {
      return this.$route.matched.some(m => m.meta.isNavigationRendered)
    },
  },

  watch: {
    isLoggedIn (value) {
      if (!document.hasFocus() || !value) {
        location.reload()
      }
    },
  },

  async created () {
    this.setAppTitle()
    await this.initApp()
    i18n.onLanguageChanged(lng => (this.lang = lng))
    this.watchChangesInLocalStorage()

    this.isAppInitialized = true
  },

  methods: {
    ...mapMutations({
      popState: vuexTypes.POP_STATE,
    }),
    async initApp () {
      // TODO: should be done before the app rendered
      if (this[vuexTypes.isLoggedIn]) {
        api.useToken(this.token)
      }
    },

    watchChangesInLocalStorage () {
      window.onstorage = (storage) => {
        const isSameStorageKey = storage.key === config.STORAGE_KEY
        if ((this[vuexTypes.isLoggedIn] ||
          storage.newValue !== storage.oldValue) &&
          isSameStorageKey) {
          this.popState()
        }
      }
    },

    setAppTitle () {
      document.title = config.APP_NAME
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.app__container {
  display: flex;
  align-items: stretch;
  overflow-x: hidden;
  flex: 1;
}

.app__container--fixed {
  max-height: 100vh;
  overflow: hidden;
}

.app__main-content {
  flex: 1;
  overflow: hidden;
}

.app__navbar {
  position: relative;
  z-index: $z-app-navbar;
  min-height: 6.4rem;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property:
    opacity,
    background-color,
    box-shadow,
    transform,
    color,
    min-height,
    -webkit-transform;
  will-change:
    opacity,
    background-color,
    box-shadow,
    transform,
    color,
    min-height;
}

.app__main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding:
    $content-padding-top
    $content-padding-right
    $content-padding-bottom
    $content-padding-left;
  background-color: $col-app-content-background;

  @include respond-to-custom($sidebar-hide-bp) {
    width: 100vw;
    padding: 0 $content-side-paddings-sm 3rem;
  }
}

.app__warning-message-link {
  margin-left: 0.4rem;
  color: $col-message-box-text;
  font-size: 1.6rem;
}
</style>
