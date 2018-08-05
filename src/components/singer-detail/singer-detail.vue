<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import MusicList from 'components/music-list/music-list'
  import {createSong2} from 'common/js/song'
  import {getSongVkey} from 'api/songVkey'

  export default {
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'   //对应 store中的 singer
      ])
    },
    data(){
      return {
        songs: []
      }
    },
    created(){
      console.log(this.singer)
      this._getDetail()
    },
    methods: {
      _getDetail(){
//            在当前页刷新，调回歌手列表
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list){
        let ret = []

        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            //  2018 播放地址新改动
            getSongVkey(musicData.songmid).then((res) => {
              if(res.code === ERR_OK) {
                const songVkey = res.data.items[0].vkey;
                ret.push(createSong2(musicData, songVkey))
              }
            })

            /* 原先*/
            // ret.push(createSong(musicData))

          }
        })

        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
