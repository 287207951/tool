<template>
  <div class="product-list">
    <product-row
      v-for="productItem in listData"
      :imgBaseUrl="imgBaseUrl"
      :productData="productItem"
      :layoutSetting="layoutSetting"
      :titleKey="titleKey"
      :imgUrlKey="imgUrlKey"
      @click="clickRow(productItem)"
      :key="productItem[idKey]"
    >
      <div class="dropdown-container" slot="dropdown">
        <product-row
          class="dropdown-item"
          v-for="proItem in productItem.proSpecData.ProList"
          :key="proItem.proNum"
          :imgBaseUrl="imgBaseUrl"
          :productData="proItem"
          :layoutSetting="tzLayout"
          titleKey="name"
          imgUrlKey="pic"
        ></product-row>
      </div>
    </product-row>
  </div>
</template>
<script>
import productRow from "./product-row";
export default {
  props: {
    imgUrlKey: {
      type: String,
      required: true
    },
    titleKey: {
      type: String,
      required: true
    },
    layoutSetting: {
      type: Array,
      required: true
    },
    imgBaseUrl: {
      type: String,
      required: true
    },
    idKey: {
      type: String,
      required: true
    },
    listData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tzLayout: [
        [
          {
            label: "编号",
            valueKey: "factoryNumber"
          },
          {
            label: "属性",
            valueFormat(data) {
              return [
                data.goldCode,
                data.condit,
                data.oneName,
                data.effect,
                data.processCode
              ]
                .filter(n => n)
                .join(",");
            },
            valueKey: "proBasics.goldCode"
          }
        ],
        [
          {
            label: "克重",
            valueKey: "weight"
          }
        ]
      ]
    };
  },
  methods: {
    clickRow(data) {
      this.$emit("clickRow", data);
    }
  },
  components: {
    "product-row": productRow
  },
  created() {
    // console.log(this.layoutSetting,this.listData)
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.product-list {
  padding-top: 10px;

  .dropdown-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .dropdown-item {
      width: 50%;
      box-sizing: border-box;
    }
  }
}
</style>
