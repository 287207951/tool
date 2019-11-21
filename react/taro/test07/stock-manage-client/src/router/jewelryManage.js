//饰品管理(新需求)
const allotOutList = () => import('@/pages/jewelryManage/allotOutList') //调拨出库列表
const allotOutDet = () => import('@/pages/jewelryManage/allotOutDet') //调拨出库详情
const allotOutAdd = () => import('@/pages/jewelryManage/allotOutAdd') //新建出库（有库位和无库位）
const allotOutEdit = () => import('@/pages/jewelryManage/allotOutEdit') //新建出库（有库位和无库位）
const allotInList = () => import('@/pages/jewelryManage/allotInList') //调拨入库列表
const allotInDet = () => import('@/pages/jewelryManage/allotInDet') //调拨入库详情
const allotRecheckList = () => import('@/pages/jewelryManage/allotRecheckList') //调拨复核列表
const allotRecheckDet = () => import('@/pages/jewelryManage/allotRecheckDet') //调拨复核详情
const allotRecheckView = () => import('@/pages/jewelryManage/allotRecheckView') //调拨复核详情
const pickOrderList = () => import('@/pages/jewelryManage/pickOrderList') //拣货验收列表
const pickOrderDetEdit = () => import('@/pages/jewelryManage/pickOrderDetEdit') //拣货验收详情(待验收)
const pickOrderDetView = () => import('@/pages/jewelryManage/pickOrderDetView') //拣货验收详情(已验收、已退回、已作废)
const outOfStockRedoList = () =>
    import('@/pages/jewelryManage/outOfStockRedo/outOfStockRedoList') //出库单列表
const creatOutOfStock = () =>
    import('@/pages/jewelryManage/outOfStockRedo/creatOutOfStock') //新增出库单
const outOfStockRedoDetail = () =>
    import('@/pages/jewelryManage/outOfStockRedo/outOfStockRedoDetail') //出库单详情
const editOutOfStock = () =>
    import('@/pages/jewelryManage/outOfStockRedo/editOutOfStock') //编辑出库单
const joinStoreList = () =>
    import('@/pages/jewelryManage/joinStore/joinStoreList') // 入库单列表
const joinStoreEdit = () =>
    import('@/pages/jewelryManage/joinStore/joinStoreEdit') // 新增入库单
const joinStoreDetail = () =>
    import('@/pages/jewelryManage/joinStore/joinStoreDetail') // 入库单详情
const inventoryList = () =>
    import('@/pages/jewelryManage/inventory/InventoryList') // 盘点列表
const inventoryEdit = () =>
    import('@/pages/jewelryManage/inventory/InventoryEdit') // 新增盘点
const inventoryDetail = () =>
    import('@/pages/jewelryManage/inventory/InventoryDetail') // 盘点详情
const outInnerOrnamentsList = () =>
    import('@/pages/jewelryManage/outInnerOrnaments/outInnerOrnamentsList') // 出内部饰
const outInnerOrnamentsDetail = () =>
    import('@/pages/jewelryManage/outInnerOrnaments/outInnerOrnamentsDetail') // 出内部饰打包
const customerDecorationList = () =>
    import('@/pages/jewelryManage/customerDecoration/customerDecorationList') //出客户饰列表
const customerDecorationDetail = () =>
    import('@/pages/jewelryManage/customerDecoration/customerDecorationDetail') //出客户饰详情
const factoryDecorationList = () =>
    import('@/pages/jewelryManage/factoryDecoration/factoryDecorationList') //出工厂饰列表
const factoryDecorationDetail = () =>
    import('@/pages/jewelryManage/factoryDecoration/factoryDecorationDetail') //出工厂饰详情
const differenceBill = () =>
    import('@/pages/decorManage/difference/differenceBill') //差异单列表
const weighingDifferenceList = () =>
    import('@/pages/decorManage/weighingDifference/weighingDifferenceList') //称差单列表
const weighingDifferenceDetail = () =>
    import('@/pages/decorManage/weighingDifference/weighingDifferenceDetail') //称差单详情
const customerSettlementList = () =>
    import('@/pages/jewelryManage/customerDecoration/customerSettlementList') //出客户饰列表（结算）
const customerSettlementDetail = () =>
    import('@/pages/jewelryManage/customerDecoration/customerSettlementDetail') //出客户饰详情（结算）
const factorySettlementList = () =>
    import('@/pages/jewelryManage/customerDecoration/factorySettlementList') //出工厂饰列表（结算）
const factorySettlementDetail = () =>
    import('@/pages/jewelryManage/customerDecoration/factorySettlementDetail') //出工厂饰详情（结算）
const outO2mList = () => import('@/pages/jewelryManage/outO2m/outO2mList') //出饰转料列表
const outO2mDetail = () => import('@/pages/jewelryManage/outO2m/outO2mDetail') //出饰转料详情

// 料转饰
const m2OList = () => import('@/pages/jewelryManage/m2o/m2OList') // 列表
const m2ODetail = () => import('@/pages/jewelryManage/m2o/m2ODetail') // 详情（新建 编辑）
// 饰转料
const o2MList = () => import('@/pages/jewelryManage/o2m/o2MList') // 列表
const o2MDetail = () => import('@/pages/jewelryManage/o2m/o2MDetail') // 详情（新建 编辑）
const o2MaEdit = () => import('@/pages/jewelryManage/o2m/o2MaEdit') // 详情（新建 编辑）
const o2MaDetail = () => import('@/pages/jewelryManage/o2m/o2MaDetail') // 详情（新建 编辑）

export default [
    {
        path: 'allotInDet', //调拨入库详情
        component: allotInDet
    },
    {
        path: 'allotInList', //调拨入库列表
        component: allotInList
    },
    {
        path: 'allotOutAdd', //新建出库（有库位和无库位）
        component: allotOutAdd
    },
    {
        path: 'allotOutEdit', //编辑调拨出库
        component: allotOutEdit
    },
    {
        path: 'allotOutDet', //调拨出库详情
        component: allotOutDet
    },
    {
        path: 'allotOutList', //调拨出库列表
        component: allotOutList
    },
    {
        path: 'allotRecheckDet', //调拨复核编辑详情
        component: allotRecheckDet
    },
    {
        path: 'allotRecheckView', //调拨复核查看详情
        component: allotRecheckView
    },
    {
        path: 'allotRecheckList', //调拨复核列表
        component: allotRecheckList
    },

    {
        path: 'outOfStockRedoList', //出库单列表
        component: outOfStockRedoList
    },
    {
        path: 'creatOutOfStock', //新增出库单
        component: creatOutOfStock
    },
    {
        path: 'outOfStockRedoDetail', //出库单详情
        component: outOfStockRedoDetail
    },
    {
        path: 'editOutOfStock', //编辑出库单
        component: editOutOfStock
    },
    {
        path: 'joinStoreList', //往来对账单
        component: joinStoreList
    },
    {
        path: 'joinStoreEdit', //出库单列表
        component: joinStoreEdit
    },
    {
        path: 'joinStoreDetail', //新增出库单
        component: joinStoreDetail
    },
    {
        path: 'inventoryList', // 盘点列表
        component: inventoryList
    },
    {
        path: 'inventoryEdit', // 盘点编辑
        component: inventoryEdit
    },
    {
        path: 'inventoryDetail', // 盘点详情
        component: inventoryDetail
    },
    {
        path: 'pickOrderList', //拣货验收列表
        component: pickOrderList
    },
    {
        path: 'pickOrderDetEdit', //拣货验收详情(待验收)
        component: pickOrderDetEdit
    },
    {
        path: 'pickOrderDetView', //拣货验收详情(已验收、已退回、已作废)
        component: pickOrderDetView
    },
    {
        path: 'customerDecorationDetail', //出客户饰详情
        component: customerDecorationDetail
    },
    {
        path: 'outInnerOrnamentsList', //出内部饰列表
        component: outInnerOrnamentsList
    },
    {
        path: 'outInnerOrnamentsDetail', //出内部饰详情
        component: outInnerOrnamentsDetail
    },
    {
        path: 'customerDecorationList', //出客户饰列表
        component: customerDecorationList
    },
    {
        path: 'factoryDecorationDetail', //出工厂饰详情
        component: factoryDecorationDetail
    },
    {
        path: 'factoryDecorationList', //出工厂饰列表
        component: factoryDecorationList
    },
    {
        path: 'differenceBill', //差异单列表
        component: differenceBill
    },
    {
        path: 'weighingDifferenceList', //称差单列表
        component: weighingDifferenceList
    },
    {
        path: 'weighingDifferenceDetail', //称差单详情
        component: weighingDifferenceDetail
    },
    {
        path: 'customerSettlementList', //客户饰列表（结算）
        component: customerSettlementList
    },
    {
        path: 'customerSettlementDetail', //客户饰详情（结算）
        component: customerSettlementDetail
    },
    {
        path: 'factorySettlementList', //工厂饰列表（结算）
        component: factorySettlementList
    },
    {
        path: 'factorySettlementDetail', //工厂饰详情（结算）
        component: factorySettlementDetail
    },
    {
        path: 'outO2mList', //出饰转料
        component: outO2mList
    },
    {
        path: 'outO2mDetail', //出饰转料详情
        component: outO2mDetail
    },
    {
        path: 'm2OList', // 饰转料列表
        component: m2OList
    },
    {
        path: `o2MaEdit`, // 饰转料新建编辑
        component: o2MaEdit
    },
    {
        path: `o2MaDetail`, // 饰转料详情
        component: o2MaDetail
    },
    {
        path: 'm2ODetail', //出饰转料详情
        component: m2ODetail
    },
    {
        path: 'o2MList', //出饰转料详情
        component: o2MList
    },
    {
        path: 'o2MDetail', //出饰转料详情
        component: o2MDetail
    }
]
