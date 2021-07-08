<template>
  <div>
    <div class="border-bottom">
      <v-row class="filter-layer mx-2 mt-2">
        <v-col
          cols="12"
          md="3"
        >
          <div class="d-flex mb-1">
            <div class="legend-color-title legend-description margin-top-3" />
            <div class="legend-text-title">{{ $t('label.look_for_it') }} {{ $t('label.based') }}</div>
          </div>
        </v-col>
      </v-row>
      <v-row class="filter-layer mx-2 mb-1">
        <v-col cols="8">
          <v-row>
            <v-col
              cols="12"
              md="4"
              class="pt-0"
            >
              <select-area-district-city
                :disabled-district="disabledDistrict"
                :district-city="districtCity"
                :city-district.sync="districtCity"
                :on-select-district="onSelectDistrict"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="pt-0"
            >
              <select-area-sub-district
                :sub-district="subDistrict"
                :update-sub-district.sync="subDistrict"
                :code-district="districtCity.kota_kode"
                :district-code.sync="districtCity.kota_kode"
                :on-select-sub-district="onSelectSubDistrict"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="pt-0"
            >
              <select-area-village
                :village="village"
                :update-village.sync="village"
                :code-sub-district="subDistrict.kecamatan_kode"
                :sub-district-code.sync="subDistrict.kecamatan_kode"
                :on-select-village="onSelectVillage"
              />
            </v-col>
          </v-row>
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
    <div class="container-map relative">
      <div id="sidebar">
        <div
          class="sidebar-content"
          v-html="sidebarContent"
        />
      </div>
      <div ref="printMap">
        <div
          id="map"
          class="map-wrapper bg-aqua"
        />
      </div>
      <div
        v-if="isFilter"
        class="filter"
      >
        <div class="filter-data">
          <ul>
            <li
              :class="[stage.positive_active.filter ? 'filter-active' : '']"
              @click="onFilter('positive_active')"
            >
              <div class="legend-color cluster-positive-active" />
              <span class="legend-text">
                {{ `${$t('label.positive')} - ${$t('label.isolation_still_sick')}` }}
              </span>
            </li>
            <li
              :class="[stage.positive_recovery.filter ? 'filter-active' : '']"
              @click="onFilter('positive_recovery')"
            >
              <div class="legend-color cluster-positive-recovery" />
              <span class="legend-text">
                {{ `${$t('label.positive')} - ${$t('label.recovery')}` }}
              </span>
            </li>
            <li
              :class="[stage.positive_dead.filter ? 'filter-active' : '']"
              @click="onFilter('positive_dead')"
            >
              <div class="legend-color cluster-positive-dead" />
              <span class="legend-text">
                {{ `${$t('label.positive')} - ${$t('label.dead')}` }}
              </span>
            </li>
            <li
              :class="[stage.probable_sick.filter ? 'filter-active' : '']"
              @click="onFilter('probable_sick')"
            >
              <div class="legend-color cluster-probable-sick" />
              <span class="legend-text">
                {{ `${$t('label.probable')} - ${$t('label.still_sick')}` }}
              </span>
            </li>
            <li
              :class="[stage.probable_recovery.filter ? 'filter-active' : '']"
              @click="onFilter('probable_recovery')"
            >
              <div class="legend-color cluster-probable-recovery" />
              <span class="legend-text">
                {{ `${$t('label.probable')} - ${$t('label.recovery')}` }}
              </span>
            </li>
            <li
              :class="[stage.probable_dead.filter ? 'filter-active' : '']"
              @click="onFilter('probable_dead')"
            >
              <div class="legend-color cluster-probable-dead" />
              <span class="legend-text">
                {{ `${$t('label.probable')} - ${$t('label.dead')}` }}
              </span>
            </li>
            <li
              :class="[stage.suspect_sick.filter ? 'filter-active' : '']"
              @click="onFilter('suspect_sick')"
            >
              <div class="legend-color cluster-suspect-sick" />
              <span class="legend-text">
                {{ `${$t('label.suspect')} - ${$t('label.still_sick')}` }}
              </span>
            </li>
            <li
              :class="[stage.suspect_discarded.filter ? 'filter-active' : '']"
              @click="onFilter('suspect_discarded')"
            >
              <div class="legend-color cluster-suspect-discarded" />
              <span class="legend-text">
                {{ `${$t('label.suspect')} - ${$t('label.discarded')}` }}
              </span>
            </li>
            <li
              :class="[stage.close_contact_quarantine.filter ? 'filter-active' : '']"
              @click="onFilter('close_contact_quarantine')"
            >
              <div class="legend-color cluster-close-contact-quarantine" />
              <span class="legend-text">
                {{ `${$t('label.tight_contact')} - ${$t('label.still_quarantine')}` }}
              </span>
            </li>
            <li
              :class="[stage.close_contact_discarded.filter ? 'filter-active' : '']"
              @click="onFilter('close_contact_discarded')"
            >
              <div class="legend-color cluster-close-contact-discarded" />
              <span class="legend-text">
                {{ `${$t('label.tight_contact')} - ${$t('label.discarded')}` }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-top">
      <v-row class="mx-2 mt-1 mb-2">
        <v-expansion-panels
          v-model="dashboardMapPanel"
          multiple
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="font-weight-bold text-lg">
              {{ dashboardMapPanel ? this.$t('label.show_captions'):this.$t('label.hide_captions') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-col
                cols="12"
                md="12"
              >
                <v-row>
                  <v-col
                    cols="12"
                    class="py-0"
                  >
                    <div class="d-flex mb-1">
                      <div class="legend-color-title legend-description margin-top-3" />
                      <div class="legend-text-title">{{ `${$t('label.information')} ${$t('label.label')}` }}</div>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    class="py-0"
                  >
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-positive-active margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.confirmation')} - ${$t('label.isolation_still_sick')}` }}</div>
                    </div>
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-positive-recovery margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.confirmation')} - ${$t('label.finished_isolation_recovery')}` }}</div>
                    </div>
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-positive-dead margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.confirmation')} - ${$t('label.dead')}` }}</div>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    class="py-0"
                  >
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-probable-sick margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.probable')} - ${$t('label.still_sick')}` }}</div>
                    </div>
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-probable-recovery margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.probable')} - ${$t('label.finished_isolation_recovery')}` }}</div>
                    </div>
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-probable-dead margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.probable')} - ${$t('label.discarded')}` }}</div>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    class="py-0"
                  >
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-suspect-sick margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.suspect')} - ${$t('label.still_sick')}` }}</div>
                    </div>
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-suspect-discarded margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.suspect')} - ${$t('label.discarded')}` }}</div>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                    class="py-0"
                  >
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-close-contact-quarantine margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.tight_contact')} - ${$t('label.still_quarantine')}` }}</div>
                    </div>
                    <div class="d-flex mb-1 align-top">
                      <div class="legend-color cluster-close-contact-discarded margin-top-3" />
                      <div class="legend-text">{{ `${$t('label.tight_contact')} - ${$t('label.discarded')}` }}</div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                cols="12"
                md="12"
              >
                <div class="d-flex mb-1">
                  <div class="legend-color-title legend-description margin-top-3" />
                  <div class="legend-text-title">{{ $t('label.information') }}</div>
                </div>
                <ol class="text-description">
                  <li>{{ $t('label.map_description_step_1') }}</li>
                  <li>{{ $t('label.map_description_step_2') }}</li>
                </ol>
              </v-col>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </div>
    <dialog-cache-disclaimer
      :disclaimer="disclaimer"
      :data-date-version="dataDateVersion"
      :on-disclaimer="onDisclaimer"
    />
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import { formatDatetime } from '@/utils/parseDatetime'
import { mapGetters } from 'vuex'
import { rolesWidget } from '@/utils/constantVariable'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-easybutton'
import 'leaflet.markercluster'
import 'leaflet-sidebar'
import 'leaflet-spin'
import * as turf from '@turf/turf'

export default {
  name: 'DistributionCaseMapV2',
  props: {
    districtCode: {
      type: String,
      default: null
    },
    districtName: {
      type: String,
      default: null
    },
    subDistrictCode: {
      type: String,
      default: null
    },
    subDistrictName: {
      type: String,
      default: null
    },
    villageCode: {
      type: String,
      default: null
    },
    villageName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      jsonAll: [],
      jsonCity: [],
      jsonSubDistrict: [],
      jsonVillage: [],
      disclaimer: 'inline',
      disabledDistrict: false,
      dataDateVersion: null,
      dashboardMapPanel: [],
      districtCity: {
        kota_kode: this.districtCode,
        kota_nama: this.districtName
      },
      subDistrict: {
        kecamatan_kode: this.subDistrictCode,
        kecamatan_nama: this.subDistrictName
      },
      village: {
        desa_kode: this.villageCode,
        desa_nama: this.villageName
      },
      isFilterLayer: false,
      isLoading: false,
      filterLayer: {
        isCity: false,
        isDistrict: false,
        isVillage: false,
        city: null,
        district: null,
        village: null
      },
      stage: {
        all: {
          name: `Semua`,
          data: [],
          filter: true
        },
        positive_active: {
          name: `${this.$t('label.confirmation')} - ${this.$t(
            'label.isolation_still_sick'
          )}`,
          data: [],
          filter: false
        },
        positive_recovery: {
          name: `${this.$t('label.confirmation')} - ${this.$t(
            'label.recovery'
          )}`,
          data: [],
          filter: false
        },
        positive_dead: {
          name: `${this.$t('label.confirmation')} - ${this.$t('label.dead')}`,
          data: [],
          filter: false
        },
        probable_sick: {
          name: `${this.$t('label.probable')} - ${this.$t('label.still_sick')}`,
          data: [],
          filter: false
        },
        probable_recovery: {
          name: `${this.$t('label.probable')} - ${this.$t('label.recovery')}`,
          data: [],
          filter: false
        },
        probable_dead: {
          name: `${this.$t('label.probable')} - ${this.$t('label.dead')}`,
          data: [],
          filter: false
        },
        suspect_sick: {
          name: `${this.$t('label.suspect')} - ${this.$t('label.still_sick')}`,
          data: [],
          filter: false
        },
        suspect_discarded: {
          name: `${this.$t('label.suspect')} - ${this.$t('label.discarded')}`,
          data: [],
          filter: false
        },
        close_contact_qurantine: {
          name: `${this.$t('label.tight_contact')} - ${this.$t(
            'label.still_quarantine'
          )}`,
          data: [],
          filter: false
        },
        close_contact_discarded: {
          name: `${this.$t('label.tight_contact')} - ${this.$t(
            'label.discarded'
          )}`,
          data: [],
          filter: false
        }
      },
      clusterCity: [],
      clusterDistrict: [],
      clusterVillage: [],
      clusterVillageSingle: [],
      isFilter: false,
      filterActive: 'all',
      sidebar: null,
      sidebarContent: '',
      map: null,
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      isZoom: false,
      zoomOld: 0,
      zoomNew: 0,
      center: [-6.932694, 107.627449],
      centerCity: [-6.932694, 107.627449],
      layerGroup: null,
      dataLayer: [],
      dataMarker: [],
      styleBorderline: {
        fillColor: 'red',
        fillOpacity: 0.01,
        weight: 0.5,
        opacity: 0.5,
        color: 'red'
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
    districtCode: value => {
      if (value) {
        this.districtCity = {
          kota_kode: value,
          kota_nama: this.districtName
        }
      } else {
        this.clearCity()
      }
    },
    subDistrictCode: value => {
      this.subDistrict = {
        kecamatan_kode: value,
        kecamatan_nama: this.subDistrictName
      }
    },
    villageCode: value => {
      this.village = {
        desa_kode: value,
        desa_nama: this.villageName
      }
    }
  },
  async beforeMount() {
    if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
      this.disabledDistrict = true
      this.filterLayer.isCity = true
      this.filterLayer.city = this.district_user
    }

    this.districtCity = {
      kota_kode: this.district_user,
      kota_nama: this.district_name_user
    }
  },
  async mounted() {
    this.initMap()
    this.getData('init')
  },
  beforeDestroy() {
    this.clearCity()
    this.clearDistrict()
    this.clearVillage()
    this.filterLayer = null
  },
  methods: {
    formatDatetime,
    async onDisclaimer() {
      this.disclaimer = 'none'
      this.initMap()
      this.getData('init')
    },
    async initMap() {
      // Map
      this.map = L.map('map', {
        zoomControl: false
      }).setView(this.center, 8)

      this.map.spin(true)
      const respVillage = await this.$store.dispatch('region/getGeoJsonVillage')
      const respSubDistrict = await this.$store.dispatch('region/getGeoJsonSubDistrict')
      const respCity = await this.$store.dispatch('region/getGeoJsonCity')
      this.jsonVillage = respVillage || []
      this.jsonSubDistrict = respSubDistrict || []
      this.jsonCity = respCity || []
      this.map.spin(false)

      // Copyright
      L.tileLayer(this.url, {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.map)

      // Zoom
      L.control
        .zoom({
          position: 'bottomright'
        })
        .addTo(this.map)

      // Home
      L.easyButton({
        position: 'topright',
        states: [
          {
            icon: '<i class="material-icons">home</i>',
            onClick: () => {
              this.map.fitBounds(this.centerCity)
            }
          }
        ]
      }).addTo(this.map)

      // Sidebar
      this.sidebar = L.control.sidebar('sidebar', {
        closeButton: true,
        position: 'left'
      })
      this.map.addControl(this.sidebar)

      this.map.on('click', () => {
        this.sidebar.hide()
        this.isFilter = false
      })

      // Layer
      this.layerGroup = L.layerGroup().addTo(this.map)
    },
    async getData(type) {
      this.map.spin(true)
      try {
        let paramCity = null
        if (this.filterLayer.isCity) {
          if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
            paramCity = this.district_user
          } else {
            paramCity = this.filterLayer.city
          }
        }

        let paramDistrict = null
        if (this.filterLayer.isDistrict) {
          paramDistrict = this.filterLayer.district
        }

        let paramVillage = null
        if (this.filterLayer.isDistrict) {
          paramVillage = this.filterLayer.village
        }

        const params = {
          kode_kab: paramCity,
          kode_kec: paramDistrict,
          kode_kel: paramVillage
        }

        const res = await this.$store.dispatch(
          'statistic/distributionCase',
          params
        )
        this.stage[this.filterActive].data = res?.data.map || []
        this.dataDateVersion = res?.data.date_version || null
        if (type === 'init') {
          if (rolesWidget['superadmin'].includes(this.roles[0])) {
            this.zoomOld = 1
            this.zoomNew = 1
            this.createLayerCity()
            this.createMarker()
          } else if (rolesWidget['dinkesKotaAndFaskes'].includes(this.roles[0])) {
            this.zoomOld = 2
            this.zoomNew = 2
            this.createLayerDistrict(this.district_user)
            this.createMarker(this.district_user)
          }
        } else if (type === 'filter' || type === 'select') {
          if (this.zoomNew === 1) {
            this.createMarker()
          } else if (this.zoomNew === 2) {
            this.createMarker(this.filterLayer.city)
          } else if (this.zoomNew === 3) {
            this.createMarker(this.filterLayer.district)
          } else if (this.zoomNew === 4) {
            this.createMarker(this.filterLayer.village)
          }
        }
        this.map.spin(false)
      } catch (error) {
        console.error(error)
      }
    },
    createLayerCity() {
      const geojsonLayer = L.geoJSON(this.jsonCity, {
        style: feature => {
          return this.styleBorderline
        },
        onEachFeature: (feature, layer, element) => {
          const polygon = layer.addTo(this.map)
          this.dataLayer.push(polygon)

          const nameCity = feature.properties.kemendagri_kabupaten_nama
          layer.bindTooltip(this.titleize(nameCity))
        }
      })

      this.map.fitBounds(geojsonLayer.getBounds())
    },
    createLayerDistrict(value = null) {
      const geojsonLayer = L.geoJSON(this.jsonSubDistrict, {
        style: feature => {
          return this.styleBorderline
        },
        filter: (feature, layer) => {
          return feature.properties.kemendagri_kabupaten_kode === value
        },
        onEachFeature: (feature, layer, element) => {
          const polygon = layer.addTo(this.map)
          this.dataLayer.push(polygon)

          const nameCity = feature.properties.kemendagri_kabupaten_nama
          const nameDistrict = feature.properties.kemendagri_kecamatan_nama
          layer.bindTooltip(`
            ${this.titleize(nameCity)} <br>
            ${this.$t('label.select_sub_district')} ${nameDistrict}
          `)
        }
      })

      if (!this.isZoom) {
        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
          this.map.fitBounds(geojsonLayer.getBounds())
        } else if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length === 1) {
          this.map.setView(geojsonLayer.getLayers()[0].getLatLng(), 12)
        }
      }
    },
    createLayerVillage(value = null) {
      const geojsonLayer = L.geoJSON(this.jsonVillage, {
        style: feature => {
          return this.styleBorderline
        },
        filter: (feature, layer) => {
          return feature.properties.kemendagri_kecamatan_kode === value
        },
        onEachFeature: (feature, layer, element) => {
          const polygon = layer.addTo(this.map)
          this.dataLayer.push(polygon)

          const nameCity = feature.properties.kemendagri_kabupaten_nama
          const nameDistrict = feature.properties.kemendagri_kecamatan_nama
          const nameVillage = feature.properties.kemendagri_desa_nama
          layer.bindTooltip(`
            ${this.titleize(nameCity)} <br>
            ${this.$t('label.select_sub_district')} ${nameDistrict} <br>
            ${this.$t('label.select_village')} ${nameVillage}
          `)
        }
      })

      if (!this.isZoom) {
        if (geojsonLayer.getLayers() !== undefined && geojsonLayer.getLayers().length > 1) {
          this.map.fitBounds(geojsonLayer.getBounds())
        } else if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length === 1) {
          this.map.setView(geojsonLayer.getLayers()[0].getLatLng(), 12)
        }
      }
    },
    createLayerVillageSingle(value) {
      const geojsonLayer = L.geoJSON(this.jsonVillage, {
        style: feature => {
          return this.styleBorderline
        },
        filter: (feature, layer) => {
          return feature.properties.kemendagri_desa_kode === value
        },
        onEachFeature: (feature, layer, element) => {
          const polygon = layer.addTo(this.map)
          this.dataLayer.push(polygon)

          const nameCity = feature.properties.kemendagri_kabupaten_nama
          const nameDistrict = feature.properties.kemendagri_kecamatan_nama
          const nameVillage = feature.properties.kemendagri_desa_nama
          layer.bindTooltip(`
            ${this.titleize(nameCity)} <br>
            ${this.$t('label.select_sub_district')} ${nameDistrict} <br>
            ${this.$t('label.select_village')} ${nameVillage}
          `)
        }
      })

      if (!this.isZoom) {
        this.map.fitBounds(geojsonLayer.getBounds())
      }
    },
    createMarker(value = null) {
      this.jsonAll = []
      Object.keys(this.stage).map(cat => {
        if (this.stage[cat].filter) this.jsonAll = this.stage[cat].data
        return this.jsonAll
      })

      let geojsonLayer
      if (this.zoomNew === 1) {
        geojsonLayer = L.geoJSON(this.jsonCity).eachLayer(element => {
          if (this.map.getBounds().intersects(element._bounds)) {
            this.clusterCity[
              element.feature.properties.kemendagri_kabupaten_kode
            ] = this.paramMarkerCluster()

            this.jsonAll.map(elPasien => {
              if ('longitude' in elPasien && 'latitude' in elPasien) {
                const longitude = Number(elPasien.latitude)
                const latitude = Number(elPasien.longitude)
                if (longitude && latitude) {
                  const point = turf.point([longitude, latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterCity, element, elPasien)
                  }
                }
              }
            })
            this.addMarkerClusterLayer(this.clusterCity, element)
          }
        })

        if (geojsonLayer && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      } else if (this.zoomNew === 2) {
        geojsonLayer = L.geoJSON(this.jsonSubDistrict, {
          filter: (feature, layer) => {
            return feature.properties.kemendagri_kabupaten_kode === value
          }
        }).eachLayer(element => {
          if (this.map.getBounds().intersects(element._bounds)) {
            this.clusterDistrict[
              element.feature.properties.kemendagri_kecamatan_kode
            ] = this.paramMarkerCluster()

            this.jsonAll.map(elPasien => {
              if ('longitude' in elPasien && 'latitude' in elPasien) {
                const longitude = Number(elPasien.latitude)
                const latitude = Number(elPasien.longitude)
                if (longitude && latitude) {
                  const point = turf.point([longitude, latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterDistrict, element, elPasien)
                  }
                }
              }
            })
            this.addMarkerClusterLayer(this.clusterDistrict, element)
          }
        })

        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      } else if (this.zoomNew === 3) {
        geojsonLayer = L.geoJSON(this.jsonVillage, {
          filter: (feature, layer) => {
            return feature.properties.kemendagri_kecamatan_kode === value
          }
        }).eachLayer(element => {
          if (this.map.getBounds().intersects(element._bounds)) {
            this.clusterVillage[
              element.feature.properties.kemendagri_desa_kode
            ] = this.paramMarkerCluster()

            this.jsonAll.map(elPasien => {
              if ('longitude' in elPasien && 'latitude' in elPasien) {
                const longitude = Number(elPasien.latitude)
                const latitude = Number(elPasien.longitude)
                if (longitude && latitude) {
                  const point = turf.point([longitude, latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterVillage, element, elPasien)
                  }
                }
              }
            })
            this.addMarkerClusterLayer(this.clusterVillage, element)
          }
        })

        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      } else if (this.zoomNew === 4) {
        geojsonLayer = L.geoJSON(this.jsonVillage, {
          filter: (feature, layer) => {
            return feature.properties.kemendagri_desa_kode === value
          }
        }).eachLayer(element => {
          if (this.map.getBounds().intersects(element._bounds)) {
            this.clusterVillageSingle = this.paramMarkerCluster()

            this.jsonAll.map(elPasien => {
              if ('longitude' in elPasien && 'latitude' in elPasien) {
                const longitude = Number(elPasien.latitude)
                const latitude = Number(elPasien.longitude)
                if (longitude && latitude) {
                  const point = turf.point([longitude, latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(
                      this.clusterVillageSingle,
                      element,
                      elPasien
                    )
                  }
                }
              }
            })
            this.addMarkerClusterLayer(this.clusterVillageSingle, element)
          }
        })

        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      }
    },
    addMarkerLayer(cluster, element, elPasien) {
      const longitude = Number(elPasien.latitude)
      const latitude = Number(elPasien.longitude)
      const m = L.marker([latitude, longitude]).on('click', e => {
        this.isFilter = false
        this.sidebar.show()

        let status
        if (elPasien.status === 'CONFIRMATION') {
          status = 'Konfirmasi'
        } else if (elPasien.status === 'PROBABLE') {
          status = 'Probable'
        } else if (elPasien.status === 'SUSPECT') {
          status = 'Suspek'
        } else if (elPasien.status === 'CLOSECONTACT') {
          status = 'Kontak Erat'
        }

        const stage = status + ' - ' + elPasien.final_result
        const age = elPasien.umur ? Math.floor(elPasien.umur) : 0
        this.sidebarContent = `
          <div class="d-flex mb-4">
            <div class="legend-color-title legend-description margin-top-3"></div>
            <div class="legend-text-title">Detail Pasien</div>
          </div>
          <div class="mb-2">
            <strong>ID</strong>: ${elPasien.id} <br>
          </div>
          <div class="mb-2">
            <strong>Status</strong>: ${stage} <br>
          </div>
          <div class="mb-2">
            <strong>L/P</strong>: ${elPasien.gender} <br>
          </div>
          <div class="mb-2">
            <strong>Umur</strong>: ${age} <br>
          </div>
          <div class="mb-2">
            <strong>Wilayah</strong>: <br>
            ${this.titleize(elPasien.nama_kab)} <br>
            Kec. ${this.titleize(elPasien.nama_kec)} <br>
            Kel/Desa. ${this.titleize(elPasien.nama_kel)} <br>
          </div>
        `
      })

      let areaStatus = false
      let area
      if (this.zoomNew === 1) {
        areaStatus = true
        area = element.feature.properties.kemendagri_kabupaten_kode
      } else if (this.zoomNew === 2) {
        areaStatus = true
        area = element.feature.properties.kemendagri_kecamatan_kode
      } else if (this.zoomNew === 3) {
        areaStatus = true
        area = element.feature.properties.kemendagri_desa_kode
      } else if (this.zoomNew === 4) {
        areaStatus = false
      }

      if (
        elPasien.status === 'CONFIRMATION' &&
        elPasien.final_result === 'Masih Sakit'
      ) {
        areaStatus
          ? cluster[area].positive_active.addLayer(m)
          : cluster.positive_active.addLayer(m)
      } else if (
        elPasien.status === 'CONFIRMATION' &&
        elPasien.final_result === 'Selesai Isolasi/Sembuh'
      ) {
        areaStatus
          ? cluster[area].positive_recovery.addLayer(m)
          : cluster.positive_recovery.addLayer(m)
      } else if (
        elPasien.status === 'CONFIRMATION' &&
        elPasien.final_result === 'Meninggal'
      ) {
        areaStatus
          ? cluster[area].positive_dead.addLayer(m)
          : cluster.positive_dead.addLayer(m)
      } else if (
        elPasien.status === 'PROBABLE' &&
        elPasien.final_result === 'Masih Sakit'
      ) {
        areaStatus
          ? cluster[area].probable_sick.addLayer(m)
          : cluster.probable_sick.addLayer(m)
      } else if (
        elPasien.status === 'PROBABLE' &&
        elPasien.final_result === 'Selesai Isolasi/Sembuh'
      ) {
        areaStatus
          ? cluster[area].probable_recovery.addLayer(m)
          : cluster.probable_recovery.addLayer(m)
      } else if (
        elPasien.status === 'PROBABLE' &&
        elPasien.final_result === 'Meninggal'
      ) {
        areaStatus
          ? cluster[area].probable_dead.addLayer(m)
          : cluster.probable_dead.addLayer(m)
      } else if (
        elPasien.status === 'SUSPECT' &&
        elPasien.final_result === 'Masih Sakit'
      ) {
        areaStatus
          ? cluster[area].suspect_sick.addLayer(m)
          : cluster.suspect_sick.addLayer(m)
      } else if (
        elPasien.status === 'SUSPECT' &&
        elPasien.final_result === 'Discarded'
      ) {
        areaStatus
          ? cluster[area].suspect_discarded.addLayer(m)
          : cluster.suspect_discarded.addLayer(m)
      } else if (
        elPasien.status === 'CLOSECONTACT' &&
        elPasien.final_result === 'Masih Dikarantina'
      ) {
        areaStatus
          ? cluster[area].close_contact_quarantine.addLayer(m)
          : cluster.close_contact_quarantine.addLayer(m)
      } else if (
        elPasien.status === 'CLOSECONTACT' &&
        elPasien.final_result === 'Discarded'
      ) {
        areaStatus
          ? cluster[area].close_contact_discarded.addLayer(m)
          : cluster.close_contact_discarded.addLayer(m)
      }
    },
    addMarkerClusterLayer(cluster, element) {
      if (this.zoomNew === 1) {
        Object.keys(
          cluster[element.feature.properties.kemendagri_kabupaten_kode]
        ).map(key => {
          const newLayer = cluster[
            element.feature.properties.kemendagri_kabupaten_kode
          ][key].addTo(this.map)
          this.dataMarker.push(newLayer)

          return cluster[element.feature.properties.kemendagri_kabupaten_kode][key].on(
            'clusterclick',
            c => {
              this.isFilter = false
              this.sidebar.show()

              const city = element.feature.properties.kemendagri_kabupaten_nama
              const stage = this.stage[key].name
              const total = c.layer._childCount

              this.sidebarContent = `
            <div class="d-flex mb-4">
              <div class="legend-color-title legend-description margin-top-3"></div>
              <div class="legend-text-title">Detail Kasus</div>
            </div>
            <div class="mb-2">
              <strong>Status</strong>: ${stage} <br>
            </div>
            <div class="mb-2">
              <strong>Jumlah</strong>: ${total} Kasus <br>
            </div>
            <div class="mb-2">
              <strong>Kota/Kab.</strong>: ${city} <br>
            </div>
            `
            }
          )
        })
      } else if (this.zoomNew === 2) {
        Object.keys(
          cluster[element.feature.properties.kemendagri_kecamatan_kode]
        ).map(key => {
          const newLayer = cluster[
            element.feature.properties.kemendagri_kecamatan_kode
          ][key].addTo(this.map)
          this.dataMarker.push(newLayer)

          return cluster[element.feature.properties.kemendagri_kecamatan_kode][key].on(
            'clusterclick',
            c => {
              this.isFilter = false
              this.sidebar.show()

              const city = element.feature.properties.kemendagri_kabupaten_nama
              const district =
                element.feature.properties.kemendagri_kecamatan_nama
              const stage = this.stage[key].name
              const total = c.layer._childCount

              this.sidebarContent = `
            <div class="d-flex mb-4">
              <div class="legend-color-title legend-description margin-top-3"></div>
              <div class="legend-text-title">Detail Kasus</div>
            </div>
            <div class="mb-2">
              <strong>Status</strong>: ${stage} <br>
            </div>
            <div class="mb-2">
              <strong>Jumlah</strong>: ${total} Kasus <br>
            </div>
            <div class="mb-2">
              <strong>Kota/Kab.</strong>: ${city} <br>
            </div>
            <div class="mb-2">
              <strong>Kec.</strong>: ${district} <br>
            </div>
            `
            }
          )
        })
      } else if (this.zoomNew === 3) {
        Object.keys(
          cluster[element.feature.properties.kemendagri_desa_kode]
        ).map(key => {
          const newLayer = cluster[
            element.feature.properties.kemendagri_desa_kode
          ][key].addTo(this.map)
          return this.dataMarker.push(newLayer)
        })
      } else if (this.zoomNew === 4) {
        Object.keys(cluster).map(key => {
          const newLayer = cluster[key].addTo(this.map)
          return this.dataMarker.push(newLayer)
        })
      }
    },
    paramMarkerCluster() {
      return {
        positive_active: L.markerClusterGroup(
          this.configCluster('positive-active')
        ),
        positive_recovery: L.markerClusterGroup(
          this.configCluster('positive-recovery')
        ),
        positive_dead: L.markerClusterGroup(
          this.configCluster('positive-dead')
        ),
        probable_sick: L.markerClusterGroup(
          this.configCluster('probable-sick')
        ),
        probable_recovery: L.markerClusterGroup(
          this.configCluster('probable-recovery')
        ),
        probable_dead: L.markerClusterGroup(
          this.configCluster('probable-dead')
        ),
        suspect_sick: L.markerClusterGroup(this.configCluster('suspect-sick')),
        suspect_discarded: L.markerClusterGroup(
          this.configCluster('suspect-discarded')
        ),
        close_contact_quarantine: L.markerClusterGroup(
          this.configCluster('close-contact-quarantine')
        ),
        close_contact_discarded: L.markerClusterGroup(
          this.configCluster('close-contact-discarded')
        )
      }
    },
    configCluster(className = null) {
      return {
        singleMarkerMode: true,
        maxClusterRadius: 10000,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0 },
        iconCreateFunction: cluster => {
          let count = cluster.getChildCount()
          const digits = (count + '').length

          let classMarker = 'cluster cluster-' + className + ' digits-' + digits

          if (count === 1) {
            count = ''
            classMarker = 'cluster cluster-' + className + ' digits-0'
          }

          return L.divIcon({
            html: count,
            className: classMarker,
            iconSize: null
          })
        }
      }
    },
    titleize(sentence) {
      if (!sentence.split) {
        return sentence
      }

      const titleizeWord = name => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      }

      const result = []
      sentence.split(' ').forEach(w => {
        result.push(titleizeWord(w))
      })
      return result.join(' ')
    },
    onFilter(category) {
      this.sidebar.hide()
      Object.keys(this.stage).map(res => {
        if (this.stage[res].filter) this.stage[res].filter = false
        return this.stage[res].filter
      })

      this.stage[category].filter = !this.stage[category].filter
      this.filterActive = category

      this.removeMarker()
      this.getData('filter')
    },
    async onSelectDistrict(value) {
      this.removeMarker()
      this.removeLayer()

      this.isFilterLayer = true
      this.districtCity = value
      this.clearDistrict()
      this.clearVillage()
      if (value.kota_kode) this.$emit('update:codeDistrict', value.kota_kode)
      if (value.kota_nama) this.$emit('update:nameDistrict', value.kota_nama)

      this.map.spin(true)
      this.zoomNew = 2
      this.filterLayer.isCity = true
      this.filterLayer.city = value.kota_kode

      this.createLayerDistrict(value.kota_kode)
      this.sleep(1500).then(() => {
        this.createMarker(value.kota_kode)
        this.map.spin(false)
      })
    },
    async onSelectSubDistrict(value) {
      this.removeMarker()
      this.removeLayer()

      this.isFilterLayer = true
      this.subDistrict = value
      this.clearVillage()
      if (value.kecamatan_kode) this.$emit('update:codeSubDistrict', value.kecamatan_kode)
      if (value.kecamatan_nama) this.$emit('update:nameSubDistrict', value.kecamatan_nama)

      this.map.spin(true)
      this.zoomNew = 3
      this.filterLayer.isDistrict = true
      this.filterLayer.district = value.kecamatan_kode

      this.createLayerVillage(value.kecamatan_kode)
      this.sleep(1000).then(() => {
        this.createMarker(value.kecamatan_kode)
        this.map.spin(false)
      })
    },
    async onSelectVillage(value) {
      this.removeMarker()
      this.removeLayer()

      this.isFilterLayer = true
      this.village = value
      if (value.desa_kode) this.$emit('update:codeVillage', value.desa_kode)
      if (value.desa_nama) this.$emit('update:nameVillage', value.desa_nama)

      this.map.spin(true)
      this.zoomNew = 4
      this.filterLayer.isVillage = true
      this.filterLayer.village = value.desa_kode

      this.createLayerVillageSingle(value.desa_kode)
      this.sleep(500).then(() => {
        this.createMarker(value.desa_kode)
        this.map.spin(false)
      })
    },
    clearCity() {
      this.districtCity = {
        kota_kode: null,
        kota_nama: null
      }
    },
    clearDistrict() {
      this.subDistrict = {
        kecamatan_kode: null,
        kecamatan_nama: null
      }
    },
    clearVillage() {
      this.village = {
        desa_kode: null,
        desa_nama: null
      }
    },
    onReset() {
      this.sidebar.hide()
      this.removeMarker()
      this.removeLayer()

      if (rolesWidget['superadmin'].includes(this.roles[0])) {
        this.clearVillage()
        this.clearDistrict()
        this.clearCity()
        this.filterLayer.isCity = false
        this.filterLayer.isDistrict = false
        this.filterLayer.isVillage = false
        this.filterLayer.village = null
        this.filterLayer.district = null
        this.filterLayer.city = null

        this.map.spin(true)
        this.map.setView(this.center, 8)
        this.zoomNew = 1
        this.createLayerCity()

        this.sleep(2000).then(() => {
          this.createMarker()
          this.map.spin(false)
        })
      } else {
        this.clearVillage()
        this.clearDistrict()
        this.filterLayer.isDistrict = false
        this.filterLayer.isVillage = false
        this.filterLayer.village = null
        this.filterLayer.district = null

        this.map.spin(true)
        this.zoomNew = 2
        this.createLayerDistrict(this.district_user)

        this.sleep(2000).then(() => {
          this.createMarker(this.district_user)
          this.map.spin(false)
        })
      }
    },
    removeLayer() {
      this.dataLayer.forEach(element => {
        this.map.removeLayer(element)
      })
      this.dataLayer = []
    },
    removeMarker() {
      this.dataMarker.forEach(element => {
        this.map.removeLayer(element)
      })
      this.dataMarker = []
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async onPrintPNG() {
      this.isLoading = true
      const el = document.querySelector('#map')
      const dateNow = Date.now()
      const filename = `Peta Penyebaran - ${this.district_name_user} - ${formatDatetime(dateNow, 'DD/MM/YYYY HH:mm')} WIB.png`
      const options = {
        type: 'dataURL'
      }
      const output = await this.$html2canvas(el, options)
      await FileSaver.saveAs(output, filename)
      this.isLoading = false
    }
  }
}
</script>

<style>
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.margin-top-3 {
  margin-top: 3px;
}

.button-action {
  height: 46px !important;
  text-transform: none;
}

.map-wrapper {
  background: white;
  height: calc(100vh - 178px);
  min-height: calc(100vh - 178px);
  z-index: 0;
}
#map .easy-button-container {
  background-color: white;
}
#map .easy-button-button {
  width: 26px;
  height: 26px;
}
#map .material-icons {
  padding-top: 5px;
  font-size: 17px;
  color: #27ae60;
}

.filter {
  position: absolute;
  top: 195px;
  right: 10px;
}
.filter ul {
  margin: 5px 6px 0 5px;
  padding-left: 0;
}
.filter li {
  list-style: none;
  opacity: 0.4;
  padding-bottom: 0.2em;
}
.filter li:hover {
  cursor: pointer;
}
.filter-active {
  opacity: 1 !important;
}
.filter-data {
  background: #fff;
  padding: 0.6em;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}

.legend-color {
  width: 1em;
  height: 1em;
  float: left;
  border-radius: 10px;
  margin-right: 8px;
  margin-top: 4.5px;
}
.legend-text {
  color: black;
  margin-top: 2px;
}
.legend-color-title {
  width: 5px;
  height: 1em;
  float: left;
  margin-right: 8px;
  margin-top: 1px;
}
.legend-text-title {
  color: #27ae60;
  font-weight: bold;
}
.legend-description {
  border: 2px solid #27ae60;
  background: #27ae60;
  margin-top: 3px;
}
.text-description {
  padding-left: 15px;
}
.text-description li {
  color: black !important;
  font-weight: normal;
}

.cluster {
  border-radius: 50%;
  text-align: center;
  color: white;
  font-weight: 700;
  font-family: monospace;
  height: 10px;
  width: 10px;
}
.cluster-positive-active {
  border: 2px solid rgb(235, 87, 87, 0.9);
  background: rgb(235, 87, 87, 0.9);
}
.cluster-positive-recovery {
  border: 2px solid rgb(235, 87, 87, 0.9);
  background: rgb(39, 174, 96, 0.9);
}
.cluster-positive-dead {
  border: 2px solid rgb(235, 87, 87, 0.9);
  background: rgb(165, 18, 18, 0.9);
}
.cluster-probable-sick {
  border: 2px solid rgb(45, 156, 219, 0.9);
  background: rgb(45, 156, 219, 0.9);
}
.cluster-probable-recovery {
  border: 2px solid rgb(45, 156, 219, 0.9);
  background: rgb(39, 174, 96, 0.9);
}
.cluster-probable-dead {
  border: 2px solid rgb(45, 156, 219, 0.9);
  background: rgb(165, 18, 18, 0.9);
}
.cluster-suspect-sick {
  border: 2px solid rgb(242, 153, 74, 0.9);
  background: rgb(242, 153, 74, 0.9);
}
.cluster-suspect-discarded {
  border: 2px solid rgb(242, 153, 74, 0.9);
  background: rgb(130, 130, 130, 0.9);
}
.cluster-close-contact-quarantine {
  border: 2px solid rgb(39, 174, 96, 0.9);
  background: rgb(39, 174, 96, 0.9);
}
.cluster-close-contact-discarded {
  border: 2px solid rgb(39, 174, 96, 0.9);
  background: rgb(130, 130, 130, 0.9);
}

.digits-0 {
  height: 17px;
  width: 17px;
  margin-top: -14px;
  margin-left: -14px;
}
.digits-1 {
  font-size: 14px;
  height: 28px;
  width: 28px;
  line-height: 24px;
  margin-top: -14px;
  margin-left: -14px;
}
.digits-2 {
  font-size: 16px;
  height: 34px;
  width: 34px;
  line-height: 30px;
  margin-top: -17px;
  margin-left: -17px;
}
.digits-3 {
  font-size: 18px;
  height: 48px;
  width: 47px;
  line-height: 44px;
  margin-top: -24px;
  margin-left: -24px;
}
.digits-4 {
  font-size: 18px;
  height: 58px;
  width: 58px;
  line-height: 54px;
  margin-top: -29px;
  margin-left: -29px;
}

.leaflet-sidebar {
  position: absolute;
  height: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 2000;
}
.leaflet-sidebar.left {
  left: -500px;
  transition: left 0.5s, width 0.5s;
  padding-right: 0;
}
.leaflet-sidebar.left.visible {
  left: 0;
}
.leaflet-sidebar.right {
  right: -500px;
  transition: right 0.5s, width 0.5s;
  padding-left: 0;
}
.leaflet-sidebar.right.visible {
  right: 0;
}
.leaflet-sidebar > .leaflet-control {
  height: 100%;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
  font-size: 1.1em;
  background: white;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.leaflet-touch .leaflet-sidebar > .leaflet-control {
  box-shadow: none;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
}
@media (max-width: 767px) {
  .leaflet-sidebar {
    width: 100%;
    padding: 0;
  }
  .leaflet-sidebar.left.visible ~ .leaflet-left {
    left: 100%;
  }
  .leaflet-sidebar.right.visible ~ .leaflet-right {
    right: 100%;
  }
  .leaflet-sidebar.left {
    left: -100%;
  }
  .leaflet-sidebar.left.visible {
    left: 0;
  }
  .leaflet-sidebar.right {
    right: -100%;
  }
  .leaflet-sidebar.right.visible {
    right: 0;
  }
  .leaflet-sidebar > .leaflet-control {
    box-shadow: none;
    -webkit-border-radius: 0;
    border-radius: 0;
  }
  .leaflet-touch .leaflet-sidebar > .leaflet-control {
    border: 0;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .leaflet-sidebar {
    width: 155px;
  }
  .leaflet-sidebar.left.visible ~ .leaflet-left {
    left: 155px;
  }
  .leaflet-sidebar.right.visible ~ .leaflet-right {
    right: 155px;
  }
}
@media (min-width: 992px) and (max-width: 1199px) {
  .leaflet-sidebar {
    width: 240px;
  }
  .leaflet-sidebar.left.visible ~ .leaflet-left {
    left: 240px;
  }
  .leaflet-sidebar.right.visible ~ .leaflet-right {
    right: 240px;
  }
}
@media (min-width: 1200px) {
  .leaflet-sidebar {
    width: 310px;
  }
  .leaflet-sidebar.left.visible ~ .leaflet-left {
    left: 310px;
  }
  .leaflet-sidebar.right.visible ~ .leaflet-right {
    right: 310px;
  }
}
.leaflet-sidebar .close {
  position: absolute;
  right: 15px;
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

.leaflet-left {
  transition: left 0.5s;
}

.leaflet-right {
  transition: right 0.5s;
}

.sidebar-stage-color {
  width: 2em;
  height: 2em;
  float: left;
  border-radius: 15px;
  margin-right: 8px;
  margin-top: 1px;
}
.sidebar-stage {
  font-size: 20px;
  line-height: 27px;
  font-weight: bold;
}

.filter-layer .v-text-field__details {
  display: none;
}
.v-expansion-panel-header__icon {
    margin-left: 2% !important;
}
</style>
