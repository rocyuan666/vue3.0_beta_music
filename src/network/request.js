import axios from "axios"
export function request(config){
  const sl1 = axios.create({
    baseURL: "http://roc.luojing.top:3001",
    timeout: 5000
  })
  // 拦截器
  sl1.interceptors.request.use(
    config => {
      //请求拦截成功
      return config
    }
  )

  sl1.interceptors.response.use(
    res => {
      //响应拦截成功
      return res
    },
    err => {
      // console.log("请求失败")
    }
  )
  
  return sl1(config)
}