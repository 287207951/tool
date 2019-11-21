<template>

  <el-card>
    <div slot="header"
         class="clearfix">
      <span>流程详情</span>
      <el-button style="float: right;padding:3px"
                 size="small"
                 v-show="!editing"
                 @click="editFlow"
                 type="text">编辑</el-button>
    </div>
    <div>
      <el-form :model="formData"
               :rules="validateRules"
               :validate-on-rule-change="false"
               ref="ruleForm"
               label-width="100px">
        <el-form-item label="流程状态"
                      v-if="!editing">
          <el-radio-group v-model="formData.statue"
                          @change="statusChange">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流程名称"
                      prop="processName">
          <span v-show="!editing">{{flowData.processName}}</span>
          <el-input v-show="editing"
                    v-model="formData.processName"></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <span v-show="!editing">{{flowData.processRemer}}</span>
          <el-input v-show="editing"
                    v-model="formData.processRemer"></el-input>
        </el-form-item>
        <el-form-item label="订单流程">
          <div v-show="!editing">
            <span v-for="(tag,index) in orderProcessT"
                  :key="tag.id">
              <el-tag @click="readonlyTagClick(tag)">
                {{tag.processName}}
              </el-tag>
              <span v-if="orderProcessT[index + 1]">--></span>
            </span>
          </div>

          <div v-show="editing">
            <span v-for="(tag,index) in orderProcess"
                  :key="tag.id">
              <el-tag :closable="true"
                      @click="taghandleClick(tag)"
                      @close="tagHandleClose(tag)">
                {{tag.processName}}
              </el-tag>
              <span v-if="orderProcess[index + 1]">--></span>
            </span>
            <el-button size="small"
                       type="primary"
                       plain
                       @click="clickAddNode(tag)">增加节点</el-button>
          </div>
        </el-form-item>
        <el-form-item label="更改时间"
                      v-show="!editing">
          <span>{{$api.dateGetDayTime(formData.createTime)}}</span>
        </el-form-item>
        <el-form-item v-show="editing">
          <el-button size="small"
                     @click="cancel">取消</el-button>
          <el-button size="small"
                     type="primary"
                     @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>

</template>

<script>
export default {
  props: {
    flowData: {
      required: true,
      default: () => { },
      type: Object
    },
    detailIndex: {
      required: true,
      type: Number
    }
  },
  computed: {
    validateRules () {
      return {
        processName: [
          { required: this.editing, message: '请输入流程名称', trigger: 'blur' }
        ],
      }
    },
    orderProcessT () {
      if (this.flowData.processTypes && this.flowData.processTypes.length) {
        return this.flowData.processTypes
      } else {
        return []
      }
    },
    orderProcess () {
      if (this.formData.processTypes && this.formData.processTypes.length) {
        return this.formData.processTypes
      } else {
        return []
      }
    }
  },
  data () {
    return {
      editing: false,
      formData: {},
      // orderProcess: [],
    }
  },
  created () {
  },
  methods: {
    openEditing (flag) {
      this.editing = flag;
    },
    readonlyTagClick (tag) {
      this.$emit('clickReadonlyTag', tag)
    },
    taghandleClick (tag) {
      const oderIndex = this.orderProcess.indexOf(tag)
      this.$emit('clickTag', this.detailIndex, oderIndex, this.orderProcess)
    },
    tagHandleClose (tag) {
      this.$confirm("确定要删除该节点么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formData.processTypes.splice(this.orderProcess.indexOf(tag), 1);
      }).catch(() => {

      })
    },
    setFlowProcess (newNode, orderIndex) {
      if (typeof orderIndex === 'number') {
        this.$set(this.formData.processTypes, orderIndex, newNode)
      } else {
        if (this.formData.processTypes && this.formData.processTypes.length) {
          this.formData.processTypes.push(newNode)
        } else {
          this.$set(this.formData, 'processTypes', [newNode])
        }
      }
    },
    clickAddNode () {
      this.$emit('clickAddNode', this.detailIndex, -1, this.orderProcess)
    },
    editFlow () {
      this.formData = this.$set(this, 'formData', JSON.parse(JSON.stringify(this.flowData)))
      this.editing = true;
    },
    statusChange (value) {
      this.$emit('statusChange', value, this.formData)
    },
    cancel () {
      this.editing = false;
    },
    save () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { processName, processRemer } = this.formData;

          let { processType, statue } = this.flowData;
          const processTypes = this.orderProcess.map((n, i) => {
            return {
              processStep: i + 1,
              processRank: 0,
              processName: n.processName,
              operareId: n.operareId
            }
          });
          statue = statue ? statue : 1;
          let params = { processName, processRemer, statue };
          params = Object.assign(this.flowData, params);

          params.processTypes = processTypes
          // const params = {
          //   processName,
          //   processRemer,
          //   processType,
          //   statue,
          //   processTypes
          // }
          let url = this.$portMain;
          if (this.flowData.id) {
            url += "/process/updataProcess"
          } else {
            url += "/process/addProcess"
          }
          this.$axios.post(url, params).then((res) => {
            if (res.data.code == 200) {
              this.editing = false;
              this.$emit('sucRevision', params)
            } else {
              this.$message.error(res.data.msg);
            }
          })
        } else {
          return false;
        }
      });
    }
  },
  updated () {
  },
  watch: {
    flowData: {
      handler (nv, ov) {
        let obj = Object.assign({}, nv, this.formData);
        obj = JSON.parse(JSON.stringify(obj))
        this.$set(this, 'formData', obj)
      },
      deep: true
    },
    // formData: {
    //   handler (nv, ov) {
    //     this.orderProcess = nv.processTypes || []
    //   },
    //   deep: true
    // },
  },

}
</script>

<style>
</style>
