import { randomFrom } from "./Random.js";

export const randomSnow = () => {
  const normals = [1, 4, 7, 10, 13, 16];
  const rares = [2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18];
  const isRare = Math.random() > 0.8;
  const num = randomFrom(isRare ? rares : normals);
  return `./assets/snow-${num.toString().padStart(2, "0")}.svg`;
};
