<template>
  <div class="headWrap">
    <div class="titleWrap">
      <div class="title">新增{{title}}</div>
      <div>
        <!-- <el-button type="primary" size="small" plain>保存</el-button>
        <el-button type="primary" size="small">确认出库</el-button>-->
        <slot name="btn"></slot>
      </div>
    </div>

    <el-row style="margin-top: 46px;">
      <el-col :span="24" style="margin-bottom: 16px;">
        <span class="smallTitle">{{title}}类型</span>
        <el-select v-model="mock" placeholder="请选择" size="small" class="width240">
          <el-option
            v-for="item in mockData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">发起单位</span>
        <el-select v-model="mock" placeholder="请选择" size="small" class="width240">
          <el-option
            v-for="item in mockData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">接收单位</span>
        <el-select v-model="mock" placeholder="请选择" size="small" class="width240">
          <el-option
            v-for="item in mockData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="8">
        <span class="smallTitle">备注</span>
        <el-input v-model="mock" placeholder="请输入备注" size="small" class="width240"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
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
.width240 {
  width: 240px;
}

.smallTitle {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8A8E99;
}

.headWrap {
  padding-bottom: 24px;

  .titleWrap {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #232426;
    }
  }
}
</style>
