<template>
  <div class="index">
    <div class="headerWrapper">
      <div class="headerLeft">
        <span class="title">尚金缘内部业务管理系统</span>
        <el-menu
          :default-active="menuIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          style
        >
          <el-menu-item
            v-for="item in menus.menu"
            v-if="item.showTF"
            :index="item.id+''"
            :key="item.id+''"
          >
            <span>{{item.menuName}}</span>
            <!-- <span v-if="item.badge">
              <el-badge :value="readData" :max="10">
                <span>{{item.menuName}}</span>
              </el-badge>
            </span>-->
          </el-menu-item>
        </el-menu>
      </div>
      <div class="headerRight">
        <!-- 当前金价 -->
        <div style="margin-right: 22px;">
          <!-- <el-popover placement="top" width="180" v-model="codeViewTF">
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="codeViewTF = false">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
            <div v-if="codeImgUrl == ''">二维码暂未生成，请稍后再试！</div>
            <div v-else class="textCenter">
              <img :src="codeImgUrl" style="width:100%">
              <p>扫一扫绑定微信，方便您接收最新的订单！</p>
            </div>
            <i class="el-icon-share" slot="reference" @click="codeLoad"></i>
          </el-popover>-->
          <span v-if="showGold">
            <el-tooltip placement="top" v-for="(item, index) in currentGoldPrice" :key="index">
              <div slot="content">￥{{item.propValue}}</div>
              <span class="gold_999" @click="goldPriceView">{{item.propType}} |</span>
            </el-tooltip>
            <!-- <el-tooltip placement="top">
              <div slot="content">￥{{gold_999}}</div>
              <span class="gold_999" @click="goldPriceView()">黄金999 |</span>
            </el-tooltip>
            <el-tooltip placement="top">
              <div slot="content">￥{{gold_9999}}</div>
              <span class="gold_999" @click="goldPriceView()">黄金9999 |</span>
            </el-tooltip>
            <el-tooltip placement="top">
              <div slot="content">￥{{platinum_950}}</div>
              <span class="gold_999" @click="goldPriceView()">铂金950</span>
            </el-tooltip>-->
          </span>
        </div>
        <!-- 消息 -->
        <div class="newsWrap">
          <img src="../../../static/images/news.png" class="newsPic" @click="goNews" />
          <span class="spot" v-show="readData > 0"></span>
        </div>
        <!-- 当前金价  -->
        <span class="accoutName" @click="editUser">欢迎你，{{ accountData.concat }}</span>
        <i class="el-icon-menu" @click="loginOut"></i>
        <el-dialog
          title="个人资料"
          :visible.sync="editDialogTF"
          width="780px"
          :close-on-click-modal="false"
        >
          <div class="editUserDiv">
            <el-row>
              <el-col :span="4" class="editUserLeft">用户名称</el-col>
              <el-col :span="20" class="editUserRight">{{accountData.username}}</el-col>
              <el-col :span="4" class="editUserLeft">用户姓名</el-col>
              <el-col :span="20" class="editUserRight">{{accountData.concat}}</el-col>
              <el-col :span="4" class="editUserLeft">用户状态</el-col>
              <el-col :span="20" class="editUserRight">
                <span v-if="accountData.statu == 'E'">已启用</span>
                <span v-else-if="accountData.statu == 'D'">已禁用</span>
              </el-col>
              <el-col :span="4" class="editUserLeft">密码设置</el-col>
              <el-col :span="20" class="editUserRight">
                <span v-if="!editUserState">******</span>
                <span v-else>
                  <el-input
                    type="password"
                    v-model="accountData.oldPassword"
                    placeholder="请输入原始密码"
                    size="small"
                    class="userInp"
                  ></el-input>
                  <br />
                  <el-input
                    type="password"
                    v-model="accountData.password"
                    placeholder="请输入新密码"
                    size="small"
                    class="userInp"
                  ></el-input>
                  <el-input
                    type="password"
                    v-model="accountData.passwordTwo"
                    placeholder="再输入一遍新密码"
                    size="small"
                    class="userInp"
                  ></el-input>
                  <br />
                </span>
              </el-col>
              <el-col :span="4" class="editUserLeft">联系电话</el-col>
              <el-col :span="20" class="editUserRight">
                <span v-if="!editUserState">{{accountData.telephone}}</span>
                <span v-else>
                  <el-input
                    v-model="accountData.telephone"
                    placeholder="请输入联系电话"
                    size="small"
                    class="userInp"
                  ></el-input>
                </span>
              </el-col>
              <el-col :span="4" class="editUserLeft">邮箱地址</el-col>
              <el-col :span="20" class="editUserRight">
                <span v-if="!editUserState">{{accountData.mail}}</span>
                <span v-else>
                  <el-input
                    v-model="accountData.mail"
                    placeholder="请输入邮箱地址"
                    size="small"
                    class="userInp"
                  ></el-input>
                </span>
              </el-col>
              <el-col :span="4" class="editUserLeft">所属角色</el-col>
              <el-col :span="20" class="editUserRight">{{accountData.roleName}}</el-col>
              <el-col :span="4" class="editUserLeft">所属部门</el-col>
              <el-col :span="20" class="editUserRight">{{accountData.deptName}}</el-col>
            </el-row>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editUserFun" size="small" v-if="!editUserState">修 改</el-button>
            <el-button @click="editDialogTF = false" size="small" v-if="editUserState">取 消</el-button>
            <el-button type="primary" @click="saveUser" size="small" v-if="editUserState">保 存</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <div class="buttomWrapper">
      <div class="leftWrapper">
        <el-row class="menu">
          <el-col style="margin-top: 13px;">
            <el-menu :router="true" @select="subMenuSelect" :default-active="defaultIndex">
              <!-- <div v-for="item in subMenuData" :key="item.menuUrl+''" > -->
              <div v-for="item in subMenuData" :key="item.menuName">
                <span v-if="item.menuUrl == null">
                  <!-- <el-submenu :index="item.menuUrl+''"> -->
                  <el-submenu :index="item.id+''">
                    <template slot="title">
                      <!-- <i class="el-icon-caret-right"></i> -->
                      <span :style="{'paddingLeft':'14px'}">{{item.menuName}}</span>
                    </template>
                    <span v-for="(itemSub,index) in item.childs" :key="index">
                      <el-menu-item :index="itemSub.menuUrl+''" :style="{'paddingLeft':'35px'}">
                        <div>- {{itemSub.menuName}}</div>
                      </el-menu-item>
                    </span>
                  </el-submenu>
                </span>
                <el-menu-item :index="item.menuUrl+''" v-else :style="{'paddingLeft':'35px'}">
                  <!-- <i class="el-icon-arrow-right"></i> -->
                  <span slot="title" v-if="!item.badge">{{item.menuName}}</span>
                  <span slot="title" v-if="item.badge == 'system'">
                    <el-badge :value="systemReadData" :max="99">
                      <span>{{item.menuName}}</span>
                    </el-badge>
                  </span>
                  <span slot="title" v-if="item.badge == 'business'">
                    <el-badge :value="businessReadData" :max="99">
                      <span>{{item.menuName}}</span>
                    </el-badge>
                  </span>
                </el-menu-item>
              </div>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="rightWrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      showGold: false, //金价显示
      menuData: {}, //目录保录浏览器缓存
      menuIndex: "4",
      activeIndex: "",
      tempData: "暂无",
      defaultIndex: "", //二级目录下默认打开第一个子目录
      codeViewTF: false, //微信扫码二维码弹出层，默认是隐藏
      codeImgUrl: "",
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
              // {
              //   id: "1115",
              //   menuName: "出饰转料",
              //   menuUrl: "/index/outO2mList",
              //   parentId: "1100",
              //   childs: [],
              //   auth: "stock-out-factory",
              //   showTF: true
              // },
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
              }
              //   {
              //     id: "1116",
              //     menuName: "料转饰(接收1)",
              //     menuUrl: "/index/m2OList",
              //     parentId: "1100",
              //     childs: [],
              //     auth: "stock-out-factory",
              //     showTF: true
              //   },
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
                  }
                  //   {
                  //     id: "7026",
                  //     menuName: "料转饰(发起1)",
                  //     menuUrl: "/index/material2OrnamentsList",
                  //     parentId: "702",
                  //     childs: [],
                  //     auth: "stock-NowStore-manage",
                  //     showTF: false
                  //   },
                  //   {
                  //     id: "7027",
                  //     menuName: "饰转料(接收1)",
                  //     menuUrl: "/index/ornaments2MaterialList",
                  //     parentId: "702",
                  //     childs: [],
                  //     auth: "stock-NowStore-manage",
                  //     showTF: false
                  //   }
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
      },

      subMenuData: [], //左边菜单数据
      accountIcon: null,
      accountName: "系统用户",
      accountData: {}, //当前用户
      editDialogTF: false, //编辑用户弹出框属性
      editUserState: false, //编辑用户状态（false为查看状态，true为编辑状态）
      // gold_999: "", // 黄金999
      // gold_9999: "", //黄金9999
      // platinum_950: "", // 铂金950
      currentGoldPrice: [], //当前金价
      readData: "", // 总共未读消息数量
      systemReadData: "", // 系统总共未读消息数量
      businessReadData: "" // 业务总共未读消息数量
    };
  },
  methods: {
    ...mapMutations(["updataQueryVerify"]),
    statr() {
      // 初始调用
      let self = this;
      this.$axios.get(this.$portMain + "/msg/unreadCount").then(function(res) {
        if (res.data.code == 200) {
          self.readData = Number(res.data.data);
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    systemUnreadCount() {
      // 系统获取未读消息呢
      let self = this;
      let params = {
        PRS: {
          msgType: "NOTIFICATION"
        }
      };

      this.$axios
        .get(this.$portMain + "/msg/unreadCount", params)
        .then(function(res) {
          if (res.data.code == 200) {
            Number(res.data.data) == 0
              ? (self.systemReadData = "")
              : (self.systemReadData = Number(res.data.data));
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    businessUnreadCount() {
      // 业务获取未读消息呢
      let self = this;
      let params = {
        PRS: {
          msgType: "REMIND"
        }
      };

      this.$axios
        .get(this.$portMain + "/msg/unreadCount", params)
        .then(function(res) {
          if (res.data.code == 200) {
            Number(res.data.data) == 0
              ? (self.businessReadData = "")
              : (self.businessReadData = Number(res.data.data));
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    goldPriceView() {
      let res = true;
      res = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "finance-view-goldprice"
      );
      if (res) {
          this.$router.push("goldPriceView");
      }
    },
    getGoldPrice() {
      // 获取黄金，铂金的价格
      var self = this;
      this.$axios
        .get(this.$portMain + "/stock/goldprice/order/goldprice")
        .then(function(res) {
          if (res.data.code == 200) {
            self.showGold = true;
            //
            //
            self.currentGoldPrice = res.data.data.goldPriceProps;
            // self.gold_999 = res.data.data.gold_999;
            // self.gold_9999 = res.data.data.gold_9999;
            // self.platinum_950 = res.data.data.platinum_950;
          } else {
            self.showGold = false;
            //self.$message.error(res.data.msg);
          }
        });
    },
    //获取用户基本信息
    getBaseInfo() {
      var self = this;
      self.$axios.get(this.$portMain + "/account/myinfo").then(function(res) {
        if (res.data.code == 200) {
          self.accountData = res.data.data;
          localStorage.sjyUserId = self.accountData.userId;
          localStorage.sjyUserName = self.accountData.username;
        } else {
          self.$message.error(res.data.msg);
        }
      });
      localStorage.getItem("accountName")
        ? (this.accountName = localStorage.getItem("accountName"))
        : (this.accountName = "暂无");
    },
    //修改当前用户按钮
    editUser() {
      var self = this;
      self.editUserState = false;
      self.editDialogTF = true;
    },
    //编辑用户信息
    editUserFun() {
      var self = this;
      this.$confirm("确认修改当前用户？", "提示", {
        type: "warning"
      })
        .then(() => {
          self.editUserState = true;
        })
        .catch(() => {});
    },
    //修改当前用户信息保存按钮
    saveUser() {
      var self = this;
      //密码校验
      if (self.accountData.password != undefined) {
        if (self.accountData.oldPassword == undefined) {
          self.accountData.oldPassword = "";
        }
        if (self.accountData.password != self.accountData.passwordTwo) {
          self.$message.error("两个新密码输入不相同，请重新输入！");
          return;
        }
        if (
          !self.$v.verifyPassword(self.accountData.password) ||
          !self.$v.verifyPassword(self.accountData.oldPassword)
        ) {
          self.$message.error(
            "密码长度为6-16位，大小写字母/数字，请重新输入！"
          );
          return;
        }
      }
      this.$api.formdataPostFun(
        this.$portMain + "/account/updateInfo",
        self.accountData,
        res => {
          self.$message.success("用户密码和信息修改成功，正在重新登录！");
          setTimeout(function() {
            self.$router.push("/login");
          }, 1000);
        },
        err => {
          self.$message.error(err.msg);
        }
      );

      // this.$axios
      //   .post(this.$portMain + "/account/updateInfo", self.accountData)
      //   .then(function(res) {
      //     if (res.data.code == 200) {
      //     } else {
      //       self.$message.error(res.data.msg);
      //     }
      //   })
      //   .catch(function(err) {
      //
      //   });
    },

    //退出登录
    loginOut() {
      var self = this;
      let params = {
        PRS: {
          accessToken: localStorage.accessToken
        }
      };
      this.$confirm("确认退出登录？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(this.$portMain + "/account/logout", params)
            .then(function(res) {
              if (res.data.code == 200) {
                localStorage.removeItem("pathData");
                localStorage.removeItem("threeMenu");
                localStorage.removeItem("threeMenuURL");
                localStorage.removeItem("standWeight");
                localStorage.removeItem("orderSourceCode");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("sjyUserId");
                localStorage.removeItem("sjyUserName");
                localStorage.removeItem("sarkData");
                localStorage.removeItem("stockAddData");
              } else {
                self.$message.error(res.data.msg);
              }
            })
            .catch(function(err) {
              //
            });
          self.$router.push("/login");
        })
        .catch(() => {});
    },
    //一级菜单选择
    handleSelect(key, keyPath) {
      var self = this;
      if (localStorage.pathData) {
        this.menuData = JSON.parse(localStorage.pathData);
        this.menuData.oneMenu = key;
      } else {
        this.menuData.oneMenu = key;
      }
      localStorage.pathData = JSON.stringify(this.menuData);
      this.menuIndex = key;
      for (var i = 0; i < this.menus.menu.length; i++) {
        if (parseInt(this.menus.menu[i].id) == parseInt(key)) {
          this.subMenuData = this.menus.menu[i].childs;
          // console.log(this.menus.menu[i])
          if (keyPath == "localStorage") {
            // console.log(localStorage.pathData)
            // console.log(localStorage.threeMenu)
            // console.log(localStorage.threeMenuURL)
            if (localStorage.threeMenu === "false") {
              this.subMenuData.forEach(twoMenuItem => {
                if (
                  JSON.parse(localStorage.pathData).twoMenu ==
                  twoMenuItem.menuUrl
                ) {
                  this.defaultIndex = twoMenuItem.menuUrl;
                  this.$router.push(twoMenuItem.menuUrl);
                }
              });
            } else {
              this.subMenuData.forEach(twoMenuItem => {
                // console.log(twoMenuItem)
                // console.log(JSON.parse(localStorage.pathData))
                // if (
                //   JSON.parse(localStorage.pathData).twoMenu == twoMenuItem.menuUrl
                // ) {
                //   console.log(twoMenuItem.menuUrl)
                //   // this.defaultIndex = twoMenuItem.menuUrl;
                //   // this.$router.push(twoMenuItem.menuUrl);
                // }
              });
            }
          } else {
            if (self.subMenuData[0].childs.length == 0) {
              this.defaultIndex = this.menus.menu[i].childs[0].menuUrl;
              localStorage.threeMenu = false;
              this.subMenuSelect(this.menus.menu[i].childs[0].menuUrl, "");
              this.$router.push(this.menus.menu[i].childs[0].menuUrl);
            } else {
              this.defaultIndex = this.menus.menu[
                i
              ].childs[0].childs[0].menuUrl;
              localStorage.threeMenu =
                self.menus.menu[i].childs[0].childs[0].menuUrl;
              localStorage.threeMenu = true;
              this.subMenuSelect(
                this.menus.menu[i].childs[0].childs[0].menuUrl,
                ""
              );
              this.$router.push(this.menus.menu[i].childs[0].childs[0].menuUrl);
            }
          }
        }
      }
    },
    //二级菜单选择
    subMenuSelect(key, keyPath) {
      // console.log(localStorage.threeMenu)
      // console.log(key)
      if (localStorage.threeMenu == "true") {
        localStorage.threeMenuURL = key;
      } else {
        localStorage.threeMenuURL = "";
      }
      this.menuData.twoMenu = key;
      localStorage.pathData = JSON.stringify(this.menuData);
    },
    //菜单数据读取
    getMenus() {
      var self = this;
      this.$axios
        .get(this.$portMain + "/account/queryVerify")
        .then(function(res) {
          sessionStorage.setItem("verify", JSON.stringify(res.data.data));
          if (res.data.code == 200) {
            let authList = res.data.data;
            self.updataQueryVerify(res.data.data);
            let oldMenuData = self.menus.menu;
            // console.log(JSON.stringify(oldMenuData))
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
                        for (var i = 0; i < welem.auth.split(",").length; i++) {
                          if (welem.auth.split(",")[i] == ielem.auth) {
                            welem.showTF = true;
                            kelem.showTF = true;
                            qelem.showTF = true;
                          }
                        }
                      });
                    } else {
                      for (var i = 0; i < kelem.auth.split(",").length; i++) {
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
            if (localStorage.pathData) {
              let pathData = JSON.parse(localStorage.pathData);
              self.handleSelect(pathData.oneMenu, "localStorage");
            } else {
              self.handleSelect(self.menus.menu[0].id + "", "");
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //微信二维码扫码
    codeLoad() {
      var self = this;
      this.$axios.get(this.$portMain + "/wx/getQrcode").then(function(res) {
        if (res.data.code == 200) {
          self.codeImgUrl = res.data.data;
        } else {
          self.$message.error(res.data.msg);
        }
      });
      self.codeViewTF = true;
    },
    //跳转到消息中心
    goNews() {
      this.$router.push("systemMessage");
      this.handleSelect("800", ["800"]);
    }
  },
  created() {
    let self = this;
    this.getMenus();
    this.getBaseInfo();
    this.getGoldPrice();
    this.statr();
    this.systemUnreadCount();
    this.businessUnreadCount();

    this.$root.eventHub.$on(
      "System_Message_State",
      (readData, systemReadData) => {
        self.readData = readData;
        self.systemReadData = systemReadData;
      }
    );
    this.$root.eventHub.$on(
      "Business_Message_State",
      (readData, businessReadData) => {
        self.readData = readData;
        self.businessReadData = businessReadData;
      }
    );
  },
  beforeRouteUpdate(to, from, next) {
    const { menu } = this.menus;
    for (let v of menu) {
      for (let one of v.childs) {
        if (one.menuUrl === to.path) {
          this.menuIndex = one.parentId;
          this.defaultIndex = one.menuUrl;
          break;
        }
        for (let two of one.childs) {
          if (two.menuUrl === to.path) {
            this.menuIndex = one.parentId;
            this.defaultIndex = two.menuUrl;
            this.subMenuData = v.childs;
            break;
          }
        }
      }
    }
    next();
  }
};
</script>
<style>
.el-badge__content.is-fixed {
  right: -46px !important;
  top: 30px !important;
  width: 12px;
  height: 16px;
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);

body {
  background-color: #f3f3f3;
}

.textCenter {
  text-align: center;
}

.index {
  overflow: hidden;

  .title {
    background-color: $base-color;
    color: #ffffff;
    height: 33px;
    width: 195px;
    text-align: center;
    padding-top: 17px;
    font-size: 14px;
  }

  .headerWrapper {
    background: #ffffff;
    margin-bottom: 15px;
    box-shadow: 0 1px 5px #EBEBEB;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headerLeft {
      color: $base-color;
      margin-left: 0px;
      display: flex;
      align-items: center;

      i.logoIcon:after {
        content: '\e61a';
        font-size: 1.5rem;
        margin-right: 5px;
      }
    }

    .headerRight {
      color: #2D2F33;
      margin-right: 25px;
      display: flex;
      align-items: center;
      font-size: 0.6rem;

      .noLoginIcon {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }

      i {
        cursor: pointer;
      }

      i.outLoginIcon:after {
        content: '\e654';
        transition: color 0.5s;
      }

      i.outLoginIcon {
        &:hover {
          color: $base-color;
        }
      }

      .accoutName {
        margin: 0 50px 0 5px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  .el-menu-demo {
    height: 50px;

    li {
      height: 50px;
      line-height: 49px;
    }
  }

  .buttomWrapper {
    display: flex;

    .leftWrapper {
      width: 200px;
      box-shadow: 1px 0 5px #EBEBEB;
      background: #ffffff;
      overflow: auto;
      overflow-x: hidden;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      border-top-right-radius: 8px;

      .iconfont {
        margin-right: 0.5rem;
      }
    }

    .rightWrapper {
      border-top-left-radius: 8px;
      padding: 15px 15px 0 15px;
      flex: 1;
      box-shadow: -1px 0 5px #EBEBEB;
      background: #ffffff;
      overflow: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      position: absolute;
      top: 60px;
      left: 210px;
      right: 0;
      bottom: 0;
    }
  }

  .editUserDiv {
    line-height: 40px;

    .editUserLeft {
      color: #999999;
    }

    .editUserRight {
      color: #333333;

      .userInp {
        width: 200px;
        margin-right: 30px;
        float: left;
      }
    }
  }

  .gold_999, .gold_9999, .platinum_950 {
    color: #878d99;
  }

  .gold_999:hover {
    color: red;
  }

  .gold_9999:hover {
    color: red;
  }

  .platinum_950:hover {
    color: red;
  }
}

i.bt-proManagerIcon:after {
  content: '\e601';
}

i.bt-genManagerIcon:after {
  content: '\e650';
}

i.bt-genColumnIcon:after {
  content: '\e61c';
}

i.bt-homePageCmIcon:after {
  content: '\e608';
}

i.bt-sellManagerIcon:after {
  content: '\e604';
}

i.bt-custManagerIcon:after {
  content: '\e607';
}

i.bt-orderManagerIcon:after {
  content: '\e602';
}

i.bt-systemManagerIcon:after {
  content: '\e61b';
}

i.bt-dataStatisticsIcon:after {
  content: '\e603';
}

i.bt-userFeedBackIcon:after {
  content: '\e60d';
}

i.bt-userManagerIcon:after {
  content: '\e61d';
}

i.bt-companyManagerIcon:after {
  content: '\e606';
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.newsWrap {
  position: relative;

  .newsPic {
    width: 15px;
    height: 16px;
  }

  .spot {
    width: 6px;
    height: 6px;
    background: red;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    right: -4px;
  }
}
</style>
