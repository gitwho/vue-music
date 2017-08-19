<template>
  <div class="singer">
    <listview @select="selectSinger" :data="singer"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    data() {
      return {
        singer: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
//          跳转接口
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)  // this.$store.commit('',xx)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK){
            //            console.log(res.data.list)
//            console.log(
//              this._normalizeSinger(res.data.list)
//            )
            this.singer = this._normalizeSinger(res.data.list)
          }
        })
      },
//      规范数据
      _normalizeSinger(list) {
        let map = {
          hot: { // 热门
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid,
            }))
          }
//          根据Findex做聚类
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        console.log(map)
//      处理 map 得到有序列表
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        console.log(ret)
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({   //扩展运算符
        setSinger:'SET_SINGER'  //对象映射
      })
    },
    components: {
      Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
