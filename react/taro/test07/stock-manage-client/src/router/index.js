import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'
import login from '@/pages/login/login'

import element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
Vue.use(element);


import stockManaRoute from './stockMana' // 引入库存管理  
import materControlRoute from './materControl'
import jewelryManageRoute from './jewelryManage' //饰品管理路由

//公司管理
const departmentManage = () =>
    import ('@/pages/companyManage/departmentManage') //部门管理
const departmentManageEdit = () =>
    import ('@/pages/companyManage/departmentManageEdit') //编辑部门管理
const userManageDisp = () =>
    import ('@/pages/companyManage/userManage/userManageDisp') //用户管理
const userManageCreate = () =>
    import ('@/pages/companyManage/userManage/userManageCreate') //创建新用户
const userManageView = () =>
    import ('@/pages/companyManage/userManage/userManageView') //用户详情
const userManageEdit = () =>
    import ('@/pages/companyManage/userManage/userManageEdit') //用户编辑
const roleAuthoManage = () =>
    import ('@/pages/companyManage/userManage/roleAuthoManage') //角色权限管理
const flowView = () =>
    import ('@/pages/companyManage/flowView') //流程管理查看
    // import departmentManage from '@/pages/companyManage/departmentManage' 
    // import departmentManageEdit from '@/pages/companyManage/departmentManageEdit' //编辑部门管理
    // import userManageDisp from '@/pages/companyManage/userManage/userManageDisp' //用户管理
    // import userManageCreate from '@/pages/companyManage/userManage/userManageCreate' //创建新用户
    // import userManageView from '@/pages/companyManage/userManage/userManageView' //用户详情
    // import userManageEdit from '@/pages/companyManage/userManage/userManageEdit' //用户编辑
    // import roleAuthoManage from '@/pages/companyManage/userManage/roleAuthoManage' //角色权限管理
    // import flowView from '@/pages/companyManage/flowView' //流程管理查看

//原料管理
const checkGoldWare = () =>
    import ('@/pages/materControl/checkGoldWare') //验料（金库）
const editGoldWare = () =>
    import ('@/pages/materControl/editGoldWare') //验料（金库）编辑
const checkGoldTest = () =>
    import ('@/pages/materControl/checkGoldTest') //验料（测金）
const editGoldTest = () =>
    import ('@/pages/materControl/editGoldTest') //验料（测金）编辑
const checkReceiveMater = () =>
    import ('@/pages/materControl/checkReceiveMater') //收料
const editReceiveMater = () =>
    import ('@/pages/materControl/editReceiveMater') //收料编辑
const checkSendMater = () =>
    import ('@/pages/materControl/checkSendMater') //发料
const editSendMater = () =>
    import ('@/pages/materControl/editSendMater') //发料编辑
const checkPurify = () =>
    import ('@/pages/materControl/checkPurify') //提纯
const editPurify = () =>
    import ('@/pages/materControl/editPurify') //提纯编辑
const checkGoldStock = () =>
    import ('@/pages/materControl/checkGoldStock') //金料库存列表
const editGoldStock = () =>
    import ('@/pages/materControl/editGoldStock') //金料库存列表编辑
const checkMaterToOrna = () =>
    import ('@/pages/materControl/checkMaterToOrna') //料转饰
const editMaterToOrna = () =>
    import ('@/pages/materControl/editMaterToOrna') //料转饰编辑
const checkOrnaToMater = () =>
    import ('@/pages/materControl/checkOrnaToMater') //饰转料
const editOrnaToMater = () =>
    import ('@/pages/materControl/editOrnaToMater') //饰转料编辑
const recharge = () =>
    import ('@/pages/materControl/recharge') //收料(new)
const warehousingDetail = () =>
    import ('@/pages/materControl/warehousingDetail') //入库详情
const warehousingComplete = () =>
    import ('@/pages/materControl/warehousingComplete') //入库完成
const SendMaterial = () =>
    import ('@/pages/materControl/SendMaterial') //发料
const creatSendMaterial = () =>
    import ('@/pages/materControl/creatSendMaterial') //新建发料
const SendMaterialDetail = () =>
    import ('@/pages/materControl/SendMaterialDetail') //发料详情
const goldAllocation = () =>
    import ('@/pages/materControl/goldAllocation') //金库调拨


// import checkGoldWare from '@/pages/materControl/checkGoldWare' //验料（金库）
// import editGoldWare from '@/pages/materControl/editGoldWare' //验料（金库）编辑
// import checkGoldTest from '@/pages/materControl/checkGoldTest' //验料（测金）
// import editGoldTest from '@/pages/materControl/editGoldTest' //验料（测金）编辑
// import checkReceiveMater from '@/pages/materControl/checkReceiveMater' //收料
// import editReceiveMater from '@/pages/materControl/editReceiveMater' //收料编辑
// import checkSendMater from '@/pages/materControl/checkSendMater' //发料
// import editSendMater from '@/pages/materControl/editSendMater' //发料编辑
// import checkPurify from '@/pages/materControl/checkPurify' //提纯
// import editPurify from '@/pages/materControl/editPurify' //提纯编辑
// import checkGoldStock from '@/pages/materControl/checkGoldStock' //金料库存列表
// import editGoldStock from '@/pages/materControl/editGoldStock' //金料库存列表编辑
// import checkMaterToOrna from '@/pages/materControl/checkMaterToOrna' //料转饰
// import editMaterToOrna from '@/pages/materControl/editMaterToOrna' //料转饰编辑
// import checkOrnaToMater from '@/pages/materControl/checkOrnaToMater' //饰转料
// import editOrnaToMater from '@/pages/materControl/editOrnaToMater' //饰转料编辑
// import recharge from '@/pages/materControl/recharge' //收料(new)
// import warehousingDetail from '@/pages/materControl/warehousingDetail' //入库详情
// import warehousingComplete from '@/pages/materControl/warehousingComplete' //入库完成
// import SendMaterial from '@/pages/materControl/SendMaterial' //发料
// import creatSendMaterial from '@/pages/materControl/creatSendMaterial' //新建发料
// import SendMaterialDetail from '@/pages/materControl/SendMaterialDetail' //发料详情
// import goldAllocation from '@/pages/materControl/goldAllocation' //金库调拨
const creatGoldAllocation = () =>
    import ('@/pages/materControl/creatGoldAllocation') //新建调拨
const goldAllocationDetail = () =>
    import ('@/pages/materControl/goldAllocationDetail') //调拨详情
const checkGold = () =>
    import ('@/pages/materControl/checkGold') //测金
const setLaborCost = () =>
    import ('@/pages/materControl/setLaborCost') //收旧工费
const setMaterialType = () =>
    import ('@/pages/materControl/setMaterialType') //料种类
const setMaterialClass = () =>
    import ('@/pages/materControl/setMaterialClass') //料类型
const materialTransfer = () =>
    import ('@/pages/materControl/materialTransfer') //料转饰
const creatMaterialTransfer = () =>
    import ('@/pages/materControl/creatMaterialTransfer') //新建转饰
const materialTransferDetail = () =>
    import ('@/pages/materControl/materialTransferDetail') //转饰详情
const setCounter = () =>
    import ('@/pages/materControl/setCounter') //柜台设置
const outOfStorage = () =>
    import ('@/pages/materControl/outOfStorage') //料出入库----------系统
const realTimeStock = () =>
    import ('@/pages/materControl/realTimeStock') //料实时库存-------系统
const ornament = () =>
    import ('@/pages/materControl/ornament') //饰转料
const creatOrnament = () =>
    import ('@/pages/materControl/creatOrnament') //新建转料
const ornamentDetail = () =>
    import ('@/pages/materControl/ornamentDetail') //饰转料详情

const allocationWarehousing = () =>
    import ('@/pages/materControl/allocationWarehousing/allocationWarehousing') //调拨入库
const allocationWarehousingDetail = () =>
    import ('@/pages/materControl/allocationWarehousing/allocationWarehousingDetail') //调拨入库详情

const outOfStorageComeDepart = () =>
    import ('@/pages/materControl/reportFormComeDepart/outOfStorage') //料出入库----------金库收料部
const realTimeStockComeDepart = () =>
    import ('@/pages/materControl/reportFormComeDepart/realTimeStock') //料实时库存-------金库收料部

const outOfStorageDepart = () =>
    import ('@/pages/materControl/reportFormDepart/outOfStorage') //料出入库----------金库部
const realTimeStockDepart = () =>
    import ('@/pages/materControl/reportFormDepart/realTimeStock') //料实时库存-------金库部

const outOfStorageListLogistics = () =>
    import ('@/pages/materControl/reportFormLogistics/outOfStorage') //料出入库----------物流
const realTimeStockListLogistics = () =>
    import ('@/pages/materControl/reportFormLogistics/realTimeStock') //料实时库存-------物流const
const vaultSendMaterial = () =>
    import ('@/pages/materControl/vault/vaultSendMaterial') //发料
const vaultCreatSendMaterial = () =>
    import ('@/pages/materControl/vault/vaultCreatSendMaterial') //新建发料
const vaultSendMaterialDetail = () =>
    import ('@/pages/materControl/vault/vaultSendMaterialDetail') //发料详情
const vaultGoldAllocation = () =>
    import ('@/pages/materControl/vault/vaultGoldAllocation') //调拨
const vaultCreatGoldAllocation = () =>
    import ('@/pages/materControl/vault/vaultCreatGoldAllocation') //新建调拨
const vaultGoldAllocationDetail = () =>
    import ('@/pages/materControl/vault/vaultGoldAllocationDetail') //调拨详情
const vaultAllocationWarehousing = () =>
    import ('@/pages/materControl/vault/vaultAllocationWarehousing') //调拨入库
const vaultAllocationWarehousingDetail = () =>
    import ('@/pages/materControl/vault/vaultAllocationWarehousingDetail') //调拨入库详情
const allotOrderExch = () =>
    import ('@/pages/stockManage/allotOrderExch') //调拨出库（审核）
const allotOrderExchDetail = () =>
    import ('@/pages/stockManage/allotOrderExchDetail') //调拨出库详情（审核）
const verifyAllotOrderExch = () =>
    import ('@/pages/stockManage/verifyAllotOrderExch') //调拨出库（一键审核）
const verifyAllotOrderExchDetail = () =>
    import ('@/pages/stockManage/verifyAllotOrderExchDetail') //调拨出库（一键审核）详情
const allotOrderExchOpera = () =>
    import ('@/pages/stockManage/allotOrderExchOpera') //新增调拨
const allotOrderExchOperaDetail = () =>
    import ('@/pages/stockManage/allotOrderExchOperaDetail') //新增调拨详情
const outFactoryDeco = () =>
    import ('@/pages/decorManage/outFactoryDeco') //出工厂饰审核列表
const outFactoryDecoDetail = () =>
    import ('@/pages/decorManage/outFactoryDecoDetail') //工厂饰审核列表详情
const verifyOutFactoryDeco = () =>
    import ('@/pages/decorManage/verifyOutFactoryDeco') //工厂饰一键审核列表
const verifyOutFactoryDecoDetail = () =>
    import ('@/pages/decorManage/verifyOutFactoryDecoDetail') //工厂饰一键审核列表
const outFactoryDecoOpera = () =>
    import ('@/pages/decorManage/outFactoryDecoOpera') //出工厂饰申请列表
const outFactoryDecoOperaDetail = () =>
    import ('@/pages/decorManage/outFactoryDecoOperaDetail') //出工厂饰申请列表详情
const allotInOrder = () =>
    import ('@/pages/stockManage/allotInOrder') //调拨入库列表
const allotInOrderDetail = () =>
    import ('@/pages/stockManage/allotInOrderDetail') //调拨入库列表详情


//库存管理
// import positionView from '@/pages/stockManage/positionView' //库位查看
// import positionViewDetail from '@/pages/stockManage/positionViewDetail' //库位查看详细
// import palletView from '@/pages/stockManage/palletView' //托盘查看
// import palletViewDetail from '@/pages/stockManage/palletViewDetail' //托盘查看详细
// import stockLevel from '@/pages/stockManage/stockLevel' //库存水位设置查看
// import stockLevelDetail from '@/pages/stockManage/stockLevelDetail' //库存水位设置查看详细
// import spotStock from '@/pages/stockManage/spotStock' //金库库存查看
// import roomStock from '@/pages/stockManage/roomStock' //展厅库存查看
// import stockSet from '@/pages/stockManage/stockSet' //仓库设置

//饰品单据管理
const allotOutDep = () =>
    import ('@/pages/decorManage/allotOutDep') //调拨出库
const allotOutDepDet = () =>
    import ('@/pages/decorManage/allotOutDepDet') //调拨出库详情
const decoLogistics = () =>
    import ('@/pages/decorManage/decoLogistics') //物流饰品库存
const decoLogisticsDet = () =>
    import ('@/pages/decorManage/decoLogisticsDet') //物流饰品库存详情
const deliLogis = () =>
    import ('@/pages/decorManage/deliLogis') //物流收货
const deliLogisDet = () =>
    import ('@/pages/decorManage/deliLogisDet') //物流收货详情
const exchConfInDep = () =>
    import ('@/pages/decorManage/exchConfInDep') //金库确认入库
const exchConfInDepDet = () =>
    import ('@/pages/decorManage/exchConfInDepDet') //金库确认入库详情
const receInDep = () =>
    import ('@/pages/decorManage/receInDep') //收饰入库
const receInDepDet = () =>
    import ('@/pages/decorManage/receInDepDet') //收饰入库详情
const retuInDep = () =>
    import ('@/pages/decorManage/retuInDep') //退饰入库
const retuInDepDet = () =>
    import ('@/pages/decorManage/retuInDepDet') //退饰入库详情
const allotOrder = () =>
    import ('@/pages/stockManage/allotOrder') //调拨单查看
const allotOrderDetail = () =>
    import ('@/pages/stockManage/allotOrderDetail') //调拨单查看详细
const allotOrderOpera = () =>
    import ('@/pages/stockManage/allotOrderOpera') //调拨单(发起者)查看
const allotOrderOperaDetail = () =>
    import ('@/pages/stockManage/allotOrderOperaDetail') //调拨单(发起者)查看详细
const deliveryOrder = () =>
    import ('@/pages/stockManage/deliveryOrder') //收货单
const deliveryOrderDetail = () =>
    import ('@/pages/stockManage/deliveryOrderDetail') //收货单查看详细
const putInOrder = () =>
    import ('@/pages/stockManage/putInOrder') //入库验收单
const putInOrderDetail = () =>
    import ('@/pages/stockManage/putInOrderDetail') //入库验收单查看详细
const returnOrder = () =>
    import ('@/pages/stockManage/returnOrder') //退货单
const returnOrderDetail = () =>
    import ('@/pages/stockManage/returnOrderDetail') //退货单查看详细
const returnOrderAddProOne = () =>
    import ('@/pages/stockManage/returnOrderAddProOne') //退货单添加产品第一步
const returnOrderAddProTwo = () =>
    import ('@/pages/stockManage/returnOrderAddProTwo') //退货单添加产品第二步
const returnOrderOpera = () =>
    import ('@/pages/stockManage/returnOrderOpera') //退货单（发起者）
const returnOrderOperaDetail = () =>
    import ('@/pages/stockManage/returnOrderOperaDetail') //退货单（发起者）查看详细
const pickOrder = () =>
    import ('@/pages/stockManage/pickOrder') //退货单添加产品第一步
const pickOrderDetail = () =>
    import ('@/pages/stockManage/pickOrderDetail') //退货单添加产品第二步
const shipmentOrder = () =>
    import ('@/pages/stockManage/shipmentOrder') //出货单（客户）
const shipmentOrderDetail = () =>
    import ('@/pages/stockManage/shipmentOrderDetail') //出货单（客户）详情
const shipmentOrderTwo = () =>
    import ('@/pages/stockManage/shipmentOrderTwo') //出货单（展厅）
const shipmentOrderTwoDetail = () =>
    import ('@/pages/stockManage/shipmentOrderTwoDetail') //出货单（展厅）详情
const galleryStorage = () =>
    import ('@/pages/stockManage/galleryStorage/galleryStorage') //调拨入库(展厅)
const galleryStorageDetail = () =>
    import ('@/pages/stockManage/galleryStorage/galleryStorageDetail') //调拨入库详情(展厅)


// //饰品管理(新需求) 
const outboundOrder = () =>
    import ('@/pages/decorManage/outboundOrder/outboundOrder') //出库单
const outboundOrderDetailComplete = () =>
    import ('@/pages/decorManage/outboundOrder/outboundOrderDetailComplete') //出库详情(已完成)
const outboundOrderDetailWait = () =>
    import ('@/pages/decorManage/outboundOrder/outboundOrderDetailWait') //出库详情(待出库)
const allocationVault = () =>
    import ('@/pages/decorManage/allocationVault/allocationVault') //调拨出库单列表（金库）
const allocationVaultComplete = () =>
    import ('@/pages/decorManage/allocationVault/allocationVaultComplete') //调拨出库单列表详情（已完成）
const allocationVaultWait = () =>
    import ('@/pages/decorManage/allocationVault/allocationVaultWait') //调拨出库单列表详情（待出库）
const outsideWarehousing = () =>
    import ('@/pages/decorManage/outsideWarehousing/outsideWarehousing') //调拨入库列表（金库）
const outsideWarehousingDetail = () =>
    import ('@/pages/decorManage/outsideWarehousing/outsideWarehousingDetail') //调拨入库单详情（金库）
const vaultCollectFactory = () =>
    import ('@/pages/decorManage/vaultCollectFactory/vaultCollectFactory') //收工厂饰列表（金库）
const vaultCollectFactoryDetail = () =>
    import ('@/pages/decorManage/vaultCollectFactory/vaultCollectFactoryDetail') //收工厂饰列表详情（金库）
const repetition = () =>
    import ('@/pages/decorManage/repetition/repetition') //调拨复称（金库）
const repetitionDetail = () =>
    import ('@/pages/decorManage/repetition/repetitionDetail') //调拨复称详情（金库）
const enterSummary = () =>
    import ('@/pages/decorManage/enterSummary/enterSummary') //入饰单列表（金库汇总）
const enterSummaryDetail = () =>
    import ('@/pages/decorManage/enterSummary/enterSummaryDetail') //入饰单列表详情（金库汇总）
const outSummary = () =>
    import ('@/pages/decorManage/outSummary/outSummary') //出饰单列表（金库汇总）
const outSummaryDetail = () =>
    import ('@/pages/decorManage/outSummary/outSummaryDetail') //出饰单列表详情（金库汇总）


//财务管理
const goldPriceView = () =>
    import ('@/pages/financialManage/goldPriceView') //金价变更记录查看
const saveOweDisp = () =>
    import ('@/pages/financialManage/saveOweDisp') //存欠表查看
const saveOweEdit = () =>
    import ('@/pages/financialManage/saveOweEdit') //存欠表详细查看
const paragraphRegister = () =>
    import ('@/pages/financialManage/paragraphRegister') //来款登记
const paragraphRegisterEdit = () =>
    import ('@/pages/financialManage/paragraphRegisterEdit') //来款登记编辑
const goldRelease = () =>
    import ('@/pages/financialManage/goldRelease') //发料
const financialOpening = () =>
    import ('@/pages/financialManage/financialOpening') //财务开票
const companyAccount = () =>
    import ('@/pages/financialManage/companyAccount') //公司账号
const creatNewAccount = () =>
    import ('@/pages/financialManage/creatNewAccount') //创建新账号
const moneyRegister = () =>
    import ('@/pages/financialManage/moneyRegister') //来款登记
const refundRegister = () =>
    import ('@/pages/financialManage/refundRegister') //退款登记
const adjustMoney = () =>
    import ('@/pages/financialManage/adjustMoney') //调整款
const recognition = () =>
    import ('@/pages/financialManage/recognition') //认款
const financeStoreroom = () =>
    import ('@/pages/financialManage/financeStoreroom') // 料入库
const financeStoreroomDetail = () =>
    import ('@/pages/financialManage/financeStoreroomDetail') // 料入库详情
const financeOutTreasury = () =>
    import ('@/pages/financialManage/financeOutTreasury') // 料出库
const financeOutTreasuryDetail = () =>
    import ('@/pages/financialManage/financeOutTreasuryDetail') // 料出库详情
const financeGoldAllocation = () =>
    import ('@/pages/financialManage/financeGoldAllocation') // 料调拨
const financeGoldAllocationDetail = () =>
    import ('@/pages/financialManage/financeGoldAllocationDetail') // 料调拨详情
const financeMaterialTransfer = () =>
    import ('@/pages/financialManage/financeMaterialTransfer') // 料转饰
const financeMaterialTransferDetail = () =>
    import ('@/pages/financialManage/financeMaterialTransferDetail') // 料转饰详情
const financeMaterialExchange = () =>
    import ('@/pages/financialManage/financeMaterialExchange') // 料往来

const jewelryInStore = () =>
    import ('@/pages/financialManage/jewelryInStore') // 饰入库
const jewelryInStoreDetail = () =>
    import ('@/pages/financialManage/jewelryInStoreDetail') // 饰入库详情
const jewelryOutStore = () =>
    import ('@/pages/financialManage/jewelryOutStore') // 饰出库
const jewelryOutStoreDetail = () =>
    import ('@/pages/financialManage/jewelryOutStoreDetail') // 饰出库详情

const financeExchangeFunds = () =>
    import ('@/pages/financialManage/financeExchangeFunds') // 款往来
const depositOweList = () =>
    import ('@/pages/financialManage/depositOweList') //存欠列表
const depositOweListetails = () =>
    import ('@/pages/financialManage/depositOweListetails') //存欠列表详情
const dealingsSummary = () =>
    import ('@/pages/financialManage/dealingsSummary') //往来汇总
const customerPrice = () =>
    import ('@/pages/financialManage/customerPrice') //客户结价
const financeAdjustMoney = () =>
    import ('@/pages/financialManage/financeAdjustMoney') //客户调整款（审核）
const financeCustomerPrice = () =>
    import ('@/pages/financialManage/financeCustomerPrice') //客户结价(审核)
const pricingTypeSet = () =>
    import ('@/pages/financialManage/pricingTypeSet') //结价种类设置
const bankAccountSet = () =>
    import ('@/pages/financialManage/bankAccountSet') //银行账号设置
const invoiceSetting = () =>
    import ('@/pages/financialManage/invoiceSetting') //开票设置
const addressBookManag = () =>
    import ('@/pages/financialManage/addressBookManag') //通讯录管理
const basicLaborCost = () =>
    import ('@/pages/financialManage/basicLaborCost') //基础工费
const platformCost = () =>
    import ('@/pages/financialManage/platformCost') //平台附加费用维护
const specialOffer = () =>
    import ('@/pages/financialManage/specialOffer') //特价优惠
const InvoiceSummary = () =>
    import ('@/pages/financialManage/InvoiceSummary') //开票登记
const createInvoice = () =>
    import ('@/pages/financialManage/createInvoice') //新增开票
const InvoiceDetails = () =>
    import ('@/pages/financialManage/InvoiceDetails') //开票详情
const noInvoice = () =>
    import ('@/pages/financialManage/noInvoice') //未开票登记

//原料管理物流
const logisticSendMaterial = () =>
    import ('@/pages/materControl/logistics/logisticSendMaterial') //发料
const logisticCreatSendMaterial = () =>
    import ('@/pages/materControl/logistics/logisticCreatSendMaterial') //新建发料
const logisticSendMaterialDetail = () =>
    import ('@/pages/materControl/logistics/logisticSendMaterialDetail') //发料详情
const logisticGoldAllocation = () =>
    import ('@/pages/materControl/logistics/logisticGoldAllocation') //调拨
const logisticCreatGoldAllocation = () =>
    import ('@/pages/materControl/logistics/logisticCreatGoldAllocation') //新建调拨
const logisticGoldAllocationDetail = () =>
    import ('@/pages/materControl/logistics/logisticGoldAllocationDetail') //调拨详情
const logisticsAllocationWarehousing = () =>
    import ('@/pages/materControl/logistics/logisticsAllocationWarehousing') //调拨入库
const logisticsAllocationWarehousingDetail = () =>
    import ('@/pages/materControl/logistics/logisticsAllocationWarehousingDetail') //调拨入库详情

//消息中心
const systemMessage = () =>
    import ('@/pages/messageCenter/systemMessage') //系统消息
const businessMessage = () =>
    import ('@/pages/messageCenter/businessMessage') //业务消息


//系统管理
const powerManage = () =>
    import ('@/pages/systemManage/powerManage') //权限管理
const companyType = () =>
    import ('@/pages/systemManage/companyType') //公司类型
const logView = () =>
    import ('@/pages/systemManage/logView') //日志查看
const systemResource = () =>
    import ('@/pages/systemManage/systemResource') //系统资源
const taskErrorList = () =>
    import ('@/pages/systemManage/taskErrorList') //任务失败记录
const taskTimeingList = () =>
    import ('@/pages/systemManage/taskTimeingList') //定时任务

//客户管理
const customerManageDisp = () =>
    import ('@/pages/customerManage/customerManageDisp') //客户列表
const customerManageView = () =>
    import ('@/pages/customerManage/customerManageView') //客户列表详情
const bankSet = () =>
    import ('@/pages/customerManage/bankSet') //银行设置
const preferentialStrategyDisp = () =>
    import ('@/pages/customerManage/preferentialStrategyDisp') //优惠策略列表
const preferentialStrategyView = () =>
    import ('@/pages/customerManage/preferentialStrategyView') //优惠策略列新增
const preferentialStrategyEdit = () =>
    import ('@/pages/customerManage/preferentialStrategyEdit') //优惠策略列编辑
const paymentView = () =>
    import ('@/pages/customerManage/paymentView') //款料计划

//订单管理
const orderDef = () =>
    import ('@/pages/orderManage/orderDef') //标准单审批(通用)
const orderDefLeader = () =>
    import ('@/pages/orderManage/orderDefLeader') //标准单审批(领导)
const orderDefAll = () =>
    import ('@/pages/orderManage/orderDefAll') //标准单
const orderPrivateSale = () =>
    import ('@/pages/orderManage/orderPrivateSale') //展销单
const orderDefAllBig = () =>
    import ('@/pages/orderManage/orderDefAllBig')
const orderDefAllDetailBig = () =>
    import ('@/pages/orderManage/orderDefAllDetailBig') //标准订单详情(一键审批)(大产品)
const repleOrder = () =>
    import ('@/pages/stockManage/repleOrder') //补货单查看
const repleOrderDetail = () =>
    import ('@/pages/stockManage/repleOrderDetail') //补货单查看详细
const repleAllOrder = () =>
    import ('@/pages/stockManage/repleAllOrder') //一键补货审批列表
const repleAllOrderDetail = () =>
    import ('@/pages/stockManage/repleAllOrderDetail') //一键补货审批详情
const repleOrderOpera = () =>
    import ('@/pages/stockManage/repleOrderOpera') //补货单（发起者）查看
const repleOrderOperaDetail = () =>
    import ('@/pages/stockManage/repleOrderOperaDetail') //补货单（发起者）查看详细
const repleCart = () =>
    import ('@/pages/stockManage/repleCart') //补货购物车查看
const repleCartDetail = () =>
    import ('@/pages/stockManage/repleCartDetail') //补货购物车确定查看

//到店统计
const storeStatistics = () =>
    import ('@/pages/storeStatistics/storeStatistics') //到店统计


//报表管理
const entrustMachining = () =>
    import ('@/pages/reportManage/entrustMachining.vue') //委托加工汇总
const costHigh = () =>
    import ('@/pages/reportManage/costHigh.vue') //工费高开
const offerLow = () =>
    import ('@/pages/reportManage/offerLow.vue') //优惠低开
const dealingsAccount = () =>
    import ('@/pages/reportManage/dealingsAccount.vue') //往来对账单
const customerExchange = () =>
    import ('@/pages/reportManage/customerExchange.vue') //客户饰品往来详情
const balanceTable = () =>
    import ('@/pages/reportManage/balanceTable.vue') //料试算平衡表
const exhibitionStatisticsForm = () =>
    import ('@/pages/reportManage/exhibitionStatisticsForm.vue') //展销活动统计表
const customerDecorationForm = () =>
    import ('@/pages/reportManage/customerDecorationForm.vue') //客户存饰表
const orderProgressRecord = () =>
    import ('@/pages/reportManage/orderProgressRecord.vue') //订单进度跟踪

//饰品单据管理H5管理
const outCustomDetail = () =>
    import ('@/pages/jewelryManage/H5/outCustomDetail') //出客户饰详情显示
const outCustomBaoView = () =>
    import ('@/pages/jewelryManage/H5/outCustomBaoView') //出客户饰包详情显示
const pickBaoPrint = () =>
    import ('@/pages/jewelryManage/H5/pickBaoPrint') //拣货单包号显示


//首页框架（包含菜单）
const Index = () =>
    import ('@/pages/index/index')


Vue.use(Router)
Vue.prototype.$axios = Axios


let routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login,
    },
    {
        path: '/Index',
        component: Index,
        children: [
            // {
            //     path: '/',
            //     component: productView
            // },
            {
                path: 'checkGoldWare', //验料（金库）
                component: checkGoldWare
            },
            {
                path: 'editGoldWare', //验料（金库）编辑
                component: editGoldWare
            },
            {
                path: 'checkGoldTest', //验料（测金）
                component: checkGoldTest
            },
            {
                path: 'editGoldTest', //验料（测金）编辑
                component: editGoldTest
            },
            {
                path: 'checkReceiveMater', //收料
                component: checkReceiveMater
            },
            {
                path: 'recharge', //收料(new)
                component: recharge
            },
            {
                path: 'warehousingDetail', //入库详情
                component: warehousingDetail
            },
            {
                path: 'warehousingComplete', //入库完成
                component: warehousingComplete
            },
            {
                path: 'SendMaterial', //发料
                component: SendMaterial
            },
            {
                path: 'creatSendMaterial', //新建发料
                component: creatSendMaterial
            },
            {
                path: 'SendMaterialDetail', //发料详情
                component: SendMaterialDetail
            },
            {
                path: 'goldAllocation', //金库收料部--调拨
                component: goldAllocation
            },
            {
                path: 'creatGoldAllocation', //金库收料部--新建调拨
                component: creatGoldAllocation
            },
            {
                path: 'goldAllocationDetail', //金库收料部--调拨详情
                component: goldAllocationDetail
            },
            {
                path: 'allocationWarehousing', //金库收料部--调拨入库
                component: allocationWarehousing
            },
            {
                path: 'checkGold', //测金
                component: checkGold
            },
            {
                path: 'setLaborCost', //收旧工费
                component: setLaborCost
            },
            {
                path: 'setMaterialType', //料种类
                component: setMaterialType
            },
            {
                path: 'setMaterialClass', //料类型
                component: setMaterialClass
            },
            {
                path: 'materialTransfer', //料转饰
                component: materialTransfer
            },
            {
                path: 'creatMaterialTransfer', //新建转饰
                component: creatMaterialTransfer
            },
            {
                path: 'materialTransferDetail', //转饰详情
                component: materialTransferDetail
            },
            {
                path: 'ornament', //饰转料
                component: ornament
            },
            {
                path: 'creatOrnament', //新建转料
                component: creatOrnament
            },
            {
                path: 'ornamentDetail', //转料详情
                component: ornamentDetail
            },
            {
                path: 'allocationWarehousing', //金库收料部----调拨入库
                component: allocationWarehousing
            },
            {
                path: 'allocationWarehousingDetail', //金库收料部----调拨入库详情
                component: allocationWarehousingDetail
            },
            {
                path: 'setCounter', //柜台设置
                component: setCounter
            },
            {
                path: 'outOfStorage', //料出入库-------系统
                component: outOfStorage
            },
            {
                path: 'realTimeStock', //料实时库存-------系统
                component: realTimeStock
            },
            {
                path: 'outOfStorageComeDepart', //料出入库-------金库收料部
                component: outOfStorageComeDepart
            },
            {
                path: 'realTimeStockComeDepart', //料实时库存-------金库收料部
                component: realTimeStockComeDepart
            },
            {
                path: 'outOfStorageDepart', //料出入库-------金库部
                component: outOfStorageDepart
            },
            {
                path: 'realTimeStockDepart', //料实时库存-------金库部
                component: realTimeStockDepart
            },
            {
                path: 'outOfStorageListLogistics', //料出入库-------物流
                component: outOfStorageListLogistics
            },
            {
                path: 'realTimeStockListLogistics', //料实时库存-------物流
                component: realTimeStockListLogistics
            },
            {
                path: 'editReceiveMater', //收料编辑
                component: editReceiveMater
            },
            {
                path: 'checkSendMater', //发料
                component: checkSendMater
            },
            {
                path: 'editSendMater', //发料编辑
                component: editSendMater
            },
            {
                path: 'checkPurify', //提纯
                component: checkPurify
            },
            {
                path: 'editPurify', //提纯编辑
                component: editPurify
            },
            {
                path: 'checkGoldStock', //金料库存列表
                component: checkGoldStock
            },
            {
                path: 'editGoldStock', //金料库存列表编辑
                component: editGoldStock
            },
            {
                path: 'checkMaterToOrna', //料转饰
                component: checkMaterToOrna
            },
            {
                path: 'editMaterToOrna', //料转饰编辑
                component: editMaterToOrna
            },
            {
                path: 'checkOrnaToMater', //饰转料
                component: checkOrnaToMater
            },
            {
                path: 'editOrnaToMater', //饰转料编辑
                component: editOrnaToMater
            },

            {
                path: 'saveOweDisp', //存欠表
                component: saveOweDisp
            },
            {
                path: 'saveOweEdit', //存欠表查看编辑
                component: saveOweEdit
            },
            {
                path: 'moneyRegister', //来款登记(new)
                component: moneyRegister
            },
            {
                path: 'refundRegister', //退款登记
                component: refundRegister
            },
            {
                path: 'recognition', //认款
                component: recognition
            },
            {
                path: 'financeStoreroom', //料入库
                component: financeStoreroom
            },
            {
                path: 'financeStoreroomDetail', //料入库详情
                component: financeStoreroomDetail
            },
            {
                path: 'financeOutTreasury', //料出库
                component: financeOutTreasury
            },
            {
                path: 'financeOutTreasuryDetail', //料出库详情
                component: financeOutTreasuryDetail
            },
            {
                path: 'financeGoldAllocation', //料调拨
                component: financeGoldAllocation
            },
            {
                path: 'financeGoldAllocationDetail', //料调拨详情
                component: financeGoldAllocationDetail
            },
            {
                path: 'financeMaterialTransfer', //料转饰
                component: financeMaterialTransfer
            },
            {
                path: 'financeMaterialTransferDetail', //料转饰详情
                component: financeMaterialTransferDetail
            },
            // jewelryInStoreDetail
            {
                path: 'jewelryInStore', // 饰入库
                component: jewelryInStore
            },
            {
                path: 'jewelryInStoreDetail', // 饰入库详情
                component: jewelryInStoreDetail
            },
            {
                path: 'jewelryOutStore', // 饰出库
                component: jewelryOutStore
            },
            {
                path: 'jewelryOutStoreDetail', // 饰出库详情
                component: jewelryOutStoreDetail
            },
            {
                path: 'financeMaterialExchange', //料往来
                component: financeMaterialExchange
            },
            {
                path: 'financeExchangeFunds', //款往来
                component: financeExchangeFunds
            },
            {
                path: 'creatNewAccount', //创建新账号
                component: creatNewAccount
            },
            {
                path: 'paragraphRegister', //来款登记
                component: paragraphRegister
            },
            {
                path: 'paragraphRegisterEdit', //来款登记编辑
                component: paragraphRegisterEdit
            },
            {
                path: 'systemMessage', //系统消息
                component: systemMessage
            },
            {
                path: 'businessMessage', //业务消息
                component: businessMessage
            },
            {
                path: 'vaultSendMaterial', //金库----发料
                component: vaultSendMaterial
            },
            {
                path: 'vaultCreatSendMaterial', //金库----新建发料
                component: vaultCreatSendMaterial
            },
            {
                path: 'vaultSendMaterialDetail', //金库----发料详情
                component: vaultSendMaterialDetail
            },
            {
                path: 'vaultGoldAllocation', //金库----调拨
                component: vaultGoldAllocation
            },
            {
                path: 'vaultCreatGoldAllocation', //金库----新建调拨
                component: vaultCreatGoldAllocation
            },
            {
                path: 'vaultGoldAllocationDetail', //金库----调拨详情
                component: vaultGoldAllocationDetail
            },
            {
                path: 'vaultAllocationWarehousing', //金库----调拨入库
                component: vaultAllocationWarehousing
            },
            {
                path: 'vaultAllocationWarehousingDetail', //金库----调拨入库详情
                component: vaultAllocationWarehousingDetail
            },
            {
                path: 'logisticSendMaterial', //物流----发料
                component: logisticSendMaterial
            },
            {
                path: 'logisticCreatSendMaterial', //物流----新建发料
                component: logisticCreatSendMaterial
            },
            {
                path: 'logisticSendMaterialDetail', //物流----发料详情
                component: logisticSendMaterialDetail
            },
            {
                path: 'logisticGoldAllocation', //物流----调拨
                component: logisticGoldAllocation
            },
            {
                path: 'logisticCreatGoldAllocation', //物流----新建调拨
                component: logisticCreatGoldAllocation
            },
            {
                path: 'logisticGoldAllocationDetail', //物流----调拨详情
                component: logisticGoldAllocationDetail
            },
            {
                path: 'logisticsAllocationWarehousing', //物流----调拨入库
                component: logisticsAllocationWarehousing
            },
            {
                path: 'logisticsAllocationWarehousingDetail', //物流----调拨入库详情
                component: logisticsAllocationWarehousingDetail
            },
            {
                path: 'userManageDisp', //用户管理
                component: userManageDisp
            },
            // {
            //     path: 'positionView', //库位管理查看
            //     component: positionView
            // },
            // {
            //     path: 'positionViewDetail', //库位管理查看详细
            //     component: positionViewDetail
            // },
            // {
            //     path: 'palletView', //托盘管理查看
            //     component: palletView
            // },
            // {
            //     path: 'palletViewDetail', //托盘管理查看详细
            //     component: palletViewDetail
            // },
            {
                path: 'repleOrder', //补货单
                component: repleOrder
            },
            {
                path: 'repleOrderDetail', //补货单查看详细
                component: repleOrderDetail
            },
            {
                path: 'repleAllOrder', // 一键补货审批列表
                component: repleAllOrder
            },
            {
                path: 'repleAllOrderDetail', // 一键补货审批详情
                component: repleAllOrderDetail
            },
            {
                path: 'allotOrder', //调拨单
                component: allotOrder
            },
            {
                path: 'allotOrderDetail', //调拨单查看详细
                component: allotOrderDetail
            },
            {
                path: 'allotOrderOpera', //调拨单（发起者）
                component: allotOrderOpera
            },
            {
                path: 'allotOrderOperaDetail', //调拨单（发起者）查看详细
                component: allotOrderOperaDetail
            },
            // {
            //     path: 'stockLevel', //库存水位设置
            //     component: stockLevel
            // },
            // {
            //     path: 'stockLevelDetail', //库存水位设置查看详细
            //     component: stockLevelDetail
            // },
            {
                path: 'repleCart', //补货购物车
                component: repleCart
            },
            // {
            //     path: 'spotStock', //金库库存查看
            //     component: spotStock
            // },
            // {
            //     path: 'roomStock', //展厅库存查看
            //     component: roomStock
            // },
            {
                path: 'deliveryOrder', //收货单
                component: deliveryOrder
            },
            {
                path: 'deliveryOrderDetail', //收货单查看详细
                component: deliveryOrderDetail
            },
            {
                path: 'putInOrder', //入库验收单
                component: putInOrder
            },
            {
                path: 'putInOrderDetail', //入库验收单查看详细
                component: putInOrderDetail
            },
            {
                path: 'returnOrder', //退货单
                component: returnOrder
            },
            {
                path: 'returnOrderDetail', //退货单查看详细
                component: returnOrderDetail
            },
            {
                path: 'depositOweList', //存欠列表
                component: depositOweList
            },
            {
                path: 'depositOweListetails', //存欠列表详情
                component: depositOweListetails
            },
            {
                path: 'dealingsSummary', //往来汇总
                component: dealingsSummary
            },
            {
                path: 'customerPrice', //客户结价
                component: customerPrice
            },
            {
                path: 'financeAdjustMoney', //客户调整款（审核）
                component: financeAdjustMoney
            },
            {
                path: 'financeCustomerPrice', //客户结价（审核）
                component: financeCustomerPrice
            },
            {
                path: 'pricingTypeSet', //结价种类设置
                component: pricingTypeSet
            },

            {
                path: 'financeOutTreasury', //料出库
                component: financeOutTreasury
            },
            {
                path: 'financeOutTreasuryDetail', //料出库详情
                component: financeOutTreasuryDetail
            },
            {
                path: 'financeGoldAllocation', //料调拨
                component: financeGoldAllocation
            },
            {
                path: 'financeGoldAllocationDetail', //料调拨详情
                component: financeGoldAllocationDetail
            },
            {
                path: 'financeMaterialTransfer', //料转饰
                component: financeMaterialTransfer
            },
            {
                path: 'financeMaterialTransferDetail', //料转饰详情
                component: financeMaterialTransferDetail
            },
            {
                path: 'financeMaterialExchange', //料往来
                component: financeMaterialExchange
            },
            {
                path: 'creatNewAccount', //创建新账号
                component: creatNewAccount
            },
            {
                path: 'paragraphRegister', //来款登记
                component: paragraphRegister
            },
            {
                path: 'paragraphRegisterEdit', //来款登记编辑
                component: paragraphRegisterEdit
            },
            {
                path: 'systemMessage', //系统消息
                component: systemMessage
            },
            {
                path: 'businessMessage', //业务消息
                component: businessMessage
            },
            {
                path: 'vaultSendMaterial', //金库----发料
                component: vaultSendMaterial
            },
            {
                path: 'vaultCreatSendMaterial', //金库----新建发料
                component: vaultCreatSendMaterial
            },
            {
                path: 'vaultSendMaterialDetail', //金库----发料详情
                component: vaultSendMaterialDetail
            },
            {
                path: 'vaultGoldAllocation', //金库----调拨
                component: vaultGoldAllocation
            },
            {
                path: 'vaultCreatGoldAllocation', //金库----新建调拨
                component: vaultCreatGoldAllocation
            },
            {
                path: 'vaultGoldAllocationDetail', //金库----调拨详情
                component: vaultGoldAllocationDetail
            },
            {
                path: 'vaultAllocationWarehousing', //金库----调拨入库
                component: vaultAllocationWarehousing
            },
            {
                path: 'vaultAllocationWarehousingDetail', //金库----调拨入库详情
                component: vaultAllocationWarehousingDetail
            },
            {
                path: 'logisticSendMaterial', //物流----发料
                component: logisticSendMaterial
            },
            {
                path: 'logisticCreatSendMaterial', //物流----新建发料
                component: logisticCreatSendMaterial
            },
            {
                path: 'logisticSendMaterialDetail', //物流----发料详情
                component: logisticSendMaterialDetail
            },
            {
                path: 'logisticGoldAllocation', //物流----调拨
                component: logisticGoldAllocation
            },
            {
                path: 'logisticCreatGoldAllocation', //物流----新建调拨
                component: logisticCreatGoldAllocation
            },
            {
                path: 'logisticGoldAllocationDetail', //物流----调拨详情
                component: logisticGoldAllocationDetail
            },
            {
                path: 'logisticsAllocationWarehousing', //物流----调拨入库
                component: logisticsAllocationWarehousing
            },
            {
                path: 'logisticsAllocationWarehousingDetail', //物流----调拨入库详情
                component: logisticsAllocationWarehousingDetail
            },
            // {
            //     path: 'positionView', //库位管理查看
            //     component: positionView
            // },
            // {
            //     path: 'positionViewDetail', //库位管理查看详细
            //     component: positionViewDetail
            // },
            // {
            //     path: 'palletView', //托盘管理查看
            //     component: palletView
            // },
            // {
            //     path: 'palletViewDetail', //托盘管理查看详细
            //     component: palletViewDetail
            // },
            {
                path: 'repleOrder', //补货单
                component: repleOrder
            },
            {
                path: 'repleOrderDetail', //补货单查看详细
                component: repleOrderDetail
            },
            {
                path: 'repleOrderOpera', //补货单（发起者）
                component: repleOrderOpera
            },
            {
                path: 'repleOrderOperaDetail', //补货单（发起者）查看详细
                component: repleOrderOperaDetail
            },
            // {
            //     path: 'stockLevel', //库存水位设置
            //     component: stockLevel
            // },
            // {
            //     path: 'stockLevelDetail', //库存水位设置查看详细
            //     component: stockLevelDetail
            // },
            {
                path: 'repleCart', //库存水位设置查看详细
                component: repleCart
            },
            // {
            //     path: 'spotStock', //金库库存查看
            //     component: spotStock
            // },
            // {
            //     path: 'roomStock', //展厅库存查看
            //     component: roomStock
            // },
            {
                path: 'depositOweList', //存欠列表
                component: depositOweList
            },
            {
                path: 'depositOweListetails', //存欠列表详情
                component: depositOweListetails
            },
            {
                path: 'dealingsSummary', //往来汇总
                component: dealingsSummary
            },
            {
                path: 'customerPrice', //客户结价
                component: customerPrice
            },
            {
                path: 'financeAdjustMoney', //客户调整款（审核）
                component: financeAdjustMoney
            },
            {
                path: 'financeCustomerPrice', //客户结价（审核）
                component: financeCustomerPrice
            },
            {
                path: 'pricingTypeSet', //结价种类设置
                component: pricingTypeSet
            },
            {
                path: 'bankAccountSet', //银行账号设置
                component: bankAccountSet
            },
            {
                path: 'invoiceSetting', //开票设置
                component: invoiceSetting
            },

            {
                path: 'goldPriceView', //金价变更记录查看
                component: goldPriceView
            },
            {
                path: 'goldRelease', //金价变更记录查看
                component: goldRelease
            },
            {
                path: 'financialOpening', //财务开票
                component: financialOpening
            },
            {
                path: 'companyAccount', //公司账号
                component: companyAccount
            },
            {
                path: 'adjustMoney', //调整款
                component: adjustMoney
            },
            {
                path: 'financeMaterialTransfer', //料转饰
                component: financeMaterialTransfer
            },
            {
                path: 'financeMaterialTransferDetail', //料转饰详情
                component: financeMaterialTransferDetail
            },
            {
                path: 'depositOweList', //存欠列表
                component: depositOweList
            },
            {
                path: 'depositOweListetails', //存欠列表详情
                component: depositOweListetails
            },
            {
                path: 'dealingsSummary', //往来汇总
                component: dealingsSummary
            },
            {
                path: 'customerPrice', //客户结价
                component: customerPrice
            },
            {
                path: 'financeAdjustMoney', //客户调整款（审核）
                component: financeAdjustMoney
            },
            {
                path: 'addressBookManag', //通讯录管理
                component: addressBookManag
            },
            {
                path: 'basicLaborCost', //基础工费
                component: basicLaborCost
            },
            {
                path: 'platformCost', //平台附加费用维护
                component: platformCost
            },
            {
                path: 'specialOffer', //特价优惠
                component: specialOffer
            },
            {
                path: 'InvoiceSummary', //开票登记
                component: InvoiceSummary
            },
            {
                path: 'noInvoice', //未开票登记
                component: noInvoice
            },
            {
                path: 'createInvoice', //新增开票
                component: createInvoice
            },
            {
                path: 'InvoiceDetails', //开票详情
                component: InvoiceDetails
            },
            {
                path: 'powerManage', //权限管理
                component: powerManage
            },
            {
                path: 'companyType', //公司类型
                component: companyType
            },
            {
                path: 'logView', //日志查看
                component: logView
            },
            {
                path: 'systemResource', //系统资源
                component: systemResource
            },
            {
                path: 'taskErrorList', //任务失败记录
                component: taskErrorList
            },
            {
                path: 'taskTimeingList', //定时任务
                component: taskTimeingList
            },
            {
                path: 'customerManageDisp', //客户列表
                component: customerManageDisp
            },
            {
                path: 'customerManageView', //客户列表详情
                component: customerManageView
            },
            {
                path: 'bankSet', //银行设置
                component: bankSet
            },
            {
                path: 'departmentManage', //部门管理
                component: departmentManage
            },
            {
                path: 'departmentManageEdit', //编辑部门管理
                component: departmentManageEdit
            },
            {
                path: 'userManageDisp', //用户管理
                component: userManageDisp
            },
            {
                path: 'userManageCreate', //创建新用户
                component: userManageCreate
            },
            {
                path: 'userManageView', //用户详情
                component: userManageView
            },
            {
                path: 'userManageEdit', //用户编辑
                component: userManageEdit
            },
            {
                path: 'roleAuthoManage', //角色权限管理
                component: roleAuthoManage
            },
            {
                path: 'storeStatistics', //到店统计
                component: storeStatistics
            },
            {
                path: 'returnOrderAddProOne', //退货单添加产品第一步
                component: returnOrderAddProOne
            },
            {
                path: 'returnOrderAddProTwo', //退货单添加产品第二步
                component: returnOrderAddProTwo
            },
            {
                path: 'flowView', //流程管理查看
                component: flowView
            },
            // {
            //     path: 'flowEdit', //流程管理编辑
            //     component: flowEdit
            // },
            {
                path: 'orderDefAllBig',
                component: orderDefAllBig // 标准单审批大产品（领导一件）
            },
            {
                path: 'orderDefAllDetailBig',
                component: orderDefAllDetailBig // 标准单详情审批大产品（领导一件）
            },
            {
                path: 'orderDef', //标准单审批(通用)
                component: orderDef
            },
            {
                path: 'orderDefLeader', //标准单审批(领导)
                component: orderDefLeader
            },
            {
                path: 'orderDefAll', //标准单
                component: orderDefAll
            },
            {
                path: 'orderPrivateSale', //展销单
                component: orderPrivateSale
            },
            {
                path: 'pickOrder', //拣货验收单
                component: pickOrder
            },
            {
                path: 'pickOrderDetail', //拣货验收单
                component: pickOrderDetail
            },
            {
                path: 'repleCartDetail', //补货购物车
                component: repleCartDetail
            },

            {
                path: 'shipmentOrder', //出货单(客户)
                component: shipmentOrder
            },
            {
                path: 'shipmentOrderDetail', //出货单(客户)详情
                component: shipmentOrderDetail
            },
            {
                path: 'shipmentOrderTwo', //出货单(展厅)
                component: shipmentOrderTwo
            },
            {
                path: 'shipmentOrderTwoDetail', //出货单(展厅)详情
                component: shipmentOrderTwoDetail
            },
            {
                path: 'preferentialStrategyDisp', //优惠策略列表
                component: preferentialStrategyDisp
            },
            {
                path: 'preferentialStrategyView', //优惠策略新增
                component: preferentialStrategyView
            },
            {
                path: 'preferentialStrategyEdit', //优惠策略编辑
                component: preferentialStrategyEdit
            },
            {
                path: 'paymentView', //款料计划
                component: paymentView
            },
            {
                path: 'returnOrderOpera', //退货单（发起者）
                component: returnOrderOpera
            },
            {
                path: 'returnOrderOperaDetail', //退货单（发起者）查看详细
                component: returnOrderOperaDetail
            },
            {
                path: 'allotOutDep', //调拨出库
                component: allotOutDep
            },
            {
                path: 'allotOutDepDet', //调拨出库详情
                component: allotOutDepDet
            },
            {
                path: 'decoLogistics', //物流饰品库存
                component: decoLogistics
            },
            {
                path: 'decoLogisticsDet', //物流饰品库存详情
                component: decoLogisticsDet
            },
            {
                path: 'deliLogis', //物流收货
                component: deliLogis
            },
            {
                path: 'deliLogisDet', //物流收货详细
                component: deliLogisDet
            },
            // {
            //     path: 'stockSet', // 仓库设置
            //     component: stockSet
            // },
            {
                path: 'exchConfInDep', //金库确认入库
                component: exchConfInDep
            },
            {
                path: 'exchConfInDepDet', //金库确认入库详细
                component: exchConfInDepDet
            },
            {
                path: 'receInDep', //收饰入库
                component: receInDep
            },
            {
                path: 'receInDepDet', //收饰入库查看详细
                component: receInDepDet
            },
            {
                path: 'retuInDep', //调拨出库
                component: retuInDep
            },
            {
                path: 'retuInDepDet', //调拨出库查看详细
                component: retuInDepDet
            },
            {
                path: 'outboundOrder', //出库单
                component: outboundOrder
            },
            {
                path: 'outboundOrderDetailComplete', //出库详情(已完成)
                component: outboundOrderDetailComplete
            },
            {
                path: 'outboundOrderDetailWait', //出库详情(待出库)
                component: outboundOrderDetailWait
            },
            {
                path: 'allocationVault', //调拨出库单（金库）
                component: allocationVault
            },
            {
                path: 'allocationVaultComplete', //调拨出库单列表详情（已完成）
                component: allocationVaultComplete
            },
            {
                path: 'allocationVaultWait', //调拨出库单列表详情（待出库）
                component: allocationVaultWait
            },
            {
                path: 'outsideWarehousing', //调拨入库列表（金库）
                component: outsideWarehousing
            },
            {
                path: 'outsideWarehousingDetail', //调拨入库单详情（金库）
                component: outsideWarehousingDetail
            },
            {
                path: 'vaultCollectFactory', //收工厂饰列表（金库）
                component: vaultCollectFactory
            },
            {
                path: 'vaultCollectFactoryDetail', //收工厂饰列表详情（金库）
                component: vaultCollectFactoryDetail
            },
            {
                path: 'repetition', //调拨复称（金库）
                component: repetition
            },
            {
                path: 'repetitionDetail', //调拨复称详情（金库）
                component: repetitionDetail
            },
            {
                path: 'allotOrderExch', //调拨出库（审核）
                component: allotOrderExch
            },
            {
                path: 'allotOrderExchDetail', //调拨出库（审核）详情
                component: allotOrderExchDetail
            },
            {
                path: 'verifyAllotOrderExch', //调拨出库（一键审核）
                component: verifyAllotOrderExch
            },
            {
                path: 'verifyAllotOrderExchDetail', //调拨出库（一键审核）详情
                component: verifyAllotOrderExchDetail
            },
            {
                path: 'allotOrderExchOpera', //新增调拨
                component: allotOrderExchOpera
            },
            {
                path: 'allotOrderExchOperaDetail', //新增调拨详情
                component: allotOrderExchOperaDetail
            },
            {
                path: 'enterSummary', //入饰单列表（金库汇总）
                component: enterSummary
            },
            {
                path: 'enterSummaryDetail', //入饰单列表详情（金库汇总）
                component: enterSummaryDetail
            },

            {
                path: 'outFactoryDeco', //出工厂饰审核列表
                component: outFactoryDeco
            },
            {
                path: 'outFactoryDecoDetail', //出工厂饰审核列表详情
                component: outFactoryDecoDetail
            },
            {
                path: 'verifyOutFactoryDeco', //出工厂饰一键审核列表
                component: verifyOutFactoryDeco
            },
            {
                path: 'verifyOutFactoryDecoDetail', //出工厂饰一键审核列表
                component: verifyOutFactoryDecoDetail
            },
            {
                path: 'outFactoryDecoOpera', //出工厂饰申请列表
                component: outFactoryDecoOpera
            },
            {
                path: 'outFactoryDecoOperaDetail', //出工厂饰申请列表详情
                component: outFactoryDecoOperaDetail
            },
            {
                path: 'allotInOrder', //出工厂饰申请列表
                component: allotInOrder
            },
            {
                path: 'allotInOrderDetail', //出工厂饰申请列表详情
                component: allotInOrderDetail
            },
            {
                path: 'galleryStorage', //调拨入库（展厅）
                component: galleryStorage
            },
            {
                path: 'galleryStorageDetail', //调拨入库详情（展厅）
                component: galleryStorageDetail
            },
            {
                path: 'outSummary', //出饰单列表（金库汇总）
                component: outSummary
            },
            {
                path: 'outSummaryDetail', //出饰单列表详情（金库汇总）
                component: outSummaryDetail
            },
            {
                path: 'entrustMachining', //委托加工汇总
                component: entrustMachining
            },
            {
                path: 'costHigh', //工费高开
                component: costHigh
            },
            {
                path: 'offerLow', //优惠低开
                component: offerLow
            },
            {
                path: 'dealingsAccount', //往来对账单
                component: dealingsAccount
            },
            {
                path: 'customerExchange', // 客户饰品往来(明细)
                component: customerExchange
            },
            {
                path: 'balanceTable', // 料试算平衡表
                component: balanceTable
            },
            {
                path: 'exhibitionStatisticsForm', //展销统计表
                component: exhibitionStatisticsForm
            },
            {
                path: 'customerDecorationForm', //客户存饰表
                component: customerDecorationForm
            },
            {
                path: 'exhibitionStatisticsForm', //展销统计表
                component: exhibitionStatisticsForm
            },
            {
                path: 'orderProgressRecord', //订单进度跟踪
                component: orderProgressRecord
            },
        ]
    },
    {
        path: '/pickBaoPrint', //拣货单包号显示
        component: pickBaoPrint,
    },
    {
        path: '/outCustomDetail', //出客户饰详情显示
        component: outCustomDetail,
    },
    {
        path: '/outCustomBaoView', //出客户饰包详情显示
        component: outCustomBaoView,
    },
    {
        path: '*',
        redirect: '/login'
    },
]


// 配置引入路由
let routerChildObj = {
    stockManaRoute,
    materControlRoute,
    jewelryManageRoute
}

const mergeRouter = (routes, obj) => {
    for (const key in obj) {
        routes[2].children = routes[2].children.concat((obj[key]))
    }
    return routes
}

routes = mergeRouter(routes, routerChildObj)

// routes[2].children = routes[2].children.concat(JSON.parse(JSON.stringify(stockMana)))  

export default new Router({
    routes
})