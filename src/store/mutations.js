// 同步修改

import * as types from './mutation-types'

//方法，函数 数据修改
const mutations = {
  // [types.SET_SINGER](state, singer) 方法名(参数， 传参)
  [types.SET_SINGER](state, singer){
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },

  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },

  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
}

export default mutations
