<template>
  <div class="EasingDefaults">
    <div
      v-for="(easingPointsGroup, index) in easingPointsGroups"
      :key="index"
      class="EasingGui-wrap"
      :class="{ active: isActive(easingPointsGroup) }"
    >
      <EasingGui
        :value="easingPointsGroup[0]"
        :svgWidth="90"
        :svgHeight="90"
        @click.native="onChangeEasingPoints(easingPointsGroup[0])"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Prop } from 'vue-property-decorator'
import EasingGui from './EasingGui.vue'
import {
  EasingPoints,
  EasingStatus,
  easingStatusGroups,
  getEasingCubicBezierPoints
} from './easing-status.interface'

@Component({
  components: {
    EasingGui
  }
})
export default class EasingDefaults extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => [0.4, 0.1, 0.4, 0.8]
  })
  value!: EasingPoints

  private easingStatusGroups: EasingStatus[][] = easingStatusGroups

  get easingPointsGroups(): EasingPoints[][] {
    return easingStatusGroups.map(easingStatusGroup =>
      easingStatusGroup.map(easingStatus =>
        getEasingCubicBezierPoints(easingStatus)
      )
    )
  }

  isActive(easingPointsGroup: EasingPoints[]): boolean {
    return easingPointsGroup.some(easingPoints =>
      easingPoints.every((point, index) => point === this.value[index])
    )
  }

  @Emit()
  onChangeEasingPoints(easingPoints: EasingPoints): EasingPoints {
    return easingPoints
  }
}
</script>

<style lang="stylus" scoped>
.EasingDefaults
  background-color #f4edf5
  .EasingGui-wrap:not(:first-child)
    margin-top: 20px
  .EasingGui-wrap
    padding: 0
    cursor pointer
    &.active .EasingGui
      background-color: #f3eaa7
</style>
