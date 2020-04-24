<template>
  <div id="app">
    <home></home>
  </div>
</template>

<script>
import home from "views/home/Home"

export default {
  name: 'App',
  components: {
    home
  }
}
</script>

<style>
  @import "assets/css/base.css";
  html, body, #app{
    height: 100%;
  }
</style>
