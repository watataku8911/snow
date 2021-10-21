<template>
  <div id="app">
    <Bglines />
    <Starge />
  </div>
</template>

<script>
import Bglines from "./components/Bglines.vue";
import Starge from "./components/Stage.vue";
export default {
  name: "App",
  components: {
    Bglines,
    Starge,
  },
  data() {
    return {};
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
}
</style>
