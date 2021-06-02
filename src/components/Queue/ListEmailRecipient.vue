<template>
  <v-dialog v-model="show" persistent max-width="30%">
    <v-card class="container">
      <v-card-title class="pt-0">
        Riwayat Email
      </v-card-title>
      <v-divider class="mt-0" />
      <v-data-table
        :headers="headers"
        :items="listEmailRecipient"
        :mobile-breakpoint="0"
        :no-data-text="$t('label.data_empty')"
        :items-per-page="100"
        :loading="isLoading"
        class="mytable"
        hide-default-footer
      >
        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ getTableRowNumbering(index) }}</td>
            <td>{{ item.email }}</td>
            <td class="px-0 text-center"><span>{{ formatDatetime(item.sendAt, 'DD MMMM YYYY') }}</span></td>
          </tr>
        </template>
      </v-data-table>
      <v-divider class="mt-8" />
      <v-card-actions>
        <v-row>
          <v-col class="text-right">
            <v-btn color="success" bottom class="ml-2 btn-small text-capitalize" @click="show = false">
              {{ $t('label.done') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'ListEmailRecipient',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    listEmailRecipient: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      show: this.showDialog,
      headers: [
        { text: '#', value: '_id', sortable: false, width: 50 },
        { text: 'Email', value: 'email' },
        { text: 'Tanggal Kirim', value: 'sendAt' }
      ]
    }
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    }
  },
  methods: {
    formatDatetime,
    getTableRowNumbering(index) {
      return index + 1
    }
  }
}
</script>
