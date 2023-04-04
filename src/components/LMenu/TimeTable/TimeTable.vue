<template>
  <div class="time-table-cart">
    <button class="send-btn" :style = "blockstyle" @click="clickEvent">
    <div class = "spacing-2"></div>
    <span class="span">선택한 시간대에 맞는 교양 추천받기</span>
    <div class="svg-wrapper-1">
      <div class="svg-wrapper">
        <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
        </svg>
      </div>
    </div>
  </button> 
    <div class="time-table">
      <TimeLine :day = 0 />
      <TimeLine :day = 1 />
      <TimeLine :day = 2 />
      <TimeLine :day = 3 />
      <TimeLine :day = 4 />
      <TimeLine :day = 5 />
    </div>
    <div class="ntlec-cart">
      <NTLecBlock :lecData="lec" v-for="lec in this.nTLecsList" :key="lec"/>
    </div>
  </div>
</template>

<script>
import TimeLine from "./TimeLine";
import NTLecBlock from "./NTLecBlock"
export default {
  name: "TimeTable",
  components: {
    TimeLine,
    NTLecBlock
  },
  computed : {
    blockstyle()
    {
      let color, fontcolor
      if (this.$store.getters.getSelectedBlockCount > 0) {
        color = `#49c282`
        fontcolor = `#FFFFFF`
      }
      else {
        color = `#e0e0e0`
        fontcolor = `#e0e0e0`
      }
      return {
        '--color' : color,
        '--fontcolor' : fontcolor
      }
    },
    nTLecsList() {
      let ret = []
      let lecList = this.$store.getters.getLecList

      for(let lec of lecList) {
        if(lec.isInTable == 1) {
          if(lec.요일.includes('시간미지정강좌') || lec.요일.includes('집중수업')) {
            ret.push(lec);
          }

        }
      }
      return ret
    }
  },
  methods:{
      async clickEvent(){
        this.$store.commit("addSelectedBlockCount");
        let timeLines
        let timeLine
        let isLogined = this.$store.getters.getIsLogined

        if(!isLogined) {
          return
        }
        timeLines = this.$store.getters.getTimeLines
        this.$store.commit("clearSelectedTimes")

        for(let x in timeLines){
          timeLines[x].forEach(y=> {
            if(y.blockKind == "block" && y.isSelected) {
              this.$store.commit("addSelectedTimes", {day: x, data: y})
            }
          })
        }
        this.$store.commit("clearRecommList")
        await this.$store.dispatch("fetchRecommList")
        this.$store.dispatch("changeScreen", 2)
    }
  }
};
</script>

<style lang="sass">
@import '../../../../variables'

.time-table-cart
  align-items: flex-start
  background-color: $white
  height: 90%
  position: relative
  width: 100%
  overflow-x: hidden
  overflow-y: overlay
  border-top: 3px solid white
  border-bottom: 3px solid white
  border-radius: 15px

.time-table-cart::-webkit-scrollbar 
  width : 2px

.time-table-cart::-webkit-scrollbar-thumb
    background-color: rgba(0,0,0, 0)
    height: 95%

.time-table
  align-items: flex-start
  display: flex
  height: 1200px
  gap: 2px
  position: relative

.ntlec-cart
  position: relative

.send-btn
  font-size: 16px 
  background-color: var(--color)
  color: var(--fontcolor)
  display: flex
  align-items: center 
  border: 2px solid white
  border-radius: 15px 
  overflow: hidden
  height: 48px
  width: 100%
  transition: all 0.2s
  .span
    display: block 
    margin-left: 0.3em 
    transition: all 0.3s ease-in-out 
    text-align: center
    width: 60%
  .svg
    display: block 
    transform: rotate(45deg)
    transform-origin: center center 
    transition: transform 0.3s ease-in-out 
.send-btn:hover
  cursor: pointer
  .svg-wrapper
    animation: fly-1 0.6s ease-in-out infinite alternate
    transform: scale(1.2)
  .svg
    transform: translateX(10em) rotate(45deg) scale(1.2)
  .span
    transform: scale(1.2)
.send-btn:active
  transform: scale(0.90)

.spacing-2
  width: 15%
</style>
