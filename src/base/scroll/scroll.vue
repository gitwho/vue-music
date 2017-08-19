<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: { // 滚动操作类型 见better-scroll说明
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
//      判断是否监听scroll事件，true：调用回调得到 位置pos，派发scroll事件
        if (this.listenScroll) {
          let me = this // 保留vue实例的this
          this.scroll.on('scroll', (pos) => {  // this指向scroll,所以钩子函数内改为me
            me.$emit('scroll', pos) //vue实例调用emit方法，发送scroll事件
          })
        }
      },
//      better-scroll方法代理
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
//      拓展功能
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      },

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
