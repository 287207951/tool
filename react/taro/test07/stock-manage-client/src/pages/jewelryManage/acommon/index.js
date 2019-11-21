import Vue from 'vue'

const lineTable = () =>
    import ('./common/lineTable') // 详情头部

// 饰品公共管理组件
const SingleAttr = () =>
    import ('./common/singleAttr') //单品
const TzAttr = () =>
    import ('./common/tzAttr') //套装
const TzAttrDetails = () =>
    import ('./common/tzAttrDetails') //套装详情
const SkuScreen = () =>
    import ('./common/skuScreen') //sku筛选
const DialogScreen = () =>
    import ('./common/dialogScreen') //弹框筛选
const OrnamentBizType = () =>
    import ('./ornamentBizType') // 饰品管理新建出入库 公司业务选择
const JeweBalanceAccount = () =>
    import ('./balanceAccount') // 饰品管理新建出入库 公司业务选择
const Steps = () =>
    import ('./common/steps') //进度条
const BatchReason = () =>
    import ('./common/batchReason') //批量选择原因

//出库
const ProductItemOne = () =>
    import ('./outOfStock/productItemOne') //出库单
const AddProductsOne = () =>
    import ('./outOfStock/addProductsOne') //出库单添加产品
const HeadSelection = () =>
    import ('./outOfStock/headSelection') //出库单头部筛选
const ProductItemTwo = () =>
    import ('./outOfStock/productItemTwo') //出库单（审核）
const AddProductsTwo = () =>
    import ('./outOfStock/addProductsTwo') //出库单添加产品（审核）
const PackingBar = () =>
    import ('./outOfStock/packingBar') //出库单打包条
const PackProductDetails = () =>
    import ('./outOfStock/packProductDetails') //出库单打包详情(弹框)
const OutPackProductDetails = () =>
    import ('./outOfStock/outPackProductDetails') //出库单打包详情(弹框)
const ParentPackageBar = () =>
    import ('./outOfStock/parentPackageBar') //拣货验收单包中包打包条
const ButtonList = () =>
    import ('./outOfStock/buttonList') //按钮列表

//调拨出库、调拨入库、调拨复核
const BaoDisplay = () =>
    import ('./allotOut/baoDisplay') //包详情显示
const DialogScreenBao = () =>
    import ('./allotOut/dialogScreenBao') //包详情搜索条件
const TzAttrBao = () =>
    import ('./allotOut/tzAttrBao') //包详情产品显示
const TzAttrDetailsBao = () =>
    import ('./allotOut/tzAttrDetailsBao') //包详情套装显示
const TzAttrAddBao = () =>
    import ('./allotOut/tzAttrAddBao') //调拨出库添加产品显示产品
const BaoDisplayReCheck = () =>
    import ('./allotOut/baoDisplayReCheck') //复核包详情显示
const ProductItemThree = () =>
    import ('./allotOut/productItemThree') //复核单品展示列表1
const ProductItemFour = () =>
    import ('./allotOut/productItemFour') //复核单品展示列表1
const BaoDisplayPickOrder = () =>
    import ('./allotOut/baoDisplayPickOrder') //拣货验收单包详情显示
const ParentPackageBarPick = () =>
    import ('./allotOut/parentPackageBarPick') //拣货验收单打包详情包中包
const OutPackProductDetailsPick = () =>
    import ('./allotOut/outPackProductDetailsPick') //拣货验收单打包详情(弹框)
const ProductItemPick = () =>
    import ('./allotOut/productItemPick') //拣货验收单打包产品详情(弹框)
const ProductItemPickTwo = () =>
    import ('./allotOut/productItemPickTwo') //拣货验收单打包产品详情单品(弹框)
const allotProductItemOne = () =>
    import ('./allotOut/allotProductItemOne') //新增编辑产品（出库）
const allotProductItemTwo = () =>
    import ('./allotOut/allotProductItemTwo') //新增编辑产品(调拨)
const PackingBarPick = () =>
    import ('./allotOut/packingBarPick') //拣货验收单打包产品详情单品(弹框)
const PackProductDetailsPick = () =>
    import ('./allotOut/packProductDetailsPick') //拣货验收单打包详情(弹框)
const TzAttrBaoPick = () =>
    import ('./allotOut/tzAttrBaoPick') //拣货验收单包详情产品显示

//调拨出库、调拨入库、调拨复核
Vue.component('JeweBalanceAccount', JeweBalanceAccount)
Vue.component('OrnamentBizType', OrnamentBizType)
Vue.component('LineTable', lineTable)
Vue.component('SingleAttr', SingleAttr)
Vue.component('TzAttr', TzAttr)
Vue.component('TzAttrDetails', TzAttrDetails)
Vue.component('SkuScreen', SkuScreen)
Vue.component('DialogScreen', DialogScreen)
Vue.component('ProductItemThree', ProductItemThree)
Vue.component('ProductItemFour', ProductItemFour)
Vue.component('ParentPackageBarPick', ParentPackageBarPick)
Vue.component('OutPackProductDetailsPick', OutPackProductDetailsPick)
Vue.component('ProductItemPick', ProductItemPick)
Vue.component('ProductItemPickTwo', ProductItemPickTwo)
Vue.component('allotProductItemOne', allotProductItemOne)
Vue.component('allotProductItemTwo', allotProductItemTwo)
Vue.component('PackingBarPick', PackingBarPick)
Vue.component('PackProductDetailsPick', PackProductDetailsPick)
Vue.component('TzAttrBaoPick', TzAttrBaoPick)

//出库
Vue.component('ProductItemOne', ProductItemOne)
Vue.component('AddProductsOne', AddProductsOne)
Vue.component('HeadSelection', HeadSelection)
Vue.component('ProductItemTwo', ProductItemTwo)
Vue.component('AddProductsTwo', AddProductsTwo)
Vue.component('PackingBar', PackingBar)
Vue.component('PackProductDetails', PackProductDetails)
Vue.component('OutPackProductDetails', OutPackProductDetails)
Vue.component('ParentPackageBar', ParentPackageBar)
Vue.component('ButtonList', ButtonList)
Vue.component('Steps', Steps)
Vue.component('BatchReason', BatchReason)

//包详情数据
Vue.component('BaoDisplay', BaoDisplay)
Vue.component('DialogScreenBao', DialogScreenBao)
Vue.component('TzAttrBao', TzAttrBao)
Vue.component('TzAttrDetailsBao', TzAttrDetailsBao)
Vue.component('TzAttrAddBao', TzAttrAddBao)
Vue.component('BaoDisplayReCheck', BaoDisplayReCheck)
Vue.component('BaoDisplayPickOrder', BaoDisplayPickOrder)