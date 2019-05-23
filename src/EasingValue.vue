<template>
  <div class="EasingValue">
    <span v-if="easingName" class="btn left" @click="onChangeEasingPoints(-1)">
      &lt;
    </span>
    <span>{{ easingName || easingCubicBezier }}</span>
    <span v-if="easingName" class="btn right" @click="onChangeEasingPoints(1)">
      &gt;
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import {
  EasingCubicBezier,
  EasingPoints,
  easingStatusGroups,
  getEasingCubicBezierPoints,
  getEasingNameByEasingPoints,
  toEasingCubicBezier
} from './easing-status.interface'

@Component
export default class EasingValue extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => [0.4, 0.1, 0.4, 0.8]
  })
  value!: EasingPoints

  get easingCubicBezier(): EasingCubicBezier {
    return toEasingCubicBezier(this.value)
  }

  get easingName(): string | null {
    return getEasingNameByEasingPoints(this.value)
  }

  get easingPointsGroups(): EasingPoints[][] {
    return easingStatusGroups.map(easingStatusGroup =>
      easingStatusGroup.map(easingStatus =>
        getEasingCubicBezierPoints(easingStatus)
      )
    )
  }

  get currentPointsGroup(): EasingPoints[] | undefined {
    return this.easingPointsGroups.find(easingPointsGroup =>
      easingPointsGroup.some(easingPoints =>
        easingPoints.every((point, index) => point === this.value[index])
      )
    )
  }

  get currentPointsIndex(): number | undefined | null {
    if (!this.currentPointsGroup) {
      return null
    }
    return this.currentPointsGroup.findIndex(easingPoints =>
      easingPoints.every((point, index) => point === this.value[index])
    )
  }

  @Emit()
  onChangeEasingPoints(val: number): EasingPoints {
    if (
      this.currentPointsIndex === null ||
      this.currentPointsIndex === undefined ||
      this.currentPointsGroup === undefined
    ) {
      return this.value
    }
    let targetIndex = this.currentPointsIndex + val
    const currentPointsGroupLength = this.currentPointsGroup.length - 1
    if (targetIndex < 0) {
      targetIndex = currentPointsGroupLength
    } else if (targetIndex > currentPointsGroupLength) {
      targetIndex = 0
    }
    const easingPoints = this.currentPointsGroup[targetIndex]
    return easingPoints
  }
}
</script>

<style lang="stylus" scoped>
.EasingValue
  background-color #f4edf5
  padding: 5px 10px
  text-align center
  .left
    float left
  .right
    float right
  .btn
    cursor pointer
    &:hover
      color: #8240a2
</style>
