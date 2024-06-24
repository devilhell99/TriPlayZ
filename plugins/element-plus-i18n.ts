import ElementPlus from 'element-plus'
// @ts-ignore
import ja from 'element-plus/dist/locale/ja.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus, {
    locale: ja,
  })
})
