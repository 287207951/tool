<template>
  <main>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>定时任务</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="head">
      <div class="search">
        <el-input
          v-model="keyword"
          size="small"
          prefix-icon="el-icon-search"
          placeholder="任务说明/创建人"
          @keyup.enter.native="getList"
        ></el-input>
        <figure>
          <span>任务名称</span>
          <el-select size="small" v-model="taskName" @change="getList">
            <el-option
              v-for="item in taskNameList"
              :key="item.taskName"
              :label="item.taskDesc"
              :value="item.taskName"
            ></el-option>
          </el-select>
        </figure>
      </div>
      <div class="btn">
        <el-button size="small" type="primary" @click="openSetTask('new')">新增</el-button>
      </div>
    </div>
    <section class="list">
      <header>
        <span>任务名称</span>
        <span>任务说明</span>
        <span>周期类型</span>
        <span>周期参数</span>
        <span>执行时间</span>
        <span>执行间隔</span>
        <span>创建人</span>
        <span>创建时间</span>
        <span>状态</span>
        <span>下次执行时间</span>
        <span>操作</span>
      </header>
      <ul>
        <li v-for="(item, index) in list" :key="item.eid">
          <span>{{ item.taskName | getTaskName(taskNameList) }}</span>
          <span>{{ item.taskDesc || '--' }}</span>
          <span>{{ item.periodType | getPeriodType }}</span>
          <span>{{ item.periodParam | getPeriodParam(item.periodType, param) }}</span>
          <span>{{ item.periodTime }}</span>
          <span>{{ item.taktTime || '--' }}</span>
          <span>{{ item.creator }}</span>
          <span>{{ item.createTime | getFormatDataTime }}</span>
          <span>{{ item.statu }}</span>
          <span>{{ item.nextFireTime | getFormatDataTime }}</span>
          <span>
            <!-- <b @click="openSetTask('update', item)">编辑</b> -->
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
      :total="rowSize"
    ></el-pagination>
    <el-dialog :title="dialog.title" :visible.sync="dialog.isShow" width="720px" custom-class="pop">
      <ul>
        <li>
          <el-select tit="任务名称" v-model="param.taskName" class="must" size="small">
            <el-option
              v-for="item in param.taskNameList"
              :key="item.taskName"
              :label="item.taskDesc"
              :value="item.taskName"
            ></el-option>
          </el-select>
        </li>
        <li>
          <div class="input" tit="任务说明">
            <el-input class="must" v-model="param.taskDesc" size="small" placeholder="请填写任务说明"></el-input>
          </div>
        </li>
        <li>
          <el-select
            tit="周期类型"
            v-model="param.periodType"
            class="must"
            size="small"
            @change="clearParam"
          >
            <el-option
              v-for="item in param.periodTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li v-if="checkPeriodParamStatus">
          <el-select
            tit="周期参数"
            size="small"
            :class="{ must: param.periodTypeMustList[param.periodType].periodParam }"
            v-model="param.periodParam"
          >
            <template v-if="param.periodType === 'MONTH'">
              <el-option
                v-for="item in param.periodParamInMONTH"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
            <template v-if="param.periodType === 'WEEK'">
              <el-option
                v-for="item in param.periodParamInWEEK"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </li>
        <li v-if="checkPeriodTimeStatus">
          <div class="input" tit="执行时间">
            <el-time-picker
              :class="{ must: param.periodTypeMustList[param.periodType].periodTime }"
              size="small"
              v-model="param.periodTime"
              value-format="HH:mm:ss"
              placeholder="任意时间点"
            ></el-time-picker>
          </div>
        </li>
        <li v-if="checkTaktTimeStatus">
          <el-select
            tit="执行间隔"
            :class="{ must: param.periodTypeMustList[param.periodType].taktTime }"
            v-model="param.taktTime"
            size="small"
          >
            <template v-if="param.periodType === 'HOUR'">
              <el-option
                v-for="item in param.taktTimeInHOUR"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </template>
            <template v-if="param.periodType === 'MINUTE'">
              <el-option
                v-for="item in param.taktTimeInMINUTE"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </template>
          </el-select>
        </li>
      </ul>
      <div class="btn">
        <el-button size="small" type="danger" @click="dialog.isShow = false" plain>取消</el-button>
        <el-button size="small" type="primary" @click="saveData" :disabled="checkSaveParam">保存</el-button>
      </div>
    </el-dialog>
  </main>
</template>
<script>
import tool from "./comm/tool.js";
import utils from "@/skyConfig/libs/utils";
export default {
  data() {
    return {
      taskName: "",
      keyword: "",
      pageIndex: 1,
      rows: 15,
      // 页面数据
      list: [],
      rowSize: 0,
      taskNameList: [],
      // 弹窗
      dialog: {
        isShow: false,
        title: "",
        type: null
      },
      // 新增/编辑对应的信息
      param: {
        // 任务名称
        taskName: "",
        taskNameList: [],
        // 任务说明
        taskDesc: "",
        // 周期类型
        periodType: "MONTH",
        periodTypeList: [
          {
            label: "月",
            value: "MONTH"
          },
          {
            label: "周",
            value: "WEEK"
          },
          {
            label: "天",
            value: "DAY"
          },
          {
            label: "小时",
            value: "HOUR"
          },
          {
            label: "分钟",
            value: "MINUTE"
          }
        ],
        periodTypeMustList: {
          MONTH: {
            taskName: true,
            taskDesc: true,
            periodParam: true,
            periodTime: true
          },
          WEEK: {
            taskName: true,
            taskDesc: true,
            periodParam: true,
            periodTime: true
          },
          DAY: {
            taskName: true,
            taskDesc: true,
            periodTime: true
          },
          HOUR: {
            taskName: true,
            taskDesc: true,
            taktTime: true
          },
          MINUTE: {
            taskName: true,
            taskDesc: true,
            taktTime: true
          }
        },
        // 周期参数
        periodParam: "",
        periodParamInWEEK: [
          {
            label: "星期日",
            value: 1
          },
          {
            label: "星期一",
            value: 2
          },
          {
            label: "星期二",
            value: 3
          },
          {
            label: "星期三",
            value: 4
          },
          {
            label: "星期四",
            value: 5
          },
          {
            label: "星期五",
            value: 6
          },
          {
            label: "星期六",
            value: 7
          }
        ],
        periodParamInMONTH: [],
        // 执行时间
        periodTime: "",
        // 执行间隔
        taktTime: "",
        taktTimeInHOUR: [],
        taktTimeInMINUTE: []
      }
    };
  },
  created() {
    this.getList();
    tool.getTaskTimeingList().then(list => {
      // 弹窗使用的列表
      this.param.taskNameList = [...list];
      // 页面使用的列表
      list.unshift({ taskName: "", taskDesc: "全部" });
      this.taskNameList = list;
    });

    // 懒人填充
    let periodParamInMONTH = [...Array(31)]
      .fill("1")
      .map((v, i) => (v = { label: i + 1 + "号", value: i + 1 }));
    this.param.periodParamInMONTH = periodParamInMONTH;

    let taktTimeInHOUR = [...Array(23)].fill(1).map((v, i) => (v = i + 1));
    this.param.taktTimeInHOUR = taktTimeInHOUR;

    let taktTimeInMINUTE = [...Array(55)].fill(1).map((v, i) => (v = i + 5));
    this.param.taktTimeInMINUTE = taktTimeInMINUTE;
  },
  methods: {
    getList() {
      const { taskName = "", keyword = "", pageIndex, rows } = this;
      const data =
        keyword === ""
          ? { taskName, pageIndex, rows }
          : { taskName, keyword, pageIndex, rows };
      this.$Api
        .get({ url: "/task/periodicTaskList", data })
        .then(({ data: res }) => {
          this.list = res.data;
          this.pageIndex = res.pageIndex;
          this.rowSize = res.rowSize;
        });
    },
    changePage(pageIndex) {
      this.pageIndex = pageIndex;
      this.getList();
    },
    changeRows(rows) {
      this.pageIndex = 1;
      this.rows = rows;
      this.getList();
    },
    openSetTask(type, item) {
      const title = type === "new" ? "新增" : "编辑";
      this.dialog = { isShow: true, title: `${title}定时任务`, type };
      // 新增 - 清理信息
      if (type === "new") {
        this.clearParam("all");
      }
      // 编辑 - 更新信息
      if (type === "update") {
        const {
          taskName,
          taskDesc,
          periodType,
          periodParam,
          periodTime,
          taktTime
        } = item;
        const updateData = {
          taskName,
          taskDesc,
          periodType,
          periodParam,
          periodTime,
          taktTime
        };
        this.param = { ...this.param, ...updateData };
      }
    },
    // 清理参数
    clearParam(type) {
      const param =
        type === "all"
          ? {
              taskName: "",
              taskDesc: "",
              periodParam: "",
              periodTime: "",
              taktTime: ""
            }
          : { periodParam: "", periodTime: "", taktTime: "" };
      this.param = { ...this.param, ...param };
    },
    // 保存
    saveData() {
      const {
        taskName, // 任务名称
        taskDesc, // 任务说明
        periodType, // 周期类型
        periodParam, // 周期参数
        periodTime, // 执行时间
        taktTime // 执行间隔
      } = this.param;
      const requestUrl = {
          MONTH: "addPeriodicTask",
          WEEK: "addWeeklyTask",
          DAY: "addEverydayTask",
          HOUR: "addHourlyTask",
          MINUTE: "addPerMinuteTask"
        },
        url = `/task/${requestUrl[periodType]}`,
        data = {
          taskName,
          taskDesc,
          periodType,
          periodParam,
          periodTime,
          taktTime
        };
      this.$Api.get({ url, data }).then(({ msg }) => {
        this.$message.success(msg);
        this.getList();
        this.clearParam();
        this.dialog.isShow = false;
      });
    },
    // 删除
    deleteTask(eid, index) {
      this.$confirm("此操作将删除该定时任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$Api
            .get({ url: "/task/delPeriodicTask", data: { eid } })
            .then(() => {
              this.$message.success("删除成功");
              this.list.splice(index, 1);
            });
        })
        .catch(() => {});
    }
  },
  computed: {
    checkPeriodParamStatus() {
      const { periodType } = this.param;
      return ["MONTH", "WEEK"].indexOf(periodType) !== -1;
    },
    checkPeriodTimeStatus() {
      const { periodType } = this.param;
      return ["MONTH", "WEEK", "DAY"].indexOf(periodType) !== -1;
    },
    checkTaktTimeStatus() {
      const { periodType } = this.param;
      return ["HOUR", "MINUTE"].indexOf(periodType) !== -1;
    },
    checkSaveParam() {
      const { periodType, periodTypeMustList } = this.param;
      const { param } = this;
      const check = periodTypeMustList[periodType];
      let result = true;
      for (let v in check) {
        if (!param[v] || param[v] === "") {
          result = false;
          break;
        }
      }
      return !result;
    }
  },
  filters: {
    getTaskName(taskName, list) {
      for (let v of list) {
        if (v.taskName === taskName) {
          return v.taskDesc;
        }
      }
      return taskName;
    },
    getFormatDataTime(val) {
      return utils.formatDataTime(val);
    },
    getPeriodType(val) {
      const tem = {
        MONTH: "月",
        WEEK: "周",
        DAY: "天",
        HOUR: "小时",
        MINUTE: "分钟"
      };
      return val in tem ? tem[val] : val;
    },
    getPeriodParam(periodType, type, param) {
      const { periodParamInWEEK, periodParamInMONTH } = param;
      let result;
      switch (type) {
        case "MONTH":
          for (let v of periodParamInMONTH) {
            if (v.value === periodType) {
              result = v.label;
              break;
            }
          }
          break;
        case "WEEK":
          for (let v of periodParamInWEEK) {
            if (v.value === periodType) {
              result = v.label;
              break;
            }
          }
          break;
        default:
          result = "--";
          break;
      }
      return result;
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

.head {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  .search {
    display: flex;

    .el-input {
      width: 280px;
    }

    figure {
      margin-left: 15px;
      color: #999;
    }
  }
}

.list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: 1px solid #CFD9E5;
  // max-height: 600px;
  max-height: calc(100% - 95px - 32px - 30px);
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
      width: calc(1 / 14 * 100%);
      box-sizing: border-box;

      &:last-of-type {
        border-right: none;
      }

      &:nth-of-type(5), &:nth-of-type(8), &:nth-of-type(10) {
        width: calc(2 / 14 * 100%);
      }
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
        width: calc(1 / 14 * 100%);
        text-align: center;
        box-sizing: border-box;
        word-wrap: break-word;
        table-layout: fixed;
        word-break: break-all;
        padding: 5px 0;
        word-wrap: break-word;

        &:first-of-type {
          border-left: none;
        }

        &:nth-of-type(5), &:nth-of-type(8), &:nth-of-type(10) {
          width: calc(2 / 14 * 100%);
        }

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

.pop {
  width: 720px;

  .must {
    position: relative;

    &:after {
      content: '*';
      position: absolute;
      right: -15px;
      bottom: 6px;
      font-size: 16px;
      color: #E60E32;
      line-height: 1;
      vertical-align: middle;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    // border-top: 1px solid #CFD9E5;
    padding: 0 24px;

    li {
      display: flex;
      flex-wrap: wrap;
      width: 50%;
      margin-top: 20px;

      p {
        width: 100%;
        font-size: 12px;
        color: #8A9199;
      }

      .el-input, .el-select {
        width: 240px;
      }

      .el-select, .input {
        &:before {
          display: flex;
          content: attr(tit);
          width: 100%;
          font-size: 12px;
          color: #8A9199;
        }
      }

      &:nth-of-type(2n) {
        justify-content: flex-end;

        p {
          text-indent: 65px;
        }
      }
    }
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    padding: 36px 24px 0 0;

    .el-button + .el-button {
      margin-left: 30px;
    }
  }
}
</style>
