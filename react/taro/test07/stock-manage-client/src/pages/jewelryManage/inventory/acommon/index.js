import Vue from 'vue'

import Steps from './steps'
import ProductItem from './productItem'
import ProLossProductItem from './productItemTwo'
import AddProducts from './addProducts'
import ProfitLoss from './profitLoss'
import InExcel from './inExcel'


Vue.component(`ProLossProductItem`, ProLossProductItem)

export {
    Steps,
    AddProducts,
    ProductItem,
    ProfitLoss,
    InExcel
}