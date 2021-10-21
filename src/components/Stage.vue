<template>
  <div class="stage"></div>
</template>

<script>
import { Emitter } from "../functions/Emitter";
import { Point } from "../functions/Point";
export default {
  mounted() {
    this.initStage();
  },
  methods: {
    initStage() {
      const root = document.querySelector(".stage");
      const emitter = new Emitter(root);
      const isLargeScreen = root.clientWidth > 500;
      emitter.pos = new Point(root.clientWidth / 2, root.clientHeight / 2);
      emitter.vec.setLengthAndAngle(1300, -90);
      emitter.nps = isLargeScreen ? 25 : 15;
      root.addEventListener("mousemove", (ev) => {
        emitter.pos = new Point(ev.clientX, ev.clientY);
      });
      root.addEventListener("touchmove", (ev) => {
        const tc = ev.touches[0];
        emitter.pos = new Point(tc.clientX, tc.clientY);
      });
      document.addEventListener("visibilitychange", () => {
        console.log(document.visibilityState);
        emitter[document.visibilityState === "hidden" ? "stop" : "start"]();
      });
      emitter.start();
    },
  },
};
</script>

<style>
.stage {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
</style>
