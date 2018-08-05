import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'  //vuex插件 打印修改mutations日志

Vue.use(Vuex) //注册插件

// vuex 调试工具
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions, getters, state, mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

