import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import permission from './modules/permission'
import toast from './modules/toast'
import region from './modules/region'
import reports from './modules/reports'
import occupation from './modules/occupation'
import rdt from './modules/rdt'
import animationLottie from './modules/animationLottie'
import statistic from './modules/statistic'
import closeContactCase from './modules/closeContactCase'
import primaryDrawer from './modules/primaryDrawer'
import localTransmissionArea from './modules/localTransmissionArea'
import historyTravel from './modules/historyTravel'
import inspectionSupport from './modules/inspectionSupport'
import publicPlace from './modules/publicPlace'
import hospitalReferral from './modules/hospitalReferral'
import exportReports from './modules/exportReports'
import notifDrawer from './modules/notifDrawer'
import notifications from './modules/notifications'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    permission,
    occupation,
    reports,
    region,
    toast,
    user,
    rdt,
    animationLottie,
    statistic,
    closeContactCase,
    hospitalReferral,
    primaryDrawer,
    historyTravel,
    exportReports,
    localTransmissionArea,
    inspectionSupport,
    notifDrawer,
    notifications,
    publicPlace
  }
})

export default store
