<template>
  <div class="product-contaienr">
    <div class="product">
      <slot name="prepend"></slot>
      <img class="product-img" :src="imgSrc" @click="showPic(imgSrc)" />
      <div class="product-detail">
        <div
          class="product-detail-seat"
          v-for="(layoutSeat,index) in slicelayoutStart"
          :key="index"
        >
          <div class="product-detail-seat-item title">{{getPropByObj(productData,titleKey)}}</div>
          <div
            class="product-detail-seat-item"
            v-for="(seatItem,jIndex) in layoutSeat"
            :key="jIndex"
          >
            <div
              style="display:flex;color:#e60e32;cursor:pointer"
              v-if="seatItem.custom && seatItem.custom(productData)"
              @click="clickDtail"
            >
              {{seatItem.custom(productData)}}
              <i
                style="line-height:1.4"
                :class="dropShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
            </div>
            <div style="display:flex" v-else>
              <div v-if="!seatItem.specialFn" class="label">{{seatItem.label}}:</div>
              <div
                v-else
                class="label"
              >{{seatItem.specialFn(productData).label ? seatItem.specialFn(productData).label + ':' : ''}}</div>

              <div class="value" v-if="seatItem.valueFormat">{{seatItem.valueFormat(productData)}}</div>
              <div
                class="value"
                v-else-if="seatItem.valueFormats"
              >{{seatItem.valueFormats(productData.proBasics)}}</div>
              <div
                v-else-if="!seatItem.specialFn"
                class="value"
              >{{getPropByObj(productData,seatItem.valueKey)}} {{seatItem.company}}</div>
              <div
                v-else
                class="value"
              >{{getPropByObj(productData,seatItem.specialFn(productData).valueKey).toString() || ''}} {{seatItem.specialFn(productData).company}}</div>
            </div>
          </div>
        </div>

        <div class="product-detail-seat" v-for="(layoutSeat,index) in slicelayoutEnd" :key="index">
          <div
            class="product-detail-seat-item"
            v-for="(seatItem,jIndex) in layoutSeat"
            :key="jIndex"
          >
            <div v-if="!seatItem.specialFn" class="label">{{seatItem.label}}:</div>
            <div
              v-else
              class="label"
            >{{seatItem.specialFn(productData).label ? seatItem.specialFn(productData).label + ':' : ''}}</div>
            <div class="value" v-if="seatItem.valueFormat">{{seatItem.valueFormat(productData)}}</div>
            <div
              class="value"
              v-else-if="seatItem.valueFormats"
            >{{seatItem.valueFormats(productData.proBasics)}}</div>
            <div
              v-else-if="!seatItem.specialFn"
              class="value"
            >{{getPropByObj(productData,seatItem.valueKey)}} {{seatItem.company}}</div>
            <div
              v-else
              class="value"
            >{{getPropByObj(productData, seatItem.specialFn(productData).valueKey).toString() || ''}} {{seatItem.specialFn(productData).company}}</div>
          </div>
        </div>

        <slot name="append"></slot>
      </div>
    </div>
    <slot name="dropdown" v-if="dropShow"></slot>

    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>

<script>
export default {
  props: {
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
    productData: {
      type: Object,
      required: true
    },
    imgUrlKey: {
      type: String,
      required: true
    }
  },
  computed: {
    hasDropdown() {
      const arr = this.slicelayoutStart.filter(
        n => n.custom && n.custom(this.productData)
      );
      return arr.length;
    },
    dropdownProLayout() {
      const layeoutItem = this.slicelayoutStart.filter(n =>
        n.custom(this.productData)
      )[0];
      if (layeoutItem) {
        return layeoutItem.custom(this.productData).layout;
      } else {
        return [];
      }
    },
    slicelayoutStart() {
      return this.layoutSetting.slice(0, 1);
    },
    slicelayoutEnd() {
      return this.layoutSetting.slice(1);
    },
    imgSrc() {
      return (
        this.imgBaseUrl + this.getPropByObj(this.productData, this.imgUrlKey)
      );
    }
    // proProps () {
    //   if (typeof this.productData.proProps === 'string') {
    //     console.log(this.productData.proProps)
    //     console.log(JSON.parse(this.productData.proProps))
    //     return JSON.parse(this.productData.proProps)
    //   } else {
    //     return this.productData.proProps
    //   }

    // }
  },
  data() {
    return {
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      dropShow: false
    };
  },
  mounted() {},
  created() {
    // console.log(this.slicelayoutStart)
  },
  methods: {
    clickDtail() {
      this.dropShow = !this.dropShow;
      this.$emit("clickDtail", this.dropShow);
    },

    getPropByObj(obj, str) {
      obj.extendAttrT = obj.proSpecData
        ? JSON.parse(obj.proSpecData.extendAttr)
        : {};
      if (str) {
        const props = str.split(".");
        let value = "";
        props.forEach(v => {
          if (obj[v] !== undefined) {
            if (typeof obj === "string") {
              obj = JSON.parse(obj);
            }
            obj = obj[v];
          } else {
            obj = obj.extendAttrT[v] ? obj.extendAttrT[v] : "";
            return obj;
          }
        });
        return obj;
      } else {
        return "";
      }
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.product-contaienr {
  padding: 14px 24px;
  border: 1px solid #e5f1ff;
  margin-bottom: 8px;

  .product {
    display: flex;
    align-items: center;

    &-img {
      width: 120px;
      height: 90px;
    }

    &-detail {
      display: flex;
      flex-grow: 1;
      flex-direction: row;
      padding-left: 15px;

      &-seat {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        padding-right: 15px;

        &-item {
          padding: 6px 0;
          display: flex;
          flex-direction: row;
          line-height: 1.2;

          &.title {
            font-weight: bold;
          }

          .label {
            color: #889199;
          }

          .value {
            padding-left: 8px;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
