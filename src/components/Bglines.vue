<template>
  <div class="bglines"></div>
</template>

<script>
import { randomWithin, randomFrom } from "../functions/Random";
export default {
  mounted() {
    this.initBg();
  },
  methods: {
    initBg() {
      const bg = document.querySelector(".bglines");
      this.createLines(
        bg,
        ["#6ac4e7", "#5bbee4", "#78cae9", "#94d5ee", "#cdebf7"],
        20
      );
    },
    createLines(parent, colors, count) {
      const elms = new Array(count)
        .fill(0)
        .map(() => document.createElement("div"));
      elms.forEach((el) => {
        const st = el.style;
        st.position = "absolute";
        st.left = "-50%";
        st.top = `${randomWithin(0, 100)}%`;
        st.width = "200%";
        st.height = `${randomWithin(3, 20)}%`;
        st.transform = `rotate(${randomWithin(-20, 20)}deg)`;
        st.opacity = `${randomWithin(0.1, 0.5)}`;
        st.backgroundColor = randomFrom(colors);
        st.mixBlendMode = "darken";
        parent.appendChild(el);
      });
    },
  },
};
</script>

<style>
.bglines {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: linear-gradient(
    to top,
    rgb(160, 207, 229) 0%,
    rgb(174, 203, 253) 28%,
    rgb(170, 185, 224) 100%
  );
}
</style>
