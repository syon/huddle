// ==UserScript==
// @name           Lobine Huddle
// @description    Hatena Bookmark Sidebar via Lobine
// @namespace      syon.github
// @include        /^https?://.*$/
// @exclude        https://lobine.app/*
// @require        https://code.jquery.com/jquery-3.5.1.min.js
// @require        https://cdn.jsdelivr.net/npm/vue@2.6.11
// @require        https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js
// @version        0.0.1
// ==/UserScript==

window.jq = $.noConflict(true)

const appTemplate = `
<div id="huddle-target" style="opacity: 1" >
  <iframe
    v-if="isIframe"
    :src="iframeUrl"
    id="huddle-iframe"
  >
  </iframe>
</div>
`

const appStyle = `
#huddle-target {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  z-index: 1000000001;
}
#huddle-target #huddle-iframe {
  width: 300px;
  height: 100vh;
}
`

jq(document).ready(function () {
  try {
    jq(document.lastChild).append(appTemplate)
  } catch (e) {
    jq(document.body).append(appTemplate)
  }

  jq('head').append(`<style type="text/css">${appStyle}</style>`)

  const $axios = axios.create({
    baseURL: 'https://hatena.now.sh/api/',
    timeout: 30000,
  })

  const app = new Vue({
    el: '#huddle-target',
    data: {
      count: 0,
      iframeUrl: '',
    },
    computed: {
      isIframe() {
        return this.count > 0
      },
    },
    async mounted() {
      await this.getCount()
      const url = document.location.href
      this.iframeUrl = `https://rd.lobine.app/?url=${url}`
    },
    methods: {
      async getCount() {
        const url = document.location.href
        const res = await $axios.get(`bookmark/getEntryCount?url=${url}`)
        this.count = res.data
      },
    },
  })
})
