<template>
  <el-dialog
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="400px"
    :before-close="handleClose"
  >
    <el-form
      :rules="rules"
      :model="form"
      :validate-on-rule-change="false"
      ref="dialogForm"
      label-width="80px"
      size="mini"
    >
      <el-form-item label="节点名称" prop="nodeName">
        <el-input v-model="form.nodeName" placeholder="节点名称"></el-input>
      </el-form-item>
      <input type="text" style="display:none" />
    </el-form>
    <el-input
      v-model="filterText"
      @input="filterChange"
      placeholder="请输入关键字搜索"
      style="margin-bottom:5px"
      prefix-icon="el-icon-search"
      size="mini"
    ></el-input>
    <div class="tree-container">
      <el-tree
        ref="tree"
        :filter-node-method="filterNode"
        show-checkbox
        default-expand-all
        :props="treeProps"
        :data="editedTreeData"
        :node-key="nodeKey"
        @check-change="handleCheckChange"
      ></el-tree>
    </div>

    <span slot="footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
a
<script>
export default {
  props: {
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "label",
          nodeKey: "id"
        };
      }
    },
    checkedIds: {
      type: Array,
      default: () => []
    },
    disabledIds: {
      type: Array,
      default: () => []
    },
    dialogTitle: {
      required: true,
      type: String
    },
    treeData: {
      type: Array,
      default: () => []
    },
    flowIndex: {
      required: true,
      type: Number
    }
  },
  computed: {
    childrenKey() {
      return this.treeProps.children;
    },
    nodeKey() {
      return this.treeProps.nodeKey;
    },
    editedTreeData() {
      let data = JSON.parse(JSON.stringify(this.treeData));
      this.recursionDisabled(data, this.disabledIds);
      return data;
    }
  },
  data() {
    var nodeNameValide = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入节点名称"));
      } else {
        callback();
      }
    };
    return {
      // flowIndex: null,
      orderIndex: null,
      filterText: "",
      form: {
        nodeName: ""
      },
      dialogVisible: false,
      rules: {
        nodeName: [{ validator: nodeNameValide, trigger: "blur" }]
      }
    };
  },
  methods: {
    recursionDisabled(data, disabledIds) {
      data.forEach(n => {
        if (disabledIds.indexOf(n.id) !== -1) {
          n.disabled = true;
        }
        if (n[this.childrenKey] && n[this.childrenKey].length) {
          this.recursionDisabled(n[this.childrenKey], disabledIds);
        }
      });
    },
    filterChange(val) {
      this.$refs.tree.filter(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      if (data.label) {
        return data.label.indexOf(value) !== -1;
      } else {
        return false;
      }
    },
    open(flowIndex, orderIndex) {
      this.flowIndex = flowIndex;
      this.orderIndex = orderIndex;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checkedIds);
      });
    },
    setCheckedKeys(arr) {
      this.$refs.tree.setCheckedKeys(arr);
    },
    handleClose(done) {
      this.$refs.dialogForm.clearValidate();
      done();
    },
    cancel() {
      this.dialogVisible = false;
    },
    setNodeName(value) {
      this.form.nodeName = value;
    },
    confirm() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          // console.log(this.$parent.$refs.flowDetail[this.flowIndex].flowData)
          // console.log(this.$parent.$refs.flowDetail[this.flowIndex].formData)
          //   const checkedIds = this.$refs.tree.getCheckedNodes().join(",");
          //   console.log(this.$refs.tree.getHalfCheckedNodes());
          //   console.log(this.$refs.tree.getHalfCheckedKeys());
          //   console.log(this.$refs.tree.getCurrentKey());
          //   console.log(this.$refs.tree.getCurrentNode());
          //   console.log(this.$refs.tree.getNode());
          //   console.log(this.$refs.tree.getCheckedKeys());
          const checkedIds = this.$refs.tree
            .getCheckedNodes()
            .filter(item => !item.deptName)
            .map(item => item.id)
            .join(",");
          if (checkedIds) {
            const obj = {
              processName: this.form.nodeName,
              operareId: checkedIds
            };
            this.$emit("confirm", obj, this.flowIndex, this.orderIndex);
            this.dialogVisible = false;
          } else {
            this.$message.error("请选择该节点审核人员");
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {}
};
</script>

<style scoped lang="stylus">
.tree-container {
  border: 1px solid #dedede;
  padding: 8px;
  height: 360px;
  overflow-y: auto;
}
</style>
>
</style>
