<template>
  <div>
    <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
      <v-row class="filter-layer mx-2 mt-2">
        <v-col
          cols="12"
          md="3"
          class="pb-0"
        >
          <div class="d-flex mb-1">
            <div
              class="legend-color-title legend-description"
              style="margin-top: 3px;"
            />
            <div class="legend-text-title">{{ $t('label.look_for_it') }} {{ $t('label.based') }}</div>
          </div>
        </v-col>
      </v-row>
      <v-row class="filter-layer mx-2">
        <v-col cols="10">
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
      </v-row>
    </div>
    <div class="container-map relative">
      <div id="sidebar">
        <div
          class="sidebar-content"
          v-html="sidebarContent"
        />
      </div>
      <div
        id="map"
        class="map-wrapper bg-aqua"
        style="z-index: 0;"
      />
      <div
        v-if="isFilter"
        class="filter"
      >
        <div class="filter-data">
          <ul>
            <li
              :class="[filter.positive_active ? 'filter-active' : '']"
              @click="onFilter('positive_active')"
            >
              <div class="legend-color cluster-positive-active" />
              <span class="legend-text">
                {{ `${$t('label.positive')} - ${$t('label.active')}` }}
              </span>
            </li>
            <li
              :class="[filter.positive_recovery ? 'filter-active' : '']"
              @click="onFilter('positive_recovery')"
            >
              <div class="legend-color cluster-positive-recovery" />
              <span class="legend-text">
                {{ `${$t('label.positive')} - ${$t('label.recovery')}` }}
              </span>
            </li>
            <li
              :class="[filter.positive_dead ? 'filter-active' : '']"
              @click="onFilter('positive_dead')"
            >
              <div class="legend-color cluster-positive-dead" />
              <span class="legend-text">
                {{ `${$t('label.positive')} - ${$t('label.dead')}` }}
              </span>
            </li>
            <li
              :class="[filter.pdp_process ? 'filter-active' : '']"
              @click="onFilter('pdp_process')"
            >
              <div class="legend-color cluster-pdp-process" />
              <span class="legend-text">
                {{ `${$t('label.PDP')} - ${$t('label.process')}` }}
              </span>
            </li>
            <li
              :class="[filter.pdp_done ? 'filter-active' : '']"
              @click="onFilter('pdp_done')"
            >
              <div class="legend-color cluster-pdp-done" />
              <span class="legend-text">
                {{ `${$t('label.PDP')} - ${$t('label.done')}` }}
              </span>
            </li>
            <li
              :class="[filter.odp_process ? 'filter-active' : '']"
              @click="onFilter('odp_process')"
            >
              <div class="legend-color cluster-odp-process" />
              <span class="legend-text">
                {{ `${$t('label.ODP')} - ${$t('label.process')}` }}
              </span>
            </li>
            <li
              :class="[filter.odp_done ? 'filter-active' : '']"
              @click="onFilter('odp_done')"
            >
              <div class="legend-color cluster-odp-done" />
              <span class="legend-text">
                {{ `${$t('label.ODP')} - ${$t('label.done')}` }}
              </span>
            </li>
            <li
              :class="[filter.otg_process ? 'filter-active' : '']"
              @click="onFilter('otg_process')"
            >
              <div class="legend-color cluster-otg-process" />
              <span class="legend-text">
                {{ `${$t('label.OTG')} - ${$t('label.process')}` }}
              </span>
            </li>
            <li
              :class="[filter.otg_done ? 'filter-active' : '']"
              @click="onFilter('otg_done')"
            >
              <div class="legend-color cluster-otg-done" />
              <span class="legend-text">
                {{ `${$t('label.OTG')} - ${$t('label.done')}` }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div style="border-top: 1px solid rgba(0, 0, 0, 0.12)">
      <v-row class="mx-2 mt-1">
        <v-col
          cols="12"
          md="6"
        >
          <div class="d-flex mb-1">
            <div
              class="legend-color-title legend-description"
              style="margin-top: 3px;"
            />
            <div class="legend-text-title">{{ $t('label.information') }}</div>
          </div>
          <ol class="text-description">
            <li>{{ $t('label.map_description_step_1') }}</li>
            <li>{{ $t('label.map_description_step_2') }}</li>
            <li>{{ $t('label.map_description_step_3') }}</li>
          </ol>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-row>
            <v-col
              cols="12"
              class="py-0"
            >
              <div class="d-flex mb-1">
                <div
                  class="legend-color-title legend-description"
                  style="margin-top: 3px;"
                />
                <div class="legend-text-title">{{ `${$t('label.information')} ${$t('label.label')}` }}</div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="py-0"
            >
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-otg-process"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.otg_process }}</div>
              </div>
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-otg-done"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.otg_done }}</div>
              </div>
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-odp-process"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.odp_process }}</div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="py-0"
            >
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-odp-done"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.odp_done }}</div>
              </div>
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-pdp-process"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.pdp_process }}</div>
              </div>
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-pdp-done"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.pdp_done }}</div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="py-0"
            >
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-positive-active"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.positive_active }}</div>
              </div>
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-positive-recovery"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.positive_recovery }}</div>
              </div>
              <div class="d-flex mb-1">
                <div
                  class="legend-color cluster-positive-dead"
                  style="margin-top: 3px;"
                />
                <div class="legend-text">{{ stage.positive_dead }}</div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div
      class="disclaimer"
      :style="{'display': disclaimer}"
    >
      <div class="backdrop" />
      <div class="modal-disclaimer">
        <div class="text-center pb-5">
          <v-img
            src="@/static/confirmation-logo.svg"
            width="75%"
            class="img-center"
          />
        </div>
        <div class="d-flex mb-1">
          <div
            class="legend-color-title legend-description"
            style="margin-top: 3px;"
          />
          <div class="legend-text-title">{{ $t('label.disclaimer') }}</div>
        </div>
        <ol class="text-description">
          <li>{{ $t('label.map_disclaimer_step_1') }}</li>
          <li>{{ $t('label.map_disclaimer_step_2') }}</li>
        </ol>
        <div class="text-center pt-5">
          <v-btn
            color="success"
            class="button button-action white--text"
            @click="onDisclaimer"
          >
            {{ $t('label.understand') }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-easybutton'
import 'leaflet.markercluster'
import 'leaflet-sidebar'
import 'leaflet-spin'
import * as turf from '@turf/turf'
import axios from 'axios'
import jsonCity from '../../json/kota.json'
import jsonDistrict from '../../json/kecamatan.json'
import jsonVillage from '../../json/kelurahan.json'

export default {
  name: 'DistributionCaseMap',
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
      jsonCity,
      jsonDistrict,
      jsonVillage,
      disclaimer: 'block',
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
      },
      stage: {
        positive_active: 'Positif - Aktif',
        positive_recovery: 'Positif - Sembuh',
        positive_dead: 'Positif - Meninggal',
        pdp_process: 'PDP - Proses',
        pdp_done: 'PDP - Selesai',
        pdp_dead: 'PDP - Meninggal',
        odp_process: 'ODP - Proses',
        odp_done: 'ODP - Selesai',
        odp_dead: 'ODP - Meninggal',
        otg_process: 'OTG - Proses',
        otg_done: 'OTG - Selesai',
        otg_dead: 'OTG - Meninggal'
      },
      data: {
        positive_active: [],
        positive_recovery: [],
        positive_dead: [],
        pdp_process: [],
        pdp_done: [],
        pdp_dead: [],
        odp_process: [],
        odp_done: [],
        odp_dead: [],
        otg_process: [],
        otg_done: [],
        otg_dead: []
      },
      clusterCity: [],
      clusterDistrict: [],
      clusterVillage: [],
      clusterVillageSingle: [],
      isFilter: false,
      filter: {
        positive_active: true,
        positive_recovery: false,
        positive_dead: false,
        pdp_process: false,
        pdp_done: false,
        pdp_dead: false,
        odp_process: false,
        odp_done: false,
        odp_dead: false,
        otg_process: false,
        otg_done: false,
        otg_dead: false
      },
      sidebar: null,
      sidebarContent: '',
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
      disabledDistrict: false,
      isFilterLayer: false,
      filterLayer: {
        isCity: false,
        isDistrict: false,
        isVillage: false,
        city: null,
        district: null,
        village: null
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
    districtCode: (value) => {
      if (value) {
        this.districtCity = {
          kota_kode: value,
          kota_nama: this.districtName
        }
      } else {
        this.clearCity()
      }
    },
    subDistrictCode: (value) => {
      this.subDistrict = {
        kecamatan_kode: value,
        kecamatan_nama: this.subDistrictName
      }
    },
    villageCode: (value) => {
      this.village = {
        desa_kode: value,
        desa_nama: this.villageName
      }
    }
  },
  async beforeMount() {
    if (this.roles[0] === 'dinkeskota') {
      this.disabledDistrict = true
      this.filterLayer.isCity = true
      this.filterLayer.city = this.district_user
    }

    this.districtCity = {
      kota_kode: this.district_user,
      kota_nama: this.district_name_user
    }
  },
  beforeDestroy() {
    this.clearCity()
    this.clearDistrict()
    this.clearVillage()
    this.filterLayer = null
  },
  methods: {
    initMap() {
      // Map
      this.map = L.map('map', {
        zoomControl: false
      }).setView(this.center, 8)

      // Copyright
      L.tileLayer(
        this.url,
        {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18
        }
      ).addTo(this.map)

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

      // Filter
      L.easyButton({
        position: 'topright',
        states: [
          {
            icon: '<i class="material-icons">filter_list</i>',
            onClick: () => {
              this.isFilter = !this.isFilter
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

      // Drag
      this.map.on('dragend', (e) => {
        this.removeMarker()
        if (this.zoomNew === 1) {
          this.createMarker()
        } else if (this.zoomNew === 2) {
          this.createMarker(this.filterLayer.city)
        } else if (this.zoomNew === 3) {
          this.createMarker(this.filterLayer.district)
        } else if (this.zoomNew === 4) {
          this.createMarker(this.filterLayer.village)
        }
      })

      // Layer
      this.layerGroup = L.layerGroup().addTo(this.map)
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
    zoomLayer(value = null) {
      if (this.zoomOld !== this.zoomNew) {
        if (this.zoomNew === 1) {
          this.removeLayer()
          this.createLayerCity()
          this.removeMarker()
          if (this.roles[0] === 'dinkesprov' || this.roles[0] === 'superadmin') {
            this.createMarker()
          } else if (this.roles[0] === 'dinkeskota') {
            this.createMarker(this.district_user)
          }
        } else if (this.zoomNew === 2) {
          this.removeLayer()
          this.createLayerDistrict(value)
          this.removeMarker()
          if (this.roles[0] === 'dinkesprov' || this.roles[0] === 'superadmin') {
            this.createMarker()
          } else if (this.roles[0] === 'dinkeskota') {
            this.createMarker(this.district_user)
          }
        } else if (this.zoomNew === 3) {
          this.removeLayer()
          this.createLayerVillage(value)
          this.removeMarker()
          if (this.roles[0] === 'dinkesprov' || this.roles[0] === 'superadmin') {
            this.createMarker()
          } else if (this.roles[0] === 'dinkeskota') {
            this.createMarker(this.district_user)
          }
        }
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
      let geojsonLayer
      if (value) {
        geojsonLayer = L.geoJSON(this.jsonDistrict, {
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
      } else {
        geojsonLayer = L.geoJSON(this.jsonDistrict, {
          style: feature => {
            return this.styleBorderline
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
      }
    },
    createLayerVillage(value = null) {
      let geojsonLayer
      if (value) {
        geojsonLayer = L.geoJSON(this.jsonVillage, {
          style: feature => {
            return this.styleBorderline
          },
          filter: (feature, layer) => {
            // return feature.properties.kemendagri_kabupaten_kode === value
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
          if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
            this.map.fitBounds(geojsonLayer.getBounds())
          } else if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length === 1) {
            this.map.setView(geojsonLayer.getLayers()[0].getLatLng(), 12)
          }
        }
      } else {
        geojsonLayer = L.geoJSON(this.jsonVillage, {
          style: feature => {
            return this.styleBorderline
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
      }
    },
    createLayerVillageSingle(value) {
      let geojsonLayer
      if (value) {
        geojsonLayer = L.geoJSON(this.jsonVillage, {
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
          if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
            this.map.fitBounds(geojsonLayer.getBounds())
          } else if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length === 1) {
            this.map.fitBounds(geojsonLayer.getBounds())
          }
        }
      }
    },
    createMarker(value = null) {
      this.jsonAll = []
      Object.keys(this.filter).map(cat => {
        if (this.filter[cat]) {
          return this.jsonAll = this.data[cat]
        }
      })

      let geojsonLayer
      if (this.zoomNew === 1) {
        geojsonLayer = L.geoJSON(this.jsonCity).eachLayer((element) => {
          if (this.map.getBounds().intersects(element._bounds)) {
            this.clusterCity[element.feature.properties.bps_kabupaten_kode] = this.paramMarkerCluster()

            this.jsonAll.map((elPasien) => {
              if (elPasien.latitude !== null) {
                const point = turf.point([elPasien.longitude, elPasien.latitude])
                const isInside = turf.inside(point, element.feature)
                if (isInside) {
                  this.addMarkerLayer(this.clusterCity, element, elPasien)
                }
              }
            })
            this.addMarkerClusterLayer(this.clusterCity, element)
          }
        })

        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      } else if (this.zoomNew === 2) {
        if (value) {
          geojsonLayer = L.geoJSON(this.jsonDistrict, {
            filter: (feature, layer) => {
              return feature.properties.kemendagri_kabupaten_kode === value
            }
          }).eachLayer((element) => {
            if (this.map.getBounds().intersects(element._bounds)) {
              this.clusterDistrict[element.feature.properties.bps_kecamatan_kode] = this.paramMarkerCluster()

              this.jsonAll.map((elPasien) => {
                if (elPasien.latitude !== null) {
                  const point = turf.point([elPasien.longitude, elPasien.latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterDistrict, element, elPasien)
                  }
                }
              })
              this.addMarkerClusterLayer(this.clusterDistrict, element)
            }
          })
        } else {
          geojsonLayer = L.geoJSON(this.jsonDistrict).eachLayer((element) => {
            if (this.map.getBounds().intersects(element._bounds)) {
              this.clusterDistrict[element.feature.properties.bps_kecamatan_kode] = this.paramMarkerCluster()

              this.jsonAll.map((elPasien) => {
                if (elPasien.latitude !== null) {
                  const point = turf.point([elPasien.longitude, elPasien.latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterDistrict, element, elPasien)
                  }
                }
              })
              this.addMarkerClusterLayer(this.clusterDistrict, element)
            }
          })
        }

        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      } else if (this.zoomNew === 3) {
        if (value) {
          geojsonLayer = L.geoJSON(this.jsonVillage, {
            filter: (feature, layer) => {
              // return feature.properties.kemendagri_kabupaten_kode === value
              return feature.properties.kemendagri_kecamatan_kode === value
            }
          }).eachLayer((element) => {
            if (this.map.getBounds().intersects(element._bounds)) {
              this.clusterVillage[element.feature.properties.bps_desa_kode] = this.paramMarkerCluster()

              this.jsonAll.map((elPasien) => {
                if (elPasien.latitude !== null) {
                  const point = turf.point([elPasien.longitude, elPasien.latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterVillage, element, elPasien)
                  }
                }
              })
              this.addMarkerClusterLayer(this.clusterVillage, element)
            }
          })
        } else {
          geojsonLayer = L.geoJSON(this.jsonVillage).eachLayer((element) => {
            if (this.map.getBounds().intersects(element._bounds)) {
              this.clusterVillage[element.feature.properties.bps_desa_kode] = this.paramMarkerCluster()

              this.jsonAll.map((elPasien) => {
                if (elPasien.latitude !== null) {
                  const point = turf.point([elPasien.longitude, elPasien.latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterVillage, element, elPasien)
                  }
                }
              })
              this.addMarkerClusterLayer(this.clusterVillage, element)
            }
          })
        }

        if (geojsonLayer.getLayers() && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      } else if (this.zoomNew === 4) {
        if (value) {
          geojsonLayer = L.geoJSON(this.jsonVillage, {
            filter: (feature, layer) => {
              // return feature.properties.kemendagri_kecamatan_kode === value
              return feature.properties.kemendagri_desa_kode === value
            }
          }).eachLayer((element) => {
            if (this.map.getBounds().intersects(element._bounds)) {
              this.clusterVillageSingle = this.paramMarkerCluster()

              this.jsonAll.map((elPasien) => {
                if (elPasien.latitude !== null) {
                  const point = turf.point([elPasien.longitude, elPasien.latitude])
                  const isInside = turf.inside(point, element.feature)
                  if (isInside) {
                    this.addMarkerLayer(this.clusterVillageSingle, element, elPasien)
                  }
                }
              })
              this.addMarkerClusterLayer(this.clusterVillageSingle, element)
            }
          })
        }

        if (geojsonLayer && geojsonLayer.getLayers().length > 1) {
          this.centerCity = geojsonLayer.getBounds()
        }
      }
    },
    titleize(sentence) {
      if (!sentence.split) {
        return sentence
      }

      const titleizeWord = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      }

      const result = []
      sentence.split(' ').forEach(w => {
        result.push(titleizeWord(w))
      })
      return result.join(' ')
    },
    addMarkerLayer(cluster, element, elPasien) {
      const m = L.marker([elPasien.latitude, elPasien.longitude]).on('click', (e) => {
        this.isFilter = false
        this.sidebar.show()

        let stage = elPasien.status + ' - ' + elPasien.stage
        if (stage === 'Positif - Proses') {
          stage = 'Positif - Aktif'
        }

        this.sidebarContent = `
          <div class="d-flex mb-4">
            <div class="legend-color-title legend-description" style="margin-top: 3px;"></div>
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
            <strong>Umur</strong>: ${elPasien.umur} <br>
          </div>
          <div class="mb-2">
            <strong>Wilayah</strong>: <br>
            ${this.titleize(elPasien.nama_kab)} <br>
            Kec. ${this.titleize(elPasien.nama_kec)} <br>
            Kel/Desa. ${this.titleize(elPasien.nama_kel)} <br>
          </div>
        `
      })

      if (this.zoomNew === 1) {
        if (elPasien.status === 'Positif' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kabupaten_kode].positive_active.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Sembuh') {
          cluster[element.feature.properties.bps_kabupaten_kode].positive_recovery.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kabupaten_kode].positive_dead.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kabupaten_kode].pdp_process.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_kabupaten_kode].pdp_done.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kabupaten_kode].pdp_dead.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kabupaten_kode].odp_process.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_kabupaten_kode].odp_done.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kabupaten_kode].odp_dead.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kabupaten_kode].otg_process.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_kabupaten_kode].otg_done.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kabupaten_kode].otg_dead.addLayer(m)
        }
      } else if (this.zoomNew === 2) {
        if (elPasien.status === 'Positif' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kecamatan_kode].positive_active.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Sembuh') {
          cluster[element.feature.properties.bps_kecamatan_kode].positive_recovery.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kecamatan_kode].positive_dead.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kecamatan_kode].pdp_process.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_kecamatan_kode].pdp_done.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kecamatan_kode].pdp_dead.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kecamatan_kode].odp_process.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_kecamatan_kode].odp_done.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kecamatan_kode].odp_dead.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_kecamatan_kode].otg_process.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_kecamatan_kode].otg_done.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_kecamatan_kode].otg_dead.addLayer(m)
        }
      } else if (this.zoomNew === 3) {
        if (elPasien.status === 'Positif' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_desa_kode].positive_active.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Sembuh') {
          cluster[element.feature.properties.bps_desa_kode].positive_recovery.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_desa_kode].positive_dead.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_desa_kode].pdp_process.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_desa_kode].pdp_done.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_desa_kode].pdp_dead.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_desa_kode].odp_process.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_desa_kode].odp_done.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_desa_kode].odp_dead.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Proses') {
          cluster[element.feature.properties.bps_desa_kode].otg_process.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Selesai') {
          cluster[element.feature.properties.bps_desa_kode].otg_done.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Meninggal') {
          cluster[element.feature.properties.bps_desa_kode].otg_dead.addLayer(m)
        }
      } else if (this.zoomNew === 4) {
        if (elPasien.status === 'Positif' && elPasien.stage === 'Proses') {
          cluster.positive_active.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Sembuh') {
          cluster.positive_recovery.addLayer(m)
        } else if (elPasien.status === 'Positif' && elPasien.stage === 'Meninggal') {
          cluster.positive_dead.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Proses') {
          cluster.pdp_process.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Selesai') {
          cluster.pdp_done.addLayer(m)
        } else if (elPasien.status === 'PDP' && elPasien.stage === 'Meninggal') {
          cluster.pdp_dead.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Proses') {
          cluster.odp_process.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Selesai') {
          cluster.odp_done.addLayer(m)
        } else if (elPasien.status === 'ODP' && elPasien.stage === 'Meninggal') {
          cluster.odp_dead.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Proses') {
          cluster.otg_process.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Selesai') {
          cluster.otg_done.addLayer(m)
        } else if (elPasien.status === 'OTG' && elPasien.stage === 'Meninggal') {
          cluster.otg_dead.addLayer(m)
        }
      }
    },
    addMarkerClusterLayer(cluster, element) {
      if (this.zoomNew === 1) {
        Object.keys(cluster[element.feature.properties.bps_kabupaten_kode]).map((key) => {
          const newLayer = cluster[element.feature.properties.bps_kabupaten_kode][key].addTo(this.map)
          this.dataMarker.push(newLayer)

          return cluster[element.feature.properties.bps_kabupaten_kode][key].on('clusterclick', (c) => {
            this.isFilter = false
            this.sidebar.show()

            const city = element.feature.properties.kemendagri_kabupaten_nama
            const stage = this.stage[key]
            const total = c.layer._childCount

            this.sidebarContent = `
            <div class="d-flex mb-4">
              <div class="legend-color-title legend-description" style="margin-top: 3px;"></div>
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
          })
        })
      } else if (this.zoomNew === 2) {
        Object.keys(cluster[element.feature.properties.bps_kecamatan_kode]).map((key) => {
          const newLayer = cluster[element.feature.properties.bps_kecamatan_kode][key].addTo(this.map)
          this.dataMarker.push(newLayer)

          return cluster[element.feature.properties.bps_kecamatan_kode][key].on('clusterclick', (c) => {
            this.isFilter = false
            this.sidebar.show()

            const city = element.feature.properties.kemendagri_kabupaten_nama
            const district = element.feature.properties.kemendagri_kecamatan_nama
            const stage = this.stage[key]
            const total = c.layer._childCount

            this.sidebarContent = `
            <div class="d-flex mb-4">
              <div class="legend-color-title legend-description" style="margin-top: 3px;"></div>
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
          })
        })
      } else if (this.zoomNew === 3) {
        Object.keys(cluster[element.feature.properties.bps_desa_kode]).map((key) => {
          const newLayer = cluster[element.feature.properties.bps_desa_kode][key].addTo(this.map)
          return this.dataMarker.push(newLayer)
        })
      } else if (this.zoomNew === 4) {
        Object.keys(cluster).map((key) => {
          const newLayer = cluster[key].addTo(this.map)
          return this.dataMarker.push(newLayer)
        })
      }
    },
    paramMarkerCluster() {
      return {
        positive_active: L.markerClusterGroup(this.configCluster('positive-active')),
        positive_recovery: L.markerClusterGroup(this.configCluster('positive-recovery')),
        positive_dead: L.markerClusterGroup(this.configCluster('positive-dead')),
        pdp_process: L.markerClusterGroup(this.configCluster('pdp-process')),
        pdp_done: L.markerClusterGroup(this.configCluster('pdp-done')),
        pdp_dead: L.markerClusterGroup(this.configCluster('pdp-dead')),
        odp_process: L.markerClusterGroup(this.configCluster('odp-process')),
        odp_done: L.markerClusterGroup(this.configCluster('odp-done')),
        odp_dead: L.markerClusterGroup(this.configCluster('odp-dead')),
        otg_process: L.markerClusterGroup(this.configCluster('otg-process')),
        otg_done: L.markerClusterGroup(this.configCluster('otg-done')),
        otg_dead: L.markerClusterGroup(this.configCluster('otg-dead'))
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
        iconCreateFunction: (cluster) => {
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
    onFilter(category) {
      Object.keys(this.filter).map((cat) => {
        return this.filter[cat] = false
      })

      this.filter[category] = !this.filter[category]
      this.sidebar.hide()

      this.removeMarker()
      if (this.zoomNew === 1) {
        this.createMarker()
      } else if (this.zoomNew === 2) {
        this.createMarker(this.filterLayer.city)
      } else if (this.zoomNew === 3) {
        this.createMarker(this.filterLayer.district)
      } else if (this.zoomNew === 4) {
        this.createMarker(this.filterLayer.village)
      }
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
      this.removeMarker()
      this.removeLayer()

      if (this.roles[0] === 'dinkesprov' || this.roles[0] === 'superadmin') {
        this.clearCity()
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
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async onDisclaimer() {
      this.disclaimer = 'none'

      this.initMap()

      this.map.spin(true)
      this.data.positive_active = []
      this.data.positive_recovery = []
      try {
        await axios.get('https://covid19-public.digitalservice.id/api/v1/sebaran_app/jabar')
          .then((res) => {
            const data = res.data.data.content

            data.map((res) => {
              if (res.status === 'Positif' && res.stage === 'Proses') {
                this.data.positive_active.push(res)
              } else if (res.status === 'Positif' && res.stage === 'Sembuh') {
                this.data.positive_recovery.push(res)
              } else if (res.status === 'Positif' && res.stage === 'Meninggal') {
                this.data.positive_dead.push(res)
              } else if (res.status === 'PDP' && res.stage === 'Proses') {
                this.data.pdp_process.push(res)
              } else if (res.status === 'PDP' && res.stage === 'Selesai') {
                this.data.pdp_done.push(res)
              } else if (res.status === 'PDP' && res.stage === 'Meninggal') {
                this.data.pdp_dead.push(res)
              } else if (res.status === 'ODP' && res.stage === 'Proses') {
                this.data.odp_process.push(res)
              } else if (res.status === 'ODP' && res.stage === 'Selesai') {
                this.data.odp_done.push(res)
              } else if (res.status === 'ODP' && res.stage === 'Meninggal') {
                this.data.odp_dead.push(res)
              } else if (res.status === 'OTG' && res.stage === 'Proses') {
                this.data.otg_process.push(res)
              } else if (res.status === 'OTG' && res.stage === 'Selesai') {
                this.data.otg_done.push(res)
              } else if (res.status === 'OTG' && res.stage === 'Meninggal') {
                this.data.otg_dead.push(res)
              }
            })

            if (this.roles[0] === 'dinkesprov' || this.roles[0] === 'superadmin') {
              this.zoomOld = 1
              this.zoomNew = 1
              this.createLayerCity()
              this.createMarker()
            } else if (this.roles[0] === 'dinkeskota') {
              this.zoomOld = 2
              this.zoomNew = 2
              this.createLayerDistrict(this.district_user)
              this.createMarker(this.district_user)
            }
            this.map.spin(false)
          })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style>
.button-action {
  height: 46px !important;
  text-transform: none;
}

.map-wrapper {
  background: white;
  height: calc(100vh - 178px);
  min-height: calc(100vh - 178px);
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
  margin-top: 1px;
}
.legend-text {
  color: black;
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
.cluster-odp-process {
  border: 2px solid rgb(45, 156, 219, 0.9);
  background: rgb(45, 156, 219, 0.9);
}
.cluster-odp-done {
  border: 2px solid rgb(45, 156, 219, 0.9);
  background: rgba(196, 195, 195, 0.9);
}
.cluster-odp-dead {
  border: 2px solid rgb(45, 156, 219, 0.9);
  background: rgb(165, 18, 18, 0.9);
}
.cluster-pdp-process {
  border: 2px solid rgb(242, 201, 76, 0.9);
  background: rgb(242, 201, 76, 0.9);
}
.cluster-pdp-done {
  border: 2px solid rgb(242, 201, 76, 0.9);
  background: rgba(196, 195, 195, 0.9);
}
.cluster-pdp-dead {
  border: 2px solid rgb(242, 201, 76, 0.9);
  background: rgb(165, 18, 18, 0.9);
}
.cluster-otg-process {
  border: 2px solid rgb(97, 97, 97, 0.9);
  background: rgb(97, 97, 97, 0.9);
}
.cluster-otg-done {
  border: 2px solid rgb(97, 97, 97, 0.9);
  background: rgba(196, 195, 195, 0.9);
}
.cluster-otg-dead {
  border: 2px solid rgb(97, 97, 97, 0.9);
  background: rgb(165, 18, 18, 0.9);
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

.backdrop {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #000;
  opacity: 0.5;
}
.modal-disclaimer {
  position: absolute;
  background-color: #fff;
  width: 400px;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border-radius: 8px;
  padding: 30px;
}
.img-center {
  display: block;
  margin: 0 auto;
}
</style>
