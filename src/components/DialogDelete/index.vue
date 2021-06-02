<template>
  <v-row justify="center" class="dialog-delete">
    <v-dialog
      v-model="dialogDelete"
      persistent
      max-width="340px"
    >
      <v-card>
        <div class="justify-center dialog-img-delete">
          <img src="../../static/image-delete-dialog.svg" alt="image-delete-dialog">
        </div>
        <v-card-text v-if="dataDeleted" class="dialog-delete-title font-weight-bold">
          {{ $t('label.delete_dialog') }} <br>
          <span
            v-if="dataDeleted.id_case"
            class="font-weight-black"
          >
            {{ dataDeleted.id_case.toUpperCase() +'?' }}
          </span>
          <span
            v-if="dataDeleted.name"
            class="font-weight-black"
          >
            {{ dataDeleted.name.toUpperCase() +'?' }}
          </span>
        </v-card-text>
        <v-card-actions class="justify-center" style="padding: 2rem">
          <v-btn
            color="grey"
            outlined
            style="height: 40px;min-width: 120px;"
            @click="dialogDelete = false"
          >
            {{ $t('label.canceled') }}
          </v-btn>
          <v-btn
            color="red"
            outlined
            style="height: 40px;min-width: 120px;"
            @click="deleteData"
          >
            {{ $t('label.deleted') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'DialogDelete',
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    storePathDelete: {
      type: String,
      default: null
    },
    storePathResetList: {
      type: String,
      default: null
    },
    storePathGetList: {
      type: String,
      default: null
    },
    dataDeleted: {
      type: Object,
      default: null
    },
    listQuery: {
      type: Object,
      default: null
    },
    idData: {
      type: String,
      default: null
    }
  },
  computed: {
    dialogDelete: {
      get() {
        return this.dialog
      },
      set(val) {
        this.$emit('update:dialogDelete', val)
      }
    }
  },
  methods: {
    async deleteData() {
      await this.$store.dispatch(this.storePathDelete, this.dataDeleted._id)
      await this.$emit('update:dialogDelete', false)
      await this.$emit('update:deletedData', {})
      await this.$store.dispatch('toast/successToast', this.$t('success.data_success_delete'))
      if (this.storePathResetList !== null) {
        await this.$store.dispatch(this.storePathResetList)
      }
      if (this.idData !== null) {
        await this.$store.dispatch(this.storePathGetList, this.idData)
      }
      if (this.listQuery) {
        await this.$store.dispatch(this.storePathGetList, this.listQuery)
      }
    }
  }
}
</script>
