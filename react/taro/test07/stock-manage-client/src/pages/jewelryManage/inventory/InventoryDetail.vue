<template>
  <div>
    <section>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
        <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
        <el-breadcrumb-item>盘点-盘点详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="hr" />

      <!-- 头部 -->
      <el-table :data="headTableData" style="width: 100%">
        <el-table-column prop="bizNo" label="盘点单号"></el-table-column>
        <el-table-column prop="wareName" label="盘点仓库"></el-table-column>
        <el-table-column prop="sarkName" label="盘点库柜"></el-table-column>
        <el-table-column prop="createTime" label="操作时间"></el-table-column>
        <el-table-column prop="creator" label="操作人"></el-table-column>
        <el-table-column prop="checkStatus" label="盘点结果">
          <template slot-scope="scope">
            <span v-if="scope.row.checkStatus === 0" style="color: #333">正常</span>
            <span v-if="scope.row.checkStatus === 1" style="color: #F20F34">非正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="调差">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">--</span>
            <span v-if="scope.row.status === 1">已调差</span>
            <span v-if="scope.row.status === 2" style="color: #F2930F">已作废</span>
            <span v-if="scope.row.status === 3" style="color: #F26D0F">待调差</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="noteWrap" v-if="allData.cs.remark">
        <span>盘点备注：</span>
        {{allData.cs.remark}}
      </div>
      <div class="bigLine"></div>
    </section>

    <div class="productWrap">
      <div class="skuTitel" v-if="allData.cs.status === 1">盈亏列表</div>
      <div class="skuTitel" v-else>差异列表</div>
      <div class="flexB">
        <div></div>
        <div v-if="allData.cs.status === 0 || allData.cs.status === 1 || allData.cs.status === 2">
          <el-button size="small" type="primary" @click="cancal">取消</el-button>
        </div>
        <div v-if="allData.cs.status === 3">
          <el-button size="small" type="primary" plain @click="cancal">取消</el-button>
          <el-button size="small" type="primary" @click="adjustment">调差</el-button>
          <el-button size="small" type="warning" @click="toVoid">作废</el-button>
        </div>
      </div>

      <div style="height: 20px"></div>

      <!-- 未调差 -->
      <div v-if="allData.cs.status !== 1">
        <ProductItem v-for="(item, index) in allData.proList" :key="index" :productData="item"></ProductItem>
      </div>

      <!-- 盈亏 begin  -->
      <div v-if="adjType && allData.cs.status === 1">
        <ProfitLoss :proLossObj="proLossObj"></ProfitLoss>
      </div>
      <!-- 盈亏 end -->
    </div>
  </div>
</template>

<script>
import { ProductItem, ProfitLoss } from "./acommon/index";

export default {
  components: {
    ProductItem,
    ProfitLoss
  },
  data() {
    return {
      id: "", // 盘点单号
      allData: {
        cs: {
          status: 1 // 状态 0 正常 1 已调差 2 已作废 3 待调差
        }
      },
      headTableData: [], // 头部表格
      proList: [], // 盘点数据
      proLossObj: {}, // 盈亏对象
      adjType: false
    };
  },
  created() {
    // 获取页面数据
    this.id = this.$route.query.id;
    this.displayAllData();
  },

  mounted() {},

  methods: {
    displayAllData() {
      let params = {
        PRS: {
          id: this.id
        }
      };
      this.$axios.get(this.$portMain + "/checkStock/get", params).then(res => {
        if (res.data.code == 200) {
          const {
            data,
            data: { cs }
          } = res.data;
          cs.createTime = this.$api.dateGetDayTime(cs.createTime);
          this.headTableData.splice(0, 1, cs);
          data.proList.forEach(item => {
            item.proName = item.proBasics.proName;
            item.skuId = item.proBasics.proNumber;
            item.amounts = item.cksAmount;
            item.inventorySuttle = item.cksSuttle;
            item.calcAmount = item.calcAmount;
            item.calcSuttle = item.calcSuttle;
            item.oneItemsCode = item.proBasics.oneItemsCode;
            item.map = item.proSpecData;
            item.map.proList = item.map.ProList;
          });
          this.allData = data;
          this.hanldProfitLossData(data.proList);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 处理盈亏数据
    hanldProfitLossData(options) {
      let proLossObj = {
          proData: {
            orderTit: `盘盈单`,
            orderNo: ``,
            adjNum: ``
          },
          lossData: {
            orderTit: `盘亏单`,
            orderNo: ``,
            adjNum: ``
          }
        },
        profitList = [],
        lossList = [],
        proNum = 0,
        lossNum = 0;
      options.forEach(item => {
        if (item.type === 1) {
          profitList.push(item);
          proNum += item.suttle;
          proLossObj.proData = {
            orderTit: `盘盈单`,
            orderNo: item.bizNo,
            adjNum: parseFloat(proNum.toFixed(2))
          };
        }
        if (item.type === 2) {
          lossList.push(item);
          lossNum += item.suttle;
          proLossObj.lossData = {
            orderTit: `盘亏单`,
            orderNo: item.bizNo,
            adjNum: parseFloat(lossNum.toFixed(2))
          };
        }
      });
      proLossObj.proData.proList = profitList;
      proLossObj.lossData.proList = lossList;
      this.proLossObj = proLossObj;
      this.adjType = true;
    },

    cancal() {
      this.$router.go(-1);
    },

    // 调差
    adjustment() {
      this.$api.refClick(this).then(res => {
        let params = {
          id: this.id
        };
        this.$api
          .urlPost(this.$portMain + "/checkStock/adj", params)
          .then(res => {
            if (res.data.code == 200) {
              this.displayAllData();
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          });
      });
    },

    // 作废
    toVoid() {
      this.$api.refClick(this).then(res => {
        let params = {
          id: this.id
        };
        this.$api
          .urlPost(this.$portMain + "/checkStock/tovoid", params)
          .then(res => {
            if (res.data.code == 200) {
              this.$router.go(-1);
            } else {
            }
          });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrap {
  padding: 20px;
}

.flexB {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.steps {
  flex: 1;
}

.empty {
  flex: 1;
}

.btn {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.btnItem {
  margin-left: 24px;
}

.listTit {
  font-weight: blod;
  font-size: 16px;
  margin-top: 50px;
  margin-bottom: 16px;
}

.infoWrap {
  padding: 20px;
}

.noteWrap {
  font-size: 16px;
  font-weight: 400;
  color: #232426;
  margin: 22px 0;

  span {
    color: #8A9199;
  }
}

.refreshHead {
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;

  span {
    color: red;
  }

  .itemWrap {
    margin: 0 33px;
  }
}

.productWrap {
  margin-top: 29px;
  margin-bottom: 20px;

  .skuTitel {
    font-size: 16px;
    font-weight: bold;
    color: #232426;
    margin-bottom: 16px;
  }
}

.noteWrap {
  font-size: 16px;
  font-weight: 400;
  color: #232426;
  margin: 22px 0;

  span {
    color: #8A9199;
  }
}
</style>
