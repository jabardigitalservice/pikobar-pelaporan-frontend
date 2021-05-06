<template>
  <v-overlay :value="loading">
    <lottie :options="lottieOptions" :width="100" :height="100" />
  </v-overlay>
</template>

<script>
import Lottie from 'vue-lottie'
import animationLoading from '@/static/loader.svg'

export default {
  name: 'LoadingLottie',
  components: {
    Lottie
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lottieOptions: { animationData: animationLoading, loop: true }
    }
  }
}
</script>
