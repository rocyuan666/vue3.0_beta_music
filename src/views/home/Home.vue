<template>
  <div id="home">
    <div class="content">
      <!-- 头部 -->
      <div class="header">
        <h1>Roc音乐</h1>
        <div class="query-box">
          <input type="text" v-model.trim="musicListData.keywords" placeholder="请输入您要查询关键字" @keydown.enter="musicListData.fnGetMusicList">
          <a href="javascript:;" @click="musicListData.fnGetMusicList">搜索</a>
        </div>
      </div>
      <!-- 主体 -->
      <div class="main">
        <!-- 歌曲列表 -->
        <div class="flex-item left">
          <ul v-if="pubData.cpListShow">
            <li v-for="(item,index) in musicListData.musicList" :key="item.id" @dblclick="playData.playMusic(item.id, index)" :class="{play: index == playData.playIndex}">
              <span v-for="item in item.artists" :key="item.id">{{item.name}} - </span>《{{item.name}}》
            </li>
          </ul>
          <div class="place-query" v-else>
            搜索内容为空~
          </div>
        </div>
        <!-- 歌曲动画 -->
        <div class="flex-item right">
          <div class="music-info">
            <h2  v-if="pubData.name != '《undefined》'">{{pubData.name}}</h2>
            <h2 v-else>当前没有歌曲播放哦~</h2>
            <p class="zz-name">
              <span v-for="(item, index) in pubData.names" :key="item.id">{{item.name}}{{pubData.names.length-1 == index ? "" : "、"}}</span>
            </p>
          </div>
          <div class="box-cp" :class="{animation: pubData.isplay}" :style="{backgroundImage: `url(${pubData.imginfo})`}" >
            <img src="~assets/img/changpian.png" alt="">
          </div>
        </div>
      </div>
      <!-- 底部控件 -->
      <div class="foot">
        <audio
          class="audio"
          @play="pubData.play"
          @pause="pubData.pause"
          controls
          autoplay
          loop
          :src="playData.playSrc"></audio>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive, computed
} from "vue"

import {
  getMusicListData,
  playMusicData,
  checkMusicData
} from "network/home/home"

import { Message } from "element-ui"

export default {
  name: "Home",
  setup(){
    // 公共属性，方法
    const pubData = reactive({
      cpListShow: computed(_ => {
        return musicListData.musicList.length
      }),
      name: computed(_ => `《${musicListData.musicList[playData.playIndex] && musicListData.musicList[playData.playIndex].name}》`),
      names: computed(_ => musicListData.musicList[playData.playIndex] && musicListData.musicList[playData.playIndex].artists),
      imginfo: computed(_ => musicListData.musicList[playData.playIndex] && musicListData.musicList[playData.playIndex].album.artist.img1v1Url),
      isplay: false,
      play(){
        pubData.isplay = true
      },
      pause(){
        pubData.isplay = false
      }
    })

    // 获取歌曲列表，属性，方法
    const musicListData = reactive({
      keywords: window.sessionStorage.getItem("keywords") || "",
      musicList: JSON.parse(window.sessionStorage.getItem("musicList")) || [],
      fnGetMusicList(){
        if(musicListData.keywords){
          getMusicListData(musicListData.keywords).then(res => {
            if(res.data.code != 200){
              console.log("获取失败")
              return
            }
            musicListData.musicList = res.data.result.songs;
            // 本地储存起来
            window.sessionStorage.setItem("musicList", JSON.stringify(musicListData.musicList))
            window.sessionStorage.setItem("keywords", musicListData.keywords)
          })
        }else{
          alert("搜索歌曲不能为空")
        }
        
      }
    })

    // 播放音乐，属性，方法
    const playData = reactive({
      playSrc: "",
      playId: "",
      playIndex: -1,
      playMusic(playId, playIndex){
        playData.playId = playId
        playData.playIndex = playIndex
        // 获取歌曲播放链接
        playMusicData(playId).then(res => {
          if(res.data.code != 200 ){
            console.log("获取失败")
            return
          }
          // 判断歌曲是否可用
          if(res.data.data[0].url != null){
            playData.playSrc = res.data.data[0].url

          }else{
            console.log("歌曲无版权")
          }
        })
      }
    })

    return {
      pubData,
      musicListData,
      playData,
    }
  }
}
</script>

<style>
#home{
    height:100%;
    background: url(~assets/img/bg.jpg) no-repeat 50% 50%;
    background-size: 100% auto;
  }
  .content{
    opacity: .75;
    width: 900px;
    height: 600px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 3px rgba(0, 0, 0, .2);
    border-radius: 6px;
    overflow: hidden;
  }
  .header{
    height: 60px;
    line-height: 60px;
    background: #7cbcfc;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .15);
  }
  .header h1{
    float: left;
    color:#eee;
    font-size: 20px;
    padding:0 50px;
  }
  .query-box{
    float:right;
    padding:0 50px;
  }
  .query-box input{
    outline: none;
    padding: 0 20px;
    height: 30px;
    border-radius: 15px;
    margin-right: 6px;
  }
  .query-box a{
    font-size: 16px;
    color:#eee;
    transition: all .3s;
  }
  .query-box a:hover{
    color:#ddd;
  }

  .main{
    height: 480px;
    display: flex;
    box-sizing: border-box;
  }
  .place-query{
    line-height: 480px;
    text-align: center;
    font-size: 18px;
  }
  .left{
    overflow-y: auto;
    width: 350px;
    border-right: 2px solid rgba(0, 0, 0, .1);
  }
  .right{
    position: relative;
    flex: 1;
    text-align: center;
  }
  .music-info{
    padding-top: 60px;
  }
  .music-info h2{
    font-size: 20px;
  }
  .zz-name{
    font-size: 16px;
  }
  .box-cp{
    position: absolute;
    top:50%;
    left:50%;
    margin:-90px 0 0 -130px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: 60% auto;
    background-position: 50% 50%;
  }
  .box-cp img{
    width: 100%;
  }
  @keyframes rotate{
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
  .box-cp.animation{
    animation: rotate 2s linear infinite;
  }

  .left li{
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left:20px;
    box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;/*内容超宽后禁止换行显示*/
    overflow: hidden;/*超出部分隐藏*/
    text-overflow:ellipsis;/*文字超出部分以省略号显示*/
  }
  .left li:hover{
    background: #efefef;
  }
  .play{
    background: #efefef;
  }
  /* 进度 */
  .progress{
    position: absolute;
    left:170px;
    right:100px;
    top: 25px;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    float: right;
    background: #ddd;
  }
  .progress i{
    display: block;
    height: 100%;
    background: #fe7676;
  }
  .foot{
    position: relative;
    height: 60px;
    overflow: hidden;
    background: #F0F3F4;
    box-shadow: 0 -1px 6px rgba(0, 0, 0, .15);
  }
  .audio{
    width: 100%;
    height: 100%;
    outline: none;
  }
</style>