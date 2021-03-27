<template>
  <div
    id="app"
    v-if="isAppInitialized"
    :key="lang">
    <template v-if="isLoadedMetamask">
      <div
        v-if="!isMetamaskConnected"
        class="app__metamask-form-wrp">
        <metamask-form />
      </div>
      <template v-else>
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
      </template>
    </template>
  </div>
</template>

<script>
import Navbar from '@/vue/navigation/Navbar.vue'
import Sidebar from '@/vue/navigation/Sidebar.vue'
import MetamaskForm from '@/vue/forms/MetamaskForm'

import MetamaskMixin from '@/vue/mixins/metamask.mixin'

import {
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
    MetamaskForm,
  },
  mixins: [MetamaskMixin],
  data: () => ({
    isAppInitialized: false,
    vueRoutes,
    lang: i18n.language,
    isSidebarOpen: false,
  }),

  computed: {
    isNavigationRendered () {
      return this.$route.matched.some(m => m.meta.isNavigationRendered)
    },
  },

  watch: {},

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

.app__metamask-form-wrp {
  width: 100%;
  padding: 5%;
}
</style>
