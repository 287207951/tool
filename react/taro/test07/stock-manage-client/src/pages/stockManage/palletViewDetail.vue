<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>托盘管理查看详细</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-table :data="tableData" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="plateName" label="托盘名称"></el-table-column>
        <el-table-column prop="plateNum" label="托盘编号"></el-table-column>
        <el-table-column prop="depositType" label="托盘类型"></el-table-column>
        <el-table-column prop="plateSumNum" label="格子数量"></el-table-column>
        <el-table-column prop="cellStore" label="单格最高容量（件）"></el-table-column>
      </el-table>
      <el-row class="itemFirst">
        <el-col :span="24">
          <div ref="tabOne" class="tabOneMain">
            <div class="tabOneDiv">
              <div
                v-for="item in sarkData.plateSumNum"
                class="tabOne"
                :style="{'width':sarkData.tabThreeWidth}"
                :key="item"
                @click="clickPallet(item)"
              >
                <div>{{returnTxt(item)}}</div>
              </div>
            </div>
          </div>
          <!-- 托盘格提示 -->
          <el-dialog :visible.sync="palletType" :close-on-click-modal="false" width="834px">
            <div class="promptStyle">
              <el-row class="palletDiv">
                <el-col :span="5">
                  <img src="../../../static/images/1.png" style="height:120px; width:150px;">
                </el-col>
                <el-col :span="5" class="palletTxtName">光身简约倒模足金戒指</el-col>
                <el-col :span="14" class="palletTxtTwo">编号：AUZ00002</el-col>
                <el-col :span="5" class="palletTxtTwo">表面工艺：钉砂</el-col>
                <el-col :span="5" class="palletTxtTwo">外观形状：圆型</el-col>
                <el-col :span="5" class="palletTxtTwo">专利号：SR223444</el-col>
                <el-col :span="4" class="palletTxtTwo">专利号：SR223444</el-col>
                <el-col :span="5" class="palletTxtTwo">车花：四叶草</el-col>
                <el-col :span="5" class="palletTxtTwo">适合人群：男</el-col>
                <el-col :span="5" class="palletTxtTwo">工费类型：每克</el-col>
                <el-col :span="4" class="palletTxtTwo">附加工费(￥)：10</el-col>
                <el-col :span="5" class="palletTxtThree">成色：足金999</el-col>
                <el-col :span="5" class="palletTxtThree">克重(g): 8</el-col>
                <el-col :span="5" class="palletTxtThree">(#): 10</el-col>
                <el-col :span="4" class="palletTxtFour">库位：A3-1</el-col>
                <el-col :span="5" class="palletTxtOne">库存数量(件)：5</el-col>
                <el-col :span="5" class="palletTxtOne">库存数量(件)：5</el-col>
                <el-col :span="5" class="palletTxtOne">最低容量(件)：2</el-col>
                <el-col :span="5" class="palletTxtOne">
                  <el-input-number v-model="palletNum" :min="0" size="mini" label="描述文字"></el-input-number>
                </el-col>
                <el-col :span="4" class="palletTxtOne">
                  <el-button type="primary" @click="palletType = false" size="mini">添加到补货购物车</el-button>
                </el-col>
              </el-row>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      reason: "", //红冲原因
      HCType: "", // 红冲状态
      allData: {}, //详细数据
      tableData: [], // 模拟
      sarkData: {}, //从插盘传值过来
      tabOneWidth: "100%", //托盘表格宽
      palletNum: 0, //补货数量
      palletSelectId: 3, //选中托盘的id
      palletType: false //托盘格产品
    };
  },
  created() {
    this.created_fun();
  },
  mounted() {
    // this.tableFun();
  },
  methods: {
    created_fun() {
      this.sarkData = JSON.parse(localStorage.sarkData);
      this.tableData = [this.sarkData];
    },
    //数值转字母字符
    returnTxt(elem) {
      return this.$publicData.charData[elem].valueS;
    },

    tableFun() {
      var self = this;
      //
      this.tabOneWidth = `calc(${((1 / this.proSizeData.rowSize) * 100).toFixed(
        2
      )}% - 2px)`;
    },
    //点击托盘修改产品
    clickPallet(ielem) {
      var self = this;
      self.palletType = true;
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
      width: 600px;
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

  .tabOneMain {
    min-width: 1200px;
    padding: 20px 3px;

    .tabOneDiv {
      width: 730px;
      margin: 0 auto;
      display: -webkit-flex; /* Safari */
      -webkit-flex-flow: row wrap; /* Safari 6.1+ */
      display: flex;
      flex-flow: row wrap;
      justify-content: center;

      .tabOne {
        border: 1px solid #333;
        margin-left: -1px;
        margin-top: -1px;
        height: 150px;
        line-height: 150px;
        text-align: center;
      }
    }
  }

  .palletDiv {
    height: 35px;
    line-height: 35px;

    .palletTxtOne {
      font-size: 14px;
      color: #333;
      margin-top: 20px;
    }

    .palletTxtTwo {
      font-size: 12px;
      color: #999;
    }

    .palletTxtThree {
      font-size: 12px;
      color: #333;
    }

    .palletTxtFour {
      font-size: 12px;
      color: #F20F34;
    }

    .palletTxtName {
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
