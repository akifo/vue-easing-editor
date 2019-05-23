<template>
  <div class="EasingBall" @click="handleClick">
    <div class="ball-wrap">
      <!--
      <transition-group name="ball" mode="in-out">
        <div
          v-for="t in ballAmount"
          :key="`${easingCubicBezier}_${t}`"
          class="ball residualBall"
          :style="residualBallStyles(t / ballAmount)"
        ></div>
      </transition-group>
      -->
      <transition name="ball" mode="out-in">
        <div
          class="ball moveBall"
          :style="stylesObject"
          :key="`${easingCubicBezier}_${reStart}`"
        ></div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Point } from './point.interface'
import {
  EasingCubicBezier,
  EasingPoints,
  toEasingCubicBezier
} from './easing-status.interface'

@Component
export default class EasingBall extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => [0.4, 0.1, 0.4, 0.8]
  })
  value!: EasingPoints
  @Prop({
    type: Number,
    required: false,
    default: 10
  })
  ballAmount!: number
  width!: number
  reStart: number = 1

  get easingCubicBezier(): EasingCubicBezier {
    return toEasingCubicBezier(this.value)
  }

  get pointA(): Point {
    return {
      cx: 0,
      cy: 0
    }
  }

  get pointB(): Point {
    return {
      cx: this.value[0],
      cy: this.value[1]
    }
  }

  get pointC(): Point {
    return {
      cx: this.value[2],
      cy: this.value[3]
    }
  }

  get pointD(): Point {
    return {
      cx: 1,
      cy: 1
    }
  }

  get stylesObject() {
    return {
      'transition-timing-function': this.easingCubicBezier,
      'transition-duration': '1.5s',
      'transition-delay': `0s`,
      'transition-property': 'left'
      // left: `calc(100% - 100px)`,
      // 'animation-timing-function': this.easingCubicBezier
    }
  }

  residualBallStyles(t: number) {
    // console.log(this.clientWidth, this.$el.clientWidth)
    // const width = 400
    return {
      'transition-delay': `${t}s`,
      'transition-property': 'opacity',
      // opacity: 1,
      left: `${this.getPositionX(t) * this.width}px`
    }
  }

  getPositionX(t: number): number {
    return (
      Math.pow(1 - t, 3) * this.pointA.cy +
      3 * Math.pow(1 - t, 2) * t * this.pointB.cy +
      3 * (1 - t) * Math.pow(t, 2) * this.pointC.cy +
      Math.pow(t, 3) * this.pointD.cy
    )
  }

  handleClick() {
    this.reStart++
  }

  mounted() {
    this.$nextTick(() => {
      this.width = ((this.$el && this.$el.clientWidth) || 300) - 100
    })
  }
}
</script>

<style lang="stylus" scoped>
$ball-size = 20px

.EasingBall
  display block
  width 100%
  padding: 5px 0
  background-color #f4edf5
  .ball-wrap
    position relative
    height $ball-size
    .ball
      position absolute
      top 0
      border-radius 50%
      width $ball-size
      height $ball-size
    .residualBall
      background-color #ff000044
      opacity: 1
    .moveBall
      background-color #8240a244
      // opacity: 0
    // .ball-enter-active
    //   opacity: 1
    .ball-enter
      left: 0
      opacity: 0
    .ball-enter-to
      left "calc(100% - %s)" % $ball-size
      opacity: 1
    .ball-leave-active
      transition-duration 0s!important
      transition-delay: 0s!important
      opacity: 0!important
    // .ball-leave-active
    //   opacity: 0
    //   transition-duration: 0
    //   transition-delay: 0
      // transition-duration 1s
      // transition-property left
      // animation-name moveBall
      // animation-fill-mode: both
      // animation 1s

  // @keyframes moveBall
  //   0%
  //     left 0
  //   100%
  //     left calc(100% - 100px)
  // @keyframes showBall
  //   0%
  //     opacity: 0
  //   99.99%
  //     opacity: 0
  //   100%
  //     opacity: 1
</style>
