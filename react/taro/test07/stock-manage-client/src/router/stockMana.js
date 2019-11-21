//库存管理(新) TODO
const StockPositionView = () =>
  import('@/pages/stockManage/stockManage/positionView') //库位查看
const StockPositionViewDetail = () =>
  import('@/pages/stockManage/stockManage/positionViewDetail') //库位查看详细
const StockPalletView = () =>
  import('@/pages/stockManage/stockManage/palletView') //托盘查看
const StockStockLevel = () =>
  import('@/pages/stockManage/stockManage/stockLevel') //库存水位设置查看
const StockStockLevelDetail = () =>
  import('@/pages/stockManage/stockManage/stockLevelDetail') //库存水位设置查看详细
const StockSpotStock = () => import('@/pages/stockManage/stockManage/spotStock') //库存查看
const StockStockSet = () => import('@/pages/stockManage/stockManage/stockSet') //仓库设置

export default [
  {
    path: 'stockPositionView',
    component: StockPositionView
  },
  {
    path: 'stockPositionViewDetail',
    component: StockPositionViewDetail
  },
  {
    path: 'stockPalletView',
    component: StockPalletView
  },
  {
    path: 'stockStockLevel',
    component: StockStockLevel
  },
  {
    path: 'stockStockLevelDetail',
    component: StockStockLevelDetail
  },
  {
    path: 'stockSpotStock',
    component: StockSpotStock
  },
  {
    path: 'stockStockSet',
    component: StockStockSet
  }
]
