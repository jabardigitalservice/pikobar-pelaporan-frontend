import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing/esm/browser'

export default {
  install(Vue, options) {
    Sentry.init({
      Vue,
      dsn: process.env.VUE_APP_SENTRY_DSN,
      release: process.env.VUE_APP_VERSION,
      environment: process.env.VUE_APP_ERROR_ENVIRONMENT,
      integrations: [new BrowserTracing()],
      tracesSampleRate: parseFloat(process.env.VUE_APP_TRACES_SAMPLE_RATE),
      tracingOptions: {
        trackComponents: true
      }
    })
  }
}
