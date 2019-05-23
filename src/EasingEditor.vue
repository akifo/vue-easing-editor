<template>
  <div class="EasingEditor">
    <EasingBall v-model="easingPoints" />
    <div class="flex">
      <EasingDefaults
        v-model="easingPoints"
        @on-change-easing-points="onChangeEasingPoints"
      />
      <EasingGui v-model="easingPoints" />
    </div>
    <EasingValue
      v-model="easingPoints"
      @on-change-easing-points="onChangeEasingPoints"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import EasingBall from './EasingBall.vue'
import EasingDefaults from './EasingDefaults.vue'
import EasingGui from './EasingGui.vue'
import EasingValue from './EasingValue.vue'
import {
  EasingPoints,
  EasingCubicBezier,
  toEasingCubicBezier
} from './easing-status.interface'

@Component({
  components: {
    EasingBall,
    EasingDefaults,
    EasingGui,
    EasingValue
  }
})
export default class EasingEditor extends Vue {
  @Prop({
    type: String,
    required: false,
    default: 'cubic-bezier(0.4, 0.1, 0.4, 0.8)',
    /**
     * true: "cubic-bezier(0.4, 0.1, 0.4, 0.0)"
     * true: "ease"
     * true: "ease-in"
     * true: "ease-out" etc
     * false: "0.4, 0.1, 0.4, 0"
     */
    validator(val) {
      const pattern = /cubic-bezier\(\s*-?[0-9]\d*(\.\d+)?,\s*-?[0-9]\d*(\.\d+)?,\s*-?[0-9]\d*(\.\d+)?,\s*-?[0-9]\d*(\.\d+)?\)/
      return pattern.test(val)
    }
  })
  value!: EasingCubicBezier

  get easingCubicBezier(): EasingCubicBezier {
    return this.value
  }
  set easingCubicBezier(val: EasingCubicBezier) {
    this.$emit('input', val)
  }

  get easingPoints(): EasingPoints {
    return this.value
      .replace('cubic-bezier(', '')
      .replace(')', '')
      .split(',')
      .map(v => +v) as EasingPoints
  }
  set easingPoints(easingPoints: EasingPoints) {
    const easingCubicBezier: EasingCubicBezier = toEasingCubicBezier(
      easingPoints
    )
    this.$emit('input', easingCubicBezier)
  }

  onChangeEasingPoints(easingPoints: EasingPoints) {
    if (!easingPoints) {
      return
    }
    this.easingPoints = easingPoints
  }

  mounted() {}
}
</script>

<style lang="stylus" scoped>
.EasingEditor
  padding: 10px
  border: 1px solid #dddddd
  border-radius: 4px
  box-shadow: 1px 1px 3px 2px #ddd

  .flex
    display: flex
    margin: 20px 0

    .EasingDefaults
      flex: 0 0 auto
      width: auto

    .EasingGui
      flex: 1 1 auto
      margin-left: 10px
</style>
