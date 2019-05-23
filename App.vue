<template>
  <div id="App">
    <EasingEditor v-model="easing" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EasingEditor from './src/EasingEditor.vue'

type Easing = string

@Component({
  components: {
    EasingEditor
  }
})
export default class App extends Vue {
  easing: Easing = 'cubic-bezier(0.2, 0.1, 0.2, 0.8)'
}
</script>

<style lang="stylus" scoped>
#App
  width 100%
  height 100vh
  min-height 500px
  display flex
  align-items center
  justify-content center
</style>
