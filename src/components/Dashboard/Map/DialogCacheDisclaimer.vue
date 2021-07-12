<template>
  <div
    class="disclaimer"
    :style="{'display': disclaimer}"
  >
    <div class="backdrop" />
    <div class="modal-disclaimer">
      <div class="text-center pb-5">
        <v-img
          src="@/static/modal-disclaimer.svg"
          width="50%"
          class="img-center"
        />
      </div>
      <p class="text-center"><strong>{{ $t('label.disclaimer') }}</strong></p>
      <p class="text-center">{{ $t('label.last_update') }}: {{ dataDateVersion ? formatDatetime(dataDateVersion, 'LLL'):'' }} |
        {{ $t('label.please_wait_and_refresh_this_page_to_update_the_data') }}</p>
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
</template>
<script>
import { formatDatetime } from '@/utils/parseDatetime'

export default {
  name: 'DialogCacheDisclaimer',
  props: {
    disclaimer: {
      type: String,
      default: null
    },
    onDisclaimer: {
      type: Function,
      default: null
    },
    dataDateVersion: {
      type: String,
      default: null
    }
  },
  methods: {
    formatDatetime
  }
}
</script>
<style scoped>
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
  width: 40%;
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
