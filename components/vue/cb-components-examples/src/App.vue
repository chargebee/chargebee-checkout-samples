<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {

  },
  created() {
    window.Chargebee.init({
      site: "honeycomics-v3-test",
      publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf"
    })
  }
}
</script>