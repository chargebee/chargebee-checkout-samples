<script lang="ts">
import { RouterView } from "vue-router";

export default {
  name: "app",
  components: {
    RouterView,
  },
  created() {
    // @ts-ignore
    window.Chargebee.init({
      site: "honeycomics-v3-test",
      publishableKey: "test_qoH22RugUvm5IcxoqUD5Svdcu9mX5figf",
    });
  },
};
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
}
</style>
