import {
  request
} from "../request"

//搜索音乐
export function getMusicListData(keywords){
  return request({
    url: "/search",
    params: {
      keywords,
      type: 1,
      limit: 100
    }
  })
}

//播放音乐
export function playMusicData(id) {
  return request({
    url: "/song/url",
    params: {
      id
    }
  })
}