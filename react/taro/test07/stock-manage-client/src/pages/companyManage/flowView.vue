<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>公司管理</el-breadcrumb-item>
      <el-breadcrumb-item>流程管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr"></div>
    <div class="flow-container">
      <el-tabs tab-position="left" v-model="flowIndex" style="height: 100%;width:100%;">
        <el-tab-pane v-for="(flowItem,index) in flowArr" :name="index" :key="flowItem.processType">
          <span v-if="flowItem.id" slot="label">{{flowItem.label}}</span>
          <span v-else slot="label">{{flowItem.label}}</span>
          <flow-detail
            ref="flowDetail"
            :detailIndex="index"
            :flowData="flowItem"
            @sucRevision="sucRevision"
            @clickTag="clickTag"
            @clickReadonlyTag="clickReadonlyTag"
            @clickAddNode="clickAddNode"
            @statusChange="statusChange"
          ></flow-detail>
        </el-tab-pane>
      </el-tabs>
    </div>
    <flow-tree-select
      :treeData="orderFlow.nodesData"
      :dialogTitle="flowTreeDialogTitle"
      :disabledIds="orderFlow.disabledIds"
      :checkedIds="orderFlow.checkedIds"
      :flowIndex="flowIndex"
      @confirm="treeSelectConfirm"
      ref="treeSelectDialog"
    ></flow-tree-select>
    <el-dialog title="节点详情" :visible.sync="readonlyDialog.show" width="1266px">
      <el-form>
        <el-form-item label="节点名称" v-if="!editing">{{readonlyDialog.nodeName}}</el-form-item>
      </el-form>
      <div v-for="item in readonlyDialog.nodes" :key="item.id">
        <el-row>
          <el-col :span="24" style="color:rgba(138,145,153,1);font-size:14px;">{{item.label}}</el-col>
        </el-row>
        <el-row>
          <el-col
            v-for="el in item.children"
            :span="6"
            style="padding-left:15px;"
            :key="el.id"
          >{{el.label}}</el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import flowDetail from "@/components/flow-detail.vue";
import flowTreeSelect from "@/components/flow-tree-select.vue";
export default {
  data() {
    return {
      flowIndex: 0,
      flowArr: [],
      orderFlow: {
        nodesData: [],
        checkedIds: [],
        disabledIds: []
      },
      readonlyDialog: {
        nodes: [],
        nodeName: "",
        show: false
      }
    };
  },
  created() {
    this.created_fun();
  },
  components: {
    "flow-detail": flowDetail,
    "flow-tree-select": flowTreeSelect
  },
  computed: {
    processTypeArr() {
      return this.flowArr.map(n => n.processType);
    }
  },
  methods: {
    getCheckdNodes(arr, index) {
      return arr[index].operareId.split(",");
    },
    getDisabledNodes(arr, index) {
      var newArr = arr
        .filter((n, i) => {
          return i !== index;
        })
        .map(n => {
          return n.operareId.split(",");
        });
      if (newArr.length) {
        return newArr
          .reduce((a, b) => {
            return a.concat(b);
          })
          .map(n => parseInt(n));
      } else {
        return [];
      }
    },
    treeSelectConfirm(newNode, flowIndex, orderIndex) {
      this.$refs.flowDetail[flowIndex].setFlowProcess(newNode, orderIndex);
    },
    treePropNameModify(arr) {
      arr.forEach((n, i) => {
        n.id = n.deptId;
        n.label = n.deptName;
        n.children = n.members;
        delete n.deptId;
        // delete n.deptName
        delete n.members;
        if (n.children && n.children.length) {
          n.children.forEach(j => {
            j.label = j.concat;
            j.id = j.userId;
            delete j.concat;
            delete j.userId;
          });
        }
      });
      return arr;
    },
    getMembers() {
      return this.$axios.get(this.$portMain + "/company/members");
    },
    sucRevision(data) {
      let index = this.flowArr
        .map(n => n.processType)
        .indexOf(data.processType);
      this.$set(
        this.flowArr,
        index,
        Object.assign({}, this.flowArr[index], data)
      );
      // this.set(this.orderFlow, 'disabledIds', [])
      // this.set(this.orderFlow,'checkedIds',[])
      this.created_fun();
    },
    setReadonlyNodes(selectNodes) {
      let nodes = [];
      this.orderFlow.nodesData.forEach(n => {
        if (selectNodes.indexOf(n.id) !== -1) {
          nodes.push(n);
        } else {
          if (n.children && n.children.length) {
            const arr = n.children.filter(j => {
              return selectNodes.indexOf(j.id) !== -1;
            });
            if (arr.length) {
              const newObj = JSON.parse(JSON.stringify(n));
              newObj.children = arr;
              nodes.push(newObj);
            }
          }
        }
      });
      this.$set(this.readonlyDialog, "nodes", nodes);
    },
    clickReadonlyTag(tag) {
      this.readonlyDialog.nodeName = tag.processName;
      const selectNodes = tag.operareId.split(",").map(n => Number(n));
      if (this.orderFlow.nodesData.length === 0) {
        this.getMembers().then(res => {
          if (res.data.code == 200) {
            this.orderFlow.nodesData = this.treePropNameModify(res.data.data);
            this.setReadonlyNodes(selectNodes);
            this.readonlyDialog.show = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
      } else {
        this.setReadonlyNodes(selectNodes);
        this.readonlyDialog.show = true;
      }
    },
    clickTag(flowIndex, oderIndex, oderData) {
      this.flowTreeDialogTitle = "编辑节点";
      if (oderData && oderData.length) {
        this.orderFlow.checkedIds = this.getCheckdNodes(oderData, oderIndex);
        this.orderFlow.disabledIds = this.getDisabledNodes(oderData, oderIndex);
      }
      this.$refs.treeSelectDialog.setNodeName(oderData[oderIndex].processName);
      if (this.orderFlow.nodesData.length === 0) {
        this.getMembers().then(res => {
          if (res.data.code == 200) {
            this.orderFlow.nodesData = this.treePropNameModify(res.data.data);
            this.$nextTick(() => {
              this.$refs.treeSelectDialog.open(flowIndex, oderIndex);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
      } else {
        this.$nextTick(() => {
          this.$refs.treeSelectDialog.open(flowIndex, oderIndex);
        });
      }
    },
    clickAddNode(index, oderIndex, oderData) {
      this.flowTreeDialogTitle = "添加新节点";
      this.orderFlow.checkedIds = [];
      this.orderFlow.disabledIds = [];
      if (oderData && oderData.length) {
        this.orderFlow.disabledIds = this.getDisabledNodes(oderData, oderIndex);
      }
      this.$refs.treeSelectDialog.setNodeName("");
      if (this.orderFlow.nodesData.length === 0) {
        this.getMembers().then(res => {
          if (res.data.code == 200) {
            this.orderFlow.nodesData = this.treePropNameModify(res.data.data);
            this.$nextTick(() => {
              this.$refs.treeSelectDialog.open(index);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
      } else {
        this.$refs.treeSelectDialog.open(index);
      }
    },
    statusChange(statue, data) {
      const params = {
        bizType: data.processType,
        statue
      };
      const index = this.processTypeArr.indexOf(data.processType);
      this.$axios({
        url: this.$portMain + "/process/updateProcessStatue",
        params,
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$set(this.flowArr[index], "statue", statue);
        } else {
          const destatue = statue === 1 ? 2 : 1;
          this.$message.error(res.data.msg);
          this.$set(this.flowArr[index], "statue", destatue);
        }
      });
    },
    findSelectProcessByType() {
      return this.$axios
        .get(this.$portMain + "/process/selectProcessByType", {})
        .then(res => {
          if (res.data.code == 200) {
            const data = res.data.data;
            this.$set(
              this,
              "flowArr",
              Object.keys(data).map(k => {
                return {
                  label: data[k],
                  processType: k
                };
              })
            );
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },

    findProcess() {
      return this.$axios
        .post(this.$portMain + "/process/findProcess", {})
        .then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            const flowArrProcessTypes = this.flowArr.map(n => n.processType);
            const processTypes = data.forEach((element, jIndex) => {
              const index = flowArrProcessTypes.indexOf(element.processType);
              if (index !== -1) {
                this.$set(
                  this.flowArr,
                  index,
                  Object.assign({}, this.flowArr[index], element)
                );
              } else {
                this.$refs.flowDetail[jIndex].openEditing;
              }
            });
            this.flowArr.forEach((n, i) => {
              if (n.id) {
                this.$refs.flowDetail[i].openEditing(false);
              } else {
                this.$refs.flowDetail[i].openEditing(true);
              }
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    created_fun() {
      this.findSelectProcessByType().then(() => {
        this.findProcess();
      });
    },
    // 编辑流程
    editFlow(flowItem) {
      const index = this.flowArr.indexOf(flowItem);
      this.$set(this.flowArr[index], "editing", true);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.flow-container {
  position: absolute;
  bottom: 0;
  right: 15px;
  left: 15px;
  top: 60px;
  display: flex;

  .flow-list {
    width: 240px;

    .box-card {
      height: 99%;
    }

    &-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(46, 48, 51, 1);
    }

    &-item {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  .flow-detail {
    flex-grow: 1;
  }
}
</style>
