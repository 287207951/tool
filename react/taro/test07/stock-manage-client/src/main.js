import 'babel-polyfill'
import '../publicResource'

import Vue from 'vue'
import App from './App'
import router from './router'
import '@/comment/theme/index.css'
import '@/comment/reset.css'
import '@/comment/stylus/base.styl'
import store from './store'

// 订单公共组件
import './pages/jewelryManage/acommon'

import '@/skyConfig/proUrl'
import '@/skyConfig/request'
import '@/skyConfig/phoneRequest'
import '@/skyConfig/_api'

const draggable = () =>
    import ('vuedraggable')
const VDistpicker = () =>
    import ('v-distpicker')
const InfiniteLoading = () =>
    import ('vue-infinite-loading')
import {
    vali
} from '@/skyConfig/libs/validate'
import utils from '@/skyConfig/libs/utils'
import infiniteScroll from 'vue-infinite-scroll'
import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'
import day from 'dayjs'
import moment from 'moment'
import nzh from 'nzh'

import $$ from 'jquery'
import '@/skyConfig/_api'

import VueScroller from 'vue-scroller'



Vue.config.productionTip = false
Vue.config.devtools = true

Vue.prototype.$v = vali
Vue.prototype.$u = utils
Vue.prototype.$day = day
Vue.prototype.$moment = moment
Vue.prototype.$nzh = nzh
Vue.prototype.$$ = $$

Vue.use(infiniteScroll)
Vue.use(Toast)
Vue.use(VueScroller)

Vue.component('InfiniteLoading', InfiniteLoading)
Vue.component('draggable', draggable)
Vue.component('VDistpicker', VDistpicker)

new Vue({
    el: '#app',
    data: {
        eventHub: new Vue()
    },
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})