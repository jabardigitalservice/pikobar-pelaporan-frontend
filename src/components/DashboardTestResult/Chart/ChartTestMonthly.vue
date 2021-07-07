<template>
  <v-card
    class="chart-test-daily"
    outlined
  >
    <v-card-title class="title ml-0 black--text">
      {{ $t('label.growth') }} {{ $t('label.total_test_result') }} {{ label }}
      <div
        v-if="tabActive === 'rapid'"
        class="sample d-flex ml-auto"
      >
        <div class="mr-3">{{ $t('label.sample_taken') }}</div>
        <v-checkbox
          v-model="sampleActive"
          class="vena pt-0 mr-3"
          :label="$t('label.vena')"
          value="vena"
          @change="filterSample()"
        />
        <v-checkbox
          v-model="sampleActive"
          class="kapiler pt-0"
          :label="$t('label.kapiler')"
          value="kapiler"
          @change="filterSample()"
        />
      </div>
    </v-card-title>
    <v-divider class="mt-0 mb-2" />
    <v-card-text>
      <chart-bar
        v-if="loaded"
        ref="barChart"
        :chart-data="chartData"
        :options="chartOptions"
        :styles="chartStyles"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ChartTestMonthly',
  props: {
    tabActive: {
      type: String,
      default: null
    },
    chartHeight: {
      type: Number,
      default: 300
    },
    testTools: {
      type: Array,
      default: function() { return [] }
    },
    dataTestMonthly: {
      type: Array,
      default: function() { return [] }
    },
    dataTestMonthlyRdt: {
      type: Array,
      default: function() { return [] }
    },
    dataTestMonthlyPcr: {
      type: Array,
      default: function() { return [] }
    }
  },
  data() {
    return {
      loaded: false,
      label: null,
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: false
              },
              scaleLabel: {
                display: false
              },
              ticks: {
                precision: 0
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                precision: 0,
                min: 0
              },
              gridLines: {
                drawBorder: false
              },
              scaleLabel: {
                display: true,
                labelString: this.$t('label.total_test_result')
              }
            }
          ]
        },
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            boxWidth: 10
          }
        },
        legendCallback: (chart) => {
          this.charts = chart
          this.legends = chart.data.datasets
        },
        tooltips: {
          displayColors: false,
          mode: 'index',
          intersect: false,
          tooltipCaretSize: 0
        }
      },
      chartStyles: {}
    }
  },
  computed: {
    optionsDataMontly: {
      get: function() {
        return this.dataTestMonthly
      },
      set: function(value) {
        this.$emit('update:testMonthlyData', value)
      }
    },
    sampleActive: {
      get: function() {
        return this.testTools
      },
      set: function(value) {
        this.$emit('update:filterTestTools', value)
      }
    },
    optionsDataMontlyRdt: {
      get: function() {
        return this.dataTestMonthlyRdt
      },
      set: function(value) {
        this.$emit('update:testMonthlyRdtData', value)
      }
    },
    optionsDataMontlyPcr: {
      get: function() {
        return this.dataTestMonthlyPcr
      },
      set: function(value) {
        this.$emit('update:testMonthlyPcrData', value)
      }
    }
  },
  watch: {
    'tabActive': {
      handler(value) {
        this.tabActive = value
        this.filterTab()
      },
      deep: true
    },
    '$refs'() {
      if (this.$refs.barChart) this.$refs.barChart.update()
    },
    optionsDataMontly(val) {
      this.filterTab()
    },
    optionsDataMontlyRdt() {
      this.filterTab()
    },
    optionsDataMontlyPcr() {
      this.filterTab()
    }
  },
  mounted() {
    this.filterTab()
  },
  methods: {
    filterTab() {
      this.loaded = false
      if (this.tabActive === 'rapid') {
        this.label = this.$t('label.rapid')
        this.getDataRapid()
      } else if (this.tabActive === 'pcr') {
        this.label = this.$t('label.pcr')
        this.getDataPCR()
      } else {
        this.label = null
        this.getDataAll()
      }
      this.loaded = true
    },
    filterSample() {
      this.updateChart(this.chartData)
    },
    getDataAll() {
      const listNameMonth = []
      const listRdt = []
      const listPcr = []

      this.setHeight(this.chartHeight)

      for (let index = 0; index < this.optionsDataMontly.length; index++) {
        listNameMonth.push(this.optionsDataMontly[index].name)
        listRdt.push(this.optionsDataMontly[index].rdt)
        listPcr.push(this.optionsDataMontly[index].pcr)
      }

      this.chartData.labels = listNameMonth

      this.chartData.datasets = []
      this.chartData.datasets.push(
        {
          label: this.$t('label.rapid_test_id'),
          backgroundColor: '#27AE60',
          hoverBackgroundColor: '#27AE60',
          data: listRdt
        },
        {
          label: this.$t('label.pcr'),
          backgroundColor: '#F2C94C',
          hoverBackgroundColor: '#F2C94C',
          data: listPcr
        }
      )

      if (this.$refs.barChart) this.updateChart(this.chartData)
    },
    getDataRapid() {
      if (this.$refs.barChart) this.$refs.barChart.$data._chart.destroy()

      const listNameMonth = []
      const listReaktif = []
      const listNonReaktif = []
      const listInkonkuslif = []

      for (let index = 0; index < this.optionsDataMontlyRdt.length; index++) {
        listNameMonth.push(this.optionsDataMontlyRdt[index].name)
        listReaktif.push(this.optionsDataMontlyRdt[index].reaktif)
        listNonReaktif.push(this.optionsDataMontlyRdt[index].non_reaktif)
        listInkonkuslif.push(this.optionsDataMontlyRdt[index].inkonkuslif)
      }

      this.chartData.labels = listNameMonth

      this.chartData.datasets = []
      this.chartData.datasets.push(
        {
          label: this.$t('label.reaktif'),
          backgroundColor: '#27AE60',
          hoverBackgroundColor: '#27AE60',
          data: listReaktif
        },
        {
          label: this.$t('label.non_reaktif'),
          backgroundColor: '#F2C94C',
          hoverBackgroundColor: '#F2C94C',
          data: listNonReaktif
        },
        {
          label: this.$t('label.inkonklusif'),
          backgroundColor: '#2F80ED',
          hoverBackgroundColor: '#2F80ED',
          data: listInkonkuslif
        }
      )

      if (this.$refs.barChart) this.updateChart(this.chartData)
    },
    getDataPCR() {
      if (this.$refs.barChart) this.$refs.barChart.$data._chart.destroy()

      const listNameMonth = []
      const listPositif = []
      const listNegaitf = []
      const listInvalid = []

      for (let index = 0; index < this.optionsDataMontlyPcr.length; index++) {
        listNameMonth.push(this.optionsDataMontlyPcr[index].name)
        listPositif.push(this.optionsDataMontlyPcr[index].positif)
        listNegaitf.push(this.optionsDataMontlyPcr[index].negaitf)
        listInvalid.push(this.optionsDataMontlyPcr[index].invalid)
      }

      this.chartData.labels = listNameMonth
      this.chartData.datasets = []
      this.chartData.datasets.push(
        {
          label: this.$t('label.positif'),
          backgroundColor: '#27AE60',
          hoverBackgroundColor: '#27AE60',
          data: listPositif
        },
        {
          label: this.$t('label.negatif'),
          backgroundColor: '#F2C94C',
          hoverBackgroundColor: '#F2C94C',
          data: listNegaitf
        },
        {
          label: this.$t('label.invalid'),
          backgroundColor: '#2F80ED',
          hoverBackgroundColor: '#2F80ED',
          data: listInvalid
        }
      )
      if (this.$refs.barChart) this.updateChart(this.chartData)
    },
    setHeight(total) {
      const limit = 8

      let height
      if (total > 0 && total <= limit) {
        height = '100%'
      } else if (total > limit && total <= limit * 2) {
        height = '200%'
      } else if (total > limit * 2 && total <= limit * 3) {
        height = '300%'
      } else if (total > limit * 3 && total <= limit * 4) {
        height = '400%'
      }

      this.chartStyles = {
        height,
        position: 'relative'
      }
    },
    updateChart(data) {
      if (this.$refs.barChart) {
        this.$refs.barChart.renderChart(data, this.chartOptions)
        this.$refs.barChart.update()
      }
    },
    randomNumber() {
      return Math.floor(Math.random() * 101)
    }
  }
}
</script>

<style lang="scss">
.chart-test-daily {
  .title {
    font-size: 16px !important;

    .sample {
      font-size: 0.875rem;
      font-weight: normal;

      .vena,
      .kapiler {
        margin-top: 2px;

        .v-input__slot {
          margin-bottom: 0;
        }

        .v-messages {
          display: none;
        }
      }
    }
  }
}
</style>
