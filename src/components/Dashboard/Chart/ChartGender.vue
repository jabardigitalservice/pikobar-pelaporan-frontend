<template>
  <v-skeleton-loader
    :loading="loading"
    type="article"
  >
    <v-card
      class="chart mx-auto"
      outlined
    >
      <v-card-title class="title ml-0 mb-3 black--text">
        {{ $t("label.gender") }}
      </v-card-title>
      <v-card-subtitle>
        <v-col
          cols="auto"
          class="pa-0"
        >
          <select-status
            :selected-status="selectedStatus"
            :on-select-status="onSelectStatus"
          />
        </v-col>
      </v-card-subtitle>
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
  </v-skeleton-loader>
</template>

<script>
export default {
  name: 'ChartGender',
  props: {
    chartHeight: {
      type: Number,
      default: 300
    },
    listQuery: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
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
              var newValue = dataset.data[tooltipItem.index]
              var percentage = Math.floor(((newValue / total) * 100) + 0.5)
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
      },
      params: null,
      selectedStatus: 'POSITIF-0'
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
    listQuery: {
      handler(value) {
        this.params = value
        this.getStatisticAge()
      },
      deep: true
    },
    $refs() {
      this.$refs.doughnutChart.update()
    }
  },
  mounted() {
    this.loaded = true
    this.params = this.listQuery
    this.getStatisticAge()
  },
  methods: {
    async getStatisticAge() {
      this.params.status_patient = (this.selectedStatus === 'POSITIF-0') ? null : this.selectedStatus

      this.loading = true
      const res = await this.$store.dispatch('statistic/countAgeGender', this.params)

      if (res) this.loading = false

      const array = []
      array.push(res.data.chart_by_gender.P)
      array.push(res.data.chart_by_gender.L)

      this.chartData.datasets[0].data = array
    },
    async onSelectStatus(value) {
      this.selectedStatus = value
      this.getStatisticAge()
    }
  }
}
</script>

<style>
.chart .title {
  text-transform: none;
}
</style>
