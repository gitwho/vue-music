import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  // 判断是否有 ?
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // es6写法 url += `&${k}=${encodeURIComponent(value)}`
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  // 去掉第一个键值对的 &
  return url ? url.substring(1) : ''
}
