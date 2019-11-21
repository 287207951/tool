<template>
  <main>
    <header>
      <el-input
        v-model="search"
        size="small"
        placeholder="请输入关键字搜素"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getList"
      ></el-input>
    </header>
    <section>
      <div class="btn">
        <el-button size="small" type="primary" @click="dialogVisible = true">创建</el-button>
        <el-button size="small" type="primary" plain @click="saveData">保存</el-button>
        <el-button size="small" type="primary" plain @click="enableData">启用</el-button>
        <el-button size="small" type="primary" plain @click="prohibitData">禁用</el-button>
        <el-button size="small" type="warning" @click="deleteOption">删除</el-button>
      </div>
      <el-table
        :data="list"
        ref="multipleTable"
        style="width: 100%"
        @selection-change="changeSelection"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="sort" label="排序">
          <template slot-scope="scope">
            <input
              type="number"
              v-model.number.lazy="scope.row.sort"
              name
              @change="checkInput(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="开票类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type | getType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间"></el-table-column>
        <el-table-column prop="createEr" label="创建人"></el-table-column>
        <el-table-column prop="status" label="使用状态" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-dialog title="新建开票类型" :visible.sync="dialogVisible" width="480px">
      <ul>
        <li>
          <span>开票类型</span>
          <el-input v-model.trim="createType" size="small" placeholder="请填写类型名称"></el-input>
        </li>
      </ul>
      <div class="btn">
        <el-button size="small" type="primary" plain @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="createTypeFun">确定</el-button>
      </div>
    </el-dialog>
  </main>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      list: [],
      search: "", // 搜索内容
      selList: [], // 选中的列表项
      dialogVisible: false,
      createType: "" // 新建的类型名称
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { search } = this;
      this.$Api
        .get({ url: "/discount/selectSaveOweTypeList", data: { search } })
        .then(({ data }) => {
          data.map(v => (v.createAt = this.$api.dateGetDayTime(v.createAt)));
          this.list = data;
        });
    },
    // 检测排序合法值
    checkInput(item) {
      if (item.sort % 1 !== 0) {
        item.sort = undefined;
        this.$message.warning(
          "排序有误，请输入正确的数值。（排序只能输入整数）"
        );
      }
    },
    // 选中
    changeSelection(list) {
      this.selList = list; // 被选中的列表
    },
    // 清除选中状态
    clearSelect() {
      this.$refs.multipleTable.clearSelection();
      this.selList = [];
    },
    // 删除
    deleteOption() {
      const { selList } = this;
      if (this.checkSelect()) {
        this.$confirm("是否删除？")
          .then(() => {
            const ids = [];
            selList.map(v => ids.push(v.id));
            // 删除请求
            this.$Api
              .post({
                url: "/discount/deleteSaveOweType",
                data: { ids: JSON.stringify(ids) },
                isForm: true
              })
              .then(() => {
                let list = [...this.list];
                this.list = list.filter(v => ids.indexOf(v.id) === -1);
                this.selList = [];
                this.$message.success("删除成功。");
              });
          })
          .catch(() => {});
      }
    },
    // 创建
    createTypeFun() {
      const { createType } = this;
      if (createType.length === 0) {
        this.$message.warning("请输入类型名称！");
        return;
      }

      this.$Api
        .post({
          url: "/discount/createSaveOweType",
          data: { type: createType },
          isForm: true
        })
        .then(() => {
          this.createType = undefined;
          this.dialogVisible = false;
          this.getList();
          this.$message.success("创建成功。");
        });
    },
    // 检测是否有选中
    checkSelect() {
      const { selList } = this;
      if (selList.length < 1) {
        this.$message.warning("请选择需要操作的选项！");
        return false;
      }
      return true;
    },
    // 保存
    saveData() {
      if (this.checkSelect()) {
        const { selList } = this;
        let saveOweTypes = [];
        selList.map(v => saveOweTypes.push({ id: v.id, sort: v.sort }));
        this.$Api
          .post({
            url: "/discount/updateSaveOweType",
            data: { saveOweTypes: JSON.stringify(saveOweTypes) },
            isForm: true
          })
          .then(() => {
            this.$message.success("保存成功");
            this.clearSelect();
            this.getList();
            // this.list.sort((pre, next) => pre.sort - next.sort);
          });
      }
    },
    // 启用
    enableData() {
      if (this.checkSelect()) {
        const { selList } = this;
        let ids = [];
        selList.map(v => ids.push(v.id));
        this.$Api
          .post({
            url: "/discount/updateSaveOweTypeStatueTrue",
            data: { ids: JSON.stringify(ids) },
            isForm: true
          })
          .then(() => {
            let { list } = this;
            list.map(v => {
              if (ids.indexOf(v.id) > -1) v.status = "true";
            });
            this.$message.success("启用成功。");
          });
      }
    },
    prohibitData() {
      if (this.checkSelect()) {
        const { selList } = this;
        let ids = [];
        selList.map(v => ids.push(v.id));
        this.$Api
          .post({
            url: "/discount/updateSaveOweTypeStatueFalse",
            data: { ids: JSON.stringify(ids) },
            isForm: true
          })
          .then(() => {
            let { list } = this;
            list.map(v => {
              if (ids.indexOf(v.id) > -1) v.status = "false";
            });
            this.$message.success("禁用成功。");
          });
      }
    }
  },
  filters: {
    getType(val) {
      switch (val) {
        case 1:
          return "专用发票";
        case 2:
          return "普通发票";
        default:
          return val || "-";
      }
    },
    getStatus(b) {
      return b === "true" ? "启用" : "禁用";
    }
  }
};
</script>
<style scoped lang="stylus">
main {
  header .el-input {
    width: 256px;
  }

  section {
    .btn {
      margin-top: 15px;

      .el-button {
        width: 60px;
        margin-right: 10px;
      }
    }

    .el-table {
      margin-top: 15px;

      .cell {
        line-height: 30px;
      }

      input {
        box-sizing: border-box;
        width: 80px;
        height: 30px;
        border: 1px solid #899199;
        padding: 0 8px;
        -moz-appearance: textfield;

        &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }

  .el-dialog {
    ul {
      li {
        display: flex;
        align-items: center;

        span {
          width: 70px;
          font-size: 14px;
          color: #8A9199;
        }

        .el-input {
          width: 240px;
        }
      }
    }

    .btn {
      display: flex;
      justify-content: flex-end;
      margin-top: 60px;

      .el-button {
        width: 60px;
        margin-left: 30px;
      }
    }
  }
}
</style>