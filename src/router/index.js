import { createRouter, createWebHistory } from 'vue-router'
import Frame1 from "../components/Frame1";
import Start from "../components/Start";
import { frame1Data, startData } from "../data";

const routes =[
  {
    path: "/",
    component: Start,
    props: { userInfoTimeTableProps: startData.userInfoTimeTableProps, xMenuProps: startData.xMenuProps },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
