import Vue from 'vue'
import Vuetify, {
  VLayout, VRow, VCol, VCard, VBtn, VTabs, VTab, VTabItem, VSelect, VLabel, VTextField, VAutocomplete, VIcon, VCardText, VDivider,
  VCardActions, VListItem, VListItemTitle, VListItemContent, VListItemSubtitle, VListItemIcon, VSkeletonLoader, VMenu, VExpansionPanel,
  VExpansionPanelHeader, VExpansionPanelContent, VDialog, VProgressLinear, VRadio, VRadioGroup, VForm, VToolbar, VToolbarTitle
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VLayout, VRow, VCol, VCard, VBtn, VTabs, VTab, VTabItem, VSelect, VLabel, VTextField, VAutocomplete, VIcon, VCardText, VDivider,
    VCardActions, VListItem, VListItemTitle, VListItemContent, VListItemSubtitle, VListItemIcon, VSkeletonLoader, VMenu, VExpansionPanel,
    VExpansionPanelHeader, VExpansionPanelContent, VDialog, VProgressLinear, VRadio, VRadioGroup, VForm, VToolbar, VToolbarTitle
  },
  directives: {
    Ripple
  }
})

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#27AE60'
      },
      dark: {
        primary: '#27AE60'
      }
    }
  }
}

export default new Vuetify(opts)
