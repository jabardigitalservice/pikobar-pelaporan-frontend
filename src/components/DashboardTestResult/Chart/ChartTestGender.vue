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
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (tooltipItem, data) => {
              return data['labels'][tooltipItem[0]['index']]
            },
            label: (tooltipItem, data) => {
              return 'Jumlah: ' + data['datasets'][0]['data'][tooltipItem['index']]
            },
            afterLabel: (tooltipItem, data) => {
              var dataset = data.datasets[tooltipItem.datasetIndex]
              var total = dataset.data.reduce((previousValue, currentValue, currentIndex, array) => {
                return previousValue + currentValue
              })
              var value = dataset.data[tooltipItem.index]
              var percentage = Math.floor(((value / total) * 100) + 0.5)
              return 'Persen: ' + percentage + '%'
            }
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
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
        this.$refs.doughnutChart.update()
      },
      deep: true
    },
    '$refs'() {
      this.$refs.doughnutChart.update()
    }
  },
  mounted() {
    this.getDataGender()
  },
  methods: {
    async getDataGender() {
      this.loaded = true

      const array = []
      array.push(this.randomNumber())
      array.push(this.randomNumber())

      this.chartData.datasets[0].data = array
    },
    randomNumber() {
      return Math.floor(Math.random() * 201)
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
