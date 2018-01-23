<template>
  <div id="app" class="d-flex flex-column">
    <top-bar></top-bar>
    <div class="d-flex flex-1">
      <el-sidenav :routerIndex="0" class="text-white bg-primary"></el-sidenav>
      <!--todo flex-->
      <div class="flex-1 mx-2 mb-2 main-vf d-flex flex-column">
        <!--<h-breadcrumb class="ml-3 font-weight-bold"></h-breadcrumb>-->
        <router-view class="main-router-view margin-main flex-1"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import topBar from './components/topbar'

  export default {
    name: 'App',
    components: {topBar}
  }
</script>

<style lang="scss">
  @import "./styles/app";

  html, body, #app {
    height: 100%;
  }
</style>
