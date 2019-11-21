<template>
  <main>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item >系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务失败记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <!-- <el-input v-model="taskName" size="small" prefix-icon="el-icon-search" placeholder="输入关键词搜索" @keyup.enter.native="getList"></el-input> -->
      <figure>
        <span>任务名称</span>
        <el-select size="small" v-model="taskName" @change="getList">
          <el-option v-for="item in taskNameList" :key="item.taskName" :label="item.taskDesc" :value="item.taskName"></el-option>
        </el-select>
      </figure>
      <figure>
        <span>修复模式</span>
        <el-select size="small" v-model="repairMode" @change="getList">
          <el-option v-for="item in repairModeList" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </figure>
    </div>
    <section class="list">
      <header>
        <span>任务名称</span>
        <span>参数</span>
        <span>失败时间</span>
        <span>说明</span>
        <span>必须修复</span>
        <span>修复模式</span>
        <span>操作</span>
      </header>
      <ul v-show="list.length > 0">
        <li v-for="(item, index) in list" :key="item.eid">
          <span>{{ item.taskName | getTaskName(taskNameList) }}</span>
          <span>{{ item.taskContent || '--' }}</span>
          <span>{{ item.createTime | getFormatDataTime }}</span>
          <span>{{ item.mark || '--' }}</span>
          <span>{{ item.mustRepair | getMustRepair }}</span>
          <span>{{ item.repairMode | getRepairMode }}</span>
          <span>
            <b v-if="item.mustRepair === 'Y'" @click="hotFixTask(item.eid, index)">修复</b>
            <s @click="deleteTask(item.eid, index)">删除</s>
          </span>
        </li>
      </ul>
      <p class="hint" v-show="list.length === 0">暂无数据</p>
    </section>
    <el-pagination
      @size-change="changeRows"
      @current-change="changePage"
      :current-page="pageIndex"
      :page-sizes="[15, 30, 45, 60]"
      :page-size="rows"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="rowSize">
    </el-pagination>
  </main>
</template>
<script>
import tool from './comm/tool.js';
import utils from '@/skyConfig/libs/utils';
export default {
  data() {
    return {
      taskName: '',
      repairMode: '', // 修复模式
      repairModeList: [
        {
          label: '全部',
          value: ''
        },{
          label: '自动',
          value: 'AUTO'
        },{
          label: '手动',
          value: 'HANDLE'
        }
      ],
      pageIndex: 1,
      rows: 15,
      // 页面数据
      list: [],
      rowSize: 0,
      taskNameList: []
    };
  },
  created() {
    this.getList();
    tool.getTaskList().then( list => {
      list.unshift({ taskName: '', taskDesc: '全部' });
      this.taskNameList = list;
    });
  },
  methods: {
    getList () {
      const { taskName = '', repairMode = '', pageIndex, rows } = this;
      this.$Api.get({ url: '/task/failTaskList', data: { taskName, repairMode, pageIndex, rows } })
      .then(({ data: res }) => {
        this.list = res.data;
        this.pageIndex = res.pageIndex;
        this.rowSize = res.rowSize;
      })
    },
    // 修复
    hotFixTask (eid, index) {
      this.$Api.get({ url: '/task/repair', data: { eid } })
      .then(() => {
        this.$message.success('修复成功');
        this.list.splice(index, 1);
      })
    },
    // 删除
    deleteTask (eid, index) {
      this.$confirm('是否删除该记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Api.get({ url: '/task/delete', data: { eid } })
        .then(() => {
          this.$message.success('删除成功');
          this.list.splice(index, 1);
        })
      })
    },
    changePage (pageIndex) {
      this.pageIndex = pageIndex;
      this.getList();
    },
    changeRows (rows) {
      this.pageIndex = 1;
      this.rows = rows;
      this.getList();
    }
  },
  filters: {
    getTaskName (taskName, list) {
      for ( let v of list ) {
        if ( v.taskName === taskName ) {
          return v.taskDesc;
        }
      }
      return taskName;
    },
    getFormatDataTime (val) {
      return utils.formatDataTime(val);
    },
    getMustRepair (val) {
      const tem = { 'N': '否', 'Y': '是' }
      return val in tem ? tem[val] : val;
    },
    getRepairMode (val) {
      if ( !val ) return '无';
      const tem = { 'AUTO': '自动', 'HANDLE': '手动' };
      return val in tem ? tem[val] : val;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
main {
  position: relative;
  height: 100%;
}
.el-breadcrumb {
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
}
.search {
  display: flex;
  margin-top: 20px;
  .el-input {
    width: 280px;
  }
  figure {
    margin-right: 15px;
    color: #999;
  }
}
.list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid #CFD9E5;
  // max-height: 600px;
  max-height: calc( 100% - 95px - 32px - 30px );
  box-sizing: border-box;
  overflow: auto;
  margin-top: 10px;
  header {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 1;
    display: flex;
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: #8A9199;
    background-color: #E6F1FF;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #CFD9E5;
      width: calc(1 / 24 * 100%);
      box-sizing: border-box;
      &:first-of-type { width: calc(2 / 24 * 100%); }
      &:nth-of-type(2) { width: calc(10 / 24 * 100%); }
      &:nth-of-type(3) { width: calc(3 / 24 * 100%); }
      &:nth-of-type(4) { width: calc(6 / 24 * 100%); }
      &:last-of-type { border-right: none; }
    }
  }
  ul {
    position: relative;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    li {
      display: inline-flex;
      width: 100%;
      min-height: 40px;
      font-size: 14px;
      color: #222426;
      &:hover {
        background: #fcfcfc;
      }
      span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-width: 0 1px 1px 0;
        border-style: solid;
        border-color: #CFD9E5;
        width: calc(1 / 24 * 100%);
        text-align: center;
        box-sizing: border-box;
        word-wrap: break-word;
        table-layout: fixed;
        word-break: break-all;
        &:first-of-type { 
          width: calc(2 / 24 * 100%);
          border-left: none; 
        }
        &:nth-of-type(2) { width: calc(10 / 24 * 100%); }
        &:nth-of-type(3) { width: calc(3 / 24 * 100%); }
        &:nth-of-type(4) { width: calc(6 / 24 * 100%); }
        &:last-of-type {
          border-right: none;
        }
        b {
          color: #F20F34;
          padding-right: 5px;
          cursor: pointer;
        }
        s {
          color: #F2930F;
          text-decoration: none;
          cursor: pointer;
        }
      }
      &:last-of-type span {
        border-bottom: none;
      }
    }
  }
  .hint {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
    border-top: 1px solid #CFD9E5;
    font-size: 14px;
    color: #999;
  }
}
.el-pagination {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 15px 0;
  text-align: center;
}
</style>
