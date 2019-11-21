<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            <el-breadcrumb-item>提纯</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <el-row>
            <el-col :span="8">
              &nbsp
              <!-- <el-button type="primary" icon="el-icon-plus" size="small" v-if="stepsActive === 0">创建</el-button> -->
              <el-button type="danger" size="small" @click="del" v-if="(isCreate === 'goldId' && stepsActive === 0) || stepsActive === 3">删除</el-button>
              <!-- <el-button type="success" size="small"  @click="veriAudit" v-if="saveStatus">申请审核</el-button> -->
              <el-button type="success" size="small"  @click="veriAudit"  v-if="(isCreate === 'goldId' && stepsActive === 0) || stepsActive === 3">申请审核</el-button>
              <el-button type="success" size="small"  @click="auditPass" v-if="stepsActive === 1">审核通过</el-button>
              <el-button type="success" size="small"  @click="unReviewed" v-if="stepsActive === 1">驳回</el-button>
              <el-button type="warning" icon="el-icon-circle-close-outline" size="small" v-if="stepsActive === 2" @click="obsolete">作废</el-button>
            </el-col>
            <el-col :span="8">
            </el-col>
            <el-col :span="8">
              <el-steps :space="200" :active="stepsActive" finish-status="success" size="small">
                <el-step title="创建"></el-step>
                <el-step title="等待审核"></el-step>
                <el-step title="已审核"></el-step>
                <el-step title="已驳回"></el-step>
                <el-step title="已作废"></el-step>
              </el-steps>
            </el-col>
          </el-row>
        </div>
        <div id="centerGoldList">
          <el-row>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  供应商
                </div>
                <div class="flexRightDiv">
                  <el-select v-model="result.provider_id" :disabled="stepsActive == 1 || stepsActive == 2 || stepsActive == 4"  placeholder="请选择" size="small">
                    <el-option
                      size="small"
                      v-for="item in providerList"
                      :key="item.company_id"
                      :label="item.company_name"
                      :value="item.company_id">
                    </el-option>
                  </el-select>
                </div>
                <div class="flexLeftDiv" v-if="stepsActive === 1">
                  提纯成色
                </div>
                <div class="flexRightDiv" v-if="stepsActive === 1">
                   <el-input size="small" v-model="purification_condition"></el-input>
                </div>
                <div class="flexLeftDiv">
                  理论平均成色
                </div>
                <div class="flexRightDiv">
                  {{theory_average_condition}}
                </div>
                <div class="flexLeftDiv" >
                  备注
                </div>
                <div class="flexRightDiv" >
                  <el-input
                    :disabled="stepsActive == 1 || stepsActive == 2 || stepsActive == 4"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="reMark">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv" >
                  工费总计
                </div>
                <div class="flexRightDiv" >
                  {{allTotalWeight}}
                </div>
                <div class="flexLeftDiv"  v-if="!createStatus">
                  提纯到货
                </div>
                <div class="flexRightDiv"  v-if="!createStatus">
                  {{this.$api.dateGetDay(result.purification_time)}}
                </div>
                <div class="flexLeftDiv"  v-if="!createStatus">
                  单据状态
                </div>
                <div class="flexRightDiv"  v-if="!createStatus">
                  <span v-if="result.purification_state == 1">创建</span>
                  <span v-if="result.purification_state == 2">等待审核</span>
                  <span v-if="result.purification_state == 3">已审核</span>
                  <span v-if="result.purification_state == 4">已驳回</span>
                  <span v-if="result.purification_state == 5">作废</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv"  v-if="!createStatus">
                  提纯单号
                </div>
                <div class="flexRightDiv"  v-if="!createStatus">
                  {{result.purification_code}}
                </div>
                <div class="flexLeftDiv" v-if="!createStatus">
                  创建时间
                </div>
                <div class="flexRightDiv"  v-if="!createStatus">
                  {{this.$api.dateGetDay(result.update_time)}}
                </div>
                <div class="flexLeftDiv" >
                  制单人
                </div>
                <div class="flexRightDiv">
                  {{result.order_uid_name}}
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="flexSaveBtn">
                <!-- <el-button type="primary"  v-if="stepsActive === 0" icon="el-icon-refresh" size="small" @click="saveGold">保存</el-button> -->
                <el-button type="primary" v-if="stepsActive === 0 || stepsActive === 3" icon="el-icon-refresh" size="small" @click="saveGold">保存</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <hr/>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-table
                id="table1"
                :data="result.purificationMaterialInventoryOrderLines"
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
                  header-align='center'
                  align='center'
                  label="名称">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.material_inventory_order_id" :disabled="stepsActive == 1 || stepsActive == 2 || stepsActive == 4" placeholder="请选择" size="medium" @change="selectData(scope.row, scope.$index)">
                      <el-option
                        :disabled="item.disabled"
                        size="small"
                        v-for="item in purMaOrderList"
                        :key="item.material_inventory_order_id"
                        :label="item.material_name"
                        :value="item.material_inventory_order_id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="net_weight"
                  sortable
                  header-align='center'
                  align='center'
                  label="净重">
                </el-table-column>
                <el-table-column
                  prop="discount_weight"
                  sortable
                  header-align='center'
                  align='center'
                  label="折重">
                </el-table-column>
                <el-table-column
                  prop="average_quality"
                  sortable
                  header-align='center'
                  align='center'
                  label="验料平均成色">
                </el-table-column>
                <el-table-column
                  v-if="stepsActive === 0"
                  header-align='center'
                  align="center"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="danger"
                      @click="deletepurMaOrder(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-bt" v-if="stepsActive === 0 || stepsActive === 3">
                <el-button type="primary" class="createGoldBtn" plain size="small" @click.native="newLine" >创建新一行</el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <el-table
                :data="result.purificationOrderLines"
                :summary-method="getSumtable"
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
                  header-align='center'
                  align='center'
                  width="150"
                  label="提纯类型">
                  <template slot-scope="scope">
                    <div v-if="scope.row.purification_type == 1">足金9999</div>
                    <div v-if="scope.row.purification_type == 2">足金99999</div>
                  </template> 
                </el-table-column>
                <el-table-column
                  prop="purification_net_weight"
                  sortable
                  header-align='center'
                  align='center'
                  label="净重">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.purification_net_weight" :disabled="stepsActive == 1 || stepsActive == 2 || stepsActive == 4"  @input="totalCount(scope.row, scope.$index)"  placeholder="净重"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="wage"
                  sortable
                  header-align='center'
                  align='center'
                  label="工费">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.wage" :disabled="stepsActive == 1 || stepsActive == 2 || stepsActive == 4" @input="totalCount(scope.row)"  placeholder="工费"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="wage_total"
                  sortable
                  header-align='center'
                  align='center'
                  label="工费总计">
                </el-table-column>
                <el-table-column
                  header-align='center'
                  label="备注">
                  <template slot-scope="scope">
                    <el-input
                      :disabled="stepsActive == 1 || stepsActive == 2 || stepsActive == 4"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="备注"
                      v-model="scope.row.note">
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
	    </div>
</template>
<script>
export default {
  data() {
    return {
      goldListId: "", //金料单编号
      createStatus: "",
      saveStatus: "",
      purification_condition: "", //提存成色
      theory_average_condition: "0", //理论平均成色（计算）
      reMark: "", //备注
      result: {
        purificationMaterialInventoryOrderLines: [],
        purificationOrderLines:[{
          purification_type: 1,
          purification_net_weight: 0,
          wage: 0
        },{
          purification_type: 2,
          purification_net_weight: 0,
          wage: 1.5
      }]
      }, //页面数据
      providerList: [], //供应商
      purMaOrderList: [], //新增一行
      allTotalWeight: 0,
      stepsActive: 0, //提纯单状态
      input: "", //创建新金料单数据
      saveData: "", //点击保存数据
      saveDataId: '', // 保存时返回的ID
      isCreate: ""   // 判断页面是创建还是展示的
    };
  },
  created() {
    this.created_fun();
    this.getState()
  },
  methods: {
    getState() {
      const query =  this.$route.query
      query.created && (this.createStatus = true);
      let search = window.location.hash.split('=')[0];
      this.isCreate = search.slice(search.indexOf('?') + 1);
    },
    created_fun() {
      let self = this;
      self.goldListId = self.$route.query.goldId;
      // 获取供应商select
      this.$axios.post(this.$portMain + "/client/clients").then(res => {
        self.providerList = res.data.data.data;
      });
      // 获取新增一行select
      this.$axios.get(this.$portBYB + "purificationOrder/materialstockList").then(res => {
        res.data.data.forEach((item, index) => {
          item.average_quality = item.quality
          item.discount_weight = this.$api.returnFloat(item.net_weight * (item.average_quality / 100))
          item.material_inventory_order_id = item.id
          delete item.id
        })
        self.purMaOrderList = res.data.data;
        if(self.purMaOrderList.length === 0) {
          return
        }
      });
      if (!self.goldListId) { 
        return;
      }
      let orderFromParams = {
        PRS: {
          orderId: this.goldListId
        }
      }
      this.$axios.get(this.$portBYB + "purificationOrder/orderFrom", orderFromParams)
        .then(res => {
          this.disposeData(res)
        });
    },
    // 金料库存单明细新增一行
    newLine() {
      if(this.purMaOrderList.length === 0) {
        return
      }
      let option = JSON.parse(JSON.stringify(this.purMaOrderList[0]))
      this.result.purificationMaterialInventoryOrderLines.push(option)
      this.totalCountTable1()
      this.restore()
    },
    // 删除金料
    deletepurMaOrder(index, row) {
      let self =  this;
      if(row.id) {
        this.$axios.post(this.$portBYB + 'purificationOrder/deleteWithMaterialInventoryOrderLine?id=' + row.id)
      }
      this.result.purificationMaterialInventoryOrderLines.splice(index, 1)
      this.totalCountTable1()
      this.restore()
      // 删除时将purMaOrderList下拉框数据设置为
      this.purMaOrderList.forEach(arr => {
        arr.disabled = false;
        self.result.purificationMaterialInventoryOrderLines.forEach(selectId => {
          if (arr.material_inventory_order_id == selectId.material_inventory_order_id) {
            arr.disabled = true;
          }
        })
      });
    },
    // 还原提纯单数据
    restore() {
      this.result.purificationOrderLines[0].purification_net_weight = this.purification_line_total_net_weight
      this.result.purificationOrderLines[1].purification_net_weight = 0
    },
    // 计算提存单
    totalCount(row, index) {
      let allWeight = this.purification_line_total_net_weight,
          orderLines = this.result.purificationOrderLines
      if(row.purification_net_weight > allWeight) {
        this.restore()
        this.$message.error('提纯单总净重不能超过金料总净重')
      }
      if(index === 0) {
        this.result.purificationOrderLines[1].purification_net_weight = allWeight - row.purification_net_weight
      }else if(index === 1) {
        this.result.purificationOrderLines[0].purification_net_weight = allWeight - row.purification_net_weight
      }
      row.wage_total = this.$api.returnFloat(row.purification_net_weight * row.wage)
      this.totalCountTable2()
    },
    getSummaries(param) {   // // 表尾合计行自定义方法一
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || index === 4 || index === 3) {
          sums[index] = "";
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
      return sums;
    },
    getSumtable(param) {   // 表尾合计行自定义方法二
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 3) {
          sums[index] = "";
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
      return sums;
    },
    // 金料合计
    totalCountTable1() {
      let length = this.result.purificationMaterialInventoryOrderLines.length
      this.theory_average_condition = 0  //提纯理论平均色
      this.purification_line_total_net_weight = 0 //提纯明细总净重
      this.purification_fold_the_heavy = 0 //提纯总折重
      this.result.purificationMaterialInventoryOrderLines.forEach((item) => {
        this.theory_average_condition += item.average_quality
        this.purification_line_total_net_weight += item.net_weight
        this.purification_fold_the_heavy += item.discount_weight
      })
      this.theory_average_condition = (this.theory_average_condition/length).toFixed(2)
    },
    // 提纯合计
    totalCountTable2() {
      this.allTotalWeight = 0, //提纯总工费
      this.purification_total_net_weight = 0 //提纯总净重
      this.result.purificationOrderLines.forEach((item) => {
        if (item.wage_total == undefined) {
          item.wage_total = 0;
        }
        this.allTotalWeight += parseFloat(item.wage_total)
        this.purification_total_net_weight += item.purification_net_weight
      })
    },
    // 初始化参数
    getParams() {
      let proName
      this.providerList.forEach(item => {
        if(item.company_id == this.result.provider_id) {
          proName = item.company_name
        }
      })

      // 提纯金料库存单明细
      if(!this.$v.valiLength(this.result.purificationMaterialInventoryOrderLines)) {
        this.$message.error('请填写提纯金料库存单明细')
        return false
      }

      if(!this.result.provider_id) {
        this.$message.error('请填写供应商信息')
        return false
      }

      // let purOrderStatus = false
      // this.result.purificationOrderLines.forEach(item => {
      //   if(!this.$v.valiNull(item.purification_net_weight)) {
      //     this.$message.error('请填写提纯单明细净重')
      //     purOrderStatus = true
      //   }else {
      //     purOrderStatus = false
      //   }
      //   if(!this.$v.valiNull(item.wage)) {
      //     this.$message.error('请填写提纯单工费')
      //     purOrderStatus = true
      //   }else {
      //     purOrderStatus = false
      //   }
      // })
      // if(purOrderStatus) { return false}

      this.result.purOrderParams = []
      this.result.purificationOrderLines.forEach((item) => {
        // if(item.purification_net_weight == 0) {
        //     return 
        // }
        item.order_uid = '1'
        item.order_uid_name = '1'
        this.result.purOrderParams.push({
          id: item.id,
          purification_type: item.purification_type,
          purification_net_weight: item.purification_net_weight,
          wage: item.wage,
          wage_total: item.wage_total,
          order_uid: item.order_uid,
          order_uid_name: item.order_uid_name
        })
      },)

      this.result.purMaOrderParams = []
      this.result.purificationMaterialInventoryOrderLines.forEach((item) => {
        this.result.purMaOrderParams.push({
          id: item.id,
          material_inventory_order_id: item.material_inventory_order_id,
          material_name: item.material_name,
          material_id: item.material_id,
          net_weight: item.net_weight,
          average_quality: item.average_quality,
          quality: item.quality,
          discount_weight: item.discount_weight,
          order_uid: item.order_uid,
          order_uid_name: item.order_uid_name
        })
      })

      this.saveData = {
        id: this.goldListId,
        purification_condition: this.purification_condition,
        provider_id: this.result.provider_id,
        provider_name: proName,
        purification_state: this.stepsActive + 1,
        purification_total_net_weight: this.purification_total_net_weight,
        purification_line_total_net_weight: this.purification_line_total_net_weight,
        purification_fold_the_heavy: this.purification_fold_the_heavy,
        theory_average_condition: this.theory_average_condition,
        total_wage: this.allTotalWeight,
        order_uid: 45,
        order_uid_name: 'tese',
        note: this.reMark,
        auditor_uid: 1,
        auditor_name: 1,
        purificationMaterialInventoryOrderLines: this.result.purMaOrderParams,
        purificationOrderLines: this.result.purOrderParams,
        purification_code: this.result.purification_code
      }

      return true
    },
    disposeData(res) {
      let resArr = [];
      this.stepsActive = Number(res.data.data.purification_state) - 1
      res.data.data.purificationOrderLines.forEach((item, index) => {
        resArr.push(Number(item.purification_type))
      });
      if(resArr.length === 1 && resArr[0] === 1) {
        res.data.data.purificationOrderLines.push(this.result.purificationOrderLines[1])
      }
      if(resArr.length === 1 && resArr[0] === 2) {
        res.data.data.purificationOrderLines.unshift(this.result.purificationOrderLines[0])
      }
      if(resArr.length === 0) {
        res.data.data.purificationOrderLines = this.result.purificationOrderLines
      }
      this.result = res.data.data;
      this.totalCountTable1() //理论平均成色
      this.totalCountTable2() //总净重
    },
    // 点击保存
    saveGold() {
      if(!this.getParams()) {
          return
      }
      if(this.createStatus) {
        this.$axios.post(this.$portBYB + "purificationOrder/insert", this.saveData).then(res => {
            if(res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.disposeData(res)
              // this.saveStatus = true
              this.saveDataId = res.data.data.id
              this.$router.push({ path: 'editPurify', query: { goldId: res.data.data.id }});
              // window.location.reload();
              this.created_fun();
              this.getState()
            }else {
              this.$message.error(res.data.msg);
            }
        })
        this.createStatus = false;
      }else if(this.stepsActive === 0) {
        this.$axios.post(this.$portBYB + "purificationOrder/update", this.saveData).then(res => {
            if(res.data.code === 200) {
              this.$message.success(res.data.msg);
              // this.saveStatus = true
              //this.saveDataId = res.data.data.id
              //this.$router.push({ path: 'editPurify', query: { goldId: res.data.data.id }});
              // window.location.reload();
              this.created_fun();
              this.getState()
            }else {
              this.$message.error(res.data.msg);
            }
        })
      } else if (this.stepsActive == 3) {
        this.$axios.post(this.$portBYB + "purificationOrder/update", this.saveData).then(res => {
            if(res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.disposeData(res)
              // this.saveStatus = true
              this.saveDataId = res.data.data.id
              this.$router.push({ path: 'editPurify', query: { goldId: res.data.data.id }});
              // window.location.reload();
              this.created_fun();
              this.getState()
            }else {
              this.$message.error(res.data.msg);
            }
        })
      }
    },
    obsolete() {
      if(!this.getParams()) {
        return
      }
      this.$axios
        .post(this.$portBYB + "purificationOrder/cancellation", this.saveData).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000)
          } else {
            this.$message.error(res.data.msg);
          }        
      })
    },
    // 提交审核
    veriAudit() {
      if(!this.getParams()) {
        return
      }
      this.saveData.id = this.goldListId;
      this.$axios.post(this.$portBYB + "purificationOrder/waitReviewed", this.saveData).then(res => {
          if(res.data.code === 200) {
            this.$message.success(res.data.msg);
            setTimeout(() => {
              this.$router.push('checkPurify')
            }, 2000)   
          }else {
            this.$message.error(res.data.msg);
          }
      })
    },
    // 审核通过
    auditPass() {
      if(!this.getParams()) {
        return
      }
      this.$axios.post(this.$portBYB + "purificationOrder/audit", this.saveData).then(res => {
          if(res.data.code === 200) {
            this.$message.success(res.data.msg);
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000)   
          }else {
            this.$message.error(res.data.msg);
          }
      })
    },
    // 驳回
    unReviewed() {
      let self = this;
      let data = {id: this.goldListId}
      this.$axios.post(this.$portBYB + "purificationOrder/unReviewed", data).then(res => {
          if(res.data.code === 200) {
            this.$message.success(res.data.msg);
            setTimeout(() => {
              this.$router.go(-1)
            }, 2000)   
          }else {
            this.$message.error(res.data.msg);
          }
      })
    },
    del() {  //删除
      let self = this;
      let params = {
        id: this.goldListId
      }
      this.$axios
        .post(this.$portBYB + "purificationOrder/delete", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(() => {
              self.$router.push('checkPurify')
            }, 2000)
          } else {
            self.$message.error(res.data.msg);
          }
        })
    },
    selectData(item, index) {  // 创建新一行下拉事件
      let self = this;
      this.purMaOrderList.forEach(arr => {
        arr.disabled = false;
        self.result.purificationMaterialInventoryOrderLines.forEach(selectId => {
          if (arr.material_inventory_order_id == selectId.material_inventory_order_id) {
            arr.disabled = true;
          }
        })
      });
      let one = {}
      this.purMaOrderList.forEach(it => {
        if(it.material_inventory_order_id == item.material_inventory_order_id) {
          one = JSON.parse(JSON.stringify(it));
        }
      })
      this.result.purificationMaterialInventoryOrderLines.splice(index, 1, one)
      this.totalCountTable1()
      this.restore()
    }
  },

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
        // text-align right
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
  }

  .createGoldBtn {
    margin: 20px 0 10px 0;
  }

  .table-bt {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
