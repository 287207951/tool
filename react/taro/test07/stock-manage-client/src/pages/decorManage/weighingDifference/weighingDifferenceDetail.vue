<template>
  <div v-loading="loadingState">
    <section>
      <!-- 头部 -->
      <el-table :data="allData" style="width: 100%">
        <el-table-column prop="weigerrorCode" label="称差单号"></el-table-column>
        <el-table-column prop="initiator" label="发起单位"></el-table-column>
        <el-table-column prop="recipient" label="接收单位"></el-table-column>
        <el-table-column prop="differAmount" label="差异数量"></el-table-column>
        <el-table-column prop="differWeight" label="差异重量"></el-table-column>
        <el-table-column prop="differMoney" label="金额(￥)"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{$api.dateGetDayTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column prop="createName" label="操作人"></el-table-column>
      </el-table>
      <div class="bigLine"></div>
    </section>

    <div style="padding-top:15px;font-weight:bold;font-size:16px;color:rgba(35,36,38,1);">SKU详情</div>
    <!-- 详细信息 -->
    <product-list
      idKey="id"
      :imgBaseUrl="$portImg"
      imgUrlKey="proBasics.pic"
      titleKey="proBasics.proName"
      :layoutSetting="layoutSetting"
      :listData="detailList"
    ></product-list>
  </div>
</template>

<script>
import productList from "@/components/product-list.vue";
export default {
  data() {
    return {
      id: null,
      allData: [],
      loadingState: false,
      detailList: [],
      layoutSetting: [
        [
          {
            label: "编号",
            valueKey: "proSpecData.specNumber"
          },
          {
            label: "属性",
            valueKey: "proBasics.goldCode",
            valueFormats(data) {
              return [
                data.goldCode,
                data.condit,
                data.oneName,
                data.effect,
                data.processCode,
                data.craft,
                data.pait
              ]
                .filter(n => n)
                .join(",");
            },
            custom: function(data) {
              if (data.proBasics.oneItemsCode === "TZ") {
                return "套装详情";
              }
            }
          }
        ],
        [
          {
            label: "成色",
            valueKey: "proSpecData.conditi"
          },
          {
            label: "克重",
            valueKey: "proSpecData.weight",
            valueFormat(data) {
              console.log(data);
              return data.proSpecData.weight + "g";
            }
          }
        ],
        [
          {
            label: "原据单号",
            valueKey: "bizNo"
          },
          {
            label: "合计数量",
            valueKey: "totalAmount"
          },
          {
            specialFn: data => {
              return data.proSpecData.factFeeType === 1
                ? {
                    label: "工费",
                    valueKey: "proSpecData.price"
                  }
                : {
                    label: "工费",
                    valueKey: "proSpecData.piecePrice"
                  };
            },
            valueFormat(data) {
              if (data.proSpecData.factFeeType === 1) {
                return data.proSpecData.price + "元 / 克";
              } else {
                return data.proSpecData.piecePrice + "元 / 件";
              }
            }
          }
        ],
        [
          {
            label: "差异克重(g)",
            valueKey: "differWeight",
            valueFormat(data) {
              return data.differWeight + "g";
            }
          },
          {
            label: "差异数量",
            valueKey: "differAmount"
          },
          {
            label: "差异金额",
            valueKey: "differMoney",
            valueFormat(data) {
              return data.differMoney ? "¥ " + data.differMoney : "";
            }
          }
        ]
      ]
    };
  },
  computed: {},
  created() {
    this.id = this.$route.query.id;
    // 获取页面数据
    this.getData();
  },
  components: {
    "product-list": productList
  },
  mounted() {},
  methods: {
    getData() {
      this.loadingState = true;
      this.$axios
        .get(this.$portMain + "/biz/differ/getWeigErrorOrderlist", {
          PRS: {
            id: this.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            (this.allData = [res.data.data]),
              (this.detailList = res.data.data.differOrders);
            this.loadingState = false;
          } else {
            this.$message.error(res.data.msg);
            this.loadingState = false;
          }
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
  flex: 2;
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

.packDataWrap {
  margin-top: 29px;

  .packTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 19px;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #232426;
    }
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
</style>
