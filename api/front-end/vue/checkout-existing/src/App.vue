<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  created() {
    if(this.$route.name != "login") {
      this.$router.replace({name: 'login'});
    }
  }
}
</script>