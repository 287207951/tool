<template>
  <el-row class="tabOne"
          :gutter="10">
    <el-col v-for="(column,index) in columns"
            class="truncation"
            :key="index"
            :span="column.span">
      <span class="label"
            :style="column.style"
            v-if="column.labelKey">{{column.labelKey}}:</span>
      <span class="value txtBlack"
            :style="column.style"
            v-if="column.valueKey && !column.tooltip">{{packgeData[column.valueKey]}}
      </span>
      <span v-if="column.other"
            class="txtRed txtRight"
            :style="column.style">{{column.other}}</span>
      <el-tooltip v-if="column.tooltip"
                  effect="light"
                  placement="top"
                  :content="packgeData[column.valueKey]">
        <span class="value txtBlack"
              :style="column.style"
              v-if="column.valueKey">{{packgeData[column.valueKey]}}
        </span>
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    columns: {
      required: true,
      type: Array,
      default () {
        return []
      }
    },
    packgeData: {
      required: true,
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
  },
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tabOne {
  background: #e4eaf0;
  padding: 10px 8px;
  color: #969aa5;
  font-size: 13px;
  margin: 10px 0;
  line-height: 16px;
}

.truncation {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
