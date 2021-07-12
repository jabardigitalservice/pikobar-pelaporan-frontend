import Vue from 'vue'
import Router from 'vue-router'
import * as Sentry from '@sentry/core'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import dashboardRouter from './modules/dashboard'
import createReportRouter from './modules/createReport'
import listVerificationReportRouter from './modules/listVerificationReport'
import listReportRouter from './modules/listReport'
import rdtRouter from './modules/rdt'
import settingRouter from './modules/setting'
import distributionCaseRouter from './modules/distributionCase'
import submissionLogistikRouter from './modules/submissionLogistik'
import dailyReportRouter from './modules/dailyReport'
// import hospitalReferralRouter from './modules/hospitalReferral'
// import closeContactCase from './modules/closeContactCase'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/change-password',
    component: Layout,
    hidden: true,
    meta: {
      title: 'change_password'
    },
    children: [
      {
        path: '/change-password',
        component: () => import('@/views/changePassword/index'),
        hidden: true,
        meta: {
          title: 'change_password'
        }
      }
    ]
  },
  {
    path: '/user/update',
    component: Layout,
    hidden: true,
    meta: {
      title: 'update_profile'
    },
    children: [{
      path: '/user/update',
      component: () => import('@/views/user/editUser'),
      hidden: true,
      meta: {
        title: 'update_profile'
      }
    }]
  },
  {
    path: '/notification',
    component: Layout,
    hidden: true,
    meta: {
      title: 'notification'
    },
    children: [{
      path: '/notification-list-all',
      component: () => import('@/views/notifications/index'),
      hidden: true,
      meta: {
        title: 'notification'
      }
    }]
  },
  {
    path: '/laporan/queue',
    component: Layout,
    hidden: true,
    meta: {
      title: 'list_case'
    },
    children: [{
      path: '/laporan/queue-list-all',
      component: () => import('@/views/laporan/listQueue'),
      hidden: true,
      meta: {
        title: 'list_case'
      }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  rdtRouter,
  createReportRouter,
  listVerificationReportRouter,
  listReportRouter,
  dashboardRouter,
  distributionCaseRouter,
  dailyReportRouter,
  submissionLogistikRouter,
  // hospitalReferralRouter,
  settingRouter,
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/', hidden: true }
]

function createRouter() {
  const router = new Router({
  // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

  router.beforeEach(beforeEach)

  return router
}

const router = createRouter()

async function beforeEach(to, from, next) {
  Sentry.configureScope((scope) => {
    scope.setTransactionName(to.path)
  })
  next()
}
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
