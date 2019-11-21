// 原料管理

// 料库存转换
const InventoryConversionList = () =>
  import('@/pages/materControl/inventoryConversion/inventoryConversionList') // 列表
const InventoryConversionDetail = () =>
  import('@/pages/materControl/inventoryConversion/inventoryConversionDetail') // 详情
const InventoryConversionEdit = () =>
  import('@/pages/materControl/inventoryConversion/inventoryConversionEdit') // 新建编辑
// 料转饰
const material2OrnamentsList = () =>
  import('@/pages/materControl/material2Ornaments/material2OrnamentsList') // 列表
const material2OrnamentsDetail = () =>
  import('@/pages/materControl/material2Ornaments/material2OrnamentsDetail') // 详情（新建 编辑）
// 饰转料
const ornaments2MaterialList = () =>
  import('@/pages/materControl/ornaments2Material/ornaments2MaterialList') // 列表
const ornaments2MaterialDetail = () =>
  import('@/pages/materControl/ornaments2Material/ornaments2MaterialDetail') // 详情（新建 编辑）

export default [
  {
    path: 'inventoryConversionList',
    component: InventoryConversionList
  },
  {
    path: 'inventoryConversionDetail',
    name: 'inventoryConversionDetail',
    component: InventoryConversionDetail
  },
  {
    path: 'inventoryConversionEdit',
    component: InventoryConversionEdit
  },
  {
    path: 'material2OrnamentsList',
    component: material2OrnamentsList
  },
  {
    path: 'material2OrnamentsDetail',
    component: material2OrnamentsDetail
  },
  {
    path: 'ornaments2MaterialList',
    component: ornaments2MaterialList
  },
  {
    path: 'ornaments2MaterialDetail',
    component: ornaments2MaterialDetail
  }
]
