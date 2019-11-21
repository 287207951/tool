<template>
  <div class="dialogWrap">
    <el-dialog
      title="产品选择"
      :visible.sync="dialogVisible"
      width="1500px"
      class="productModel"
      :close-on-click-modal="false"
      @close="closeFun"
    >
      <div class="dialogContent">
        <div class="hr"></div>
        <!-- 标题 -->
        <div class="dialogTitel">
          <span>发起单位：</span>
          金库-货柜
        </div>
        <!-- 筛选 -->
        <DialogScreen :showInputType="showInputType">
          <el-button type="primary" size="small">确认选中</el-button>
        </DialogScreen>
        <!-- 产品 -->
        <div class="productUL">
          <!-- 单装 -->
          <div class="product">
            <SingleAttr></SingleAttr>
            <!-- <TzAttr @suitDes="suitDes" :handle="handle"></TzAttr> -->
            <div style="display:flex;flex:1">
              <div class="uLTwo" style="width:28%">
                <div>
                  <span class="grayCol">剩余库存：</span>
                  <span>11</span>
                </div>
                <div>
                  <span class="grayCol">库存毛重：</span>
                  <span>80.2g</span>
                </div>
                <div>
                  <span class="grayCol">库存净重：</span>
                  <span>80.2g</span>
                </div>
              </div>
              <div class="uLThree" style="width:33%;display: flex;justify-content: space-between;">
                <div>
                  <span class="grayCol">选择数量：</span>
                  <el-input v-model="mock" placeholder="请输入数量" size="mini" style="width:80px"></el-input>
                </div>
                <div>
                  <span class="grayCol">选择净重：</span>
                  <el-input v-model="mock" placeholder="请输入净量" size="mini" style="width:80px"></el-input>
                </div>
                <div>
                  <span class="grayCol">选择毛重：</span>
                  <el-input v-model="mock" placeholder="请输入毛量" size="mini" style="width:80px"></el-input>
                </div>
              </div>
              <div class="uLThree">
                <div style="margin-bottom: 6px;">
                  <span class="grayCol">出库备注：</span>
                  <el-input v-model="mock" placeholder="请输入备注" size="small" style="width:200px"></el-input>
                </div>
                <div>
                  <span class="grayCol">出库原因：</span>
                  <el-select
                    v-model="mock"
                    multiple
                    placeholder="请选择"
                    size="small"
                    style="width:200px"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <!-- 套装 -->
          <div class="tzWtap" v-show="arrowType">
            <TzAttrDetails :styleType="handle"></TzAttrDetails>
            <TzAttrDetails></TzAttrDetails>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    AddProductType: {
      required: true
    }
  },
  data() {
    return {
      showInputType: true,
      handle: true,
      mock: "",
      mockData: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      dialogVisible: false,
      arrowType: false
    };
  },
  created() {},
  mounted() {},
  watch: {
    AddProductType: function(newVal, oldVal) {
      this.dialogVisible = true;
    }
  },
  computed: {},
  methods: {
    cancelModel() {
      this.$emit("callback", false);
    },
    //套装详情
    suitDes(val) {
      this.arrowType = val;
    },
    closeFun() {
      console.log("关闭");
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.dialogWrap {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #222426;

  .grayCol {
    color: #889199;
  }

  .redCol {
    color: #F20F34;
  }

  .width160 {
    width: 160px;
  }

  .mL24 {
    margin-left: 24px;
  }

  .smallTitle {
    color: #8A8E99;
  }

  .dialogContent {
    position: relative;

    .dialogTitel {
      font-size: 16px;
      font-weight: bold;

      span {
        color: #8A9199;
      }
    }

    .screenWrap {
      display: flex;
      justify-content: space-between;
      margin: 14px 0 16px 0;
    }
  }

  // 产品
  .productUL {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #222426;
    border: 1px solid #E5F1FF;
    padding: 14px 24px;
    margin-bottom: 8px;

    .grayCol {
      color: #889199;
    }

    .redCol {
      color: #F20F34;
    }

    // 单品
    .product {
      display: flex;

      .uLOne {
        display: flex;

        img {
          width: 120px;
          height: 90px;
          margin-left: 15px;
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
        display: flex;
        line-height: 36px;
        flex-direction: column;
        // justify-content: space-evenly;
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
        padding-left: 29px;
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
}
</style>
