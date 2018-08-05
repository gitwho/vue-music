<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created(){
      this.touch = {} //touch实例，不同回调共享数据
    },
    methods:{
      progressTouchStart(e){
        this.touch.initiated = true  //初始化
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth  //进度条宽度,已偏移量
      },
      progressTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth =Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))  //取进度条与手指偏移量之间最小值（最大偏移量为进度条长度）
        this._offset(offsetWidth)
      },
      progressTouchEnd(e){
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e){
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对 (offsetX相对定位的父元素的偏移)
        // this._offset(e.offsetX)
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange',percent)
      },
      _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch:{
      percent(newPercent){
        if (newPercent >= 0 && !this.touch.initiated){
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
