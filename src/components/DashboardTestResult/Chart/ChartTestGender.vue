<template>
  <v-card
    class="chart-test-gender"
    outlined
  >
    <v-card-title class="title ml-0 black--text">
      {{ $t('label.comparison') }} {{ $t('label.gender') }}
    </v-card-title>
    <v-divider class="mt-0 mb-2" />
    <v-card-text>
      <chart-doughnut
        v-if="loaded"
        ref="doughnutChart"
        :chart-data="chartData"
        :options="chartOptions"
        :styles="chartStyles"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ChartTestGender',
  props: {
    tabActive: {
      type: String,
      default: null
    },
    params: {
      type: Object,
      default: null
    },
    chartHeight: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      loaded: false,
      chartData: {
        labels: [this.$t('label.female'), this.$t('label.male')],
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#F2C94C',
              '#27AE60'
            ]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 10
          },
          reverse: true
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (tooltipItem, data) => {
              return data.labels[tooltipItem.datasetIndex]
            },
            afterLabel: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex]
              var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue
              })
              var currentValue = dataset.data[tooltipItem.index]
              var percentage = Math.floor(((currentValue / total) * 100) + 0.5)
              return percentage + '%'
            }
          }
        },
        hover: {
          mode: 'nearest',
          animationDuration: 0,
          intersect: true
        },
        animation: {
          duration: 0,
          animateScale: true,
          animateRotate: true
        },
        responsiveAnimationDuration: 0
      }
    }
  },
  computed: {
    chartStyles() {
      return {
        height: `${this.chartHeight}px`,
        position: 'relative'
      }
    }
  },
  watch: {
    'tabActive': {
      handler(value) {
        this.tabActive = value
        this.getDataGender()
      },
      deep: true
    },
    'params': {
      handler(value) {
        this.getDataGender()
      },
      deep: true
    },
    '$refs'() {
      this.updateChart(this.chartData)
    }
  },
  async mounted() {
    await this.getDataGender()
  },
  methods: {
    setDataGender(male = 0, female = 0) {
      this.loaded = true
      this.chartData.datasets[0].data = [female, male]
      this.updateChart(this.chartData)
    },
    async getDataGender() {
      const res = await this.$store.dispatch('statistic/summaryTestResultGender', this.params)
      const { data } = res
      let male = 0
      let female = 0
      if (data.length > 0) {
        male = Array.isArray(data) ? data[0].male : 0
        female = Array.isArray(data) ? data[0].female : 0
      }
      this.setDataGender(male, female)
    },
    updateChart(data) {
      if (this.$refs.doughnutChart) {
        this.$refs.doughnutChart.renderChart(data, this.chartOptions)
        this.$refs.doughnutChart.update()
      }
    }
  }
}
</script>

<style lang="scss">
.chart-test-gender {
  .title {
    font-size: 16px !important;
  }
}
</style>
