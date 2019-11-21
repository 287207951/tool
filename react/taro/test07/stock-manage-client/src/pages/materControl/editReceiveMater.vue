<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            <el-breadcrumb-item>收料</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <el-row>
            <el-col :span="8">
              <el-button type="success" icon="el-icon-sort" size="small" @click="saveGold" v-if="!readTF">保存</el-button>
              <el-button type="primary" icon="el-icon-sort" size="small" @click="confirmGold" v-if="!readTF">确认</el-button>
              <el-button type="warning" icon="el-icon-sort" size="small" @click="cancel" v-if="orderAllData.order_state == '2'">作废</el-button>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
            </el-col>
          </el-row>
        </div>
        <div id="centerGoldList">
          <el-row>
            <el-col :span="12">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  送料客户
                </div>
                <div class="flexRightDiv">
                  <el-select v-model="orderAllData.partner_id" placeholder="请选择" size="small" :disabled="readTF">
                    <el-option
                      size="small"
                      v-for="item in companyList"
                      :key="item.company_id"
                      :label="item.company_name"
                      :value="item.company_id">
                    </el-option>
                  </el-select>
                </div>
                <div class="flexLeftDiv">
                  收料净重
                </div>
                <div class="flexRightDiv">
                  {{orderAllData.net_weight}}
                </div>
                <div class="flexLeftDiv">
                  备注
                </div>
                <div class="flexRightDiv">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    :disabled="readTF"
                    v-model="orderAllData.note">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  收料单号
                </div>
                <div class="flexRightDiv">
                  {{orderAllData.order_code}}
                </div>
                <div class="flexLeftDiv">
                  收料时间
                </div>
                <div class="flexRightDiv">
                  {{orderAllData.receive_material_time}}
                </div>
                <div class="flexLeftDiv">
                  制单人
                </div>
                <div class="flexRightDiv">
                  {{orderAllData.order_uid_name}}
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="flexSaveBtn">
              </div>
            </el-col>
          </el-row>
        </div>
        <hr/>

        <div id="goldListTab">
          <el-table
            :data="orderLineData"
            :summary-method="getSummaries"
            show-summary
            style="width: 100%">
            <el-table-column
              type="index"
              label="序"
              header-align='center'
              align='center'
              width="50">
            </el-table-column>
            <el-table-column
              label="结算类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.account_type" placeholder="请选择" size="small" :disabled="readTF || scope.row.oldTF">
                  <el-option
                    v-for="item in accountTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              width="170"
              sortable
              label="金料类型">
              <template slot-scope="scope">
                <span v-if="scope.row.oldTF">
                  <div style="float:left;width:80%">
                    <el-select v-model="scope.row.material_type_id" v-on:change="changeReceiveDei(scope.row)" placeholder="请选择" size="small" :disabled="readTF || scope.row.oldTF" >
                      <el-option
                        v-for="item in materialTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </span>
                <span v-else>
                  <div style="float:left;width:80%">
                    <el-select v-model="scope.row.material_type_id" v-on:change="changeReceiveDei(scope.row)" placeholder="请选择" size="small" :disabled="readTF || scope.row.oldTF" >
                      <el-option
                        v-for="item in materialThreeNoDisList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <i class="el-icon-circle-plus-outline" @click="createNewDei(scope.row)" v-if="!readTF"></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quality"
              sortable
              label="收料成色">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quality" placeholder="请输入内容"  v-on:change="changeReceiveDei(scope.row)" size="small" :disabled="readTF"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="net_weight"
              sortable
              label="收料净重">
              <template slot-scope="scope">
                <el-input v-model="scope.row.net_weight" placeholder="请输入内容"  v-on:change="changeReceiveDei(scope.row)" size="small" :disabled="readTF"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="discount_weight"
              sortable
              label="折重">
              <template slot-scope="scope">
                {{scope.row.discount_weight}}
              </template>
            </el-table-column>
            <el-table-column
              prop="check_net_weight"
              sortable
              label="测后净重">
              <template slot-scope="scope">
                {{scope.row.check_net_weight}}
              </template>
            </el-table-column>
            <el-table-column
              prop="check_quality"
              sortable
              label="实测成色平均值">
              <template slot-scope="scope">
                {{scope.row.check_quality}}
              </template>
            </el-table-column>
            <el-table-column
              prop="quality_list"
              sortable
              label="成色列表">
              <template slot-scope="scope">
                {{scope.row.quality_list}}
              </template>
            </el-table-column>
            <el-table-column
              prop="fee"
              sortable
              label="加收工费">
              <template slot-scope="scope">
                {{scope.row.fee}}
              </template>
            </el-table-column>
            <el-table-column
              prop="fee_total"
              sortable
              label="工费总计">
              <template slot-scope="scope">
                {{scope.row.fee_total}}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              label="验料单号">
              <template slot-scope="scope">
                {{scope.row.check_material_order_code}}
              </template>
            </el-table-column>
            <el-table-column
              header-align='center'
              align='center'
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="!readTF" @click="delMaterDeiFun(scope.row)"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
            
          </el-table>
          <el-button type="primary" class="createGoldBtn" plain size="small" @click="createDeiFun" v-if="!readTF">创建新一行</el-button>
          
        </div>
        <el-dialog
          title="添加新金料类型"
          :visible.sync="createDeiVisTf"
          :close-on-click-modal="false"
          width="30%">
          <div class="DeiVisDiv">
            <el-row>
              <el-col :span="5">
                金料名称
              </el-col>
              <el-col :span="19">
                <el-input v-model="newSelectProData.name" placeholder="请输入金料名称" size="small"></el-input>
              </el-col>
              <el-col :span="5">
                工费
              </el-col>
              <el-col :span="19">
                <el-input v-model="newSelectProData.fee" placeholder="请输入工费" size="small"></el-input>
              </el-col>
              <el-col :span="5">
                选择流程
              </el-col>
              <el-col :span="19">
                <el-select v-model="newSelectProData.flow_type" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in selectProList"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                折重
              </el-col>
              <el-col :span="19">
                <el-select v-model="newSelectProData.is_discount" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in isDiscountlist"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="createDeiVisTf = false" size='small'>取 消</el-button>
            <el-button type="primary" @click="createDeiVisFun" size='small'>确 定</el-button>
          </span>
        </el-dialog>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      readTF: false, //只读属性
      goldListId: "", //收料单编号
      createGoldTF: false, //创建新收料单新窗口
      companyList: [], //客戶列表
      orderAllData: {},
      orderLineData: [], //收料单明细数组
      accountTypeList: [
        {
          value: "0",
          label: "转存"
        },
        {
          value: "1",
          label: "结价"
        }
      ],
      materialTypeList: [], //金料类型的数据列表
      materialThreeNoDisList: [], //金料类型的flow_type为3的去掉数据列表
      weight: "暂无", //暂时数据
      note: "备注", //备注
      input: "", //创建新收料单数据
      createDeiVisTf: false, //创建新金料类型弹出框
      selectProList: [
        {
          //选择流程下拉框
          id: "1",
          value: "免检"
        },
        {
          id: "2",
          value: "先收后验"
        }
      ],
      isDiscountlist: [
        {
          //选择流程下拉框
          id: "0",
          value: "否"
        },
        {
          id: "1",
          value: "是"
        }
      ],
      selectProId: 1, //选择流程默认“免检”
      newSelectProData: {}, //创建新的金料类型数据
      sumData: [] //数据统计合计数组
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.goldListId = window.location.hash.split("goldId=")[1];
      if (window.location.hash.split("view").length != -1) {
        self.readTF = true;
      }
      self.goldListId = window.location.hash.split("=")[1];
      //用户名称
      this.$axios
        .post(this.$portMain + "/client/clients")
        .then(function(res) {
          if (res.data.code == 200) {
            self.companyList = res.data.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });

      //金料类型
      this.$axios
        .get(this.$portMain + "/stock/materialtype/order/list")
        .then(function(res) {
          if (res.data.code == 200) {
            self.materialTypeList = res.data.data;
            self.materialThreeNoDisList = [];
            for (var i = 0; i < self.materialTypeList.length; i++) {
              if (self.materialTypeList[i].flow_type != "1") {
                self.materialThreeNoDisList.push(self.materialTypeList[i]);
              }
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });

      if (self.goldListId == "createData") {
        //创建新收料单数据
        self.orderAllData = {
          id: "",
          order_code: "",
          gross_weight: "",
          net_weight: "",
          partner_id: "",
          partner_name: "",
          receive_material_order_id: "",
          receive_material_order_code: "",
          order_state: "",
          order_uid: 1,
          order_uid_name: "",
          note: "",
          check_material_order_line: "",
          is_active: "",
          order_line: [{}]
        };

        self.readTF = false;
        return;
      }

      if (window.location.hash.indexOf("editId=") >= 0) {
        //收料单号判断
        self.readTF = false;
      }
      let params = {
        PRS: {
          orderId: self.goldListId
        }
      };
      this.$axios
        .get(
          this.$portMain + "/stock/receivematerial/order/form",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderAllData = res.data.data;
            self.orderAllData.receive_material_time = self.$api.dateGetDay(
              self.orderAllData.receive_material_time
            );
            self.orderAllData.create_time = self.$api.dateGetDay(
              self.orderAllData.create_time
            );
            self.orderAllData.update_time = self.$api.dateGetDay(
              self.orderAllData.update_time
            );

            self.order_state = parseInt(res.data.data.order_state);
            self.orderLineData = res.data.data.order_line;
            for (var i = 0; i < self.orderLineData.length; i++) {
              self.orderLineData[i].create_time = self.$api.dateGetDay(
                self.orderLineData[i].create_time
              );
              self.orderLineData[i].update_time = self.$api.dateGetDay(
                self.orderLineData[i].update_time
              );
              self.orderLineData[i].order_uid = localStorage.sjyUserId;
              self.orderLineData[i].order_uid_name = localStorage.sjyUserName;
              self.orderLineData[i].oldTF = true;
            }
          } else {
            self.$message.error(res.data.msg);
          }
          if (self.orderAllData.order_state == "2") {
            self.readTF = true;
          } else {
            self.readTF = false;
          }
        });
    },
    //编辑收料单保存按钮
    saveGold() {
      var self = this;
      if (self.goldListId == "createData") {
        self.orderAllData.order_line = self.orderLineData;
        self.orderAllData.order_state = "1";
        self.orderAllData.net_weight = self.sumData[4];
        self.orderAllData.discount_weight = self.sumData[5];
        self.orderAllData.check_net_weight = self.sumData[6];
        self.orderAllData.fee_total = self.sumData[10];
        for (var i = 0; i < self.orderAllData.order_line.length; i++) {
          for (var j = 0; j < self.materialTypeList.length; j++) {
            if (
              self.orderAllData.order_line[i].material_type_id ==
              self.materialTypeList[j].id
            ) {
              self.orderAllData.order_line[i].flow_type =
                self.materialTypeList[j].flow_type;
            }
          }
          self.orderAllData.order_line[i].order_code =
            self.orderAllData.order_code + "_" + (i + 1);
        }

        if (self.orderAllData.partner_id == "") {
          self.$message.error("错误：创建未选择送料客户！");
          return;
        }
        for (var i = 0; i < self.companyList.length; i++) {
          if (self.orderAllData.partner_id == self.companyList[i].company_id) {
            self.orderAllData.partner_name = self.companyList[i].company_name;
          }
        }
        for (var i = 0; i < self.companyList.length; i++) {
          if (self.orderAllData.partner_id == self.companyList[i].company_id) {
            self.orderAllData.partner_name = self.companyList[i].company_name;
            break;
          }
        }
        this.$axios
          .post(
            this.$portMain +
              "/stock/receivematerial/order/create",
            self.orderAllData
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("数据保存成功，正在刷新！");
              setTimeout(function() {
                self.$router.push("checkReceiveMater");
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
        return;
      }
      if (window.location.hash.indexOf("editId=") >= 0) {
        self.orderAllData.order_state = "1";
        self.orderAllData.net_weight = self.sumData[4];
        self.orderAllData.discount_weight = self.sumData[5];
        self.orderAllData.check_net_weight = self.sumData[6];
        self.orderAllData.fee_total = self.sumData[10];
        for (var i = 0; i < self.orderAllData.order_line.length; i++) {
          for (var j = 0; j < self.materialTypeList.length; j++) {
            if (
              self.orderAllData.order_line[i].material_type_id ==
              self.materialTypeList[j].id
            ) {
              self.orderAllData.order_line[i].flow_type =
                self.materialTypeList[j].flow_type;
            }
          }
          self.orderAllData.order_line[i].order_code =
            self.orderAllData.order_code + "_" + (i + 1);
        }
        for (var i = 0; i < self.companyList.length; i++) {
          if (self.orderAllData.partner_id == self.companyList[i].company_id) {
            self.orderAllData.partner_name = self.companyList[i].company_name;
            break;
          }
        }
        this.$axios
          .post(
            this.$portMain + "/stock/receivematerial/order/edit",
            self.orderAllData
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("数据保存成功，正在刷新！");
              setTimeout(function() {
                self.created_fun();
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
        return;
      }
    },
    //编辑收料单确认按钮
    confirmGold() {
      var self = this;
      if (self.orderAllData.partner_id == "") {
        self.$message.error("错误：创建未选择送料客户！");
        return;
      }
      if (self.orderLineData.length == 0) {
        self.$message.error("错误:无明细，确认操作需要添加明细！");
        return;
      }
      self.orderAllData.order_line = self.orderLineData;
      for (var i = 0; i < self.companyList.length; i++) {
        if (self.orderAllData.partner_id == self.companyList[i].company_id) {
          self.orderAllData.partner_name = self.companyList[i].company_name;
          break;
        }
      }
      for (var i = 0; i < self.orderAllData.order_line.length; i++) {
        for (var j = 0; j < self.materialTypeList.length; j++) {
          if (
            self.orderAllData.order_line[i].material_type_id ==
            self.materialTypeList[j].id
          ) {
            self.orderAllData.order_line[i].flow_type =
              self.materialTypeList[j].flow_type;
            self.orderAllData.order_line[i].material_type_name =
              self.materialTypeList[j].name;
          }
        }
        self.orderAllData.order_line[i].order_code =
          self.orderAllData.order_code + "_" + (i + 1);
      }
      self.orderAllData.order_state = "2";
      self.orderAllData.net_weight = self.sumData[4];
      self.orderAllData.discount_weight = self.sumData[5];
      self.orderAllData.check_net_weight = self.sumData[6];
      self.orderAllData.fee_total = self.sumData[10];
      this.$axios
        .post(
          this.$portMain +
            "/stock/receivematerial/order/confirm",
          self.orderAllData
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("数据保存成功，正在刷新！");
            setTimeout(function() {
              self.$router.push("checkReceiveMater");
            }, 1000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //创建新的一行明细
    createDeiFun() {
      var self = this;
      var newOrderLine = {
        order_id: "",
        order_code: "",
        account_type: "0",
        material_type_id: self.materialThreeNoDisList[0].id,
        material_type_name: "",
        quality: "0",
        net_weight: "0",
        discount_weight: 0,
        check_net_weight: 0,
        check_quality: 0,
        quality_list: "",
        fee: 0,
        fee_total: 0,
        check_material_order_code: "0",
        create_time: "",
        update_time: "",
        order_uid: "",
        order_uid_name: "",
        is_active: "",
        oldTF: false //新记录
      };
      newOrderLine.material_type_id = self.materialThreeNoDisList[0].id; //默认第一个金料类型ID
      newOrderLine.material_type_name = self.materialThreeNoDisList[0].name; //默认第一个金料类型名称
      newOrderLine.fee = self.materialTypeList[0].fee; //默认第一个金料类型工费

      self.orderLineData.push(newOrderLine);
    },
    //创建新收料类型
    createNewDei(elem) {
      var self = this;
      self.newSelectProData = {};
      self.createDeiVisTf = true;
    },
    //改收料明细的成色和净重
    changeReceiveDei(elem) {
      var self = this;
      if (elem.material_type_id == 2 || elem.material_type_id == 3) {
        //板料和旧料回收不折重
        elem.discount_weight = elem.net_weight;
      } else {
        //自动算出折重，折重=成色/100*收料净重
        elem.discount_weight = self.$api.returnFloat(
          elem.net_weight * (elem.quality / 100)
        );
      }
      elem.check_net_weight = elem.net_weight; //测后净重=收料净重

      for (var i = 0; i < self.materialTypeList.length; i++) {
        if (elem.material_type_id == self.materialTypeList[i].id) {
          elem.fee = self.materialTypeList[i].fee;
          break;
        }
      }
      self.orderAllData.net_weight = self.sumData[4];
      elem.fee_total = self.$api.returnFloat(elem.fee * elem.net_weight); //工费总计 = 加收工费 X 净重
    },
    //删除收料单明细
    delMaterDeiFun(elem) {
      var self = this;
      this.$confirm("确认将此明细单删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            PRS: {
              orderId: elem.id
            }
          };
          this.$axios
            .get(
              this.$portMain +
                "/stock/receivematerial/orderline/delete",
              params
            )
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message("删除成功,正在刷新页面中");
                setTimeout(function() {
                  self.created_fun();
                }, 1000);
              } else {
                self.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
    },
    //创建新的金料类型
    createDeiVisFun() {
      var self = this;
      let trueTf = true;
      if (
        !self.newSelectProData.name ||
        !self.newSelectProData.fee ||
        !self.newSelectProData.flow_type ||
        !self.newSelectProData.is_discount
      ) {
        trueTf = false;
      }
      if (trueTf) {
        this.$axios
          .post(
            this.$portMain + "/stock/materialtype/order/create",
            self.newSelectProData
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("添加金料类型成功，正在刷新中！");
              setTimeout(function() {
                self.created_fun();
              }, 1000);
              self.createDeiVisTf = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.$message.error("还有必填字段未填！");
      }
    },
    //明细表table统计合计功能
    getSummaries(param) {
      var self = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 3 || index === 7 || index === 8) {
          sums[index] = "";
          return;
        }
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      self.sumData = sums;
      return sums;
    },
    //作废此单
    cancel() {
      var self = this;
      for (var i = 0; i < self.companyList.length; i++) {
        if (self.orderAllData.partner_id == self.companyList[i].company_id) {
          self.orderAllData.partner_name = self.companyList[i].company_name;
          break;
        }
      }
      this.$confirm("确认作废此单？").then(_ => {
        this.$axios
          .post(
            this.$portMain +
              "/stock/receivematerial/order/abolish",
            self.orderAllData
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("作废成功，现在正在返回库位列表页！");
              setTimeout(function() {
                self.$router.push("checkReceiveMater");
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
  #centerGoldList
    .flexSaveBtn
      margin-top 50px
      text-align right
      padding-right 50px
    .flexDiv
      display flex
      flex-flow row wrap
      .flexLeftDiv
        width 30%
        margin-top 10px
        height 30px
        padding 15px 15px 0px 0px
        // text-align right
      .flexRightDiv
        width 50%
        margin-top 10px
        height 30px
        padding 15px 0 0 0
  .createGold
    line-height 50px
  .createGoldBtn
    margin 20px 0 10px 0
  .DeiVisDiv
    line-height 50px
</style>