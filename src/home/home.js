import Vue from 'vue'
import home from './home.vue'
import router from './router/index'

//引入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入vue-resource解决elementUI图片回显跨域问题
import VueResource from 'vue-resource'

Vue.use(ElementUI)
Vue.use(VueResource)

new Vue({
    render:h=>h(home),
    router
}).$mount('#home')