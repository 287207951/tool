<template>
  <div class="screenWrap">
    <div>
      <el-input
        placeholder="引用单号"
        style="width:200px;    margin-right: 10px;"
        size="small"
        v-model="mock"
        v-show="showInputType"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input placeholder="请输入关键字搜索" style="width:200px" size="small" v-model="mock">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span class="smallTitle mL24">分类</span>
      <el-select v-model="mock" placeholder="请选择" size="small" class="width160">
        <el-option
          v-for="item in mockData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="smallTitle mL24">材质</span>
      <el-select v-model="mock" placeholder="请选择" size="small" class="width160">
        <el-option
          v-for="item in mockData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="smallTitle mL24">生产工艺</span>
      <el-select v-model="mock" placeholder="请选择" size="small" class="width160">
        <el-option
          v-for="item in mockData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="smallTitle mL24">成色</span>
      <el-select v-model="mock" placeholder="请选择" size="small" class="width160">
        <el-option
          v-for="item in mockData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <!-- <el-button type="primary" size="small">确认选中</el-button> -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    showInputType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mock: "",
      mockData: []
    };
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //关闭
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
  width: 160px;
}

.smallTitle {
  color: #8A8E99;
}

.mL24 {
  margin-left: 24px;
}
</style>
