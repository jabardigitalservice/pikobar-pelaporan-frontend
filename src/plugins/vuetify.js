import Vue from 'vue'
import Vuetify, {
  VLayout, VRow, VCol, VCard, VBtn, VDataTable, VDatePicker, VSimpleTable, VTabs, VTab, VTabItem, VSelect, VLabel, VTextField,
  VAutocomplete, VIcon, VCardText, VDivider, VStepper, VAppBar, VNavigationDrawer, VInput, VImg, VTooltip, VPagination, VSkeletonLoader,
  VAlert, VSnackbar, VCardActions, VListItem, VListItemTitle, VListItemContent, VListItemSubtitle, VListItemIcon, VMenu, VToolbarTitle,
  VExpansionPanel, VExpansionPanelHeader, VExpansionPanelContent, VDialog, VCheckbox, VProgressLinear, VRadio, VRadioGroup, VForm, VToolbar
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VLayout, VRow, VCol, VCard, VBtn, VDataTable, VDatePicker, VSimpleTable, VTabs, VTab, VTabItem, VSelect, VLabel, VTextField,
    VAutocomplete, VIcon, VCardText, VDivider, VStepper, VAppBar, VNavigationDrawer, VInput, VImg, VTooltip, VPagination, VSkeletonLoader,
    VAlert, VSnackbar, VCardActions, VListItem, VListItemTitle, VListItemContent, VListItemSubtitle, VListItemIcon, VMenu, VToolbarTitle,
    VExpansionPanel, VExpansionPanelHeader, VExpansionPanelContent, VDialog, VCheckbox, VProgressLinear, VRadio, VRadioGroup, VForm, VToolbar
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
