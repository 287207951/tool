<template>
  <div>
    <div v-if="proLossObj.proData.proList.length > 0">
      <!-- 头部 -->
      <div class="header">
        <div>{{proLossObj.proData.orderTit}}</div>
        <div>单号: {{proLossObj.proData.orderNo}}</div>
        <div>克重差异: {{proLossObj.proData.adjNum}}g</div>
        <div class="outDetail">
          <div class="cursor" @click="exportFun(proLossObj.proData.orderNo)">导出Excel</div>
          <div class="cursor" @click="changeDetailProfit">
            查看详情
            <i class="el-icon-arrow-up" v-if="profitStatus"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </div>
        </div>
      </div>
      <!-- 筛选 -->
      <div v-if="profitStatus">
        <!-- <el-row style="margin-bottom: 8px;">
          <el-col :span="22">
            <span class="smallTitle mL24">金料成色</span>
            <el-select
              v-model="mock"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="searchFun"
            >
              <el-option
                v-for="item in []"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <span class="smallTitle mL24">产品分类</span>
            <el-select
              v-model="one"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="searchFun"
            >
              <el-option v-for="item in []" :key="item.code" :label="item.val" :value="item.code"></el-option>
            </el-select>

            <span class="smallTitle mL24">克重差异</span>
            <el-select
              v-model="processCode"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="searchFun"
            >
              <el-option v-for="item in []" :key="item.code" :label="item.val" :value="item.code"></el-option>
            </el-select>
          </el-col>
        </el-row>-->

        <!-- 产品 -->
        <ProLossProductItem
          v-for="(item, index) in proLossObj.proData.proList"
          :key="index"
          :productData="item"
        ></ProLossProductItem>
      </div>
    </div>

    <div v-if="proLossObj.lossData.proList.length > 0">
      <!-- 头部 -->
      <div class="header">
        <div>{{proLossObj.lossData.orderTit}}</div>
        <div>单号: {{proLossObj.lossData.orderNo}}</div>
        <div>克重差异: {{proLossObj.lossData.adjNum}}g</div>
        <div class="outDetail">
          <div class="cursor" @click="exportFun(proLossObj.lossData.orderNo)">导出Excel</div>
          <div class="cursor" @click="changeDetailLoss">
            查看详情
            <i class="el-icon-arrow-up" v-if="lossStatus"></i>
            <i class="el-icon-arrow-down" v-else></i>
          </div>
        </div>
      </div>
      <!-- 筛选 -->
      <div v-if="lossStatus">
        <!-- <el-row style="margin-bottom: 8px;">
          <el-col :span="22">
            <span class="smallTitle mL24">金料成色</span>
            <el-select
              v-model="mock"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="searchFun"
            >
              <el-option
                v-for="item in []"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

            <span class="smallTitle mL24">产品分类</span>
            <el-select
              v-model="one"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="searchFun"
            >
              <el-option v-for="item in []" :key="item.code" :label="item.val" :value="item.code"></el-option>
            </el-select>

            <span class="smallTitle mL24">克重差异</span>
            <el-select
              v-model="processCode"
              placeholder="请选择"
              size="small"
              class="width200"
              @change="searchFun"
            >
              <el-option v-for="item in []" :key="item.code" :label="item.val" :value="item.code"></el-option>
            </el-select>
          </el-col>
        </el-row>-->

        <!-- 产品 -->
        <ProLossProductItem
          v-for="(item, index) in proLossObj.lossData.proList"
          :key="index"
          :productData="item"
        ></ProLossProductItem>
      </div>
    </div>
    <a ref="xlsDownloadA"></a>
  </div>
</template>
<script>
export default {
  props: {
    proLossObj: {
      type: Object
    }
  },
  data() {
    return {
      profitStatus: false,
      lossStatus: false
    };
  },
  mounted() {
    const {
      proData: { proList },
      lossData: { proList: lossProList }
    } = this.proLossObj;
    if (proList.length > 0) {
      this.profitStatus = true;
    }
    if (proList.length === 0 && lossProList.length > 0) {
      this.lossStatus = true;
    }
  },
  methods: {
    searchFun() {},

    //导出
    exportFun(option) {
      let self = this;
      let params = {
        PRS: {
          bizNo: option
        }
      };
      this.$axios
        .get(this.$portMain + "/checkStock/downCheckPro", params)
        .then(function(res) {
          if (res.data.code == 200) {
            let baseFile =
              "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
              res.data.data;
            self.fname =
              "调差." +
              self.$publicData.base61File[self.$api.getContentType(baseFile)];
            let blob = self.$api.getBlob(baseFile);
            self.$refs.xlsDownloadA.download = self.fname;
            self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
            self.$refs.xlsDownloadA.click();
            // let xlsDownloadA = document.createElement("a");
            // xlsDownloadA.download = self.fname;
            // xlsDownloadA.href = URL.createObjectURL(blob);
            // xlsDownloadA.click();
          } else {
            self.$message.error(res.msg);
          }
        });
    },

    changeDetailProfit() {
      this.profitStatus = !this.profitStatus;
    },

    changeDetailLoss() {
      this.lossStatus = !this.lossStatus;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  height: 40px;
  background: #E4EAF0;
}

.outDetail {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.outDetail > div {
  margin-left: 20px;
  color: red;
}

.cursor {
  cursor: pointer;
}

.mL24 {
  margin-left: 24px;
}
</style>
