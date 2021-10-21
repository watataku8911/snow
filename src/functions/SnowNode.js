import { randomSnow } from "./Assets.js";
import { SnowAnimOption } from "./SnowAnimOption.js";
import { SnowOption } from "./SnowOption.js";

// 再利用するためのプール
const nodePool = [];

export class SnowNode {
  constructor(parent, option = new SnowOption()) {
    // ノード本体
    this._el = document.createElement("div");
    // 重力アニメーションのためのラッパー
    this._elWrapper = document.createElement("div");
    // 動作中のアニメーションを保持する配列
    this._anims = [];
    parent.appendChild(this._elWrapper);
    this._elWrapper.appendChild(this._el);
    this._initStyle();
    this._option = option;
  }

  _initStyle() {
    const styleWrapper = this._elWrapper.style;
    styleWrapper.position = "absolute";
    styleWrapper.left = "0";
    styleWrapper.top = "0";
    styleWrapper.willChange = "transform";

    const style = this._el.style;
    style.position = "absolute";
    style.left = "0";
    style.top = "0";
    style.width = "200px";
    style.height = "200px";
    style.backgroundImage = `url("${randomSnow()}")`;
    style.visibility = "hidden";
    style.backgroundRepeat = "no-repeat";
    style.willChange = "transform";
  }

  /**
   * ノードの状態をリセットします
   * 動作中のアニメーションがあればすべて中断し、ノードは非表示になります。
   * @param {SnowOption} option  初期位置・スタイルの設定
   */
  reset(option = new SnowOption()) {
    this._anims.forEach((anim) => anim.cancel());
    //this._el.style.backgroundImage = `url(${randomStar()})`;
    this._option = option;
  }

  /**
   * 方向・速度等の設定にしたがって、ノードを射出します。
   * @param {SnowAnimOption} option アニメーションの設定
   */
  async emit(option = new SnowAnimOption()) {
    const basePos = this._option.pos;
    const baseScale = this._option.size / 100;

    /// 本体のアニメーション（設定に基づく方向・速度のアニメーション） ///
    // キーフレーム1
    const init = {
      visibility: "visible",
      opacity: 1,
      transform: `
        translate(${basePos.x}px, ${basePos.y}px) 
        scale(0) 
        rotate(${option.angle * -0.3}deg)
      `,
    };
    // キーフレーム2
    const fromOffset = 0.1;
    const from = {
      visibility: "visible",
      opacity: 1,
      transform: `
        translate(${option.vec.x * fromOffset + basePos.x}px, ${option.vec.y *
        fromOffset +
        basePos.y}px) 
        scale(${baseScale}) 
        rotate(0deg)
      `,
      offset: fromOffset,
    };
    // キーフレーム3
    const to = {
      visibility: "hidden",
      opacity: option.alpha,
      transform: `
        translate(${option.vec.x + basePos.x}px, ${option.vec.y + basePos.y}px) 
        scale(${option.scale * baseScale}) 
        rotate(${option.angle}deg)
      `,
    };
    // キーフレーム1-3を使ってアニメーション
    const anim = this._el.animate([init, from, to], {
      duration: option.duration,
      iterations: 1,
    });

    /// 重力（縦方向）のアニメーション ///
    /// 外側のラッパーオブジェクトを重力方向にアニメーションさせる ///
    const G = 1000;
    // アニメーション期間で最終的に到達するY位置を求める
    const totalG = ((option.duration / 1000) * G) / 2;
    // キーフレーム1
    const vFrom = {
      transform: "translateY(0px)",
    };
    // キーフレーム2
    const vTo = {
      transform: `translateY(${totalG}px)`,
    };
    // キーフレーム1-2でアニメーション
    const vAnim = this._elWrapper.animate([vFrom, vTo], {
      duration: option.duration,
      iterations: 1,
      // 緩い放物線を描くようにイージングを設定する
      easing: "cubic-bezier(.37,.01,.96,.58)",
    });

    // 実行中のアニメーションを配列に保持（reset用）
    this._anims = [anim, vAnim];
    // アニメーションの終了を待つ
    await anim.finished;
    // 実行中のアニメーション配列をクリア
    this._anims = [];
    // this._elWrapper.style.willChange = "auto";
    // this._el.style.willChange = "auto";
  }
}

/**
 * 新しくノードを作成するファクトリ関数です。
 * 再利用できるノードがある場合には再利用し、なければ新たに生成します。
 */
const createSnow = (parent, snowOption = new SnowOption()) => {
  const snow = nodePool.pop();
  if (snow) {
    snow.reset(snowOption);
    return snow;
  }
  return new SnowNode(parent, snowOption);
};

/**
 * 新しいノードを生成し、即座にアニメーションを開始します。
 * このメソッドで生成されたノードは、効率化のため、アニメーションの終了後に再利用プールに保存されます。
 * @param {HTMLElement} parent
 * @param {SnowOption} snowOption
 * @param {SnowAnimOption} animOption
 */
export const emitStar = async (
  parent,
  snowOption = new SnowOption(),
  animOption = new SnowAnimOption()
) => {
  const star = createSnow(parent, snowOption);
  await star.emit(animOption);
  nodePool.push(star);
};
