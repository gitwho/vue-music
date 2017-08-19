<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probe-type="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar"  class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :data-index="index"
            class="item"
            :class="{'current':currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT =18
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
//    data里的数据会被vue实时监听
    data() {
      return {
        scrollY : -1,
        currentIndex: 0, //当前的列表的位置
        diff: -1
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true //告诉scroll组件，监听滚动
      this.listHeight = [] // 每个group到文档顶部的距离
      this.probeType = 3
    },
    computed: {
//    得到右侧列表
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        console.log(anchorIndex)
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY // Y坐标
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
//        坐标差除以每个高度值，就是相差的index值
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // "| 0": 向下取整
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        console.log(anchorIndex)
        this._scrollTo(anchorIndex)
      },
      scroll(pos) { //scroll组件 emit 返回的 位置
        this.scrollY = pos.y
      },
      _scrollTo(index) {
//          index为 null (没有点上)
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        }else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }

//      this.listHeight[index] 是 负值
        this.scrollY = - this.listHeight[index]
        console.log('ys-'+this.scrollY)
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // " 0 ":缓动动画时间
      },
//      计算高度
      _calculateHeight() {
        this.listHeight = [] //清空数据
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
//        data数据发生变化
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
//
      scrollY(newY) {
        const listHeight = this.listHeight
//      当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
//        在中间部分滚动
        for (let i = 0;i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
//
          if ( -newY >= height1 && -newY <= height2 ) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
//        当滚动到底部，且-newY大于最后一个元素的上限
//       减 2 ： listHeight.length 大于 列表个数，且列表个数从0开始计数，
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop === fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll, Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
