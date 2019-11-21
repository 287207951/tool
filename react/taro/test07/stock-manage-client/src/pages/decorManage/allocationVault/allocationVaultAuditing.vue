<template>
  <div class="outOfStock" ref="creatSendMaterial">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>调拨出库单列表详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>

      <div>
        <el-table :data="data" style="width: 100%">
          <el-table-column prop="label" label="调拨单号" width="180"></el-table-column>
          <el-table-column prop label="接收部门" width="180"></el-table-column>
          <el-table-column prop label="发起部门"></el-table-column>
          <el-table-column prop label="数量"></el-table-column>
          <el-table-column prop label="毛重(g）"></el-table-column>
          <el-table-column prop label="净重(g)"></el-table-column>
          <el-table-column prop label="操作人"></el-table-column>
          <el-table-column prop label="制单时间"></el-table-column>
          <el-table-column prop label="操作" width="100">
            <template slot-scope="scope">
              <span style="color:#F26D0F">待审核</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bigLine"></div>

      <el-row class="reasonWrap">
        <el-col :span="12">
          <span class="leftTitle">调拨原因：</span>
          <span>调拨原因12</span>
        </el-col>
        <el-col :span="12" class="itemRight">
          <el-button type="danger" size="small" plain>驳回</el-button>
          <el-button type="primary" size="small">审核通过</el-button>
        </el-col>
        <el-col :span="12" class="stepWrap">
          <el-steps :active="1" finish-status="success">
            <el-step title="客户" description></el-step>
            <el-step title="调拨出库" description></el-step>
          </el-steps>
        </el-col>
      </el-row>
    </div>

    <div class="container">
      <div class="productWarp">
        <!-- <img v-if="item.url" :src="$portImg+item.url" class="productPic"> -->
        <img src="../../../../static/images/img-noimg.png" class="productPic">
        <div class="productDes">
          <div class="proUL">
            <div class="proTitel">时尚精品珠花戒指</div>
            <div class="proLI">
              <span class="left">编号：</span>
              <span class="right">AUZ00002</span>
            </div>

            <div class="proLI">
              <span class="left">克重：</span>
              <span class="right">8.9g</span>
            </div>
          </div>

          <div class="proUL">
            <div class="proLI">
              <span class="left">产品成色：</span>
              <span class="right">999</span>
            </div>

            <div class="proLI">
              <span class="left">产品材质：</span>
              <span class="right">足金</span>
            </div>

            <div class="proLI">
              <span class="left">生产工艺：</span>
              <span class="right">油压</span>
            </div>
          </div>

          <div class="proUL">
            <div class="proLI">
              <span class="left">产品类别：</span>
              <span class="right">戒指</span>
            </div>

            <div class="proLI">
              <span class="left">调拨数量：</span>
              <span class="right">99</span>
            </div>

            <div class="proLI">
              <span class="left">调拨重量：</span>
              <span class="right">99g</span>
            </div>
          </div>

          <!-- <div class="SUKUL">
              <div class="proLI">
                <span class="left">库存数据：</span>
                <span class="right">6</span>
              </div>

              <div class="proLI">
                <span class="left">库存毛重：</span>
                <span class="right">120.36g</span>
              </div>

              <div class="proLI">
                <span class="left">库存净重：</span>
                <span class="right">118.12g</span>
              </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderAllData: {},
      retreatNumber: "",
      mock: "",
      data: [
        {
          label: 12,
          label1: 66
        }
      ],
      totalWeight: 0,
      nowTime: "",
      priceTxt: "",
      ceditSumNum: 0
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // let self = this;
      // this.retreatNumber = this.$route.query.stockNumber;
    },

    //表格1底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              let res = (Number(prev) + Number(curr)).toFixed(2);
              return res;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
        // if (index === 5 || index === 3) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return "";
        //     }
        //   }, 0);
        //   //sums[index] += "";
        // }
      });
      return sums;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.outOfStock {
  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .itemRight {
    text-align: right;
  }

  .bigLine {
    height: 16px;
    background: #e6ebf5;
  }

  .reasonWrap {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(35, 36, 38, 1);
    padding-top: 19px;

    .leftTitle {
      color: #8A9199;
    }
  }

  .stepWrap {
    margin-top: 38px;
  }

  .container {
    padding-top: 24px;

    .productWarp {
      // width: 1px;
      height: 120px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(229, 241, 255, 1);
      box-sizing: border-box;
      display: flex;
      padding: 16px 24px 14px 24px;
      margin-bottom: 8px;

      .productPic {
        width: 120px;
        height: 90px;
      }

      .productDes {
        // display: inline-block;
        margin-left: 16px;
        height: 76px;
        width: 100%;
        display: flex;

        .proTitel {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          margin-bottom: 11px;
        }

        .proUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
          // margin-right: 224px;
          width: 24%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .SUKUL {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 36, 38, 1);
        }

        .proLI {
          margin-bottom: 11px;

          .left {
            color: #889199;
          }

          .right {
          }
        }
      }
    }
  }
}
</style>
