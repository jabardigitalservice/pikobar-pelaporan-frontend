<template>
  <div class="login">
    <div class="column-left">
      <div class="logo-js" />
      <div class="icon-bottom" />
      <div class="pic-login" />
    </div>
    <div class="column-right">
      <v-row>
        <div class="logo-js">
          <div class="logo-js-right" />
        </div>
        <div class="icon" />
      </v-row>
      <v-row>
        <v-col class="title-login">
          <h1 class="title-1"> {{ $t('label.login_title') }}
          </h1>
          <h1 class="title-2"> {{ $t('label.report_covid') }}
          </h1>
        </v-col>
      </v-row>
      <v-card-text class="formLogin">
        <v-form
          id="login-form"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            id="username"
            v-model="loginForm.username"
            :rules="usernameRules"
            :label="$t('label.username')"
            name="username"
            append-icon="person"
            type="text"
            required
          />
          <v-text-field
            v-model="loginForm.password"
            :rules="passwordRules"
            :append-icon="typePassword ? 'visibility' : 'visibility_off'"
            :type="typePassword ? 'password' : 'text'"
            :label="$t('label.password')"
            name="password"
            @click:append="() => (typePassword = !typePassword)"
            @keyup.enter.native="handleLogin"
          />
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            id="loginBottom"
            :loading="loading"
            @click="handleLogin"
          >
            {{ $t('label.login') }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </div>
  </div>
</template>

<script>
import i18n from '@/lang'

export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      typePassword: String,
      loading: false,
      loginForm: {
        username: '',
        password: ''
      },
      usernameRules: [
        v => !!v || i18n.t('errors.username_must_be_filled')
      ],
      passwordRules: [
        v => !!v || i18n.t('errors.password_must_be_filled'),
        v => (v && v.length >= 5) || i18n.t('errors.password_must_be_more_than_characters')
      ]
    }
  },
  methods: {
    handleLogin() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$store.dispatch('user/login', this.loginForm)
          .then(async(response) => {
            if ((response.role !== 'faskes') && (this.$store.getters['permission/permission_routes'].length > 0)) {
              await this.$store.dispatch('toast/successToast', 'Login Berhasil')
              await this.$router.push({ path: '/' })
            } else {
              await this.$store.dispatch('toast/successToast', 'Login Berhasil')
              await this.$router.push({ path: '/laporan' })
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
            this.$refs.form.reset()
          })
      }
    }
  }
}
</script>
