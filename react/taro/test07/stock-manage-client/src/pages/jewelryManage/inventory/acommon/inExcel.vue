<template>
  <el-dialog title="导入设置" width="640px" :visible.sync="inExcelShow" @close="cancelFun">
    <div class="upload-con newDialog">
      <div class="line"></div>
      <!-- <p class="upc-tit">点击上传Excel数据</p> -->

      <div class="content">
        <!-- <div class="left">
          <div class="upc-mi">
            <label for="exFileThree" :style="prosNameStyleThree">
              <span>{{prosName || '点击上传Excel数据' }}</span>
              <input id="exFileThree" type="file" @change="uploadProsThree" ref="exFileThree" />
            </label>
          </div>
          <div style="display:flex">
            <div class="upc-pro">
              <el-progress
                v-show="exProgressThree"
                :percentage="exProgressThree"
                :status="exProStatusThree"
                style="width: 140px"
              ></el-progress>
            </div>
          </div>
        </div>-->
        <div class="right">
          <div>
            <span class="smallTitle">盘点仓库</span>
            <el-select
              v-model="params.wareId"
              placeholder="请选择"
              size="small"
              class="width240"
              @change="getWare"
            >
              <el-option
                v-for="item in repoListList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span class="txtRed left10 txt16">*</span>
          </div>
          <div style="height: 10px"></div>
          <div>
            <span class="smallTitle">盘点库柜</span>
            <el-select
              v-model="params.sarkId"
              @change="getSark"
              placeholder="请选择"
              size="small"
              class="width240"
            >
              <el-option
                v-for="item in sarkList"
                :key="item.id"
                :label="item.sarkName"
                :value="item.id"
              ></el-option>
            </el-select>
            <span class="txtRed left10 txt16">*</span>
          </div>
          <div class="file-top">
            <i class="el-icon-folder-add file-icon"></i>
            <label for="exFileThree" :style="prosNameStyleThree">
              <span class="up-file">{{prosNameThree || '点击上传Excel文件' }}</span>
              <input id="exFileThree" type="file" @change="uploadProsThree" ref="exFileThree" />
            </label>
            <div style="display:flex">
              <div class="upc-pro">
                <el-progress
                  v-show="exProgressThree"
                  :percentage="exProgressThree"
                  :status="exProStatusThree"
                  style="width: 140px"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain @click="cancelFun">取消</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="exportLoading"
          @click="dlUploadClickThree"
        >开始导入</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: [`inExcelShow`],
  data() {
    return {
      exportLoading: false,
      prosNameThree: "",
      exProgressThree: ``,
      exProStatusThree: ``,
      repoListList: [], // 仓库列表
      sarkList: [], // 货柜列表
      params: {
        wareId: ``,
        sarkId: ``
      }
    };
  },

  mounted() {
    this.confRepoList();
  },

  methods: {
    //取消
    cancelFun() {
      this.$emit("cancel", "");
    },

    getWare(e) {
      this.params.wareName = this.getWareName(e);
      this.params.sarkId = ``;
      this.sarkLoad();
    },

    getWareName(e) {
      let name = ``;
      this.repoListList.forEach(item => {
        if (item.id === e) {
          name = item.name;
        }
      });
      return name;
    },

    getSarkName(e) {
      let name = ``;
      this.sarkList.forEach(item => {
        if (item.id === e) {
          name = item.sarkName;
        }
      });
      return name;
    },

    // 查看当前用户部门的仓库
    confRepoList() {
      const self = this;
      let params = {
        PRS: {
          type: `NORMAL`
        }
      };
      this.$axios
        .get(this.$portMain + "/bizWare/select", params)
        .then(function(res) {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              item.name = item.wareName;
            });
            self.repoListList = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //货柜列表搜索
    sarkLoad() {
      const { wareId } = this.params;
      let params = {
        wareId
      };
      this.$api.formdataPostFun(
        this.$portMain + "/bizSark/select",
        params,
        res => {
          this.sarkList = res.data;
        }
      );
    },

    uploadProsThree(e) {
      this.excelFileThree = e.target.files[0];
      this.prosNameThree = this.excelFileThree.name;
      this.prosNameStyleThree = {
        background: "none"
      };
      this.exProgressThree = 0;
      this.exProStatusThree = "";
      this.exBtnThree = false;
    },

    dlUploadClickThree() {
      const { wareId, sarkId, wareName } = this.params;
      //   let params = {
      //     files: this.excelFileThree,
      //     wareId,
      //     wareName: this.getWareName(wareId),
      //     sarkId,
      //     sarkName: this.getSarkName(sarkId)
      //   };
      let self = this;
      if (!wareId) {
        this.$message.error("请上传仓库");
        return;
      }
      if (!sarkId) {
        this.$message.error("请上传库存");
        return;
      }
      if (!this.excelFileThree) {
        this.$message.error("请上传excel");
        return;
      }

      let param = new FormData(); // 创建form对象
      param.append("files", this.excelFileThree); // 通过append向form对象添加数据
      param.append("wareId", wareId); // 通过append向form对象添加数据
      param.append("wareName", wareName); // 通过append向form对象添加数据
      param.append("sarkId", sarkId); // 通过append向form对象添加数据
      param.append("sarkName", this.getSarkName(sarkId)); // 通过append向form对象添加数据
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: progressEvent => {
          var complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          this.exProgressThree = complete;
        }
      };
      this.exportLoading = true;
      // 添加请求头
      this.$axios
        .post(this.$portMain + "/checkStock/upload", param, config)
        .then(res => {
          this.exportLoading = false;
          if (res.data.code == 200) {
            self.exBtnThree = true;
            self.$message.success(res.data.msg);
            self.exProStatusThree = `success`;
            self.$refs.exFileThree.value = "";
            self.$emit(`upLoadSuccess`, {});
          } else {
            self.$message.error(res.data.msg);
            self.exProStatusThree = `exception`;
            self.$refs.exFileThree.value = "";
          }
        });
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);

.upload-con {
  .upc-tit {
    margin-bottom: 15px;
  }

  .upc-down {
    margin-bottom: 40px;
  }

  .upc-mi {
    display: flex;
    margin-bottom: 14px;

    & > label {
      display: block;
      box-sizing: border-box;
      width: 100px;
      height: 60px;
      font-size: 12px;
      color: $base-color;
      text-align: center;
      background: url('/static/images/img-upload.png') no-repeat;
      background-size: 100% 100%;
      margin-right: 20px;
      padding-top: 28px;

      & > input {
        /* opacity: 0; */
        display: none;
      }
    }

    & > div:hover {
      cursor: pointer;
    }
  }

  .upc-pro {
    display: flex;
    margin-bottom: 10px;
    width: 140px;
  }

  .upc-warn {
    color: #888;

    .upcw-t {
      color: $base-color;
    }

    > p > span {
      color: $base-color;
      margin-right: 8px;
    }
  }
}

.content {
  display: flex;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: -10px;
}

.file-top {
  cursor: pointer;
  margin-top: 16px;
}

.file-icon {
  font-size: 16px;
  color: red;
}

.up-file {
  color: $base-color;
}

#exFileThree {
  opacity: 0;
}
</style>
