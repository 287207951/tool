<template>
  <div class="pt10">
    <el-row
      class="tabOne"
      v-for="(ielem,indOne) in baoData"
      :key="indOne"
      @click.native="packDetailFun(ielem)"
    >
      <el-col :span="3">
        包号
        <span class="txtBlack">{{ielem.packId}}</span>
      </el-col>
      <el-col :span="3">
        金料成色
        <span class="txtBlack">{{ielem.conditi}}</span>
      </el-col>
      <el-col :span="3">
        类别
        <span class="txtBlack">{{ielem.one}}</span>
      </el-col>
      <el-col :span="2">
        总数量
        <span class="txtBlack">{{ielem.packTotalAmount}}</span>
      </el-col>
      <el-col :span="2">
        净重
        <span class="txtBlack">{{ielem.packTotalSuttle}}</span>
      </el-col>
      <el-col :span="2">
        毛重
        <span class="txtBlack">{{ielem.packNetTotalWeight}}</span>
      </el-col>
      <el-col :span="3">
        毛重差异
        <span class="txtBlack">{{ielem.weightDif?ielem.weightDif:'0.00'}}</span>
      </el-col>
      <el-col :span="2">
        过重备注
        <!-- <span class="txtBlack">{{ielem.weightDifRemark}}</span> -->
        <span v-if="ielem.weightDifRemark">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="ielem.weightDifRemark"
          >
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.weightDifRemark.length < 4 ? ielem.weightDifRemark : ielem.weightDifRemark.substr(0,4)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="3">
        备注
        <span v-if="ielem.remark">
          <el-popover placement="top-start" width="200" trigger="hover" :content="ielem.remark">
            <span
              class="txtBlack overflowHidden"
              slot="reference"
            >{{ielem.remark.length < 8 ? ielem.remark : ielem.remark.substr(0,8)+'...'}}</span>
          </el-popover>
        </span>
        <span v-else>-</span>
      </el-col>
      <el-col :span="1" class="txtRed txtRight" style="cursor: pointer;">查看详情</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    baoData: {
      required: true
    }
  },
  data() {
    return {
      arrowType: false,
      baoViewTF: false, //查看包详情
      // baoData: {}, //包的详情数据
      baoObj: {}, //选择包的详情数据
      proList: [] //单里的产品详情数据
    };
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //关闭
    clickFun() {},
    packDetailFun(elem) {
      // console.log("详情", elem);
      this.$emit("goPackDetail", elem);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tabOne {
  background: #e4eaf0;
  padding: 10px 15px;
  color: #969aa5;
  font-size: 14px;
  margin: 10px 0;
}

.pt10 {
  padding: 10px 0;
}

.productUL {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;
  border: 1px solid #E5F1FF;
  padding: 14px 24px;
  margin-bottom: 8px;

  &.on {
    border: 1px solid #8A9199;
  }

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  // 单品
  .product {
    display: flex;
    position: relative;

    .closePic {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }

    .uLOne {
      display: flex;

      img {
        width: 120px;
        height: 90px;
      }

      .liDes {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .uLTwo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .uLThree {
      width: 260px;
      display: flex;
      line-height: 36px;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }

  // 套装
  .tzWtap {
    border-top: 1px solid #E5F1FF;
    margin-top: 13px;
    padding: 14px 0;

    .itemWrap {
      width: 49%;
      display: inline-flex;
      margin-bottom: 20px;
    }

    .uLOne {
      display: flex;

      img {
        width: 120px;
        height: 90px;
      }

      .liDes {
        margin-left: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    .uLTwo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  // 更多
  .more {
    display: inline-block;
    position: relative;
    cursor: pointer;

    strong {
      color: #df343d;
      font-weight: bold;
    }

    .dialog {
      visibility: hidden;
      position: absolute;
      left: 0;
      top: 100%;
      width: 250px;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;

      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #37393b;
      }

      p {
        padding-top: 10px;
        line-height: 1.4;
        font-size: 12px;
        color: #3c3c3c;
      }
    }

    &:hover .dialog {
      visibility: visible;
    }
  }
}
</style>
