<template>
  <div class="conBigDiv">
    <loginT></loginT>
    <div id="loginBig">
      <el-row>
        <el-col :span="12">
          <img src="/static/images/loginImg/leftIco.png" class="leftIco" />
        </el-col>
        <el-col :span="12">
          <div class="loginRight">
            <div class="loginRightOne">
              <img src="/static/images/loginImg/logoIco.png" class="logoIco" />
            </div>
            <div class="loginRightTwo">
              <el-input placeholder="请输入用户名" v-model="userName" size="large">
                <template slot="prepend">
                  <i class="iconfont icon-yonghuming"></i>
                </template>
              </el-input>
              <br />
              <el-input
                placeholder="请输入密码"
                v-model="userPassword"
                type="password"
                size="large"
                ref="userPassword"
              >
                <template slot="prepend">
                  <i slot="prefix" class="iconfont icon-mima"></i>
                </template>
              </el-input>
            </div>
            <div class="loginRightThree">
              <el-button type="primary" class="loginBtn" @click="loginFun">登 录</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="divVersion">
        <version>当前版本系统V3.8.118.dev</version>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      userPassword: "",
      menus: {
        menu: [
          {
            id: "100",
            menuName: "公司管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "101",
                menuName: "部门管理",
                menuUrl: "/index/departmentManage",
                auth: "company-view-depart,company-edit-depart",
                parentId: "100",
                childs: [],
                showTF: false
              },
              {
                id: "102",
                menuName: "流程管理",
                menuUrl: "/index/flowView",
                auth: "flow-edit",
                parentId: "100",
                childs: [],
                showTF: false
              },
              {
                id: "103",
                menuName: "人员管理",
                menuUrl: null,
                parentId: "100",
                childs: [
                  {
                    id: "1030",
                    menuName: "员工列表",
                    menuUrl: "/index/userManageDisp",
                    auth: "company-view-clerk,company-edit-cherk",
                    parentId: "103",
                    childs: [],
                    showTF: false
                  },
                  {
                    id: "1031",
                    menuName: "角色权限",
                    menuUrl: "/index/roleAuthoManage",
                    auth: "company-view-role,company-edit-role",
                    parentId: "103",
                    childs: [],
                    showTF: false
                  }
                ]
              },
              {
                id: "104",
                menuName: "任务失败记录",
                menuUrl: "/index/taskErrorList",
                parentId: "100",
                childs: [],
                auth: "task-manage",
                showTF: false
              },
              {
                id: "105",
                menuName: "定时任务",
                menuUrl: "/index/taskTimeingList",
                parentId: "100",
                childs: [],
                auth: "task-manage",
                showTF: false
              }
            ]
          },
          {
            id: "200",
            menuName: "客户管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "201",
                menuName: "客户列表",
                menuUrl: "/index/customerManageDisp",
                parentId: "200",
                childs: [],
                auth: "client-view,client_sync",
                showTF: false
              },
              {
                id: "202",
                menuName: "合作银行",
                menuUrl: "/index/bankSet",
                parentId: "200",
                childs: [],
                auth: "company-view-bank,company-edit-bank",
                showTF: false
              },
              {
                id: "203",
                menuName: "优惠策略",
                menuUrl: "/index/preferentialStrategyDisp",
                parentId: "200",
                childs: [],
                auth: "preferential-strategy",
                showTF: false
              },
              {
                id: "204",
                menuName: "款料计划",
                menuUrl: "/index/paymentView",
                parentId: "200",
                childs: [],
                auth: "back-money",
                showTF: false
              }
            ]
          },
          //   {
          //     id: "300",
          //     menuName: "库存管理",
          //     menuUrl: null,
          //     parentId: "000",
          //     showTF: false,
          //     childs: [
          //       {
          //         id: "301",
          //         menuName: "金库库存",
          //         menuUrl: "/index/spotStock",
          //         parentId: "300",
          //         childs: [],
          //         auth: "coffers-inventory",
          //         showTF: false
          //       },
          //       {
          //         id: "302",
          //         menuName: "展厅库存",
          //         menuUrl: "/index/roomStock",
          //         parentId: "300",
          //         childs: [],
          //         auth: "exhibition-inventory",
          //         showTF: false
          //       },
          //       {
          //         id: "303",
          //         menuName: "物流库存",
          //         menuUrl: "/index/decoLogistics",
          //         parentId: "300",
          //         childs: [],
          //         auth: "logistics-receipt",
          //         showTF: false
          //       },
          //       {
          //         id: "304",
          //         menuName: "仓库设置",
          //         menuUrl: "/index/stockSet",
          //         parentId: "300",
          //         childs: [],
          //         auth: "logistics-receipt",
          //         showTF: false
          //       },
          //       {
          //         id: "304",
          //         menuName: "库存管理",
          //         menuUrl: "/index/stockSpotStock",
          //         parentId: "300",
          //         childs: [],
          //         auth: "coffers-inventory",
          //         showTF: false
          //       },
          //       {
          //         id: "305",
          //         menuName: "仓储管理",
          //         parentId: "300",
          //         showTF: false,
          //         menuUrl: null,
          //         childs: [
          //           {
          //             id: "3041",
          //             menuName: "库位管理",
          //             menuUrl: "/index/positionView",
          //             parentId: "304",
          //             childs: [],
          //             auth: "sark-view,sark-edit,sark-get",
          //             showTF: false
          //           },
          //           {
          //             id: "3042",
          //             menuName: "托盘管理",
          //             menuUrl: "/index/palletView",
          //             parentId: "304",
          //             childs: [],
          //             auth: "plate-view,plage-edit",
          //             showTF: false
          //           },
          //           {
          //             id: "3043",
          //             menuName: "库存水位设置",
          //             menuUrl: "/index/stockLevel",
          //             parentId: "304",
          //             childs: [],
          //             auth: "product-water-level",
          //             showTF: false
          //           }
          //         ]
          //       }
          //     ]
          //   },
          {
            id: "300",
            menuName: "库存管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "301",
                menuName: "仓库设置",
                menuUrl: "/index/stockStockSet",
                parentId: "300",
                childs: [],
                auth: "warehouse-manage",
                showTF: false
              },
              {
                id: "302",
                menuName: "库存管理",
                menuUrl: "/index/stockSpotStock",
                parentId: "300",
                childs: [],
                auth: "inventory-view",
                showTF: false
              },
              {
                id: "303",
                menuName: "仓储管理",
                parentId: "300",
                showTF: false,
                menuUrl: null,
                childs: [
                  {
                    id: "3041",
                    menuName: "库位管理",
                    menuUrl: "/index/stockPositionView",
                    parentId: "304",
                    childs: [],
                    auth: "sark-view,sark-edit,sark-get",
                    showTF: false
                  },
                  {
                    id: "3042",
                    menuName: "托盘管理",
                    menuUrl: "/index/stockPalletView",
                    parentId: "304",
                    childs: [],
                    auth: "plate-view,plage-edit",
                    showTF: false
                  },
                  {
                    id: "3043",
                    menuName: "库存水位设置",
                    menuUrl: "/index/stockStockLevel",
                    parentId: "304",
                    childs: [],
                    auth: "product-water-level",
                    showTF: false
                  }
                ]
              }
            ]
          },
          {
            id: "400",
            menuName: "订单管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "401",
                menuName: "客单管理",
                menuUrl: "/index/orderDefAllBig",
                parentId: "400",
                childs: [],
                auth: "order-online-operate",
                showTF: false
              },
              {
                id: "402",
                menuName: "补货管理",
                menuUrl: null,
                parentId: "400",
                showTF: false,
                childs: [
                  {
                    id: "4023",
                    menuName: "补货购物车",
                    menuUrl: "/index/repleCart",
                    parentId: "402",
                    childs: [],
                    showTF: false,
                    auth: "order-replenish"
                  },
                  {
                    id: "4022",
                    menuName: "补货申请列表",
                    menuUrl: "/index/repleOrderOpera",
                    parentId: "402",
                    childs: [],
                    showTF: false,
                    auth: "order-replenish"
                  },
                  {
                    id: "4021",
                    menuName: "补货审批列表",
                    menuUrl: "/index/repleOrder",
                    parentId: "402",
                    childs: [],
                    showTF: false,
                    auth: "order-replenish-operate"
                  },
                  {
                    id: "4021",
                    menuName: "补货管理列表",
                    menuUrl: "/index/repleAllOrder",
                    parentId: "402",
                    childs: [],
                    showTF: false,
                    auth: "order-replenish-list"
                  }
                ]
              }
            ]
          },
          //   {
          //     id: "500",
          //     menuName: "饰品单据管理",
          //     menuUrl: null,
          //     parentId: "000",
          //     showTF: false,
          //     childs: [
          //       {
          //         id: "501",
          //         menuName: "物流",
          //         menuUrl: null,
          //         parentId: "500",
          //         showTF: false,
          //         childs: [
          //           {
          //             id: "5011",
          //             menuName: "收工厂饰列表",
          //             menuUrl: "/index/deliLogis",
          //             parentId: "501",
          //             childs: [],
          //             auth: "logistics-receipt",
          //             showTF: false
          //           },
          //           {
          //             id: "5012",
          //             menuName: "入饰单列表",
          //             menuUrl: "/index/receInDep",
          //             parentId: "501",
          //             childs: [],
          //             auth: "logistics-receipt,logistics-allot,logistics-refund",
          //             showTF: false
          //           },
          //           {
          //             id: "5013",
          //             menuName: "调拨入库列表",
          //             menuUrl: "/index/allotInOrder",
          //             parentId: "501",
          //             childs: [],
          //             auth: "logistics-allot-receipt",
          //             showTF: false
          //           },
          //           {
          //             id: "5014",
          //             menuName: "调拨出库列表",
          //             menuUrl: "/index/allotOutDep",
          //             parentId: "501",
          //             childs: [],
          //             auth: "logistics-allot",
          //             showTF: false
          //           },
          //           {
          //             id: "5015",
          //             menuName: "出饰单列表",
          //             menuUrl: "/index/retuInDep",
          //             parentId: "501",
          //             childs: [],
          //             auth: "logistics-refund",
          //             showTF: false
          //           }
          //         ]
          //       },
          //       {
          //         id: "502",
          //         menuName: "金库",
          //         menuUrl: null,
          //         parentId: "500",
          //         showTF: false,
          //         childs: [
          //           {
          //             id: "5021",
          //             menuName: "收工厂饰",
          //             menuUrl: "/index/vaultCollectFactory",
          //             parentId: "502",
          //             childs: [],
          //             auth: "stock-receiv",
          //             showTF: false
          //           },
          //           {
          //             id: "5022",
          //             menuName: "收客户饰",
          //             menuUrl: "/index/returnOrderOpera",
          //             parentId: "502",
          //             childs: [],
          //             auth: "back-order",
          //             showTF: false
          //           },
          //           {
          //             id: "5023",
          //             menuName: "调拨入库列表",
          //             menuUrl: "/index/outsideWarehousing",
          //             parentId: "502",
          //             childs: [],
          //             auth: "edit-receiv-order",
          //             showTF: false
          //           },
          //           {
          //             id: "5025",
          //             menuName: "调拨入库复称",
          //             menuUrl: "/index/repetition",
          //             parentId: "502",
          //             childs: [],
          //             auth: "edit-receiv-order",
          //             showTF: false
          //           },
          //           {
          //             id: "50210",
          //             menuName: "调拨出库申请列表",
          //             menuUrl: "/index/allotOrderExchOpera",
          //             parentId: "502",
          //             childs: [],
          //             auth: "order-trand-out",
          //             showTF: false
          //           },
          //           {
          //             id: "5029",
          //             menuName: "调拨出库审核列表",
          //             menuUrl: "/index/allotOrderExch",
          //             parentId: "502",
          //             childs: [],
          //             auth: "order-trand-outopreate",
          //             showTF: false
          //           },
          //           {
          //             id: "5029",
          //             menuName: "调拨出库管理列表",
          //             menuUrl: "/index/verifyAllotOrderExch",
          //             parentId: "502",
          //             childs: [],
          //             auth: "order-trand-list",
          //             showTF: false
          //           },
          //           {
          //             id: "5024",
          //             menuName: "调拨出库制单列表",
          //             menuUrl: "/index/allocationVault",
          //             parentId: "502",
          //             childs: [],
          //             auth: "edit-receiv-order",
          //             showTF: false
          //           },
          //           {
          //             id: "5026",
          //             menuName: "出工厂饰申请列表",
          //             menuUrl: "/index/outFactoryDecoOpera",
          //             parentId: "502",
          //             childs: [],
          //             auth: "order-trand-factory",
          //             showTF: false
          //           },
          //           {
          //             id: "5026",
          //             menuName: "出工厂饰审核列表",
          //             menuUrl: "/index/outFactoryDeco",
          //             parentId: "502",
          //             childs: [],
          //             auth: "order-trand-facopreate",
          //             showTF: false
          //           },
          //           {
          //             id: "5026",
          //             menuName: "出工厂饰管理列表",
          //             menuUrl: "/index/verifyOutFactoryDeco",
          //             parentId: "502",
          //             childs: [],
          //             auth: "order-trand-faclist",
          //             showTF: false
          //           },
          //           {
          //             id: "5026",
          //             menuName: "出工厂饰制单列表",
          //             menuUrl: "/index/outboundOrder",
          //             parentId: "502",
          //             childs: [],
          //             auth: "out-store_audit",
          //             showTF: false
          //           },

          //           {
          //             id: "5026",
          //             menuName: "出客户饰列表",
          //             menuUrl: "/index/shipmentOrder",
          //             parentId: "502",
          //             childs: [],
          //             auth: "out-store_audit",
          //             showTF: false
          //           },
          //           {
          //             id: "5027",
          //             menuName: "入饰单列表",
          //             menuUrl: "/index/enterSummary",
          //             parentId: "502",
          //             childs: [],
          //             auth: "out-store_audit",
          //             showTF: false
          //           },
          //           {
          //             id: "5028",
          //             menuName: "出饰单列表",
          //             menuUrl: "/index/outSummary",
          //             parentId: "502",
          //             childs: [],
          //             auth: "out-store_audit",
          //             showTF: false
          //           },

          //           {
          //             id: "5029",
          //             menuName: "拣货验收列表",
          //             menuUrl: "/index/pickOrder",
          //             parentId: "502",
          //             childs: [],
          //             auth: "edit-pick-confirm",
          //             showTF: false
          //           }
          //         ]
          //       }
          //     ]
          //   },
          {
            id: "1100",
            menuName: "饰品管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "1101",
                menuName: "调拨出库",
                menuUrl: "/index/allotOutList",
                parentId: "1100",
                childs: [],
                auth:
                  "transfer-out-view,transfer-out-create,transfer-out-audit",
                showTF: false
              },
              {
                id: "1102",
                menuName: "调拨入库",
                menuUrl: "/index/allotInList",
                parentId: "1100",
                childs: [],
                auth: "transfer-in-view,transfer-in-receipt,transfer-in-audit",
                showTF: false
              },
              {
                id: "1104",
                menuName: "出库单",
                menuUrl: "/index/outOfStockRedoList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-view,stock-out-create,stock-out-audit",
                showTF: false
              },
              {
                id: "1105",
                menuName: "入库单",
                menuUrl: "/index/joinStoreList",
                parentId: "1100",
                childs: [],
                auth: "stock-in-view,stock-in-create,stock-in-audit",
                showTF: false
              },
              {
                id: "1103",
                menuName: "复称",
                menuUrl: "/index/allotRecheckList",
                parentId: "1100",
                childs: [],
                auth: "weight_twice",
                showTF: false
              },
              {
                id: "1106",
                menuName: "拣货验收",
                menuUrl: "/index/pickOrderList",
                parentId: "1100",
                childs: [],
                auth: "order_pick_check",
                showTF: false
              },
              {
                id: "1107",
                menuName: "盘点",
                menuUrl: "/index/inventoryList",
                parentId: "1100",
                childs: [],
                auth: "check-stock",
                showTF: false
              },
              {
                id: "1108",
                menuName: "出客户饰",
                menuUrl: "/index/customerDecorationList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-client",
                showTF: false
              },
              {
                id: "1109",
                menuName: "出工厂饰",
                menuUrl: "/index/factoryDecorationList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-factory",
                showTF: false
              },
              {
                id: "1110",
                menuName: "出内部饰",
                menuUrl: "/index/outInnerOrnamentsList",
                parentId: "1100",
                childs: [],
                auth: "transfer-out-shipment",
                showTF: false
              },
              {
                id: "1115",
                menuName: "出饰转料",
                menuUrl: "/index/outO2mList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-factory",
                showTF: true
              },
              {
                id: "1111",
                menuName: "差异单",
                menuUrl: "/index/differenceBill",
                parentId: "1100",
                childs: [],
                auth: "differ-order",
                showTF: false
              },
              {
                id: "1112",
                menuName: "称差单",
                menuUrl: "/index/weighingDifferenceList",
                parentId: "1100",
                childs: [],
                auth: "weigerror-order",
                showTF: false
              },
              {
                id: "1113",
                menuName: "出客户饰(结算)",
                menuUrl: "/index/customerSettlementList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-client",
                showTF: false
              },
              {
                id: "1114",
                menuName: "出工厂饰(结算)",
                menuUrl: "/index/factorySettlementList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-factory",
                showTF: false
              },
              {
                id: "1116",
                menuName: "料转饰(接收)",
                menuUrl: "/index/m2OList",
                parentId: "1100",
                childs: [],
                auth: "stock-out-factory",
                showTF: true
              }
              // {
              //   id: "1115",
              //   menuName: "出饰转料",
              //   menuUrl: "/index/outO2mList",
              //   parentId: "1100",
              //   childs: [],
              //   auth: "stock-out-factory",
              //   showTF: false
              // },
              // {
              //   id: "1116",
              //   menuName: "料转饰(接收)",
              //   menuUrl: "/index/m2OList",
              //   parentId: "1100",
              //   childs: [],
              //   auth: "stock-out-factory",
              //   showTF: false
              // },
              // {
              //   id: "1117",
              //   menuName: "饰转料(发起)",
              //   menuUrl: "/index/o2MList",
              //   parentId: "1100",
              //   childs: [],
              //   auth: "stock-out-factory",
              //   showTF: false
              // }
            ]
          },
          {
            id: "600",
            menuName: "财务管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "601",
                menuName: "金价发布",
                menuUrl: "/index/goldPriceView",
                parentId: "600",
                childs: [],
                auth:
                  "finance-view-goldprice,finance-save-goldprice,finance-sent-goldprice",
                showTF: false
              },
              {
                id: "602",
                menuName: "工费设置",
                menuUrl: null,
                parentId: "600",
                showTF: false,
                childs: [
                  {
                    id: "6021",
                    menuName: "基础工费",
                    menuUrl: "/index/basicLaborCost",
                    parentId: "602",
                    childs: [],
                    auth: "finance-save-wage",
                    showTF: false
                  },
                  {
                    id: "6022",
                    menuName: "平台附加费用维护",
                    menuUrl: "/Index/platformCost",
                    parentId: "602",
                    childs: [],
                    auth: "plat_update_view",
                    showTF: false
                  },
                  {
                    id: "6023",
                    menuName: "特价饰品优惠",
                    menuUrl: "/index/specialOffer",
                    parentId: "602",
                    childs: [],
                    auth: "customer-discount",
                    showTF: false
                  }
                ]
              },
              {
                id: "603",
                menuName: "通讯录管理",
                menuUrl: "/index/addressBookManag",
                parentId: "600",
                childs: [],
                auth: "stock-message-manage",
                showTF: false
              },
              {
                id: "604",
                menuName: "认款",
                menuUrl: "/Index/recognition",
                parentId: "600",
                childs: [],
                auth: "come-account-realize",
                showTF: false
              },
              {
                id: "605",
                menuName: "出纳",
                menuUrl: null,
                parentId: "600",
                showTF: false,
                childs: [
                  {
                    id: "6051",
                    menuName: "来款登记",
                    menuUrl: "/Index/moneyRegister",
                    parentId: "605",
                    childs: [],
                    auth:
                      "come-account-view,come-account-add,come-account-audit",
                    showTF: false
                  },
                  {
                    id: "6052",
                    menuName: "退款登记",
                    menuUrl: "/Index/refundRegister",
                    parentId: "605",
                    childs: [],
                    auth: "return-account-view,return-account-update",
                    showTF: false
                  },
                  {
                    id: "6053",
                    menuName: "调整款",
                    menuUrl: "/Index/adjustMoney",
                    parentId: "605",
                    childs: [],
                    auth: "adjust-update_c",
                    showTF: false
                  }
                ]
              },
              {
                id: "606",
                menuName: "财务审核",
                menuUrl: null,
                parentId: "600",
                showTF: false,
                childs: [
                  {
                    id: "6061",
                    menuName: "料入库",
                    menuUrl: "/Index/financeStoreroom",
                    parentId: "606",
                    childs: [],
                    auth: "finan-stock-input",
                    showTF: false
                  },
                  {
                    id: "6062",
                    menuName: "料出库",
                    menuUrl: "/Index/financeOutTreasury",
                    parentId: "606",
                    childs: [],
                    auth: "finan-stock-output",
                    showTF: false
                  },
                  {
                    id: "6063",
                    menuName: "料调拨",
                    menuUrl: "/Index/financeGoldAllocation",
                    parentId: "606",
                    childs: [],
                    auth: "finan-stock-allot",
                    showTF: false
                  },
                  {
                    id: "6064",
                    menuName: "饰入库",
                    menuUrl: "/Index/jewelryInStore",
                    parentId: "606",
                    childs: [],
                    // auth: "finan-stock-allot",
                    auth: "finan-biz-audit",
                    showTF: false
                  },
                  {
                    id: "6065",
                    menuName: "饰出库",
                    menuUrl: "/Index/jewelryOutStore",
                    parentId: "606",
                    childs: [],
                    // auth: "finan-stock-allot",
                    auth: "finan-biz-audit",
                    showTF: false
                  },
                  {
                    id: "6066",
                    menuName: "客户结价",
                    menuUrl: "/Index/financeCustomerPrice",
                    parentId: "606",
                    childs: [],
                    auth: "audit-knot-pricec",
                    showTF: false
                  },
                  {
                    id: "6067",
                    menuName: "客户调整款",
                    menuUrl: "/Index/financeAdjustMoney",
                    parentId: "606",
                    childs: [],
                    auth: "audit-adjust_c",
                    showTF: false
                  }
                ]
              },
              {
                id: "607",
                menuName: "存欠列表",
                menuUrl: "/Index/depositOweList",
                parentId: "600",
                childs: [],
                auth: "save-owe-view",
                showTF: false
              },
              {
                id: "608",
                menuName: "往来汇总",
                menuUrl: "/Index/dealingsSummary",
                parentId: "600",
                childs: [],
                auth: "deal-report-view",
                showTF: false
              },
              {
                id: "609",
                menuName: "料往来",
                menuUrl: "/Index/financeMaterialExchange",
                parentId: "600",
                childs: [],
                auth: "deal-report-view",
                showTF: false
              },
              {
                id: "610",
                menuName: "款往来",
                menuUrl: "/Index/financeExchangeFunds",
                parentId: "600",
                childs: [],
                auth: "deal-report-view",
                showTF: false
              },
              {
                id: "611",
                menuName: "客户结价",
                menuUrl: "/Index/customerPrice",
                parentId: "600",
                childs: [],
                auth: "kont-price-update",
                showTF: false
              },
              {
                id: "612",
                menuName: "设置",
                menuUrl: null,
                parentId: "600",
                showTF: false,
                childs: [
                  {
                    id: "6121",
                    menuName: "银行账号设置",
                    menuUrl: "/Index/bankAccountSet",
                    parentId: "612",
                    childs: [],
                    auth: "company-view-bankaccount,company-edit-bankaccount",
                    showTF: false
                  },
                  {
                    id: "6122",
                    menuName: "结价种类设置",
                    menuUrl: "/Index/pricingTypeSet",
                    parentId: "612",
                    childs: [],
                    auth: "kont-price-type",
                    showTF: false
                  },
                  {
                    id: "6123",
                    menuName: "开票设置",
                    menuUrl: "/Index/invoiceSetting",
                    parentId: "612",
                    childs: [],
                    auth: "save-owe-type",
                    showTF: false
                  }
                ]
              },
              {
                id: "613",
                menuName: "开票登记",
                menuUrl: "/Index/InvoiceSummary",
                parentId: "600",
                childs: [],
                auth: "invoice-manage",
                showTF: false
              }
            ]
          },
          {
            id: "700",
            menuName: "原料管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "702",
                menuName: "金库收料部",
                menuUrl: null,
                parentId: "700",
                showTF: false,
                childs: [
                  {
                    id: "7020",
                    menuName: "测金",
                    menuUrl: "/index/checkGold",
                    parentId: "702",
                    childs: [],
                    auth: "stock-check-view,stock-check-submit",
                    showTF: false
                  },
                  {
                    id: "7021",
                    menuName: "收料",
                    menuUrl: "/index/recharge",
                    parentId: "702",
                    childs: [],
                    auth:
                      "stock-input-view,stock-input-add,stock-input-operation",
                    showTF: false
                  },
                  {
                    id: "7022",
                    menuName: "发料",
                    menuUrl: "/index/SendMaterial",
                    parentId: "702",
                    childs: [],
                    auth: "stock-output-view,stock-output-add",
                    showTF: false
                  },
                  {
                    id: "7023",
                    menuName: "料调拨",
                    menuUrl: "/index/goldAllocation",
                    parentId: "702",
                    childs: [],
                    auth: "stock-allot-view",
                    showTF: false
                  },
                  {
                    id: "7024",
                    menuName: "调拨入库",
                    menuUrl: "/index/allocationWarehousing",
                    parentId: "702",
                    childs: [],
                    auth:
                      "stock-allotinput-view,stock-depart-allotinput-audit,stock-depart-input-operation",
                    showTF: false
                  },
                  {
                    id: "7025",
                    menuName: "料库存转换",
                    menuUrl: "/index/inventoryConversionList",
                    parentId: "702",
                    childs: [],
                    auth: "stock-NowStore-manage",
                    showTF: false
                  },
                  {
                    id: "7026",
                    menuName: "料转饰(发起)",
                    menuUrl: "/index/material2OrnamentsList",
                    parentId: "702",
                    childs: [],
                    auth: "stock-NowStore-manage",
                    showTF: false
                  },
                  {
                    id: "7027",
                    menuName: "饰转料(接收)",
                    menuUrl: "/index/ornaments2MaterialList",
                    parentId: "702",
                    childs: [],
                    auth: "stock-NowStore-manage",
                    showTF: false
                  }
                ]
              },
              {
                id: "703",
                menuName: "物流",
                menuUrl: null,
                parentId: "700",
                showTF: false,
                childs: [
                  {
                    id: "7031",
                    menuName: "发料",
                    menuUrl: "/index/logisticSendMaterial",
                    parentId: "703",
                    childs: [],
                    auth:
                      "stock-logistics-output-view,stock-logistics-output-add",
                    showTF: false
                  },
                  {
                    id: "7032",
                    menuName: "调拨",
                    menuUrl: "/index/logisticGoldAllocation",
                    parentId: "703",
                    childs: [],
                    auth:
                      "stock-logistics-allot-view,stock-logistics-allot-add",
                    showTF: false
                  },
                  {
                    id: "7033",
                    menuName: "调拨入库",
                    menuUrl: "/index/logisticsAllocationWarehousing",
                    parentId: "703",
                    childs: [],
                    auth:
                      "stock-logistics-allot-approve,stock-logistics-allot-audit",
                    showTF: false
                  }
                ]
              },
              {
                id: "704",
                menuName: "设置",
                menuUrl: null,
                parentId: "700",
                showTF: false,
                childs: [
                  {
                    id: "7041",
                    menuName: "收旧工费",
                    menuUrl: "/Index/setLaborCost",
                    parentId: "704",
                    childs: [],
                    auth: "stock-add-stockwage",
                    showTF: false
                  },
                  {
                    id: "7042",
                    menuName: "料种类",
                    menuUrl: "/Index/setMaterialType",
                    parentId: "704",
                    childs: [],
                    auth: "stock-kind-view",
                    showTF: false
                  },
                  {
                    id: "7043",
                    menuName: "料类型",
                    menuUrl: "/Index/setMaterialClass",
                    parentId: "704",
                    childs: [],
                    auth: "stock-type-view",
                    showTF: false
                  },
                  {
                    id: "7044",
                    menuName: "柜台",
                    menuUrl: "/Index/setCounter",
                    parentId: "704",
                    childs: [],
                    auth: "stock-position-view,stock-position-add",
                    showTF: false
                  }
                ]
              },
              {
                id: "705",
                menuName: "报表(系统管理员)",
                menuUrl: null,
                parentId: "700",
                showTF: false,
                childs: [
                  {
                    id: "7051",
                    menuName: "料出入库",
                    menuUrl: "/index/outOfStorage",
                    parentId: "705",
                    childs: [],
                    auth: "stock-Intoutput-manage",
                    showTF: false
                  },
                  {
                    id: "7052",
                    menuName: "料实时库存",
                    menuUrl: "/index/realTimeStock",
                    parentId: "705",
                    childs: [],
                    auth: "stock-NowStore-manage",
                    showTF: false
                  }
                ]
              },
              {
                id: "706",
                menuName: "报表(金库收料部)",
                menuUrl: null,
                parentId: "700",
                showTF: false,
                childs: [
                  {
                    id: "7061",
                    menuName: "料出入库",
                    menuUrl: "/index/outOfStorageComeDepart",
                    parentId: "706",
                    childs: [],
                    auth: "stock-Intoutput-comedepart",
                    showTF: false
                  },
                  {
                    id: "7062",
                    menuName: "料实时库存",
                    menuUrl: "/index/realTimeStockComeDepart",
                    parentId: "706",
                    childs: [],
                    auth: "stock-NowStore-comedepart",
                    showTF: false
                  }
                ]
              },
              {
                id: "707",
                menuName: "报表(物流中心)",
                menuUrl: null,
                parentId: "700",
                showTF: false,
                childs: [
                  {
                    id: "7071",
                    menuName: "料出入库",
                    menuUrl: "/index/outOfStorageListLogistics",
                    parentId: "707",
                    childs: [],
                    auth: "stock-Intoutput-logistics",
                    showTF: false
                  },
                  {
                    id: "7072",
                    menuName: "料实时库存",
                    menuUrl: "/index/realTimeStockListLogistics",
                    parentId: "707",
                    childs: [],
                    auth: "stock-NowStore-logistics",
                    showTF: false
                  }
                ]
              }
            ]
          },
          {
            id: "800",
            menuName: "消息中心",
            menuUrl: null,
            parentId: "000",
            showTF: true,
            childs: [
              {
                id: "801",
                menuName: "系统消息",
                badge: "system",
                menuUrl: "/index/systemMessage",
                parentId: "800",
                childs: [],
                auth: "",
                showTF: true
              },
              {
                id: "802",
                menuName: "业务消息",
                badge: "business",
                menuUrl: "/index/businessMessage",
                parentId: "800",
                childs: [],
                auth: "",
                showTF: true
              }
            ]
          },
          {
            id: "900",
            menuName: "系统管理",
            menuUrl: null,
            parentId: "000",
            showTF: false,
            childs: [
              {
                id: "901",
                menuName: "权限管理",
                menuUrl: "/index/powerManage",
                parentId: "900",
                childs: [],
                auth: "sys-auth",
                showTF: false
              },
              {
                id: "902",
                menuName: "公司类型",
                menuUrl: "/index/companyType",
                parentId: "900",
                childs: [],
                auth: "sys-company-type",
                showTF: false
              },
              {
                id: "903",
                menuName: "日志查看",
                menuUrl: "/index/logView",
                parentId: "900",
                childs: [],
                auth: "sys-log",
                showTF: false
              },
              {
                id: "904",
                menuName: "系统资源",
                menuUrl: "/index/systemResource",
                parentId: "900",
                childs: [],
                auth: "sys-resource",
                showTF: false
              }
            ]
          },
          {
            id: "1000",
            menuName: "报表管理",
            menuUrl: null,
            parentId: "1000",
            showTF: false,
            childs: [
              {
                id: "1001",
                menuName: "委托加工汇总",
                menuUrl: "/index/entrustMachining",
                parentId: "1000",
                childs: [],
                auth: "statements-tofac-bill",
                showTF: false
              },
              {
                id: "1002",
                menuName: "未开票汇总",
                menuUrl: "/index/noInvoice",
                parentId: "1000",
                childs: [],
                auth: "invoice-manage",
                showTF: false
              },
              {
                id: "1003",
                menuName: "工费高开",
                menuUrl: "/index/costHigh",
                parentId: "1000",
                childs: [],
                auth: "report-exceed-cost",
                showTF: false
              },
              {
                id: "1004",
                menuName: "优惠低开",
                menuUrl: "/index/offerLow",
                parentId: "1000",
                childs: [],
                auth: "report-exceed-cost",
                showTF: false
              },
              {
                id: "1005",
                menuName: "往来对账单",
                menuUrl: "/index/dealingsAccount",
                parentId: "1000",
                childs: [],
                auth: "report-bill",
                showTF: false
              },
              {
                id: "1006",
                menuName: "客户饰品往来（明细）",
                menuUrl: "/index/customerExchange",
                parentId: "1000",
                childs: [],
                auth: "report-ac-jewelry",
                showTF: false
              },
              {
                id: "1007",
                menuName: "料试算平衡表",
                menuUrl: "/index/balanceTable",
                parentId: "1000",
                childs: [],
                auth: "save-owe-view",
                showTF: false
              },
              {
                id: "1008",
                menuName: "展销统计表",
                menuUrl: "/index/exhibitionStatisticsForm",
                parentId: "1000",
                childs: [],
                auth: "report-view",
                showTF: false
              },
              {
                id: "1009",
                menuName: "客户存饰表",
                menuUrl: "/index/customerDecorationForm",
                parentId: "1000",
                childs: [],
                auth: "report-ts-view",
                showTF: false
              },
              {
                id: "1010",
                menuName: "订单进度跟踪",
                menuUrl: "/index/orderProgressRecord",
                parentId: "1000",
                childs: [],
                auth: "order-trace",
                showTF: false
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    this.created_fun();
    localStorage.removeItem("stockAddData");
    localStorage.removeItem("standWeight");
  },
  methods: {
    created_fun() {
      let self = this;
      document.onkeydown = e => {
        let dom = self.$refs.userPassword;
        if (dom && (e.code == "Enter" || e.code == "NumpadEnter")) {
          self.loginFun();
        }
      };
    },
    loginFun() {
      var self = this;
      let params = {
        loginName: self.userName,
        password: self.userPassword
      };
      this.$api.formdataPostFun(
        this.$portMain + "/account/login",
        params,
        res => {
          localStorage.removeItem("pathData");
          localStorage.removeItem("threeMenu");
          localStorage.removeItem("threeMenuURL");
          localStorage.removeItem("standWeight");
          localStorage.removeItem("orderSourceCode");
          localStorage.removeItem("sjyUserId");
          localStorage.removeItem("sjyUserName");
          localStorage.removeItem("sarkData");

          //
          //
          if (res.code == 200) {
            localStorage.accessToken = res.data;
            self.$message({
              duration: 1500,
              showClose: true,
              message: "登录成功，正在跳转中！",
              type: "success"
            });
            self.$axios
              .get(self.$portMain + "/account/queryVerify")
              .then(function(resq) {
                if (resq.data.code == 200) {
                  let authList = resq.data.data ? resq.data.data : [];
                  let oldMenuData = self.menus.menu;
                  var newMenuData = [];
                  authList.forEach(ielem => {
                    if (ielem.hasAuth == "true") {
                      // console.log(ielem.auth)
                      oldMenuData.forEach(qelem => {
                        //一级菜单目录遍历
                        qelem.childs.forEach(kelem => {
                          //二级菜单目录遍历
                          if (!kelem.auth) {
                            kelem.childs.forEach(welem => {
                              //三级菜单目录遍历
                              for (
                                var i = 0;
                                i < welem.auth.split(",").length;
                                i++
                              ) {
                                if (welem.auth.split(",")[i] == ielem.auth) {
                                  welem.showTF = true;
                                  kelem.showTF = true;
                                  qelem.showTF = true;
                                }
                              }
                            });
                          } else {
                            for (
                              var i = 0;
                              i < kelem.auth.split(",").length;
                              i++
                            ) {
                              if (kelem.auth.split(",")[i] == ielem.auth) {
                                kelem.showTF = true;
                                qelem.showTF = true;
                              }
                            }
                          }
                        });
                      });
                    }
                  });

                  oldMenuData.forEach(kelem => {
                    if (kelem.showTF) {
                      newMenuData.push(kelem);
                      let newSubMenuList = [];
                      kelem.childs.forEach((qelem, ind) => {
                        //二級遍历
                        if (qelem.showTF) {
                          newSubMenuList.push(qelem);
                          if (qelem.childs.length != 0) {
                            let newThreeMenuList = [];
                            qelem.childs.forEach(pelem => {
                              if (pelem.showTF) {
                                newThreeMenuList.push(pelem);
                              }
                            });
                            qelem.childs = newThreeMenuList;
                          }
                        }
                      });
                      kelem.childs = newSubMenuList;
                    }
                  });
                  self.menus.menu = newMenuData;
                  if (newMenuData.length != 0) {
                    if (newMenuData[0].childs[0].childs.length == 0) {
                      self.$router.push(newMenuData[0].childs[0].menuUrl);
                    } else {
                      self.$router.push(
                        newMenuData[0].childs[0].childs[0].menuUrl
                      );
                    }
                  }
                } else {
                  self.$message.error(res.msg);
                }
              });
          } else {
            self.$message.error(res.msg);
          }
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  height: calc(100% - 138px);
  background-image: url('/static/images/loginImg/background.png');
  text-align: center;
  padding-top: 10%;


  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  #loginBig {
    background-color: #ffffff;
    width: 1020px;
    height: 460px;
    border-radius: 10px;
    margin: 0 auto;
    text-align: center;
    padding-top: 100px;

    .leftIco {
      margin-left: 100px;
    }

    .loginRight {
      text-align: left;
      padding: 0px 80px 20px 65px;

      .loginRightOne {
        margin-bottom: 15px;
      }

      .loginRightTwo {
        line-height: 60px;
      }

      .loginRightThree {
        padding-top: 104px;
      }

      .loginBtn {
        width: 100%;
      }
    }

    .divVersion {
      margin-top: 70px;
      color: #919599;
      font-size: 12px;
      padding-left: 16px;
      text-align: left;
    }
  }
}
</style>
