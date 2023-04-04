<template>
  <div class="lec-list">
    <div class = "lec-list-upper-menu">
      <div class = "search-cart">
        <div class = "spacing-1"></div>
        <input type="text" class="search-text" id="searchbox"  placeholder="원하는 과목 직접 검색"/>
        <input type="submit" class="search-button" value="검색" @click="getSearchText()">
      </div>
      <div class = "result-cart" v-show="this.hideResultCart == false">
        <LecListHead class = "lec-list-head" :lecHeadData="resultListHead"/>
        <div class = "search-result-list">
          <SearchModalRecord class= "search-result-tuple" :lecData=result v-for="result in this.resultList" :key="lec"></SearchModalRecord>
        </div>
      </div>
      <div class = close-result v-show="this.hideResultCart == false" @click="clickSeeBtn">^</div>
    </div>
    <RMenuTitleBox color="red">
        <input type="submit" class="export-pref-lec" value="저장하기" @click="exportPrefLec"/>
        내 수업목록
        <input type="submit" class="load-pref-lec" value="내 희망수업 불러오기" @click="loadPrefLec"/> 
      </RMenuTitleBox>
      
    <div class = "lec-list-lower-menu">
      <LecListHead class = "lec-list-head" :lecHeadData="lecListHead"/>
        <draggable class = "drag-lec-list" :list= this.myList item-key= "수업번호">
          <template #item="{element}">
              <LecListRecord class = "llr" :lecData="element"></LecListRecord>
          </template>
        </draggable>
    </div>
  </div>
</template>

<script>
import RMenuTitleBox from "../Box/RMenuTitleBox";
import RMenuTextBox from "../Box/RMenuTextBox";
import LecListRecord from "./LecListRecord";
import LecListHead from "./LecListHead";
import SearchImageBox from "../Box/SearchImageBox";
import SearchModalRecord from "../../SearchModalRecord";

import draggable from 'vuedraggable';
import { parseLectime } from "../../../util";
import axios from "axios"

export default {
  name: "LecList",
  components: {
    RMenuTitleBox,
    LecListRecord,
    LecListHead,
    RMenuTextBox,
    SearchImageBox,
    SearchModalRecord,
    draggable
  },
  data(){
    return{
      lecListHead :{과목명: "과목명", 대표교강사명: "강사명", 수업시간: "수업시간", 담기: "등록", 빼기: "빼기",},
      resultListHead :{과목명: "과목명", 대표교강사명: "강사명", 수업시간: "수업시간", 담기: "담기", 빼기: "빼기",},
      resultList : [],
      hideResultCart: true,
    }
  },
  computed : {
    myList: {
        get() {
            return this.$store.getters.getLecList;
        },
        set(value) {
            this.$store.commit('updateList', value)
        }
    }
  },
  methods:{
    openSearchModal() {
      this.$store.commit("setSearchModal")
    },
    loadPrefLec(){
      this.$store.dispatch("crawlingWantedData")
    },
    savePrefLec(){
      this.$store.dispatch("exportPrefLec")
    },
    exportPrefLec(){
      this.$store.dispatch("updateLecList")

      //this.$store.dispatch("crawlingWantedData1")
      //this.$store.commit("setSelectIndexModal")
      


      //this.$store.dispatch("exportPrefLec")
      //this.$store.dispatch("exportPrefLec")
    },
    async getSearchText(){
      this.input = document.getElementById("searchbox").value
      this.hideResultCart = false
      try{
        this.resultList = (await axios.get('https://ruleof.datasesang.store/list/search', {params: {keyword: this.input}})).data.list
        for(let result of this.resultList) {
          let parsedLT = parseLectime(result.수업시간);
          result.수업시간 = parsedLT.수업시간
          result.요일 = parsedLT.요일
          result.시작시간 = parsedLT.시작시간
          result.끝시간 = parsedLT.끝시간
        }
      }
      catch(error){
        console.log(error)
      }
    },
    clickSeeBtn(){
      this.hideResultCart = !this.hideResultCart

    }
  },
};
</script>

<style lang="sass">
@import '../../../../variables'

.lec-list
  align-items: center
  background-color: $pippin
  display: flex
  flex-direction: column
  height: 95%
  position: relative
  width: 100%
  border-bottom-right-radius: 15px
  border-bottom-left-radius: 15px
.lec-list-upper-menu
  width: 100%
  position: relative
.lec-list-head
  height: 42px
.lec-list-lower-menu
  width: 100%
  overflow-y: overlay
  overflow-x: hidden

.lec-list-lower-menu::-webkit-scrollbar 
  display: none

.lec-list-lower-menu::-webkit-scrollbar-thumb
  background-color: hsla(0, 0%, 42%, 0.49)
  border-radius: 100px

.search-cart
  width: 100%
  height: 48px
  display: flex
  align-items: center
  background-color: $geraldine
  border-left: 2px white solid

.spacing-1
  width: 7%

.search-text
  position: relative 
  background-color: $white
  width: 68%
  height: 35px
  font-size: 20px
  border: none
  border-top-left-radius: 15px
  border-bottom-left-radius: 15px
  font-family: "Noto Sans KR", Helvetica
  
.search-button
  width: 18%
  height: 35px
  font-size: 20px
  border: none
  border-top-right-radius: 15px
  border-bottom-right-radius: 15px
  font-family: "Noto Sans KR", Helvetica
  
.search-button:hover
  transform: scale(1.1)
  background-color: $silver
  cursor: pointer
.search-button:active
  transform: scale(0.95)
  border: none

.hideResultBtn
  height: 40px
  
.search-result-list
  height: 300px
  position: relative
  overflow-y: overlay
  overflow-x: hidden
  background-color: $pippin

.search-result-list::-webkit-scrollbar 
  display: none
.search-result-list::-webkit-scrollbar-thumb
  background-color: hsla(0, 0%, 42%, 0.49)
  border-radius: 100px

.load-pref-lec
  width: 25%
  height: 60%
  border: 3px solid
  border-color: $pippin
  border-radius: 10px
  background-color: $white
  position: absolute
  left: 73%
  color: $geraldine
  font-weight: 1000
.export-pref-lec
  width: 30%
  height: 60%
  border: 3px solid
  border-color: $pippin
  border-radius: 10px
  background-color: $white
  position: absolute
  left: 2%
  color: $geraldine
  font-weight: 1000

.load-pref-lec:hover,
.export-pref-lec:hover,
.llr:hover,
.search-result-tuple:hover
  transform: scale(1.05)
  cursor: pointer
.load-pref-lec:active,
.export-pref-lec:active,
.llr:active,
.search-result-tuple:active
  transform: scale(0.95)

.close-result
  width: 100%
  background-color: $geraldine
  border-left: 2px white solid
  border-bottom: 4px white solid
  height: 28px
  text-align: center
  color: $white
  font-family: "Noto Sans KR", Helvetica

</style>
