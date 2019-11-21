<template>
  <div class="conBigDiv customTable">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>料调拨</el-breadcrumb-item>
      <el-breadcrumb-item>库存转换详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24" class="itemRight">
          <el-button type="danger" size="small" @click="printFun">打印</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>转换单号：</span>
            <span>{{allData.orderCode}}</span>
          </div>
          <div style="margin-top:12px">
            <span>转换部门：</span>
            <span>{{allData.departName}}</span>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>制单人：</span>
            <span>{{allData.createName}}</span>
          </div>
          <div style="margin-top:12px">
            <!-- <span>接收单位：</span>
            <span>{{allData.customer_name}}</span>-->
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>日期：</span>
            <span>{{allData.createTime}}</span>
          </div>
          <div style="margin-top:12px" v-if="allData.note">
            <span>备注：</span>
            <span>{{allData.note}}</span>
          </div>
        </el-col>
      </el-row>

      <div style="display: flex;">
        <!-- 表格1 -->
        <el-table :data="allDataArr" style="width: 50%; margin-top: 20px">
          <el-table-column label="原库存" header-align="center">
            <el-table-column prop="old_output_counter" label="原库存-存货柜" width="150"></el-table-column>
            <el-table-column prop="old_stock_kind" label="原库存-料种类"></el-table-column>
            <el-table-column prop="old_stock_type" label="原库存-料类型"></el-table-column>
            <el-table-column prop="old_input_pur_weight" label="原库存-毛重(g)"></el-table-column>
            <el-table-column prop="old_input_net_weight" label="原库存-净重(g)"></el-table-column>
          </el-table-column>
        </el-table>

        <!-- 表格2 -->
        <el-table :data="allDataArr" style="width: 50%; margin-top: 20px">
          <el-table-column label="新库存" header-align="center">
            <el-table-column prop="new_output_counter" label="新库存-存货柜"></el-table-column>
            <el-table-column prop="new_stock_kind" label="新库存-料种类"></el-table-column>
            <el-table-column prop="new_stock_type" label="新库存-料类型"></el-table-column>
            <el-table-column prop="new_output_pur_weight" label="新库存-毛重(g)"></el-table-column>
            <el-table-column prop="new_output_net_weight" label="新库存-净重(g)"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 打印 -->
    <div v-show="false">
      <printTPTen :billData="allData" ref="myComp"></printTPTen>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allData: {},
      allDataArr: [],
      nowTime: "",
      promptType: false //提示状态
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      const { item } = this.$route.params;
      this.allData = JSON.parse(item);
      this.allDataArr = this.getAllDataArr();
    },

    getAllDataArr() {
      return [this.allData];
    },

    //打印
    printFun() {
      this.nowTime = this.$moment().format("YYYY年MM月DD日 HH:mm:ss");
      this.$refs.myComp.compPrintFun();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .itemRight {
    text-align: right;
  }

  .itemFirst {
    margin-top: 22px;
    margin-bottom: 20px;
    line-height: 32px;
    font-size: 14px;

    span:first-child {
      color: #8A9199;
    }

    span:last-child {
      color: #222426;
    }

    .noteStyle {
      display: flex;
      justify-content: flex-end;
      // margin-top 10px
    }

    .textAreaStlye {
      width: 86%;
      height: 76px;
      border-radius: 4px;
      border: 1px solid #CFD4E6;
      resize: none;
    }

    .completeDes {
      width: 82.5%;
      display: inline-block;
      text-align: left;
    }
  }

  .promptStyle {
    position: relative;

    .line {
      width: 480px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textAreaStyle {
      width: 433px;
      height: 120px;
      resize: none;
      background: rgba(240, 247, 255, 1);
    }
  }
}
</style>

<style>
.customTable .el-table__header th {
  background-color: #f5f7fa;
}
</style>
