<template>
  <div class="EasingGui">
    <div ref="svg">
      <svg
        :height="svgHeight"
        :width="svgWidth"
        :viewBox="viewBox"
        @mousedown.self="handleSvgClick"
      >
        <path :d="pathAB" stroke="#aa8fc2" stroke-width="0.007" fill="none" />
        <path :d="pathCD" stroke="#aa8fc2" stroke-width="0.007" fill="none" />
        <path :d="pathAD" stroke="#00000011" stroke-width="0.005" fill="none" />
        <path :d="path" stroke="black" stroke-width="0.012" fill="none" />

        <g stroke="#8240a2" stroke-width="0.05">
          <circle
            id="pointB"
            :cx="pointB.cx"
            :cy="pointB.cy"
            r="0.01"
            @mousedown="onMouseDown($event)"
          ></circle>
          <circle
            id="pointC"
            :cx="pointC.cx"
            :cy="pointC.cy"
            r="0.01"
            @mousedown="onMouseDown($event)"
          ></circle>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Point } from './point.interface'
import { EasingPoints } from './easing-status.interface'

export interface Dimension {
  width: number
  height: number
}

export enum Points {
  PointB = 1,
  PointC
}

@Component
export default class EasingGui extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => [0.4, 0.1, 0.4, 0.8]
  })
  value!: EasingPoints
  @Prop({
    type: Number,
    required: false,
    default: 300
  })
  svgHeight!: number
  @Prop({
    type: Number,
    required: false,
    default: 300
  })
  svgWidth!: number
  @Prop({
    type: Number,
    required: false,
    default: 0.2
  })
  viewBoxPadding!: number

  private mousePointStartScreen: Point = {
    cx: 0,
    cy: 0
  }
  private mousePointMovedScreen: Point = {
    cx: 0,
    cy: 0
  }
  private mousePointStartOffset: Point = {
    cx: 0,
    cy: 0
  }
  private edittingPoint!: Points
  private Points = Points

  get viewBox(): string {
    return `-${this.viewBoxPadding} -${this.viewBoxPadding} ${1 +
      this.viewBoxPadding * 2} ${1 + this.viewBoxPadding * 2}`
  }

  get svgPaddingRate(): number {
    return this.viewBoxPadding / (1 + this.viewBoxPadding * 2)
  }

  /**
   * SVG の内側の 0-1 座標外の padding の px値
   * Actual は screen の px値を意味する
   */
  get viewBoxPaddingActual(): Dimension {
    return {
      width: this.svgWidth * this.svgPaddingRate,
      height: this.svgHeight * this.svgPaddingRate
    }
  }

  /**
   * SVG の内側の 0-1 座標内の実際の px値
   * Actual は screen の px値を意味する
   */
  get targetAreaActual(): Dimension {
    return {
      width: this.svgWidth - this.viewBoxPaddingActual.width * 2,
      height: this.svgHeight - this.viewBoxPaddingActual.height * 2
    }
  }

  /**
   * マウスが動いた分だけの cx cy
   * Unit は 0-1 の範囲を意味する
   */
  get mousePointDiffUnit(): Point {
    return {
      cx:
        (this.mousePointMovedScreen.cx - this.mousePointStartScreen.cx) /
        this.targetAreaActual.width,
      cy:
        (-this.mousePointMovedScreen.cy + this.mousePointStartScreen.cy) /
        this.targetAreaActual.height
    }
  }

  /**
   * マウスダウン初期値の cx cy
   * Unit は 0-1 の範囲を意味する
   */
  get mousePointStartUnit(): Point {
    return {
      cx:
        (this.mousePointStartOffset.cx - this.viewBoxPaddingActual.width) /
        this.targetAreaActual.width,
      cy:
        (this.mousePointStartOffset.cy - this.viewBoxPaddingActual.height) /
        this.targetAreaActual.height
    }
  }

  /**
   * 現在のマウスの位置の cx cy
   * Unit は 0-1 の範囲を意味する
   */
  get mousePointUnit(): Point {
    return {
      cx: this.mousePointDiffUnit.cx + this.mousePointStartUnit.cx,
      cy: this.mousePointDiffUnit.cy + this.mousePointStartUnit.cy
    }
  }

  /**
   * 親コンポーネントに投げる easing
   * ex) [0.2, 0.1, 0.9, 1]
   */
  get easingPoints(): EasingPoints {
    const cx = this.mousePointUnit.cx.toFixed(2)
    const cy = this.mousePointUnit.cy.toFixed(2)
    if (this.edittingPoint === Points.PointB) {
      return [+cx, +cy, this.pointC.cx, this.pointC.cy]
    } else if (this.edittingPoint === Points.PointC) {
      return [this.pointB.cx, this.pointB.cy, +cx, +cy]
    } else {
      return [this.pointB.cx, this.pointB.cy, this.pointC.cx, this.pointC.cy]
    }
  }

  get path(): string {
    return `M${this.pointA.cx},${this.pointA.cy}
      C${this.pointB.cx},${this.pointB.cy}
      ${this.pointC.cx},${this.pointC.cy}
      ${this.pointD.cx}, ${this.pointD.cy}`
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
  set pointB(point: Point) {
    const easingPoints: EasingPoints = [
      +point.cx.toFixed(2),
      +point.cy.toFixed(2),
      this.pointC.cx,
      this.pointC.cy
    ]
    this.$emit('input', easingPoints)
  }

  get pointC(): Point {
    return {
      cx: this.value[2],
      cy: this.value[3]
    }
  }
  set pointC(point: Point) {
    const easingPoints: EasingPoints = [
      this.pointB.cx,
      this.pointB.cy,
      +point.cx.toFixed(2),
      +point.cy.toFixed(2)
    ]
    this.$emit('input', easingPoints)
  }

  get pointD(): Point {
    return {
      cx: 1,
      cy: 1
    }
  }

  get pathAB(): string {
    return `M ${this.pointA.cx} ${this.pointA.cy}
    L ${this.pointB.cx} ${this.pointB.cy}`
  }

  get pathCD(): string {
    return `M ${this.pointC.cx} ${this.pointC.cy}
    L ${this.pointD.cx} ${this.pointD.cy}`
  }

  get pathAD(): string {
    return `M ${this.pointA.cx} ${this.pointA.cy}
    L ${this.pointD.cx} ${this.pointD.cy}`
  }

  onMouseDown(event: MouseEvent): void {
    this.handleSvgClick(event)
  }

  @Emit('input')
  onMouseMove(event: MouseEvent): EasingPoints {
    event.preventDefault()
    this.mousePointMovedScreen.cx = event.screenX
    this.mousePointMovedScreen.cy = event.screenY
    return this.easingPoints
  }

  @Emit('input')
  handleSvgClick(event: MouseEvent): EasingPoints {
    event.preventDefault()
    this.mousePointStartScreen.cx = event.screenX
    this.mousePointStartScreen.cy = event.screenY
    this.mousePointMovedScreen.cx = event.screenX
    this.mousePointMovedScreen.cy = event.screenY
    this.mousePointStartOffset.cx = event.offsetX
    this.mousePointStartOffset.cy = event.offsetY
    this.edittingPoint = this.closestPoint(this.mousePointUnit)
    document.addEventListener('mousemove', this.onMouseMove, false)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', this.onMouseMove)
      this.mousePointStartScreen.cx = 0
      this.mousePointStartScreen.cy = 0
      this.mousePointMovedScreen.cx = 0
      this.mousePointMovedScreen.cy = 0
      this.mousePointStartOffset.cx = 0
      this.mousePointStartOffset.cy = 0
    })
    return this.easingPoints
  }

  closestPoint(mousePointToEasingUnit: Point): Points {
    const distanceBX = Math.hypot(
      mousePointToEasingUnit.cx - this.pointB.cx,
      mousePointToEasingUnit.cy - this.pointB.cy
    )
    const distanceCX = Math.hypot(
      mousePointToEasingUnit.cx - this.pointC.cx,
      mousePointToEasingUnit.cy - this.pointC.cy
    )
    return distanceBX > distanceCX ? Points.PointC : Points.PointB
  }
}
</script>

<style lang="stylus" scoped>
.EasingGui
  position relative
  display: inline-block
  transform scaleY(-1)
  background-color #fbe9e9
  svg
    vertical-align: bottom;
</style>
