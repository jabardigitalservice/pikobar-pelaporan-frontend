// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { Vue2Dragula } from 'vue2-dragula'
import VmBackTop from 'vue-multiple-back-top'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import VueMoment from 'vue-moment'
import * as VeeValidate from 'vee-validate'
import moment from 'moment'
import 'moment/locale/id'
import infiniteScroll from 'vue-infinite-scroll'
import FlagIcon from 'vue-flag-icon'
import VueAnalytics from 'vue-analytics'
import vueDebounce from 'vue-debounce'

moment.locale('id')

import * as firebase from './plugins/firebase'
import vuetify from './plugins/vuetify'
Vue.config.performance = process.env.NODE_ENV === 'development'

import App from './App'
import store from './store'
import router from './router'

import './components' // include all components
import '@/styles' // include all css files
import './permission' // permission control
import '@/utils/vee-validate' // include all validate form
import i18n from './lang' // Internationalization
import '@/helpers/filters' // include all filters
import Sentry from './plugins/sentry' // sentry
import VueHtml2Canvas from 'vue-html2canvas'
import './registerServiceWorker'

Vue.use(vueDebounce, {
  listenTo: 'input'
})

Vue.use(VueHtml2Canvas)
Vue.use(FlagIcon)
Vue.use(Vue2Dragula)
Vue.use(VueBreadcrumbs)
Vue.use(Sentry)
Vue.component(VmBackTop.name, VmBackTop)

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(VueMoment, {
  moment
})

Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_ANALYTICS,
  router
})

Vue.use(VeeValidate, {
  i18n
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  firebase,
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App)
})
