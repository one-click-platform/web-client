import Vue from 'vue'
import Router from 'vue-router'
import { vueRoutes } from '@/vue-router/routes'
// import { store, vuexTypes } from '@/vuex'

import AppContent from '@/vue/AppContent'

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
          path: '/assets',
          name: vueRoutes.assets.name,
          meta: {
            pageNameTranslationId: 'pages-names.assets',
          },
        },
      ],
    },
  ],
})

export default router

function redirectRouteGuard (to, from, next) {
  if (to.name === vueRoutes.app.name) {
    next(vueRoutes.assets)
  } else {
    next()
  }
}
