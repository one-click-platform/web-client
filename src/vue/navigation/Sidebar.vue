<template>
  <div class="sidebar">
    <div
      class="sidebar__backdrop"
      :class="{ 'sidebar__backdrop--active': isOpened }"
      @click="closeSidebar"
    />

    <button
      @click="openSidebar"
      class="sidebar__burger-btn"
      :class="{ 'sidebar__burger-btn--sidebar-active': isOpened }"
    >
      <i class="mdi mdi-menu sidebar__burger-btn-icon" />
    </button>

    <aside
      class="sidebar__aside"
      :class="{
        'sidebar__aside--closed': !isOpened,
        'sidebar__aside--open': isOpened
      }"
    >
      <section class="sidebar__logo-section">
        <logo
          class="sidebar__logo"
          @click.native="closeSidebar"
        />
      </section>

      <section class="sidebar__links-section">
        <nav class="sidebar__links-group">
          <router-link
            key="tokens"
            class="sidebar__link"
            @click.native="closeSidebar"
            tag="a"
            :to="vueRoutes.tokens"
          >
            <i
              class="sidebar__link-icon"
              :class="`mdi mdi-coins`"
            />
            <span>
              {{ 'pages-names.tokens' | globalize }}
            </span>
          </router-link>
          <router-link
            key="offers"
            class="sidebar__link"
            @click.native="closeSidebar"
            tag="a"
            :to="vueRoutes.offers"
          >
            <i
              class="sidebar__link-icon"
              :class="`mdi mdi-periodic-table`"
            />
            <span>
              {{ 'pages-names.offers' | globalize }}
            </span>
          </router-link>
        </nav>
      </section>

      <section class="sidebar__footer-section">
        {{ address }}
      </section>
    </aside>
  </div>
</template>

<script>
import Logo from '@/vue/assets/Logo'

import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'
import MetamaskMixin from '@/vue/mixins/metamask.mixin'

const EVENTS = {
  open: 'open',
  close: 'close',
}

export default {
  name: 'sidebar',

  components: {
    Logo,
  },

  mixins: [MetamaskMixin],
  data: () => ({
    isOpened: false,
    config,
    vueRoutes,
    address: '',
  }),

  computed: {},
  async created () {
    this.address = await this.getAccount()
  },

  methods: {
    openSidebar () {
      this.isOpened = true
      this.$emit(EVENTS.open)
    },

    closeSidebar () {
      this.isOpened = false
      this.$emit(EVENTS.close)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

// we cannot wrap all the the contents into a wrapper because the links should
// take the full width of the aside when recolored
$content-item-left-padding: 4rem;
$content-item-right-padding: 2.4rem;

.sidebar {
  position: relative;
  background-color: $col-sidebar-background;
  border-bottom: 0.1rem solid $color-border;
}

.sidebar__backdrop {
  @include respond-to-custom($sidebar-hide-bp) {
    position: fixed;
    left: -100%;
    top: 0;
    z-index: $z-sidebar-backdrop;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.sidebar__backdrop--active {
  left: $sidebar-width;
  opacity: 1;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.sidebar__burger-btn {
  position: absolute;
  left: 0.5rem;
  top: 4.1rem;
  z-index: $z-sidebar-burger;
  width: 4rem;
  height: 4rem;
  margin-right: 0;
  margin-left: 0.8rem;
  border: none;
  outline: none;
  border-radius: 50%;
  background-color: $col-button-flat-txt;
  transform: translateX($sidebar-width);
  opacity: 0;
  cursor: pointer;
  color: $col-sidebar-burger-icon-color;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar__burger-btn-icon {
  display: flex;
  justify-content: center;
  font-size: 2.6rem;
}

.sidebar__burger-btn--sidebar-active {
  transform: translateX($sidebar-width);
}

.sidebar__aside {
  width: 100%;
  min-height: 100%;
  z-index: $z-sidebar;
  list-style: none;
  display: flex;
  align-items: center;
  padding: 2rem 6.5rem 2rem 5rem;

  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 1;
    background-color: $col-sidebar-background-media-small;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.sidebar__aside--closed {
  @include respond-to-custom($sidebar-hide-bp) {
    opacity: 0;
    width: 0;
    visibility: hidden;
  }
}

.sidebar__aside--open {
  @include respond-to-custom($sidebar-hide-bp) {
    max-height: 100vh;
    overflow: scroll;
    padding-bottom: 10rem;
    z-index: $z-sidebar;
  }
}

.sidebar__logo-section {
  @include respond-to-custom($sidebar-hide-bp) {
    .sidebar__aside--closed & {
      display: none;
    }
  }
}

.sidebar__logo {
  max-width: 9.5rem;
  width: 100%;
  display: block;
}

.sidebar__scheme-label-section {
  padding: 1.6rem $content-item-right-padding 0 $content-item-left-padding;
}

.sidebar__scheme-label {
  font-size: 1.2rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08rem;
  color: $col-sidebar-scheme-label;
}

.sidebar__links-section {
  width: 100%;
  display: flex;

  @include respond-to-custom($sidebar-hide-bp) {
    .sidebar__aside--closed & {
      display: none;
    }
  }
}

.sidebar__links-group {
  display: flex;
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.sidebar__links-group-title {
  padding: 0 $content-item-right-padding 0 $content-item-left-padding;
  opacity: 0.7;
  font-size: 1.4rem;
  margin-bottom: 0.2rem;
  color: $col-footer-text;
}

.sidebar__link {
  display: flex;
  align-items: center;
  min-height: 4.8rem;
  padding: 0 $content-item-right-padding 0 $content-item-left-padding;
  cursor: pointer;
  color: $col-sidebar-text;
  text-decoration: none;

  span {
    font-size: 2.2rem;
  }

  &:hover {
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__link.router-link-active {
  background-color: $col-sidebar-active-elem-background;
  color: $col-sidebar-active-elem-text;
  pointer-events: none;
}

.sidebar__link-icon {
  margin-right: 2rem;
  color: $col-sidebar-text;
  font-size: 2.6rem;

  .router-link-active & {
    color: $col-sidebar-active-elem-text;
  }
}

.sidebar__footer-section {
  @include respond-to-custom($sidebar-hide-bp) {
    .sidebar__aside--closed & {
      display: none;
    }
  }
}
</style>
