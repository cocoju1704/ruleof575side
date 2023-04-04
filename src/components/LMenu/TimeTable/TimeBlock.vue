<template>
  <div class="time-block" :style="blockstyle" @click="clickEvent" v-show='this.timeBlockData.blockKind != "sendBtn"'>
    <div class="time-block-content notosanskr-normal-black-14px"> 
      {{ this.timeBlockData.content }}
    </div>
  </div>
  <div class = "time-block" :style="blockstyle" @click="clickEvent" v-show='this.timeBlockData.blockKind == "sendBtn"'>모두 <br> 선택</div>
</template>
  
  <script>
  export default {
    name: "TimeBlock",
    props: ["timeBlockData"],
    computed: {
      blockstyle() {
        let color, height
        switch (this.timeBlockData.blockKind) {
          case "block":
            if (this.timeBlockData.isSelected) {
              color = `#49c282`
            }
            else {
              color = `#f0f0f0`
            }
            break;
          case "lecBlock":
            color = this.timeBlockData.color
            break;
          case "dayBlock":
            color = `#e0e0e0`
            break;
          case "hourBlock":
            color = `#e0e0e0`
            break;
          case "sendBtn":
            color = `#e0e0e0`
            break;
          default:
            color = `#ff00d6`
            break;
        }
        if (this.timeBlockData.blockKind == "sendBtn")
        {
          return {
            '--height' : `48px`,
            '--color' : color
          }
        }
        else {
          return {
            '--height' : `${(this.timeBlockData.end - this.timeBlockData.start) * 96}px`,
            '--color' : color
          }
        }
      }
    },
    methods:{
      async clickEvent(){
        let timeLines
        let timeLine
        let isLogined = this.$store.getters.getIsLogined

        if(!isLogined) {
          return
        }
        this.$store.commit("addSelectedBlockCount");

        switch(this.timeBlockData.blockKind) {
          case "block":
            this.timeBlockData.isSelected = !this.timeBlockData.isSelected
            //console.log(this.timeBlockData.isSelected)
            break
          case "lecBlock":
            //console.log(this.timeBlockData.lecNum)
            await this.$store.dispatch("fetchLecDetails", this.timeBlockData.lecNum)
            break
          case "dayBlock":
            //console.log(this.timeBlockData.content)
            this.timeBlockData.isSelected = !this.timeBlockData.isSelected
            timeLines = this.$store.getters.getTimeLines
            timeLine = timeLines[this.timeBlockData.content] 
            timeLine.forEach(x=> {
              if(this.timeBlockData.isSelected != x.isSelected && x.blockKind =="block") {
                x.isSelected = this.timeBlockData.isSelected
              }
            })
            break
          case "hourBlock":
            //console.log(this.$store.getters.getTimeblockLists)
            this.timeBlockData.isSelected = !this.timeBlockData.isSelected
            timeLines = this.$store.getters.getTimeLines
            
            for(let x in timeLines){
              //console.log(x)
              timeLines[x].forEach(y =>{
                if(Math.floor(y.start) == this.timeBlockData.start && y.blockKind == "block"
                  && this.timeBlockData.isSelected != y.isSelected) {
                  y.isSelected = this.timeBlockData.isSelected
                  //console.log(y.isSelected)
                }
              })
            }
            break
          case "sendBtn":
            this.timeBlockData.isSelected = !this.timeBlockData.isSelected
              timeLines = this.$store.getters.getTimeLines
              for(let x in timeLines){
                //console.log(x)
                timeLine = timeLines[x]
                timeLine.forEach(y => {
                      if(this.timeBlockData.isSelected != y.isSelected && y.blockKind =="block") {
                    y.isSelected = this.timeBlockData.isSelected
                  }
                })
              }
              break

          default: 
           alert("error")
           break
        }
      }
    }
  };
  
  </script>
  
  <style lang="sass">
  @import '../../../../variables'

  .time-block
    align-items: center
    background-color: var(--color)
    display: flex
    flex-direction: column
    height: var(--height)
    width: 100%
    border-style: none none solid
    border-width: 2px
    border-color: $white
    position: relative
    overflow: hidden
    border-radius: 5px
    
  .time-block:hover
    transform: scale(1.05)
    cursor: pointer
    background-color: #c0c0c0
  .time-block:active
    transform: scale(0.9)

  .time-block-content
    height: 100%
    line-height: normal
    text-align: center
    width: 100%
    position: relative
    
  @keyframes fly-1
    0%
      transform: translateY(0.1em)
    100%
      transform: translateY(-0.1em)
  
    
  </style>
  