//状态管理
import {playMode} from 'common/js/config'
import {loadSearch, loadPlay} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  //从本地存储获取值
  searchHistory: loadSearch(),
  playHistory: loadPlay()
}

export default state

//保存基础数据，能够计算的数据 均放在 getters.js 中
