import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import classmanager from '../components/content/homecontent/classmanager.vue'
import stumanager from '../components/content/homecontent/stumanager.vue'
import teamanager from '../components/content/homecontent/teamanager.vue'
import paymanager from '../components/content/homecontent/paymanager.vue'
import teaabsenmanager from '../components/content/homecontent/teaabsenmanager.vue'
import stuabsenmanager from '../components/content/homecontent/stuabsenmanager.vue'
import stufinancemanager from '../components/content/homecontent/stufinancemanager.vue'
import teafinancemanager from '../components/content/homecontent/teafinancemanager.vue'
import dynamic from '../components/content/homecontent/dynamic.vue'
import studynamic from '../components/content/homecontent/studynamic.vue'
const routes = [
    {
        path:'/home',
        redirect:'/classmanager'
    },
    {
        name:'classmanager',
        path:'/classmanager',
        component:classmanager
    },
    {
        name:'stumanager',
        path:'/stumanager',
        component:stumanager
    },
    {
        name:'teamanager',
        path:'/teamanager',
        component:teamanager
    },
    {
        name:'paymanager',
        path:'/paymanager',
        component:paymanager
    },
    {
        name:'teaabsenmanager',
        path:'/teaabsenmanager',
        component:teaabsenmanager
    },
    {
        name:'stuabsenmanager',
        path:'/stuabsenmanager',
        component:stuabsenmanager
    },
    {
        name:'stufinancemanager',
        path:'/stufinancemanager',
        component:stufinancemanager
    },
    {
        name:'teafinancemanager',
        path:'/teafinancemanager',
        component:teafinancemanager
    },
    {
        name:'dynamic',
        path:'/dynamic',
        component:dynamic
    },
    {
        name:'studynamic',
        path:'/studynamic',
        component:studynamic
    },
]

const router = new Router({
    routes,
    mode:'history'
})

export default router

// 避免重复点击时出现报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}