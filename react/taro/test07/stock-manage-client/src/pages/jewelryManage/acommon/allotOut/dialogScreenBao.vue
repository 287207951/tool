<template>
  <div class="screenWrap">
    <div>
      <el-input
        v-if="orderTxtTF"
        placeholder="引用单号"
        style="width:200px;margin-right: 10px;"
        size="small"
        v-model="searchData.orderTxt"
        @keydown.enter.native="searchFun"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!-- <el-input
        v-if="!orderTF"
        placeholder="请输入关键字搜索"
        style="width:200px"
        size="small"
        v-model="searchData.search"
        @keydown.enter.native="searchFun"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>-->

      <el-input
        v-if="orderTF"
        placeholder="请输入产品名称或编号"
        style="width:200px"
        size="small"
        v-model="searchData.search"
        @keydown.enter.native="searchFun"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <span v-if="orderTF">
        <span class="smallTitle mL24">分类</span>
        <el-select
          v-model="searchData.one"
          placeholder="请选择"
          size="small"
          class="width160"
          @change="searchFun"
        >
          <el-option
            v-for="item in proDeiData.one_items_code"
            :key="item.code"
            :label="item.val"
            :value="item.code"
          ></el-option>
        </el-select>
        <span class="smallTitle mL24">材质</span>
        <el-select
          v-model="searchData.goldCode"
          placeholder="请选择"
          size="small"
          class="width160"
          @change="searchFun"
        >
          <el-option
            v-for="item in proDeiData.gold_material_code"
            :key="item.code"
            :label="item.val"
            :value="item.code"
          ></el-option>
        </el-select>
        <span class="smallTitle mL24">生产工艺</span>
        <el-select
          v-model="searchData.processCode"
          placeholder="请选择"
          size="small"
          class="width160"
          @change="searchFun"
        >
          <el-option
            v-for="item in proDeiData.pro_process_code"
            :key="item.code"
            :label="item.val"
            :value="item.code"
          ></el-option>
        </el-select>
        <span class="smallTitle mL24">成色</span>
        <el-select
          v-model="searchData.conditi"
          placeholder="请选择"
          size="small"
          class="width160"
          @change="searchFun"
        >
          <el-option
            v-for="item in proDeiData.condition_code"
            :key="item.code"
            :label="item.val"
            :value="item.code"
          ></el-option>
        </el-select>
      </span>
    </div>
    <!-- <el-button type="primary" size="small">确认选中</el-button> -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    selectTF: {
      type: Boolean,
      default: false
    },
    orderTxtTF: {
      type: Boolean,
      default: false
    },
    orderTF: {
      type: Boolean,
      default: true
    },
    conditiShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchData: {
        search: "",
        one: "",
        goldCode: "",
        processCode: "",
        conditi: "全部",
        orderTxt: ""
      }, //搜索输入值
      proDeiData: {} //产品属性接口
      // orderTF: true //产品搜索
    };
  },
  created() {
    this.createFun();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //产品属性调接口
    createFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/proCommonController/code")
        .then(res => {
          if (res.data.code == 200) {
            self.proDeiData = res.data.data;
            let allTxtObj = { val: "全部", code: "" };
            self.proDeiData.one_items_code.unshift(allTxtObj);
            self.proDeiData.gold_material_code.unshift(allTxtObj);
            self.proDeiData.pro_process_code.unshift(allTxtObj);
            self.proDeiData.condition_code.unshift({
              val: "全部",
              code: "全部"
            });
            this.judgeCondit();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 判断删除筛选成色
    judgeCondit() {
      if (!this.conditiShow) {
        const { condition_code } = this.proDeiData;
        this.proDeiData.condition_code.shift();
        this.searchData.conditi = condition_code[0].code;
        this.searchFun();
      }
    },
    //筛选字段
    searchFun() {
      this.searchData.orderTxt = this.searchData.orderTxt
        ? this.searchData.orderTxt.replace(/\s*/g, "")
        : "";
      this.searchData.conditi =
        this.searchData.conditi != "全部" ? this.searchData.conditi : "";
      if (this.searchData.orderTxt.length === 0) {
        this.orderTF = true;
      } else {
        this.orderTF = false;
      }
      this.$emit("suitSearch", { ...this.searchData });
    },
    //清空选中
    clearFun() {
      this.searchData = {};
      this.orderTF = true;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.screenWrap {
  display: flex;
  justify-content: space-between;
  margin: 14px 0 16px 0;
}

.width160 {
  width: 128px;
}

.smallTitle {
  color: #8A8E99;
}

.mL24 {
  margin-left: 24px;
}
</style>
