<template>
  <v-row>
    <v-col auto>
      <v-data-table
        :key="list.length"
        :headers="tableHeaders"
        :items="list"
        :mobile-breakpoint="0"
        :no-data-text="$t('label.data_empty')"
        :items-per-page="listQuery.limit"
        hide-default-footer
      >
        <template slot="body.append">
          <tr class="footer-totals">
            <th scope="col" class="footer-title">Total</th>
            <th scope="col" class="footer-title">{{ sumField('otg_proses') }}</th>
            <th scope="col" class="footer-title">{{ sumField('otg_selesai') }}</th>
            <th scope="col" class="footer-title">{{ sumField('odp_proses') }}</th>
            <th scope="col" class="footer-title">{{ sumField('odp_selesai') }}</th>
            <th scope="col" class="footer-title">{{ sumField('pdp_proses') }}</th>
            <th scope="col" class="footer-title">{{ sumField('pdp_selesai') }}</th>
            <th scope="col" class="footer-title">{{ sumField('positif_aktif_proses') }}</th>
            <th scope="col" class="footer-title">{{ sumField('positif_sembuh_selesai') }}</th>
            <th scope="col" class="footer-title">{{ sumField('positif_meninggal_selesai') }}</th>
            <th scope="col" class="footer-title">{{ sumField('grand_total') }}</th>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DailyReportTable',
  props: {
    list: {
      type: Array,
      default: null
    },
    listQuery: {
      type: Object,
      default: null
    },
    tableHeaders: {
      type: Array,
      default: null
    }
  },
  methods: {
    sumField(key) {
      // sum data in give key (property)
      return this.list.reduce((a, b) => a + (b[key] || 0), 0)
    }
  }
}
</script>

<style scoped>
  .footer-totals {
    font-size: 14px;
    color: #FFFFFF;
    background-color: #27AE60;
  }
  .footer-title {
    font-size: 14px;
  }
  .v-data-table tr:hover:not(.v-table__expanded__content) {
    background: #27AE60 !important;
  }
</style>
