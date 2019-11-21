<template>
  <div class="conBigDiv" ref="basicLaborCost" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>工费设置</el-breadcrumb-item>
      <el-breadcrumb-item>基础工费</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <div>
            <el-input
              placeholder="信息编号"
              v-model="search"
              class="input-with-select searchTxt"
              size="small"
              @keydown.enter.native="displayAllData"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="fontGray marginLeft24">时间筛选</span>
            <el-date-picker
              class="marginRight"
              v-model="selectedDay"
              @change="selectDayFun"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$publicData.pickerOptions2"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:24px">
        <el-col :span="24">
          <div class="topMenuLeft">
            <el-button type="primary" size="small" @click="creatTable">创建</el-button>
            <el-button type="primary" size="small" @click="queryFun">查询</el-button>
            <el-button type="primary" size="small" @click="resetAllData">重置</el-button>
            <!-- <el-button type="danger" size="small" plain>打印</el-button>
            <el-button type="danger" size="small" plain>导出</el-button>-->
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="laborCostData"
        @row-dblclick="getDetails"
        stripe
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column prop="order_code" label="信息编号"></el-table-column>
        <el-table-column prop="gold_type" label="种类"></el-table-column>
        <el-table-column prop="gold_type_value" label="基础工费"></el-table-column>
        <el-table-column prop="note" label="备注信息"></el-table-column>
        <el-table-column prop="order_uid_name" label="发布人"></el-table-column>
        <el-table-column prop="create_time" label="发布时间"></el-table-column>
      </el-table>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceSum"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 新增工费设置 -->
    <el-dialog
      title="新增工费设置"
      :visible.sync="laborCostType"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="newFrame">
        <div class="line"></div>
        <div class="itemOneWrap">
          <div class="titleTop">金价设置</div>

          <div class="itemOne" v-for="(itemClass,itemIndex) in goldPriceProps" :key="itemIndex">
            <span class="itemOneTitle">种类</span>
            <el-select
              v-model="itemClass.propType"
              placeholder="请选择"
              size="small"
              class="marginRight"
              style="width:200px"
              @change="handelPropTyle(itemClass)"
            >
              <el-option
                v-for="item in classData"
                :key="item"
                :label="item"
                :value="item"
                :disabled="disabledFun(item)"
              ></el-option>
            </el-select>
            <span class="itemOneTitle" style="margin-left:88px">基础工费</span>
            <el-input
              v-model="itemClass.propValue"
              placeholder="请输入基础工费"
              size="small"
              style="width:200px"
              @blur="checkInputLimit(itemClass.propValue, itemIndex)"
            ></el-input>
            <i class="el-icon-plus red_font marginLeft24" @click="addTo" v-show="itemIndex == 0"></i>
            <i
              class="el-icon-delete red_font marginLeft24"
              @click="deleFun(itemIndex)"
              v-show="itemIndex != 0"
            ></i>
          </div>
        </div>

        <div class="itemTwoWrap" v-show="groupingData.length > 0">
          <div class="titleTop">人员列表</div>
          <div class="itemTwo">
            <div v-for="(item,index) in groupingData" :key="index">
              <el-checkbox
                v-model="item.checkAll"
                @change="handleCheckAllChange(item)"
              >{{item.departName}}</el-checkbox>
              <i class="el-icon-arrow-down" @click="hiddenFun(item)" v-show="item.show"></i>
              <i class="el-icon-arrow-right" @click="showFun(item)" v-show="!item.show"></i>

              <div
                style="margin-top: 10px;margin-bottom:15px;"
                class="checkWrap"
                v-show="item.show"
                v-if="item.messageManages != undefined"
              >
                <el-checkbox-group
                  v-model="item.checkedItem"
                  @change="handleCheckedPeopleChange(item)"
                >
                  <el-checkbox
                    v-for="people in item.messageManages"
                    :label="people.id"
                    :key="people.id"
                  >{{people.personName}} {{people.personTelephone}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="itemThreeWrap">
          <div class="titleTop">备注</div>
          <textarea name id class="textAreaStyle" placeholder="请输入备注" v-model="note"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="laborCostType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveCreate" size="small" :loading="btnCreateType">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 工费详情 -->
    <el-dialog
      title="工费详情"
      :visible.sync="laborCostDetailType"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="newFrame">
        <div class="line"></div>
        <div class="itemOneWrap">
          <div class="titleTop">金价设置：</div>
          <div class="detailWrap">
            <div
              class="deatailItem"
              v-for="(item,index) in costDetailData.goldPriceProps"
              :key="index"
            >
              种类：
              <span>{{item.propType}}/{{item.propValue}}元/g</span>
            </div>
          </div>
        </div>

        <div class="itemTwoWrap">
          <div class="titleTop">人员列表：</div>
          <div>
            <div
              class="detailWrap"
              v-if="costDetailData.groupManages.length != 0"
              v-for="(departItem,departIndex) in costDetailData.groupManages"
              :key="departIndex"
            >
              <span>{{departItem.departName}}</span>
              <i
                class="el-icon-arrow-down"
                v-show="departItem.show"
                @click="showDetailFun(departItem)"
              ></i>
              <i
                class="el-icon-arrow-right"
                v-show="!departItem.show"
                @click="showDetailFun(departItem)"
              ></i>
              <div style="margin-top:5px" v-if="departItem.messageManages" v-show="departItem.show">
                <div
                  class="departItem"
                  v-for="(peopleItem,peopleIndex) in departItem.messageManages"
                  :key="peopleIndex"
                >
                  {{peopleItem.personName}}
                  <span>{{peopleItem.personTelephone}}</span>
                </div>
              </div>
            </div>
            <div class="detailWrap" v-if="costDetailData.groupManages.length == 0">暂无数据</div>
          </div>
        </div>
        <div class="noteWrap">
          <div class="titleTop">备注：</div>
          <div class="noteDetail" v-if="costDetailData.note">{{costDetailData.note}}</div>
          <div class="noteDetail" v-else>暂无备注</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="laborCostDetailType = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnCreateType: false, //新增按钮状态
      loading: false,
      costDetailData: { groupManages: [] }, //工费详情数据
      note: "", //备注
      groupingData: [], //分组数据
      goldPriceProps: [
        {
          propType: "足金999",
          propValue: ""
        }
      ],
      classData: ["足金999", "足金9999", "足金"],
      checkType: true, //模拟
      moni: "", //模拟
      laborCostData: [],
      laborCostType: false, //创建弹出框状态
      laborCostDetailType: false, //详情状态
      selectedDay: "", //日期选择属性
      search: "", //搜索字段
      startTime: "",
      endTime: "",
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      dialogFormVisible: false, // 创建弹出框
      orderState: "", // 单据状态
      formLabelWidth: "120px",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      formDate: {
        gold_999: "",
        gold_9999: "",
        platinum_950: ""
      }
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.basicLaborCost;
      if (dom != undefined && altKey && keyCode === 78) {
        self.creatTable();
      }

      if (this.laborCostType == true && altKey && keyCode === 83) {
        self.saveCreate();
      }
    };
  },
  methods: {
    created_fun() {
      this.displayAllData();
      this.getGroupingData();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/wagePriceList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.laborCostData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.laborCostData.forEach((item, index) => {
              item.create_time = self.$api.dateGetDay(item.create_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 查询事件
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.displayAllData();
    },
    // 重置搜索
    resetAllData() {
      this.search = "";
      this.startTime = "";
      this.endTime = "";
      this.selectedDay = "";
      this.queryFun();
    },
    //获取分组数据
    getGroupingData() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/getAllGroupManage")
        .then(function(res) {
          if (res.data.code == 200) {
            if (res.data.data != undefined) {
              self.groupingData = res.data.data;
              if (self.groupingData != undefined) {
                self.groupingData.forEach(item => {
                  item.checkAll = false;
                  item.checkedItem = [];
                  item.show = true;
                });
              }
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    creatTable() {
      // 创建数据
      this.laborCostType = true;
      this.btnCreateType = false;
      this.note = "";
      this.goldPriceProps = [
        {
          propType: "足金999",
          propValue: ""
        }
      ];
      if (this.groupingData != undefined) {
        this.groupingData.forEach(item => {
          item.checkedItem = [];
          item.checkAll = false;
        });
      }
    },
    //隐藏事件
    hiddenFun(item) {
      // this.checkType = false;
      item.show = !item.show;
      this.$forceUpdate();
    },
    //显示事件
    showFun(item) {
      // this.checkType = true;
      item.show = !item.show;
      this.$forceUpdate();
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData();
    },
    //添加
    addTo() {
      if (this.goldPriceProps.length < 3) {
        this.goldPriceProps.push({
          propType: "",
          propValue: ""
        });
      } else {
        this.$message.warning("抱歉，金价设置最多只能有三条！");
      }
    },
    //删除
    deleFun(num) {
      this.goldPriceProps.splice(num, 1);
    },
    //手动选择种类
    handelPropTyle(elem) {
      //
    },
    //种类显示状态
    disabledFun(item) {
      let res = false;
      this.goldPriceProps.forEach(itemOne => {
        if (itemOne.propType == item) {
          res = true;
        }
      });
      return res;
    },
    //单选
    handleCheckedPeopleChange(item) {
      item.checkAll = item.checkedItem.length == item.messageManages.length;
      this.$forceUpdate();
    },
    //全选
    handleCheckAllChange(item) {
      if (item.checkAll && item.messageManages != undefined) {
        item.checkedItem = [];
        item.messageManages.forEach(once => {
          item.checkedItem.push(once.id);
        });
      } else {
        item.checkedItem = [];
      }
      this.$forceUpdate();
      // this.
    },
    //保存创建
    saveCreate() {
      let self = this;
      let groupManages = [];
      if (this.groupingData.length > 0) {
        this.groupingData.forEach(item => {
          if (item.checkedItem.length > 0) {
            let messageManagestr = [];

            item.checkedItem.forEach(once => {
              item.messageManages.forEach(two => {
                if (once == two.id) {
                  messageManagestr.push(two);
                }
              });
            });

            groupManages.push({
              id: item.id,
              departName: item.departName,
              messageManagestr: messageManagestr
            });
          }
        });
      }

      let tipsOne = false;
      let tipsTwo = false;
      this.goldPriceProps.forEach(item => {
        if (item.propType == "") {
          tipsOne = true;
        }

        if (item.propValue == "") {
          tipsTwo = true;
        }
      });

      if (tipsOne) {
        self.$message.error("选择种类!");
        return;
      }

      if (tipsTwo) {
        self.$message.error("请填写基础工费!");
        return;
      }

      let params = {
        goldPriceProps: JSON.stringify(self.goldPriceProps),
        groupManages: JSON.stringify(groupManages),
        note: self.note != undefined ? self.note.trim() : ""
      };
      this.btnCreateType = true;
      this.$api.formdataPostFun(
        self.$portMain + "/stock/createWageprice",
        params,
        res => {
          self.$message.success(res.msg);
          self.laborCostType = false;
          self.btnCreateType = false;
          self.displayAllData();
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //获取详情数据
    getDetails(item) {
      let self = this;
      let params = {
        PRS: {
          wagePriceId: item.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/wagePriceForm", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.laborCostDetailType = true;
            self.costDetailData = res.data.data;
            self.costDetailData.groupManages.forEach(item => {
              item.show = true;
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //详情显示
    showDetailFun(item) {
      item.show = !item.show;
      this.$forceUpdate();
    },
    // 检测输入，限制只能输入数字
    checkInputLimit(val, index) {
      const value = val.replace(/[^\-?\d.]/g, "");

      let result = isNaN(val);
      let result2 = Number(val) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        this.goldPriceProps[index].propValue = "";
        return;
      }
      this.goldPriceProps[index].propValue = Number(value).toFixed(2);
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

  .topMenuLeft {
    display: inline-block;
  }

  .searchTxt {
    width: 256px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontGray {
    color: $font-color;
  }

  .marginRight {
    margin-right: 8px;
  }

  .width40 {
    width: 40%;
    display: inline-block;
  }

  .marginLeft24 {
    margin-left: 24px;
  }

  .marginLeft18 {
    margin-left: 18%;
  }

  .marginTop6 {
    margin-top: 6%;
  }

  .newFrame {
    position: relative;

    .line {
      width: 840px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .titleTop {
      font-size: 16px;
      color: #222426;
      font-weight: 400;
    }

    .itemOneWrap {
      .itemOne {
        margin-left: 35px;
        margin-bottom: 16px;

        .itemOneTitle {
          font-size: 14px;
          color: #8A9199;
        }
      }
    }

    .itemTwoWrap {
      .itemTwo {
        margin-left: 35px;
        margin-bottom: 16px;
      }
    }

    .itemThreeWrap {
      display: flex;

      .textAreaStyle {
        width: 86%;
        height: 76px;
        border-radius: 4px;
        border: 1px solid #CFD4E6;
        resize: none;
        margin-left: 20px;
        padding: 10px;
      }
    }

    .detailWrap {
      margin-left: 33px;

      .deatailItem {
        display: inline-block;
        width: 250px;
        margin-bottom: 14px;
        font-size: 14px;
        color: #8A9199;

        span {
          color: #222426;
        }
      }

      .departItem {
        color: #222426;
        font-size: 14px;
        display: inline-block;
        width: 250px;
        margin-bottom: 14px;
      }
    }

    .noteWrap {
      .noteDetail {
        margin-left: 35px;
        color: #222426;
        font-size: 14px;
        width: 700px;
      }
    }
  }
}
</style>

<style>
.itemTwoWrap .checkWrap .el-checkbox {
  margin-left: 0px;
  width: 230px;
}
</style>
