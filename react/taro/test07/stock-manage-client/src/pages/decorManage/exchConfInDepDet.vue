<template>
  <div class="conBigDiv" ref="creatSendMaterial">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24" class="itemRight">
          <el-button type="danger" size="small" plain @click="hcFun">红冲</el-button>
          <el-button type="primary" size="small">打印</el-button>
        </el-col>
      </el-row>
      <el-row class="itemFirst">
        <el-col :span="8">
          <div>
            <span>调拨单号：</span>
            <span>LS170713001</span>
          </div>
          <div style="margin-top:14px">
            <span>调拨部门：</span>
            <el-select
              v-model="mock"
              placeholder="请选择"
              size="small"
              style="width:240px"
              @change="searchFun"
            ></el-select>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <span>调拨状态：</span>
            <span style="color:#F26D0F">待签收</span>
          </div>
          <div style="margin-top:14px">
            <span>接收单位：</span>
            <el-select
              v-model="mock"
              placeholder="请选择"
              size="small"
              style="width:240px"
              @change="searchFun"
            ></el-select>
          </div>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <div class="noteStyle">
            <span style="padding-right: 8px;">备注：</span>
            <textarea name id class="textAreaStlye" placeholder="请输入备注信息" v-model="mock"></textarea>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="data"
      border
      show-summary
      :summary-method="getSummaries"
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{background:'#f5f7fa'}"
    >
      <el-table-column header-align="center" align="center" prop="label" label="包号"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="种类"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="营销品类"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="重量"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="成色"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="折千足重"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="单价/克"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="数量"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="单价/件"></el-table-column>
      <el-table-column header-align="center" align="center" prop="label" label="金额"></el-table-column>
      <el-table-column header-align="center" align="center" prop label="备注" width="470px"></el-table-column>
    </el-table>

    <div class="desWrap">
      <div class="desLi">
        <span>2018-12-10 10:23:23</span>
        <span class="desName">尚金缘联系人</span>
        <span>对新建提交操作</span>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="HCpromptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因" v-model="mock"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="HCpromptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="HCpromptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      HCpromptType: false, //红冲弹框状态
      mock: "",
      data: [
        {
          label: 1
        }
      ]
    };
  },
  created() {},
  methods: {
    created_fun() {},
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
      });
      return sums;
    },
    //红冲
    hcFun() {
      this.HCpromptType = true;
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
  }

  .desWrap {
    margin-top: 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(138, 145, 153, 1);

    .desLi {
      margin-bottom: 20px;

      .desName {
        color: #000;
      }
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
</style>


