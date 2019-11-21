<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>验料（测金）</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="8">
            <el-button
              type
              icon="el-icon-sort"
              size="small"
              @click="saveGold"
              v-if="!readTF"
              class="btnColor"
            >保存</el-button>
            <el-button
              type="primary"
              icon="el-icon-sort"
              size="small"
              @click="confirmGold"
              v-if="!readTF"
            >确认</el-button>
          </el-col>
          <el-col :span="8"></el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </div>
      <div id="centerGoldList">
        <el-row>
          <el-col :span="8">
            <div class="flexDiv">
              <div class="flexLeftDiv">客户</div>
              <div class="flexRightDiv">
                <el-select
                  v-model="orderAllData.partner_id"
                  placeholder="请选择"
                  size="small"
                  :disabled="readTF"
                >
                  <el-option
                    size="small"
                    v-for="item in companyList"
                    :key="item.company_id"
                    :label="item.company_name"
                    :value="item.company_id"
                  ></el-option>
                </el-select>
              </div>
              <div class="flexLeftDiv">毛重</div>
              <div class="flexRightDiv">{{orderAllData.gross_weight}}</div>
              <div class="flexLeftDiv">备注</div>
              <div class="flexRightDiv">
                <el-input
                  type="textarea"
                  :disabled="readTF"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="orderAllData.note"
                ></el-input>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="flexDiv">
              <div class="flexLeftDiv">验料单号</div>
              <div class="flexRightDiv">{{orderAllData.order_code}}</div>
              <div class="flexLeftDiv">收料单</div>
              <div class="flexRightDiv">{{orderAllData.receive_material_order_code}}</div>
              <div class="flexLeftDiv">检验状态</div>
              <div class="flexRightDiv">
                <span v-if="order_state == 1">创建</span>
                <span v-else-if="order_state == 2">检验中</span>
                <span v-else-if="order_state == 3">已检验</span>
                <span v-else-if="order_state == 4">作废</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="flexDiv">
              <div class="flexLeftDiv">创建时间</div>
              <div class="flexRightDiv">{{orderAllData.create_time}}</div>
              <div class="flexLeftDiv">制单人</div>
              <div class="flexRightDiv">{{orderAllData.order_uid_name}}</div>
              <div class="flexLeftDiv">验料时间</div>
              <div class="flexRightDiv">{{orderAllData.check_material_time}}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="flexSaveBtn"></div>
          </el-col>
        </el-row>
      </div>
      <hr>

      <div id="goldListTab">
        <el-table
          :data="goldListData"
          :summary-method="getSummaries"
          show-summary
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column
            prop="index"
            type="index"
            label="序"
            header-align="center"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column prop="material_name" label="金料名称">
            <template slot-scope="scope">
              <span v-if="readTF">{{scope.row.material_name}}</span>
              <el-select
                v-else
                v-model="scope.row.material_type_id"
                v-on:change="changeGoldList(scope.row)"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in materialTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <i
                class="el-icon-circle-plus-outline"
                @click="createNewDei(scope.row)"
                v-if="!readTF"
              ></i>
            </template>
          </el-table-column>
          <el-table-column prop="net_weight" sortable label="测后净重">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.net_weight"
                placeholder="请输入内容"
                v-on:change="changeGoldList(scope.row)"
                size="small"
                :disabled="readTF"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="quality" sortable label="实测成色列表">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.quality"
                placeholder="请输入内容"
                v-on:change="changeGoldList(scope.row)"
                size="small"
                :disabled="readTF"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="average_quality" sortable label="实测成色平均值">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.average_quality"
                placeholder="请输入内容"
                v-on:change="changeGoldList(scope.row)"
                size="small"
                :disabled="readTF"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="备注">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.note"
                placeholder="请输入内容"
                size="small"
                :disabled="readTF"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column sortable label="操作">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="delGoldDetail(scope.row)"
                size="small"
                v-show="!readTF"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          class="createGoldBtn"
          plain
          size="small"
          @click="createGoldListFun"
          v-if="!readTF"
        >创建新明细</el-button>
        <el-dialog title="添加新金料类型" :visible.sync="createDeiVisTf" width="30%" :close-on-click-modal="false">
          <div class="DeiVisDiv">
            <el-row>
              <el-col :span="5">金料名称</el-col>
              <el-col :span="19">
                <el-input v-model="newSelectProData.name" placeholder="请输入金料名称" size="small"></el-input>
              </el-col>
              <el-col :span="5">工费</el-col>
              <el-col :span="19">
                <el-input v-model="newSelectProData.fee" placeholder="请输入工费" size="small"></el-input>
              </el-col>
              <el-col :span="5">选择流程</el-col>
              <el-col :span="19">先验后收</el-col>
              <el-col :span="5">折重</el-col>
              <el-col :span="19">
                <el-select v-model="newSelectProData.is_discount" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in isDiscountlist"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="createDeiVisTf = false" size="small">取 消</el-button>
            <el-button type="primary" @click="createDeiVisFun" size="small">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goldListId: "", //金料单编号
      createGoldTF: false, //创建新金料单新窗口
      companyList: [], //用户
      orderAllData: {},
      value: "", //选中用户
      weight: "105", //净重
      backup: "备注", //备注
      order_state: -1, //验料单状态码
      goldListData: [], //金料单列表数据
      newGoldData: {}, //创建新金料单数据
      materialTypeList: [], //金料名称的数据列表
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
      readTF: false, //只读属性
      options: [
        {
          value: "足金料(杂料)",
          label: "足金料(杂料)"
        },
        {
          value: "足金旧料",
          label: "足金旧料"
        },
        {
          value: "(手环)旧料",
          label: "(手环)旧料"
        }
      ],
      saveDataTF: true, //明细必填项保存
      sumData: [], //数据统计合计数组
      netWeightSum: 0 //明细净重总数
    };
  },
  created() {
    this.created_fun();
    // this.getMockData();
  },
  methods: {
    created_fun() {
      var self = this;
      self.goldListId = window.location.hash.split("=")[1];
      this.$axios.post(this.$portMain + "/client/clients").then(function(res) {
        if (res.data.code == 200) {
          self.companyList = res.data.data.data;
        } else {
          self.$message.error(res.data.msg);
        }
      });

      if (self.goldListId == "createNewData") {
        self.orderAllData = newCheckGoldData;
        return;
      }

      if (window.location.hash.indexOf("editId=") >= 0) {
        // self.readTF = false;
      }
      // 查看是否先收后验（flow_type:2）
      let params = {
        PRS: {
          orderId: self.goldListId
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/checkmaterial/order/form", params)
        .then(function(res) {
          if (res.data.code == 200) {
            if (res.data.data.flow_type == 2) {
            } else {
              self.flowType();
            }
            self.orderAllData = res.data.data;
            self.orderAllData.create_time = self.$api.dateGetDay(
              self.orderAllData.create_time
            );
            self.orderAllData.check_material_time = self.$api.dateGetDay(
              self.orderAllData.check_material_time
            );
            self.orderAllData.update_time = self.$api.dateGetDay(
              self.orderAllData.update_time
            );
            self.order_state = parseInt(res.data.data.order_state);
            //当没有明细时自动加一条明细
            self.goldListData = res.data.data.order_line;
            if (self.goldListData.length == 0) {
              self.createGoldListFun();
            }
          } else {
            self.$message.error(res.data.msg);
          }
          if (self.orderAllData.order_state == "3") {
            self.readTF = true;
          } else if (self.orderAllData.order_state == "2") {
            self.readTF = false;
          }
        });
    },
    // 先验后手或者免检（flow_type:1,0）
    flowType() {
      //金料名称
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/materialtype/order/checklist")
        .then(function(res) {
          if (res.data.code == 200) {
            self.materialTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 演示的数据
    getMockData() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/materialtype/order/list")
        .then(function(res) {
          if (res.data.code == 200) {
            self.materialTypeList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //明细表table统计合计功能
    getSummaries(param) {
      var self = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 3 || index === 4) {
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
    //测金保存按钮
    saveGold() {
      var self = this;
      if (self.goldListData.length == 0) {
        self.$message.error("错误:无明细，确认操作需要添加明细！");
        return;
      } else {
        self.netWeightSum = 0;
        for (let i = 0; i < self.goldListData.length; i++) {
          self.netWeightSum += parseFloat(self.goldListData[i].net_weight);
        }
        self.goldListData.forEach(item => {
          if (
            item.net_weight != undefined &&
            item.quality != undefined &&
            item.average_quality != undefined
          ) {
            self.saveDataTF = true;
          } else {
            self.saveDataTF = false;
          }
        });

        if (self.orderAllData.gross_weight < self.netWeightSum) {
          self.$message.error("错误:明细总净重大于毛重，请重新输入！");
          return;
        }
      }
      if (self.saveDataTF) {
        self.orderAllData.order_line = self.goldListData;
        self.orderAllData.net_weight = self.netWeightSum;
        for (var i = 0; i < self.goldListData.length; i++) {
          for (var j = 0; j < self.materialTypeList.length; j++) {
            if (
              self.materialTypeList[j].id ==
              self.goldListData[i].material_type_id
            ) {
              self.goldListData[i].material_name =
                self.materialTypeList[j].name;
              break;
            }
          }
        }
        this.$axios
          .post(
            this.$portMain + "/stock/checkmaterial/order/edit",
            self.orderAllData
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message({
                message: "资料已经保存，正在刷新中！",
                type: "success"
              });
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.$message({
          message: "还有必填项未填，未能保存！",
          type: "error"
        });
      }
    },
    //确认测金
    confirmGold() {
      var self = this;
      if (self.goldListData.length == 0) {
        self.$message.error("错误:无明细，确认操作需要添加明细！");
        return;
      } else {
        self.netWeightSum = 0;
        for (let i = 0; i < self.goldListData.length; i++) {
          self.netWeightSum += parseFloat(self.goldListData[i].net_weight);
        }

        if (self.orderAllData.gross_weight < self.netWeightSum) {
          self.$message.error("错误:明细总净重大于毛重，请重新输入！");
          return;
        }
      }
      if (self.saveDataTF) {
        self.orderAllData.order_line = self.goldListData;
        self.orderAllData.net_weight = self.netWeightSum;
        for (var i = 0; i < self.goldListData.length; i++) {
          for (var j = 0; j < self.materialTypeList.length; j++) {
            if (
              self.materialTypeList[j].id ==
              self.goldListData[i].material_type_id
            ) {
              self.goldListData[i].material_name =
                self.materialTypeList[j].name;
              break;
            }
          }
        }
        self.orderAllData.order_state = "3";
        this.$axios
          .post(
            this.$portMain + "/stock/checkmaterial/order/edit",
            self.orderAllData
          )
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message({
                message: "资料已经确认，正在刷新中！",
                type: "success"
              });
              setTimeout(function() {
                self.created_fun();
              }, 1000);
            } else {
              self.orderAllData.order_state = "2";
              self.$message.error(res.data.msg);
            }
          });
        // self.$router.push("checkGoldTest");
      } else {
        self.$message({
          message: "还有必填项未填！",
          type: "error"
        });
      }
    },
    //添加金料单弹出框
    createGoldListFun() {
      var self = this;
      self.saveDataTF = false;
      self.newGoldData = {};
      self.newGoldData.order_id = self.goldListId;
      self.newGoldData.order_uid = 1;
      self.newGoldData.order_uid_name = "";
      self.newGoldData.material_name = "";
      self.newGoldData.material_type_id = self.materialTypeList[0].id;
      self.newGoldData.net_weight = "0";
      self.newGoldData.quality = "";
      self.newGoldData.note = "";
      self.goldListData.push(self.newGoldData);
      for (var i = 0; i < self.goldListData.length; i++) {
        self.goldListData[i].order_code = self.goldListId + "_" + (i + 1);
      }
    },
    //添加金料单
    changeGoldList(elem) {
      var self = this;

      setTimeout(function() {
        for (let i = 0; i < self.goldListData.length; i++) {
          self.goldListData[i].order_code = self.goldListId + "_" + (i + 1);
          self.goldListData[i].net_weight = parseFloat(
            self.goldListData[i].net_weight
          );
        }
        let qualityList = elem.quality.split(",");
        let qualitySum = 0;
        for (let i = 0; i < qualityList.length; i++) {
          qualitySum += parseFloat(qualityList[i]);
        }
        elem.average_quality = self.$api.returnFloat(
          qualitySum / qualityList.length
        );
      }, 500);

      if (elem.net_weight == "") {
        this.$message({
          message: "测后净重为必填!",
          type: "warning"
        });
        self.saveDataTF = false;
        return;
      } else if (elem.quality == "") {
        this.$message({
          message: "实测成色列表为必填!",
          type: "warning"
        });
        self.saveDataTF = false;
        return;
      } else if (elem.average_quality == "") {
        this.$message({
          message: "实测成色平均值为必填!",
          type: "warning"
        });
        self.saveDataTF = false;
        return;
      } else {
        self.saveDataTF = true;
      }
    },
    //删除验料单明细
    delGoldDetail(elem) {
      var self = this;
      this.$confirm("确认删除此明细？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (elem.id != undefined) {
            let params = {
              PRS: {
                orderId: elem.id
              }
            };
            this.$axios
              .get(
                this.$portMain + "/stock/checkmaterial/orderline/delete",
                params
              )
              .then(function(res) {
                if (res.data.code == 200) {
                  self.$message({
                    type: "success",
                    message: "删除明细成功，正在刷新页面!"
                  });
                  setTimeout(function() {
                    self.created_fun();
                  }, 1000);
                } else {
                  self.$message.error(res.data.msg);
                }
              });
          } else {
            for (var i = 0; i < self.goldListData.length; i++) {
              if (self.goldListData[i].order_code == elem.order_code) {
                self.goldListData.splice(i, 1);
                //self.saveDataTF = true;
                break;
              }
            }
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //创建新收料类型
    createNewDei(elem) {
      var self = this;
      self.newSelectProData = {};
      self.createDeiVisTf = true;
    },
    //创建新的金料类型
    createDeiVisFun() {
      var self = this;
      let trueTf = true;
      self.newSelectProData.flow_type = "1";
      if (
        !self.newSelectProData.name ||
        !self.newSelectProData.fee ||
        !self.newSelectProData.flow_type ||
        !self.newSelectProData.is_discount
      ) {
        trueTf = false;
      }
      let nameTf = false;

      for (var i = 0; i < self.materialTypeList.length; i++) {
        if (self.materialTypeList[i].name == self.newSelectProData.name) {
          nameTf = true;
          break;
        }
      }
      if (nameTf) {
        self.$message.error("金料名称重复，请重新输入！");
        return;
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
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
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

  #centerGoldList {
    .flexSaveBtn {
      margin-top: 50px;
      text-align: right;
      padding-right: 50px;
    }

    .flexDiv {
      display: flex;
      flex-flow: row wrap;

      .flexLeftDiv {
        width: 30%;
        margin-top: 10px;
        height: 30px;
        padding: 15px 15px 0px 0px;
      }

      .flexRightDiv {
        width: 50%;
        margin-top: 10px;
        height: 30px;
        padding: 15px 0 0 0;
      }
    }
  }

  .createGold {
    line-height: 50px;

    .createInp {
      width: 90%;
    }
  }

  .createGoldBtn {
    margin: 20px 0 10px 0;
  }

  .DeiVisDiv {
    line-height: 50px;
  }

  .btnColor {
    border: 1px solid #F20F34;
    border-radius: 3px;
  }
}
</style>