import {commonParams} from './config'
import axios from 'axios'

export function getSongVkey(mid) {
  const url = '/api/songVkey'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: 'C400'+ mid +'.m4a',
    guid: 6344165318,
    platform: 'yqq',
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0,
    cid: 205361747,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
