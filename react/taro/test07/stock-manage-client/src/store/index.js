import Vue from 'vue'
import Vuex from 'vuex'
import productView from './modules/productView'
import retProductView from './modules/retProductView'
import designerProductNew from './modules/designerProductNew'
import proProductView from './modules/proProductView'
import proNewProduct from './modules/proNewProduct'
import customerManage from './modules/customerManage'

import createLogger from './plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state: {
        queryVerify: sessionStorage.getItem('verify')
    },
    mutations: {
        updataQueryVerify(state, data) {
            sessionStorage.setItem("verify", JSON.stringify(data));
            state.queryVerify = sessionStorage.getItem('verify');
        }
    },
    modules: {
        productView,
        retProductView,
        designerProductNew,
        proProductView,
        proNewProduct,
        customerManage,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})