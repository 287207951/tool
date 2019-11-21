<template>
  <el-row>
    <el-col :span="22">
      <el-input
        placeholder="请输入关键字搜索"
        style="width:256px"
        size="small"
        v-model="searchVal"
        @input="searchFun"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <!-- <el-select 
        v-model="mock"
        placeholder="请选择店铺"
        size="small"
        class="width200"
        v-show="componentSet.shopStatu"
        @change="searchFun"
      >
        <el-option
          v-for="item in mockData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <span class="smallTitle mL24">产品分类</span>
      <el-select v-model="one" placeholder="请选择" size="small" class="width200" @change="searchFun">
        <el-option
          v-for="item in proDeiData.one_items_code"
          :key="item.code"
          :label="item.val"
          :value="item.code"
        ></el-option>
      </el-select>

      <span class="smallTitle mL24">生产工艺</span>
      <el-select
        v-model="processCode"
        placeholder="请选择"
        size="small"
        class="width200"
        @change="searchFun"
      >
        <el-option
          v-for="item in proDeiData.pro_process_code"
          :key="item.code"
          :label="item.val"
          :value="item.code"
        ></el-option>
      </el-select>

      <span class="smallTitle mL24">金料成色</span>
      <el-select
        v-model="conditi"
        placeholder="请选择" 
        size="small"
        class="width200"
        @change="searchFun"
      >
        <el-option
          v-for="item in proDeiData.condition_code"
          :key="item.code"
          :label="item.val"
          :value="item.code"
        ></el-option>
      </el-select>-->
    </el-col>

    <el-col :span="2" style="text-align: right;">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    componentSet: {
      //配置组件要显示隐藏元素
      type: Object,
      required: false,
      default: function() {
        return { shopStatu: false };
      }
    },

    proList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      //   mock: "",
      //   mockData: [],
      //   one: "",
      //   processCode: "",
      //   conditi: "",
      searchVal: "", //关键字
      searchData: {
        search: ``,
        backProList: []
      }
      //   proDeiData: {} //产品属性接口
    };
  },
  created() {
    this.debounce = this.$api.debounce(this.hanld, 800);
  },
  mounted() {},
  methods: {
    //筛选字段
    searchFun(e) {
      let self = this;
      setTimeout(() => {
        self.searchVal = "";
      }, 3500);
      this.debounce(e);
    },

    hanld(val) {
      let obj = {
        search: val,
        backProList: this.$api.searchList.search(val, this.proList).getList()
      };
      this.searchData = obj;
      this.$emit("suitSearch", this.searchData);
    },
    //清空输入框
    emptyInput() {
      this.searchVal = "";
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.smallTitle {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8A8E99;
}

.width200 {
  width: 200px;
}

.mL24 {
  margin-left: 24px;
}
</style>
