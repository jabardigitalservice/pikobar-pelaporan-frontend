<template>
  <v-dialog v-model="show" persistent max-width="20%">
    <v-card class="pa-7">
      <v-row class="mx-0 mb-5" justify="center" align="center">
        <v-icon x-large color="red" left>mdi-close-circle</v-icon>
        <span class="headline text-center">{{ title }}</span>
      </v-row>
      <v-row class="mx-0 mb-5 text-center" justify="center">
        {{ message }}
      </v-row>
      <v-row class="mx-0" justify="center">
        <v-btn color="red darken-1" text @click="show = false">{{ $t('label.ok') }}</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DialogFailed',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: this.showDialog
    }
  },
  watch: {
    showDialog(value) {
      this.show = value
    },
    show(value) {
      this.$emit('update:show', value)
    }
  }
}
</script>
