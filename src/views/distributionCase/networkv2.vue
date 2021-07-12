<template>
  <div>
    <div class="container-network-filter border-bottom">
      <v-row class="content mx-2 mt-2 mb-2">
        <v-col
          cols="12"
          lg="8"
          md="12"
        >
          <div class="d-flex header">
            <div class="title-box" />
            <div class="c-title">{{ $t('label.distribution_case_network') }}</div>
          </div>
        </v-col>
      </v-row>
      <v-row class="filter-layer mx-2">
        <v-col
          cols="12"
          md="8"
          class="pt-0"
        >
          <address-region
            :district-code="listQuery.address_district_code"
            :district-name="district_name_user"
            :code-district.sync="listQuery.address_district_code"
            :sub-district-code="listQuery.address_subdistrict_code"
            :code-sub-district.sync="listQuery.address_subdistrict_code"
            :village-code="listQuery.address_village_code"
            :code-village.sync="listQuery.address_village_code"
            :village-name="nameVillage"
            :name-village.sync="nameVillage"
            :disabled-district="disabledDistrict"
            :disabled-address="false"
            :required-address="false"
            :is-label="false"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
          sm="12"
        >
          <v-btn
            block
            color="grey darken-3"
            class="button button-action white--text"
            @click="onReset"
          >
            {{ $t('label.reset') }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            block
            outlined
            :loading="isLoading"
            color="primary"
            class="button button-action white--text"
            @click="onPrintPNG"
          >
            <span class="green--text">{{ $t('label.export_png') }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="container-network relative">
      <div
        class="sidebar-network network-sidebar left"
        :class="sidebarActive ? 'visible' : ''"
      >
        <div
          id="sidebar-network"
          class="leaflet-control d-flex flex-column flex-auto"
        >
          <div class="sidebar-content flex-auto overflow-auto pa-5">
            <a
              class="close outline-none"
              @click="onClose()"
            >×</a>
            <div class="d-flex mb-3">
              <div class="mr-3">
                <img
                  :src="getImgUrl()"
                  width="60px"
                  alt="Img-Url"
                >
              </div>
              <div>
                <div class="mb-1"><strong>{{ detail.id_case }}</strong></div>
                <div>
                  <status :status="detail.status" />
                </div>
              </div>
            </div>
            <div class="mb-3">
              <span class="c-label">Status</span> <br>
              <strong class="dead">{{ detail.final_result }}</strong>
            </div>
            <div class="mb-3">
              <span class="c-label">Jenis Kelamin</span> <br>
              <strong v-if="detail.gender ==='P'">
                {{ $t('label.female') }}
              </strong>
              <strong v-else>
                {{ $t('label.male') }}
              </strong>
            </div>
            <div class="mb-3">
              <span class="c-label">Usia</span> <br>
              <strong>{{ detail.age }} Tahun</strong>
            </div>
            <div class="mb-3">
              <span class="c-label">Tanggal Muncul Gejala</span> <br>
              <strong>{{ detail.first_symptom_date ? $moment(detail.first_symptom_date).locale('id').format('DD MMMM YYYY'):'-' }}</strong>
            </div>
            <div class="mb-3">
              <span class="c-label">Lokasi Saat Ini</span> <br>
              <strong v-if="detail.current_location_address">
                {{ detail.current_location_address }}
              </strong>
              <strong v-else>
                -
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div ref="printNetworkCase" class="content">
        <network
          id="network"
          ref="network"
          class="network-content"
          :style="{ transform: 'translate3d(' + sidebarTransform + 'px, 0px, 0px)' }"
          :nodes="network.nodes"
          :edges="network.edges"
          :options="network.options"
          :events="['selectNode', 'hoverNode']"
          @start-stabilizing="onStabilizationProgress()"
          @stabilized="onStabilizationDone()"
          @select-node="onNodeSelected($event)"
          @deselect-node="onNodeDeselected()"
        />
        <div
          v-if="loadingNetwork"
          class="network-loading d-flex align-center justify-center"
        >
          <div class="text-center">
            <v-progress-circular
              indeterminate
              color="black"
            />
            <div class="mt-3">Harap Tunggu</div>
          </div>
        </div>
        <dialog-cache-disclaimer
          :disclaimer="disclaimer"
          :data-date-version="dataDateVersion"
          :on-disclaimer="onDisclaimer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { mapGetters } from 'vuex'
import { Network } from 'vue-vis-network'
import { rolesWidget } from '@/utils/constantVariable'
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'DistributionCaseNetworkV2',
  components: {
    Network
  },
  data() {
    return {
      loadingNetwork: false,
      loadingDetail: false,
      isLoading: false,
      nameVillage: '',
      selected: 'all',
      disclaimer: 'inline',
      listStatus: [
        {
          id: 'all',
          name: `${this.$t('label.all')} ${this.$t('label.status')}`
        }
      ],
      districtCity: {
        kota_kode: '32.73'
      },
      sidebarActive: false,
      disabledDistrict: false,
      sidebarTransform: 0,
      networkEvents: '',
      network: {
        nodes: [],
        edges: [],
        options: {
          nodes: {
            size: 30,
            font: {
              color: '#000000'
            },
            shapeProperties: {
              interpolation: false
            }
          },
          edges: {
            color: 'grey',
            dashes: true,
            length: 150,
            arrows: {
              to: {
                enabled: true,
                type: 'arrow',
                scaleFactor: 0.5
              }
            }
          },
          layout: { improvedLayout: false },
          physics: {
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {
              enabled: true,
              iterations: 100,
              updateInterval: 25
            }
          }
        }
      },
      detail: {
        image: null,
        _id: null,
        id: null,
        status: null,
        final_result: null,
        age: null,
        gender: null,
        first_symptom_date: null,
        current_location_address: null
      },
      dataDateVersion: null,
      listQuery: {
        address_district_code: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'roles',
      'fullName',
      'district_user',
      'district_name_user'
    ])
  },
  watch: {
    'listQuery': {
      handler: function(value) {
        this.getData()
      },
      deep: true
    }
  },
  async beforeMount() {
    this.disabledDistrict = rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])
    if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
      this.listQuery.address_district_code = this.district_user
    } else {
      this.listQuery.address_district_code = '32.73'
    }
    await this.getData()
  },
  methods: {
    async onDisclaimer() {
      this.disclaimer = 'none'
      await this.getData()
    },
    async getData() {
      const res = await this.$store.dispatch(
        'statistic/listCaseRelated',
        this.listQuery
      )

      const nodes = res.data.edges
      const edges = res.data.nodes
      this.dataDateVersion = res?.data.date_version || null

      const filteredNodes = nodes.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id)
        if (!x) {
          return acc.concat([current])
        } else {
          return acc
        }
      }, [])

      filteredNodes.map(res => {
        if (!res.size) {
          res.size = 30
        }

        res.image = this.checkImg('object', res)
      })

      this.network.nodes = filteredNodes
      this.network.edges = edges
    },
    async onNodeSelected(event) {
      this.loadingDetail = true

      const id = event.nodes[0]

      const res = await this.$store.dispatch('statistic/detailCaseRelated', id)

      if (res) this.loadingDetail = false

      this.detail = {
        image: null,
        _id: res.data[0]._id,
        id_case: res.data[0].id,
        status: res.data[0].status,
        final_result: res.data[0].final_result,
        age: Math.floor(res.data[0].age),
        gender: res.data[0].gender,
        first_symptom_date: res.data[0].first_symptom_date,
        current_location_address: res.data[0].current_location_address
      }

      this.sidebarActive = true
      this.sidebarTransform = 155
    },
    async onSelectDistrict(value) {
      this.listQuery.address_district_code = value.kota_kode
      this.getData()
    },
    onSelectStatus() {},
    onNodeDeselected() {
      this.sidebarActive = false
      this.sidebarTransform = 0
    },
    onClose() {
      this.sidebarActive = false
      this.sidebarTransform = 0
    },
    onDetail(id) {
      const routeData = this.$router.resolve({
        path: `/distribution-case/network/${id}`
      })
      window.open(routeData.href, '_blank')
    },
    onStabilizationProgress() {
      this.loadingNetwork = true
    },
    onStabilizationDone() {
      this.loadingNetwork = false
      const scaleOption = { scale: 1 }
      this.$refs.network.moveTo(scaleOption)
      this.$refs.network.setOptions({ physics: false })
    },
    getImgUrl() {
      let image
      if (this.sidebarActive) {
        const res = this.detail

        let age
        if (res.age >= 0 && res.age <= 1) {
          age = 'baby'
        } else if (res.age >= 2 && res.age <= 5) {
          age = 'child'
        } else if (res.age >= 6 && res.age <= 19) {
          age = 'teen'
        } else if (res.age >= 20 && res.age <= 59) {
          age = 'adult'
        } else if (res.age >= 60) {
          age = 'elderly'
        }

        let gender
        if (res.gender === 'P') {
          gender = 'female'
        } else {
          gender = 'male'
        }

        let status
        if (res.status === 'CONFIRMATION') {
          if (res.final_result === 'Masih Sakit') {
            status = 'positive_active'
          } else if (res.final_result === 'Selesai Isolasi/Sembuh') {
            status = 'positive_recovery'
          } else if (res.final_result === 'Meninggal') {
            status = 'positive_dead'
          } else if (res.final_result === 'Negatif') {
            status = 'positive_recovery'
          }
        } else {
          status = 'normal'
        }

        const img = `avatar/${age}-${gender}-${status}.svg`
        image = this.checkImg('string', img)
      } else {
        image = `avatar/undefined.svg`
      }
      return image
    },
    checkImg(from, data) {
      let img
      let image
      if (from === 'object') {
        if (!('image' in data)) {
          image = 'avatar/undefined.svg'
          return image
        } else {
          img = data.image
        }
      } else if (from === 'string') {
        img = data
      }

      if (
        img === 'avatar/adult-female-undefined.svg' ||
        img === 'avatar/adult-male-undefined.svg' ||
        img === 'avatar/baby-female-undefined.svg' ||
        img === 'avatar/baby-male-undefined.svg' ||
        img === 'avatar/child-female-undefined.svg' ||
        img === 'avatar/child-male-undefined.svg' ||
        img === 'avatar/elderly-female-undefined.svg' ||
        img === 'avatar/elderly-male-undefined.svg' ||
        img === 'avatar/teen-female-undefined.svg' ||
        img === 'avatar/teen-male-undefined.svg'
      ) {
        image = 'avatar/undefined.svg'
      } else {
        image = img
      }

      return image
    },
    async onPrintPNG() {
      this.isLoading = true
      const el = this.$refs.printNetworkCase
      const dateNow = Date.now()
      const filename = `Kasus Keterkaitan - ${this.district_name_user} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.png`
      const options = {
        type: 'dataURL'
      }
      const output = await this.$html2canvas(el, options)
      await FileSaver.saveAs(output, filename)
      this.isLoading = false
    },
    onReset() {
      this.listQuery.address_district_code = ''
      this.listQuery.address_subdistrict_code = ''
      this.listQuery.address_village_code = ''
      if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
        this.listQuery.address_district_code = this.district_user
      } else {
        this.listQuery.address_district_code = '32.73'
      }
    }
  }
}
</script>

<style lang="scss">
$otg-color: #616161;
$odp-color: #2d9cdb;
$pdp-color: #f2c94c;
$positive-color: #eb5757;
$active-color: #eb5757;
$recovery-color: #27ae60;
$dead-color: #333333;

@mixin transition($second) {
  -webkit-transition: $second ease-in-out;
  -moz-transition: $second ease-in-out;
  -o-transition: $second ease-in-out;
  transition: $second ease-in-out;
}

@mixin border($size, $color, $direction) {
  @if $direction == top {
    border-top: $size solid $color;
  } @else if $direction == bottom {
    border-bottom: $size solid $color;
  }
}

.container-network-filter {
  .content {
    .header {
      padding: 13px 0;

      .title-box {
        width: 5px;
        height: 1em;
        float: left;
        margin-right: 8px;
        margin-top: 1px;
        border: 2px solid #27ae60;
        background: #27ae60;
        margin-top: 3px;
      }

      .c-title {
        color: #27ae60;
        font-weight: bold;
      }
    }

    .select .v-input__slot {
      margin-bottom: 0;
    }
    .select .v-text-field__details {
      display: none !important;
    }
  }
}

.container-network {
  overflow-y: hidden;

  .content {
    position: absolute;
    background: white;
    width: 100%;
    height: calc(100vh - 153px);
    min-height: calc(100vh - 153px);
  }

  .network-content {
    position: absolute;
    background: white;
    width: 100%;
    height: 100%;
    @include transition(0.5s);
  }

  .network-loading {
    position: absolute;
    background-color: #fff;
    width: 300px;
    top: 50%;
    left: 50%;
    box-shadow: 0px -1px 20px 0px #dddddd;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 8px;
    padding: 30px;
  }

  .vis-network:focus {
    outline: 0px solid transparent;
  }

  .sidebar-network {
    .c-label {
      font-size: 12px;
    }

    .status {
      border: 1px solid;
      border-radius: 8px;
      padding: 8px 32px;
      font-size: 12px;
      text-align: center;
    }

    .otg {
      background-color: #ffffff;
      border-color: $otg-color;
      color: $otg-color;
    }

    .odp {
      background-color: #ffffff;
      border-color: $odp-color;
      color: $odp-color;
    }

    .pdp {
      background-color: #ffffff;
      border-color: $pdp-color;
      color: $pdp-color;
    }

    .positive {
      background-color: #ffffff;
      border-color: $positive-color;
      color: $positive-color;
    }

    .active {
      color: $active-color;
    }

    .recovery {
      color: $recovery-color;
    }

    .dead {
      color: $dead-color;
    }
  }
}

.border-top {
  @include border(1px, rgba(0, 0, 0, 0.12), top);
}
.border-bottom {
  @include border(1px, rgba(0, 0, 0, 0.12), bottom);
}
.outline-none {
  outline: none;
}

.network-sidebar {
  position: absolute;
  height: calc(100vh - 153px);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 1;
}
.network-sidebar.left {
  left: -310px;
  transition: left 0.5s, width 0.5s;
  padding-right: 0;
}
.network-sidebar.left.visible {
  left: 0;
}
.network-sidebar.right {
  right: -310px;
  transition: right 0.5s, width 0.5s;
  padding-left: 0;
}
.network-sidebar.right.visible {
  right: 0;
}
.network-sidebar > .leaflet-control {
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 13.2px;
  background: white;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.leaflet-touch .network-sidebar > .leaflet-control {
  box-shadow: none;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
}
@media (max-width: 767px) {
  .network-sidebar {
    width: 100%;
    padding: 0;
  }
  .network-sidebar.left.visible ~ .leaflet-left {
    left: 100%;
  }
  .network-sidebar.right.visible ~ .leaflet-right {
    right: 100%;
  }
  .network-sidebar.left {
    left: -100%;
  }
  .network-sidebar.left.visible {
    left: 0;
  }
  .network-sidebar.right {
    right: -100%;
  }
  .network-sidebar.right.visible {
    right: 0;
  }
  .network-sidebar > .leaflet-control {
    box-shadow: none;
    -webkit-border-radius: 0;
    border-radius: 0;
  }
  .leaflet-touch .network-sidebar > .leaflet-control {
    border: 0;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .network-sidebar {
    width: 155px;
  }
  .network-sidebar.left.visible ~ .leaflet-left {
    left: 155px;
  }
  .network-sidebar.right.visible ~ .leaflet-right {
    right: 155px;
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .network-sidebar {
    width: 240px;
  }
  .network-sidebar.left.visible ~ .leaflet-left {
    left: 240px;
  }
  .network-sidebar.right.visible ~ .leaflet-right {
    right: 240px;
  }
}
@media (min-width: 1200px) {
  .network-sidebar {
    width: 310px;
  }
  .network-sidebar.left.visible ~ .leaflet-left {
    left: 310px;
  }
  .network-sidebar.right.visible ~ .leaflet-right {
    right: 310px;
  }
}
.network-sidebar .close {
  position: absolute;
  right: 25px;
  top: 17px;
  width: 31px;
  height: 31px;
  color: #333 !important;
  font-size: 15pt;
  line-height: 1em;
  text-align: center;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  z-index: 800;
}
</style>
