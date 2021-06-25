import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

export default {
  install(Vue) {
    Sentry.init({
      Vue,
      dsn: process.env.VUE_APP_SENTRY_DSN,
      release: process.env.VUE_APP_VERSION,
      environment: process.env.VUE_APP_ERROR_ENVIRONMENT,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: parseFloat(process.env.VUE_APP_TRACES_SAMPLE_RATE),
      tracingOptions: {
        trackComponents: true
      }
    })
  }
}
