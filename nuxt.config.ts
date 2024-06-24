import ja from './locales/ja.json'
import en from './locales/en.json'

export default defineNuxtConfig({
  ssr: process.env.SSR === 'true',
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:3009',
      nuxtAuthSecret:
        process.env.NUXT_AUTH_SECRET || '875F92F5BE94E32B6AE6CA7793736',
      timezone: process.env.TIMEZONE || 'Asia/Tokyo',
    },
  },
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  components: [
    {
      path: '~/components/',
      pathPrefix: false,
    },
  ],
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element.scss" as element;`,
        },
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    // add `vueI18n` option to `@nuxtjs/i18n` module options
    vueI18n: {
      legacy: false,
      locale: 'ja',
      messages: {
        en,
        ja,
      },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
  },
})
