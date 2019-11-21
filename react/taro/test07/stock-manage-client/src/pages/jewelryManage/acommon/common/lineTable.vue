<template>
  <div class="table">
    <div class="tr">
      <div class="th table-hr" v-for="item in list.th" :key="item.val">{{item.val}}</div>
    </div>
    <div class="tr">
      <div class="td" v-for="item in list.td" :key="item.val">{{item.val}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {
        return {
          th: [
            { style: {}, val: `入库单号` },
            { style: {}, val: `入库类型` },
            { style: {}, val: `原单号` },
            { style: {}, val: `发起单位` },
            { style: {}, val: `接收单位` },
            { style: {}, val: `数量` },
            { style: {}, val: `毛重` },
            { style: {}, val: `工费` },
            { style: {}, val: `操作人` },
            { style: {}, val: `创建时间` },
            { style: {}, val: `订单状态` }
          ],
          td: [
            { style: {}, val: `入库单号` },
            { style: {}, val: `入库类型` },
            { style: {}, val: `原单号` },
            { style: {}, val: `发起单位` },
            { style: {}, val: `接收单位` },
            { style: {}, val: `数量` },
            { style: {}, val: `毛重` },
            { style: {}, val: `工费` },
            { style: {}, val: `操作人` },
            { style: {}, val: `创建时间` },
            { style: {}, val: `订单状态` }
          ]
        };
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.table {
  width: 100%;
  display: table;

  .table-hr {
    border-bottom: 1px solid #eee;
  }

  .tr {
    display: table-row;

    .td, .th {
      line-height: 50px;
      display: table-cell;
    }

    .th {
      padding-top: 15px;
      font-weight: bold;
      color: #8A8E99;
    }

    .td {
      color: #232426;
    }
  }
}
</style>
