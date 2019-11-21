<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            <el-breadcrumb-item>饰转料</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <el-row>
            <el-col :span="8">
              <el-button type="primary" icon="el-icon-plus" size="small" v-if="stepsActive === 0">创建</el-button>
              <el-button type="primary" icon="el-icon-sort" size="small" v-if="stepsActive === 0">确认</el-button>
            </el-col>
            <el-col :span="16">
            </el-col>
          </el-row>
        </div>
        <div id="centerGoldList">
          <el-row>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  选择料
                </div>
                <div class="flexRightDiv">
                  {{result.materialweight_quality}}
                  <!-- <el-select v-model="selectValue" placeholder="请选择" size="small">
                    <el-option
                      size="small"
                      v-for="item in providerList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select> -->
                </div>
                <div class="flexLeftDiv">
                  备注
                </div>
                <div class="flexRightDiv">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    :disabled="stepsActive !== 0"
                    placeholder="请输入内容"
                    v-model="reMark">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv" v-if="!createStatus">
                  单据编号
                </div>
                <div class="flexRightDiv" v-if="!createStatus">
                  {{result.material_turn_ornament_code}}
                </div>
                <div class="flexLeftDiv">
                  转入库存仓
                </div>
                <div class="flexRightDiv">
                  {{result.stock_position_name}}
                  <!-- <el-select v-model="value" placeholder="请选择" size="small">
                    <el-option
                      size="small"
                      v-for="item in materiList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select> -->
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  制单人
                </div>
                <div class="flexRightDiv">
                  {{result.order_uid_name}}
                </div>
                <div class="flexLeftDiv" v-if="stepsActive === 0">
                  创建时间
                </div>
                <div class="flexRightDiv" v-if="stepsActive === 0">
                  {{this.$api.dateGetDay(result.update_time)}}
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="flexSaveBtn" >
                <el-button type="primary" v-if="stepsActive === 0" icon="el-icon-refresh" size="small" @click="saveGold">保存</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <hr/>

        <div id="goldListTab">
          <el-table
            :data="result.materialTurnOrnamentLines"
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
              prop="product_pic"
              header-align='center'
              align='center'
              label="产品图片">
            </el-table-column>
            <el-table-column
              prop="product_name"
              sortable
              header-align='center'
              align='center'
              label="产品名称">
            </el-table-column>
            <el-table-column
              prop="product_standard"
              sortable
              header-align='center'
              align='center'
              label="规格参数">
            </el-table-column>
            <el-table-column
              prop="product_appearance"
              sortable
              header-align='center'
              align='center'
              label="外观状态">
            </el-table-column>
            <el-table-column
              prop="ornament_net_weight"
              sortable
              header-align='center'
              align='center'
              label="净重">
            </el-table-column>
            <el-table-column
              prop="ornament_quality"
              sortable
              header-align='center'
              align='center'
              label="成色">
            </el-table-column>
            <el-table-column
              prop="ornament_num"
              sortable
              header-align='center'
              align='center'
              label="件数">
            </el-table-column>
            <el-table-column
              prop="ornament_warehouse"
              sortable
              header-align='center'
              align='center'
              label="仓储位">
            </el-table-column>
            <el-table-column
              prop="note"
              sortable
              header-align='center'
              align='center'
              label="备注">
            </el-table-column>
            <el-table-column
              prop="backup"
              sortable
              align='center'
              header-align='center'
              v-if="stepsActive === 0"
              label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="delMaterDeiFun(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
            <div class="table-bt" v-if="stepsActive === 0">
              <el-button type="success" @click.native="newLine">新增一行</el-button>
              <el-select v-model="materAddDef" placeholder="请选择" size="medium">
                <el-option
                  size="medium"
                  v-for="item in materAddList"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      stepsActive: 0,
      result: {},
      goldListId:'',//金料单编号
      createStatus: '',
      materiList: [],
      materAddDef: '',
      materAddList: [],
      selectValue: '',
      reMark: "",//备注
    };
  },
  created() {
    this.created_fun();
    this.getState()
  },
  methods: {
    getState() {
      const query =  this.$route.query
      query.created && (this.createStatus = true)
    },
    async created_fun() {
      let self = this;
      this.goldListId = this.$route.query.goldId;
      // 获取供应商select
      this.$axios.get(this.$portBYB + "purificationOrder/resPartnerList").then(res => {
        self.providerList = res.data.data;
        self.selectValue = self.providerList[0].name;
      });
      // await this.getMateriList()
      if (!self.goldListId) {
        return;
      }
      await this.getOrderFrom()
      // await this.purorderSlectFilter()
    },
    getMateriList() {
      let self = this;
      return Promise.resolve(
        this.$axios.get(this.$portBYB + "MaterialTurnOrnament/materialstockList").then(res => {
          self.materiList = res.data.data;
          if (self.materiList.length === 0) {
            return;
          }
          self.materiList.forEach(item => {
            item.store_issue_type = item.material_name;
            item.material_inventory_order_id = item.id
            item.material_name === "足金9999" && (item.wage = 0)
            item.material_name === "足金99999" && (item.wage = 1.5)
            delete item.id
          });
          self.materAddDef = self.materiList[0].store_issue_type;
        })
      )
    },
    getOrderFrom() {
      let self = this;
      let orderFromParams = {
        PRS: {
          orderId: this.goldListId
        }
      }
      return Promise.resolve(
        this.$axios.get(this.$portBYB + "MaterialTurnOrnament/orderFrom", orderFromParams).then(res => {
          let state = res.data.data.store_issue_state;
          switch (Number(state)) {
            case 1:
              self.stepsActive = 0;
              break;
            case 2:
              self.stepsActive = 1;
              break;
            case 3:
              self.stepsActive = 2;
              break;
            case 4:
              self.stepsActive = 3;
              break;
            case 5:
              self.stepsActive = 4;
              break;
          }
          self.result = res.data.data;
        })
      )
    },
    // 新增一行
    newLine() {
      // this.result.materialTurnOrnamentLines.push(option)
    },
    delMaterDeiFun(index, row) {
      // if(row.id) {
      //   this.$axios.post(this.$portBYB + 'MaterialTurnOrnament/deleteWithOrderLine?id=' + row.id)
      // }
      // this.result.materialTurnOrnamentLines.splice(index, 1);
      // this.purorderSlectFilter();
    },
    // 初始化参数
    getParams() {
      // 供应商
      this.result.materialOrderData = [];
      this.result.materialTurnOrnamentLines.forEach(item => {
        this.result.materialOrderData.push({
          product_id: item.product_id,
          product_pic: item.product_pic,
          product_name: item.product_name,
          product_standard: item.product_standard,
          product_appearance: item.product_appearance,
          ornament_net_weight: item.ornament_net_weight,
          ornament_quality: item.ornament_quality,
          ornament_num: item.ornament_num,
          ornament_warehouse_id: item.ornament_warehouse_id,
          ornament_warehouse: item.ornament_warehouse,
          order_uid: item.order_uid,
          order_uid_name: item.order_uid_name
        });
      });
      this.saveData = {
        // id: this.result.id ? this.result.id: '',
        material_id: this.result.material_id,
        material_total_weight: this.result.material_total_weight,
        material_quality: this.result.material_quality,
        materialweight_quality: this.result.materialweight_quality,
        ornament_total_weight: this.result.ornament_total_weight,
        stock_position_id: this.result.stock_position_id,
        stock_position_name: this.reault.stock_position_name,
        order_uid_id: this.result.order_uid_id,
        order_uid_name: this.result.order_uid_name,
        materialTurnOrnamentLines: this.result.materialOrderData,
      };
      return true;
    },
    saveGold() {
      if (!this.getParams()) {
        return;
      }
      if (this.createStatus) {
        this.$axios
          .post(this.$portBYB + "storeIssueOrder/insert", this.saveData)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success("保存成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
      } else if (this.stepsActive === 0) {
        this.$axios
          .post(this.$portBYB + "storeIssueOrder/update", this.saveData)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success("保存成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
      }
      // self.$router.push("checkPurify");
    },
    veriAudit() {
      if(!this.getParams()) {
        return
      }
      this.$axios.post(this.$portBYB + "MaterialTurnOrnament/waitReviewed", this.saveData).then(res => {
          if(res.data.code === 200) {
            this.$message.success('保存成功');
          }else {
            this.$message.error(res.data.msg);
          }
      })
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999

.table-bt
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
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
</style>
