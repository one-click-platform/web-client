import Vue from 'vue'
import Router from 'vue-router'
import { vueRoutes } from '@/vue-router/routes'
// import { store, vuexTypes } from '@/vuex'

import AppContent from '@/vue/AppContent'
import TokensPage from '@/vue/pages/TokensPage'
import OffersPage from '@/vue/pages/OffersPage'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: vueRoutes.app.name,
      meta: { isNavigationRendered: true },
      component: AppContent,
      beforeEnter: redirectRouteGuard,
      children: [
        {
          path: '/tokens',
          name: vueRoutes.tokens.name,
          component: TokensPage,
          meta: {
            pageNameTranslationId: 'pages-names.tokens',
          },
        },
        {
          path: '/auction',
          name: vueRoutes.offers.name,
          component: OffersPage,
          meta: {
            pageNameTranslationId: 'pages-names.offers',
          },
        },
      ],
    },
  ],
})

export default router

function redirectRouteGuard (to, from, next) {
  if (to.name === vueRoutes.app.name) {
    next(vueRoutes.tokens)
  } else {
    next()
  }
}
