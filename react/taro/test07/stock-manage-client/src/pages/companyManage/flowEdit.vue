<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>流程管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-tabs tab-position="left"
               v-model="selectedTabId"
               style="height: 100%;width:100%;">
        <el-tab-pane v-for="flowItem in flowArr"
                     :name="flowItem.processType"
                     :key="flowItem.processType">
          <span v-if="flowItem.show"
                slot="label">
            {{flowItem.processName}}
            <el-badge class="mark"
                      value="1" />
          </span>
          <span v-else
                slot="label">
            {{flowItem.processName}}
          </span>
          <el-card>
            <div slot="header"
                 class="clearfix">
              <span>编辑{{flowItem.processName}}流程详情</span>
            </div>
            <div>
              <flow-detail-edit></flow-detail-edit>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <!-- 
      <el-tabs v-model="selectedTabId"
               type="border-card">
        <el-tab-pane label="调拨入库流程"
                     name="one">
          <div>
            <div class="SubDiv">
              <div class="lineDiv">
                流程名称
                <br>
                <el-input v-model="orderLineData.processName"
                          placeholder="请输入流程名称"
                          size="small"
                          class="input500"></el-input>
                <span class="red_font">*</span>
              </div>
              <div class="lineDiv">
                备注
                <br>
                <el-input v-model="orderLineData.processRemer"
                          placeholder="请输入备注"
                          size="small"
                          class="input500"></el-input>
              </div>
              <div class="lineDiv backFont">
                <span v-if="orderLineDispTxt.length != 0">
                  <span v-for="(items,index) in orderLineDispTxt"
                        :key="index">
                    <span v-if="index == 0">
                      <el-button size="small"
                                 @click="editPoint('调拨入库',items)">{{items.processName}}</el-button>
                    </span>
                    <span v-else>
                      <el-button size="small"
                                 @click="editPoint('调拨入库',items)">{{items.processName}}</el-button>
                    </span>
                    <i class="el-icon-circle-close-outline red_font"
                       @click="delPoint('调拨入库',items)"></i>
                  </span>
                </span>
                <span v-else>暂无节点</span>
                <el-button size="small"
                           type="primary"
                           plain
                           @click="addPointTF('调拨入库')">增加节点</el-button>
              </div>
            </div>
          </div>
          <div class="orderLineBtn">
            <el-button size="small"
                       @click="cancelOrderLine">取消</el-button>
            <el-button type="primary"
                       size="small"
                       @click="saveOrderLine('调拨入库')">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="调拨出库流程"
                     name="two">
          <div>
            <div class="SubDiv">
              <div class="lineDiv">
                流程名称
                <br>
                <el-input v-model="orderAllotData.processName"
                          placeholder="请输入流程名称"
                          size="small"
                          class="input500"></el-input>
                <span class="red_font">*</span>
              </div>
              <div class="lineDiv">
                备注
                <br>
                <el-input v-model="orderAllotData.processRemer"
                          placeholder="请输入备注"
                          size="small"
                          class="input500"></el-input>
              </div>
              <div class="lineDiv backFont">
                <span v-if="orderAllotDispTxt.length != 0">
                  <span v-for="(items,index) in orderAllotDispTxt"
                        :key="index">
                    <span v-if="index == 0">
                      <el-button size="small"
                                 @click="editPoint('调拨出库流程',items)">{{items.processName}}</el-button>
                    </span>
                    <span v-else>
                      <el-button size="small"
                                 @click="editPoint('调拨出库流程',items)">{{items.processName}}</el-button>
                    </span>
                    <i class="el-icon-circle-close-outline red_font"
                       @click="delPoint('调拨出库流程',items)"></i>
                  </span>
                </span>
                <span v-else>暂无节点</span>
                <el-button size="small"
                           type="primary"
                           plain
                           @click="addPointTF('调拨出库流程')">增加节点</el-button>
              </div>
            </div>
          </div>
          <div class="orderLineBtn">
            <el-button size="small"
                       @click="cancelOrderLine">取消</el-button>
            <el-button type="primary"
                       size="small"
                       @click="saveOrderLine('调拨出库流程')">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="补货单流程"
                     name="three">
          <div>
            <div class="SubDiv">
              <div class="lineDiv">
                流程名称
                <br>
                <el-input v-model="orderRepleData.processName"
                          placeholder="请输入流程名称"
                          size="small"
                          class="input500"></el-input>
                <span class="red_font">*</span>
              </div>
              <div class="lineDiv">
                备注
                <br>
                <el-input v-model="orderRepleData.processRemer"
                          placeholder="请输入备注"
                          size="small"
                          class="input500"></el-input>
              </div>
              <div class="lineDiv backFont">
                <span v-if="orderRepleDispTxt.length != 0">
                  <span v-for="(items,index) in orderRepleDispTxt"
                        :key="index">
                    <span v-if="index == 0">
                      <el-button size="small"
                                 @click="editPoint('补货单流程',items)">{{items.processName}}</el-button>
                    </span>
                    <span v-else>
                      <el-button size="small"
                                 @click="editPoint('补货单流程',items)">{{items.processName}}</el-button>
                    </span>
                    <i class="el-icon-circle-close-outline red_font"
                       @click="delPoint('补货单流程',items)"></i>
                  </span>
                </span>
                <span v-else>暂无节点</span>
                <el-button size="small"
                           type="primary"
                           plain
                           @click="addPointTF('补货单流程')">增加节点</el-button>
              </div>
            </div>
          </div>
          <div class="orderLineBtn">
            <el-button size="small"
                       @click="cancelOrderLine">取消</el-button>
            <el-button type="primary"
                       size="small"
                       @click="saveOrderLine('补货单流程')">保存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs> -->

      <el-dialog :visible.sync="AddPointTF"
                 width="700px"
                 :close-on-click-modal="false">
        <div slot="title"
             class="redfont">添加新节点</div>
        <div>
          <el-row>
            <el-col :span="16">
              节点名称
              <el-input v-model="pointName"
                        placeholder="请设置节点名称"
                        size="small"
                        class="input150"></el-input>
              <span class="red_font">*</span>
              <el-input placeholder="请输入关键字搜索"
                        prefix-icon="el-icon-search"
                        v-model="pointSearchTxt"
                        size="small"
                        class="input150 left30"></el-input>
            </el-col>
            <el-col :span="8">
            </el-col>
          </el-row>
          <div style="max-height:570px;overflow-y: auto;">
            <div v-for="(items,index) in companyAllDataList"
                 :key="index">
              <el-checkbox-group v-model="checkedDepart">
                <el-checkbox :label="items.deptName"
                             :key="items.deptId"
                             @change="handleCheckAllChange(items.members,items.deptId)"
                             ref="deptId">{{items.deptName}}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="checkedCities">
                <el-row>
                  <el-col :span="6"
                          v-for="item in items.members"
                          :key="item.userId">
                    <el-checkbox :label="item.userId"
                                 class="width25"
                                 :disabled="item.editTF">
                      {{item.concat}}
                      <span v-if="item.editTF"></span>
                    </el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
              <div class="hr" />
            </div>
          </div>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="AddPointTF = false"
                     size="small">取 消</el-button>
          <el-button type="primary"
                     @click="addPointFun"
                     size="small">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :visible.sync="EditPointTF"
                 width="750px"
                 :close-on-click-modal="false">
        <div slot="title"
             class="redfont">编辑节点</div>
        <div>
          <el-row>
            <el-col :span="16">
              当前节点名称
              <el-input v-model="pointName"
                        placeholder="请设置当前节点名称"
                        size="small"
                        class="input150"></el-input>
              <span class="red_font">*</span>
              <el-input placeholder="请输入关键字搜索"
                        prefix-icon="el-icon-search"
                        v-model="pointSearchTxt"
                        size="small"
                        class="input150 left30"></el-input>
            </el-col>
            <el-col :span="8">
            </el-col>
          </el-row>
          <div style="max-height:570px;overflow-y: auto;">
            <div v-for="(items,index) in companyAllDataList"
                 :key="index">
              <el-checkbox-group v-model="checkedDepart">
                <el-checkbox :label="items.deptName"
                             :key="items.deptId"
                             @change="handleCheckAllChange(items.members,items.deptId)"
                             ref="deptId">{{items.deptName}}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="checkedCities">
                <el-row>
                  <el-col :span="6"
                          v-for="item in items.members"
                          :key="item.userId">
                    <el-checkbox :label="item.userId"
                                 class="width25"
                                 :disabled="item.editTF">
                      {{item.concat}}
                      <span v-if="item.editTF"></span>
                    </el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
              <div class="hr" />
            </div>
          </div>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="EditPointTF = false"
                     size="small">取 消</el-button>
          <el-button type="primary"
                     @click="editPointFun"
                     size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import flowDetailEdit from '@/components/flow-detail-edit.vue'
export default {
  components: {
    'flow-detail-edit': flowDetailEdit
  },
  data () {
    return {
      flowArr: [
        {
          processName: '收工厂饰',
          processType: 'RECEIVE_FACTORY',
        },
        {
          processName: '收工厂饰红冲',
          processType: 'RECEIVE_FACTORY_HC',
        },
        {
          processName: '收客户饰',
          processType: 'RECEIVE_CLIENT',
        },
        {
          processName: '收客户饰红冲',
          processType: 'RECEIVE_CLIENT_HC',
        },
        {
          processName: '出工厂饰',
          processType: 'SEND_FACTORY',
        },
        {
          processName: '出客户饰',
          processType: 'SEND_CLIENT',
        },
        {
          processName: '出客户饰结算单',
          processType: 'SEND_FACTORY_STAT',
        },
        {
          processName: '出客户饰结算红冲单',
          processType: 'SEND_FACTORY_STAT_HC',
        },
        {
          processName: '出工厂饰结算单',
          processType: 'SEND_CLIENT_STAT',
        },
        {
          processName: '出工厂饰结算红冲单',
          processType: 'SEND_CLIENT_STAT_HC',
        },
        {
          processName: '调拨入库',
          processType: 'TRANSFER_IN',
        },
        {
          processName: '调拨出库',
          processType: 'TRANSFER_OUT',
        },
        {
          processName: '复称',
          processType: 'WEIGHT_TWICE',
        },
        {
          processName: '拣货',
          processType: 'ORDER_PICK',
        },
        {
          processName: '上柜',
          processType: 'PUT_CONTAINER',
        },
        {
          processName: '暂存',
          processType: 'TS',
        },
      ],
      input: "", //输入框
      flowAllData: [], //流程所有数据

      orderLineData: {}, //调拨入库流程数据
      orderLineNewData: [], //调拨入库新流程数据
      orderLineDispTxt: [], //调拨入库流程数据显示文字

      orderAllotData: {}, //调拨出库流程数据
      orderAllotNewData: [], //调拨出库新流程数据
      orderAllotDispTxt: [], //调拨出库流程数据显示文字

      orderRepleData: {}, //补货单流程数据
      orderRepleNewData: [], //补货单新流程数据
      orderRepleDispTxt: [], //补货单流程数据显示文字

      orderReturnData: {}, //退货流程数据
      orderReturnNewData: [], //退货新流程数据
      orderReturnDispTxt: [], //退货流程数据显示文字

      AddPointTF: false, //新增节点弹出框
      EditPointTF: false, //新增节点弹出框
      radio: "角色", //新增节点弹出框，默认为角色
      typeNum: "", //新增节点类型
      selectID: "", //新增节点类型选择角色、部门、个人ID
      selectList: [], //新增节点类型选择角色、部门、个人列表
      positionTF: false, //是否有审批额度权限
      pointName: "", //节点名称
      pointSearchTxt: "", //关键字搜索
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      // companyData: {}, //公司ID
      userData: {}, //用户ID
      companyAllDataList: [], //公司的组织机构树
      checkedDepart: [], //公司选择数组
      selectedTabId: "", //选中选项卡的id
      selectedPointName: { name: "", pointId: "" } //选中节点类型名称
    };
  },
  created () {
    this.selectedTabId = this.$route.query.tabId;
    this.created_fun();
  },
  methods: {
    created_fun () {
      var self = this;

      this.$axios
        .post(this.$portMain + "/process/findProcess", {})
        .then(function (res) {
          if (res.data.code == 200) {
            self.flowAllData = res.data.data;
            for (var i = 0; i < self.flowAllData.length; i++) {
              switch (self.flowAllData[i].processType) {
                case 6: //调拨入库流程
                  self.orderLineData = self.flowAllData[i];
                  break;
                case 7: //调拨出库流程
                  self.orderAllotData = self.flowAllData[i];
                  break;
                case 5: //补货流程
                  self.orderRepleData = self.flowAllData[i];
                  break;
                case 9: //退货流程
                  self.orderReturnData = self.flowAllData[i];
                  break;
              }
            }

            //调拨入库展示字段
            if (
              JSON.stringify(self.orderLineData) != "{}" &&
              self.orderLineData.processTypes.length != 0
            ) {
              self.orderLineDispTxt = [];
              for (var i = 0; i < self.orderLineData.processTypes.length; i++) {
                self.orderLineDispTxt.push(self.orderLineData.processTypes[i]);
              }
            }

            //调拨出库流程字段
            if (
              JSON.stringify(self.orderAllotData) != "{}" &&
              self.orderAllotData.processTypes.length != 0
            ) {
              self.orderAllotDispTxt = [];
              for (
                var i = 0;
                i < self.orderAllotData.processTypes.length;
                i++
              ) {
                self.orderAllotDispTxt.push(
                  self.orderAllotData.processTypes[i]
                );
              }
            }
            //补货单流程字段
            if (
              JSON.stringify(self.orderRepleData) != "{}" &&
              self.orderRepleData.processTypes.length != 0
            ) {
              self.orderRepleDispTxt = [];
              for (
                var i = 0;
                i < self.orderRepleData.processTypes.length;
                i++
              ) {
                self.orderRepleDispTxt.push(
                  self.orderRepleData.processTypes[i]
                );
              }
            }
            //退货流程字段
            if (
              JSON.stringify(self.orderReturnData) != "{}" &&
              self.orderReturnData.processTypes.length != 0
            ) {
              self.orderReturnDispTxt = [];
              for (
                var i = 0;
                i < self.orderReturnData.processTypes.length;
                i++
              ) {
                self.orderReturnDispTxt.push(
                  self.orderReturnData.processTypes[i]
                );
              }
            }
          } else {
            self.orderLineData.processName = "";
            self.orderLineData.processRemer = "";
            self.orderAllotData.processName = "";
            self.orderAllotData.processRemer = "";
            self.orderRepleData.processName = "";
            self.orderRepleData.processName = "";
            self.orderLineDispTxt = [];
            self.orderAllotDispTxt = [];
            self.orderRepleDispTxt = [];
            self.$message.error(res.data.msg);
          }
        });
      //公司id获取
      // this.$axios
      //   .get(this.$portMain + "/company/simpleinfo")
      //   .then(function(res) {
      //     if (res.data.code == 200) {
      //       self.companyData = res.data.data;
      //     } else {
      //       self.$message.error(res.data.msg);
      //     }
      //   });
      //用户ID获取
      self.$axios.get(this.$portMain + "/account/myinfo").then(function (res) {
        if (res.data.code == 200) {
          self.userData = res.data.data;
        }
      });
    },
    //点击添加节点按钮弹出选择框
    addPointTF (elem) {
      var self = this;
      self.typeNum = elem;
      self.pointName = "";
      self.radio = "角色";
      self.selectID = "";
      self.checkedCities = [];
      this.$axios.get(this.$portMain + "/company/members").then(function (res) {
        if (res.data.code == 200) {
          let editList = [];
          self.companyAllDataList = res.data.data;
          let disabledList = [];
          switch (elem) {
            case "调拨入库":
              self.orderLineData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
            case "调拨出库流程":
              self.orderAllotData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
            case "补货单流程":
              self.orderRepleData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
            case "退货流程":
              self.orderReturnData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
          }
          self.companyAllDataList.forEach(ielem => {
            ielem.members.forEach(jelem => {
              let editTF = false;
              disabledList.forEach(welem => {
                if (parseInt(welem) === jelem.userId) {
                  editTF = true;
                }
              });
              jelem.editTF = editTF;
            });
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
      self.AddPointTF = true;
    },
    //添加节点确认按钮
    addPointFun () {
      var self = this;
      if (!self.$v.valiNull(self.pointName.trim())) {
        self.$message.error("节点名称为必填，请重新输入提交！");
        return;
      }
      if (self.checkedCities.length == 0) {
        self.$message.error("员工未选择，请重新选择提交！");
        return;
      }
      if (self.typeNum == "调拨入库") {
        let orderLineSubData = self.orderLineData.processTypes
          ? self.orderLineData.processTypes
          : [];
        let newPointData = {};
        newPointData.processName = self.pointName.trim(); //新节点名称
        newPointData.operareId = self.checkedCities.join(",");
        //新节点是否需要审核额度
        if (self.positionTF) {
          newPointData.processRank = 1;
        } else {
          newPointData.processRank = 0;
        }
        orderLineSubData.push(newPointData);
        for (var i = 0; i < orderLineSubData.length; i++) {
          orderLineSubData[i].processStep = i + 1;
        }
        self.orderLineData.processTypes = orderLineSubData;
        self.orderLineDispTxt = [];
        for (var i = 0; i < self.orderLineData.processTypes.length; i++) {
          self.orderLineDispTxt.push(self.orderLineData.processTypes[i]);
        }
        self.AddPointTF = false;
      } else if (self.typeNum == "调拨出库流程") {
        if (self.orderAllotData.processTypes == undefined) {
          self.orderAllotData.processTypes = [];
        }
        let orderAllotSubData = self.orderAllotData.processTypes
          ? self.orderAllotData.processTypes
          : [];
        let newPointData = {};
        newPointData.processName = self.pointName.trim(); //新节点名称
        newPointData.operareId = self.checkedCities.join(",");
        //新节点是否需要审核额度
        if (self.positionTF) {
          newPointData.processRank = 1;
        } else {
          newPointData.processRank = 0;
        }
        orderAllotSubData.push(newPointData);
        for (var i = 0; i < orderAllotSubData.length; i++) {
          orderAllotSubData[i].processStep = i + 1;
        }
        self.orderAllotData.processTypes = orderAllotSubData;
        self.orderAllotDispTxt = [];
        for (var i = 0; i < self.orderAllotData.processTypes.length; i++) {
          self.orderAllotDispTxt.push(self.orderAllotData.processTypes[i]);
        }
        self.AddPointTF = false;
      } else if (self.typeNum == "补货单流程") {
        if (self.orderRepleData.processTypes == undefined) {
          self.orderRepleData.processTypes = [];
        }
        let orderRepleSubData = self.orderRepleData.processTypes
          ? self.orderRepleData.processTypes
          : [];
        let newPointData = {};
        newPointData.processName = self.pointName.trim(); //新节点名称
        newPointData.operareId = self.checkedCities.join(",");
        //新节点是否需要审核额度
        if (self.positionTF) {
          newPointData.processRank = 1;
        } else {
          newPointData.processRank = 0;
        }
        orderRepleSubData.push(newPointData);
        for (var i = 0; i < orderRepleSubData.length; i++) {
          orderRepleSubData[i].processStep = i + 1;
        }
        self.orderRepleData.processTypes = orderRepleSubData;
        self.orderRepleDispTxt = [];
        for (var i = 0; i < self.orderRepleData.processTypes.length; i++) {
          self.orderRepleDispTxt.push(self.orderRepleData.processTypes[i]);
        }
        self.AddPointTF = false;
      } else if (self.typeNum == "退货流程") {
        if (self.orderReturnData.processTypes == undefined) {
          self.orderReturnData.processTypes = [];
        }
        let orderReturnSubData = self.orderReturnData.processTypes
          ? self.orderReturnData.processTypes
          : [];
        let newPointData = {};
        newPointData.processName = self.pointName.trim(); //新节点名称
        newPointData.operareId = self.checkedCities.join(",");
        //新节点是否需要审核额度
        if (self.positionTF) {
          newPointData.processRank = 1;
        } else {
          newPointData.processRank = 0;
        }
        orderReturnSubData.push(newPointData);
        for (var i = 0; i < orderReturnSubData.length; i++) {
          orderReturnSubData[i].processStep = i + 1;
        }
        self.orderReturnData.processTypes = orderReturnSubData;
        self.orderReturnDispTxt = [];
        for (var i = 0; i < self.orderReturnData.processTypes.length; i++) {
          self.orderReturnDispTxt.push(self.orderReturnData.processTypes[i]);
        }
        self.AddPointTF = false;
      }
    },
    //编辑弹窗
    editPoint (elem, item) {
      var self = this;
      self.selectedPointName = { name: elem, pointId: item.id };
      this.$axios.get(this.$portMain + "/company/members").then(function (res) {
        if (res.data.code == 200) {
          self.companyAllDataList = res.data.data;
          let disabledList = [];
          switch (elem) {
            case "调拨入库":
              self.orderLineData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
            case "调拨出库流程":
              self.orderAllotData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
            case "补货单流程":
              self.orderRepleData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
            case "退货流程":
              self.orderReturnData.processTypes.forEach(ielem => {
                disabledList = disabledList.concat(ielem.operareId.split(","));
              });
              break;
          }

          if (disabledList.length > 0) {
            let newList = [];
            disabledList.forEach(jelem => {
              let listTF = true;
              if (selectOperData.length > 0) {
                selectOperData.forEach(ielem => {
                  if (ielem == jelem) {
                    listTF = false;
                  }
                });
              }
              if (listTF) {
                newList.push(jelem);
              }
            });
            disabledList = newList;
          }

          self.companyAllDataList.forEach(ielem => {
            if (ielem.members.length > 0) {
              ielem.members.forEach(jelem => {
                disabledList.forEach(kelem => {
                  if (kelem == jelem.userId) {
                    jelem.editTF = true;
                  }
                });
              });
            }
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
      self.pointName = item.processName.trim();
      self.EditPointTF = true;
      let selectOperData = item.operareId.split(",");
      for (var i = 0; i < selectOperData.length; i++) {
        selectOperData[i] = parseInt(selectOperData[i]);
      }

      self.checkedCities = selectOperData;
    },
    editPointFun () {
      var self = this;
      if (!self.$v.valiNull(self.pointName.trim())) {
        self.$message.error("节点名称为必填，请重新输入提交！");
        return;
      }
      for (var i = 0; i < self.checkedCities.length; i++) {
        if (self.checkedCities[i] == NaN) {
          self.checkedCities.splice(i, 1);
        }
      }
      if (self.checkedCities.length == 0) {
        self.$message.error("员工未选择，请重新选择提交！");
        return;
      }
      switch (self.selectedPointName.name) {
        case "调拨入库": //调拨入库
          var tempData = self.orderLineData.processTypes;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].id == self.selectedPointName.pointId) {
              tempData[i].processName = self.pointName.trim();
              tempData[i].operareId = self.checkedCities.join(",");
            }
          }
          break;
        case "调拨出库流程": //调拨流程
          var tempData = self.orderAllotData.processTypes;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].id == self.selectedPointName.pointId) {
              tempData[i].processName = self.pointName.trim();
              tempData[i].operareId = self.checkedCities.join(",");
            }
          }
          break;
        case "补货单流程": //补货流程
          var tempData = self.orderRepleData.processTypes;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].id == self.selectedPointName.pointId) {
              tempData[i].processName = self.pointName.trim();
              tempData[i].operareId = self.checkedCities.join(",");
            }
          }
          break;
        case "退货流程": //退货流程
          var tempData = self.orderReturnData.processTypes;
          for (var i = 0; i < tempData.length; i++) {
            if (tempData[i].id == self.selectedPointName.pointId) {
              tempData[i].processName = self.pointName.trim();
              tempData[i].operareId = self.checkedCities.join(",");
            }
          }
          break;
      }
      self.EditPointTF = false;
    },
    //删除节点
    delPoint (elem, item) {
      var self = this;
      this.$confirm("确认删除此节点？").then(_ => {
        switch (elem) {
          case "调拨入库":
            var TempData = self.orderLineData.processTypes;
            for (var i = 0; i < TempData.length; i++) {
              if (TempData[i].id == item.id) {
                TempData.splice(i, 1);
              }
            }
            self.orderLineDispTxt = [];
            for (var i = 0; i < TempData.length; i++) {
              self.orderLineDispTxt.push(TempData[i]);
            }
            break;
          case "调拨出库流程":
            var TempData = self.orderAllotData.processTypes;
            for (var i = 0; i < TempData.length; i++) {
              if (TempData[i].id == item.id) {
                TempData.splice(i, 1);
              }
            }
            self.orderAllotDispTxt = [];
            for (var i = 0; i < TempData.length; i++) {
              self.orderAllotDispTxt.push(TempData[i]);
            }
            break;
          case "补货单流程":
            var TempData = self.orderRepleData.processTypes;
            for (var i = 0; i < TempData.length; i++) {
              if (TempData[i].id == item.id) {
                TempData.splice(i, 1);
              }
            }
            self.orderRepleDispTxt = [];
            for (var i = 0; i < TempData.length; i++) {
              self.orderRepleDispTxt.push(TempData[i]);
            }
            break;
          case "退货流程":
            var TempData = self.orderReturnData.processTypes;
            for (var i = 0; i < TempData.length; i++) {
              if (TempData[i].id == item.id) {
                TempData.splice(i, 1);
              }
            }
            self.orderReturnDispTxt = [];
            for (var i = 0; i < TempData.length; i++) {
              self.orderReturnDispTxt.push(TempData[i]);
            }
            break;
        }
      });
    },
    //选择节点多选事件开始
    handleCheckAllChange (allData, subElem) {
      var self = this;
      setTimeout(function () {
        self.$refs.deptId.forEach((elem, index) => {
          if (elem.$vnode.data.key == subElem) {
            if (elem.isChecked) {
              allData.forEach(smElem => {
                if (smElem.editTF != true) {
                  self.checkedCities.push(smElem.userId);
                }
              });
              self.checkedCities = self.$api.listUnique(self.checkedCities);
            } else {
              var newList = self.checkedCities;
              allData.forEach(smElem => {
                newList.forEach((sbElem, sbind) => {
                  if (sbElem == smElem.userId) {
                    newList.splice(sbind, 1);
                  }
                });
              });
            }
          }
        });
      }, 100);
    },
    //选择节点多选事件结束

    //编辑订单流程
    saveOrderLine (elem) {
      let self = this;
      switch (elem) {
        case "调拨入库":
          if (
            self.$api.trim(self.orderLineData.processName) == "" ||
            self.orderLineData.processName == undefined
          ) {
            self.$message.error("调拨入库名字不能为空，请重新输入！");
            return;
          }
          if (self.orderLineData.id == undefined) {
            self.orderLineData.processType = 6; //调拨入库流程为1
            // self.orderLineData.companyId = self.companyData.companyId;
            self.orderLineData.operareUserId = self.userData.userId;
            this.$axios
              .post(this.$portMain + "/process/addProcess", self.orderLineData)
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success("调拨入库创建成功！");
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: this.selectedTabId }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          } else {
            //编辑修改调拨入库
            if (self.orderLineData.processTypes.length == 0) {
              self.$message.error("流程不能为空，请重新添加节点保存！");
              return;
            }
            self.orderLineData.processType = 6; //调拨入库流程为1
            this.$axios
              .post(
                this.$portMain + "/process/updataProcess",
                self.orderLineData
              )
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success(
                    "调拨入库流程修改成功，现在正在返回流程管理！"
                  );
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: this.selectedTabId }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          }
          break;
        case "调拨出库流程":
          if (
            self.$api.trim(self.orderAllotData.processName) == "" ||
            self.orderAllotData.processName == undefined
          ) {
            self.$message.error("调拨出库流程名字不能为空，请重新输入！");
            return;
          }
          if (self.orderAllotData.id == undefined) {
            self.orderAllotData.processType = 7;
            // self.orderAllotData.companyId = self.companyData.companyId;
            self.orderAllotData.operareUserId = self.userData.userId;
            this.$axios
              .post(this.$portMain + "/process/addProcess", self.orderAllotData)
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success("调拨出库流程创建成功！");
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: this.selectedTabId }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          } else {
            //编辑修改调拨出库流程
            if (self.orderAllotData.processTypes.length == 0) {
              self.$message.error("流程不能为空，请重新添加节点保存！");
              return;
            }
            self.orderAllotData.processType = 7; //调拨出库流程为6
            this.$axios
              .post(
                this.$portMain + "/process/updataProcess",
                self.orderAllotData
              )
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success(
                    "调拨出库流程修改成功，现在正在返回流程管理！"
                  );
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: this.selectedTabId }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          }
          break;
        case "补货单流程":
          if (
            self.$api.trim(self.orderRepleData.processName) == "" ||
            self.orderRepleData.processName == undefined
          ) {
            self.$message.error("补货单流程名字不能为空，请重新输入！");
            return;
          }
          if (self.orderRepleData.id == undefined) {
            self.orderRepleData.processType = 5;
            // self.orderRepleData.companyId = self.companyData.companyId;
            self.orderRepleData.operareUserId = self.userData.userId;
            this.$axios
              .post(this.$portMain + "/process/addProcess", self.orderRepleData)
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success("补货单流程创建成功！");
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: this.selectedTabId }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          } else {
            //编辑修改补货单流程
            if (self.orderRepleData.processTypes.length == 0) {
              self.$message.error("流程不能为空，请重新添加节点保存！");
              return;
            }
            self.orderRepleData.processType = 5; //补货单流程为7
            this.$axios
              .post(
                this.$portMain + "/process/updataProcess",
                self.orderRepleData
              )
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success(
                    "补货单流程修改成功，现在正在返回流程管理！"
                  );
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: this.selectedTabId }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          }
          break;
        case "补货单流程":
          if (
            self.$api.trim(self.orderRepleData.processName) == "" ||
            self.orderRepleData.processName == undefined
          ) {
            self.$message.error("补货单流程名字不能为空，请重新输入！");
            return;
          }
          if (self.orderRepleData.id == undefined) {
            self.orderRepleData.processType = 7;
            // self.orderRepleData.companyId = self.companyData.companyId;
            self.orderRepleData.operareUserId = self.userData.userId;
            this.$axios
              .post(this.$portMain + "/process/addProcess", self.orderRepleData)
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success("补货单流程创建成功！");
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: "seven" }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          } else {
            //编辑修改补货单流程
            if (self.orderRepleData.processTypes.length == 0) {
              self.$message.error("流程不能为空，请重新添加节点保存！");
              return;
            }
            self.orderRepleData.processType = 7; //补货单流程为7
            this.$axios
              .post(
                this.$portMain + "/process/updataProcess",
                self.orderRepleData
              )
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success(
                    "补货单流程修改成功，现在正在返回流程管理！"
                  );
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: "seven" }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          }
          break;
        case "退货流程":
          if (
            self.$api.trim(self.orderReturnData.processName) == "" ||
            self.orderReturnData.processName == undefined
          ) {
            self.$message.error("退货流程名字不能为空，请重新输入！");
            return;
          }
          if (self.orderReturnData.id == undefined) {
            //创建退货流程
            self.orderReturnData.processType = 9;
            // self.orderReturnData.companyId = self.companyData.companyId;
            self.orderReturnData.operareUserId = self.userData.userId;
            this.$axios
              .post(this.$portMain + "/process/addProcess", self.orderReturnData)
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success("退货流程创建成功！");
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: "four" }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          } else {
            //编辑修改退货流程
            if (self.orderReturnData.processTypes.length == 0) {
              self.$message.error("流程不能为空，请重新添加节点保存！");
              return;
            }
            self.orderReturnData.processType = 3; //退货流程为3
            this.$axios
              .post(
                this.$portMain + "/process/updataProcess",
                self.orderReturnData
              )
              .then(function (res) {
                if (res.data.code == 200) {
                  self.$message.success(
                    "网络退货流程修改成功，现在正在返回流程管理！"
                  );
                  setTimeout(function () {
                    self.$router.push({
                      path: "flowView",
                      query: { tabId: "four" }
                    });
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          }
          break;
      }
    },
    //取消编辑订单流程
    cancelOrderLine () {
      this.$router.push({
        path: "flowView",
        query: { tabId: this.selectedTabId }
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.flow-container {
  position: absolute;
  bottom: 0;
  right: 15px;
  left: 15px;
  top: 60px;
  display: flex;

  .flow-list {
    width: 240px;

    .box-card {
      height: 99%;
    }

    &-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(46, 48, 51, 1);
    }

    &-item {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  .flow-detail {
    flex-grow: 1;
  }
}
</style>
