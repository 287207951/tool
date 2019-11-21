<template>
  <div class="conBigDiv messageWrap" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>消息中心</el-breadcrumb-item>
      <el-breadcrumb-item>业务消息</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部消息" name="first" class="tab">
            <el-checkbox-group v-model="checkedAllData" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="(item, index) in inforAllData"
                :label="item"
                :key="index"
                class="line"
              >
                <div v-if="item.msgStatu == 0" @click="handle(item, $event)" class="divWidth">
                  <span class="smallTitle">{{item.createTime}}</span>
                  <div class="text fontBlack">
                    【系统消息】{{item.msgBody}}
                    <span class="fontRed">马上处理</span>
                  </div>
                </div>
                <div v-if="item.msgStatu == 1">
                  <span class="smallTitle">{{item.createTime}}</span>
                  <div class="text fontColor">【系统消息】{{item.msgBody}}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <el-row>
              <el-col :span="24" class="selectAll Nodata" v-if="inforAllData.length == 0">暂无数据</el-col>
            </el-row>

            <el-row class="footer">
              <el-col :span="7" class="pageD">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
                  <span class="selectAll">全选</span>
                </el-checkbox>
                <el-button
                  type="danger"
                  size="small"
                  @click="del"
                  v-if="checkedAllData.length > 0"
                >删除</el-button>
                <el-button type="info" size="small" disabled v-if="checkedAllData.length == 0">删除</el-button>
              </el-col>
              <el-col :span="17">
                <div class="pageD">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNum1"
                    :page-sizes="[12,30, 50, 100]"
                    :page-size.sync="pageSize1"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="goldSize1"
                    background
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="未处理消息" name="second" class="tab">
            <el-checkbox-group v-model="checkedAllDataUnread" @change="handleCheckedCitiesChange2">
              <el-checkbox
                v-for="(item, index) in unReadAllData"
                :label="item"
                :key="index"
                class="line"
              >
                <div v-if="item.msgStatu == 0" @click="handle(item, $event)" class="divWidth">
                  <span class="smallTitle">{{item.createTime}}</span>
                  <div class="text fontBlack">
                    【系统消息】{{item.msgBody}}
                    <span class="fontRed">马上处理</span>
                  </div>
                </div>
                <div v-if="item.msgStatu == 1">
                  <span class="smallTitle">{{item.createTime}}</span>
                  <div class="text fontColor">【系统消息】{{item.msgBody}}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <el-row>
              <el-col :span="24" class="selectAll Nodata" v-if="unReadAllData.length == 0">暂无数据</el-col>
            </el-row>

            <el-row class="footer">
              <el-col :span="7" class="pageD">
                <el-checkbox v-model="checkAllUnread" @change="handleCheckAllChange2">
                  <span class="selectAll">全选</span>
                </el-checkbox>
                <el-button
                  type="danger"
                  size="small"
                  @click="delUnread"
                  v-if="checkedAllDataUnread.length > 0"
                >删除</el-button>
                <el-button
                  type="info"
                  size="small"
                  disabled
                  v-if="checkedAllDataUnread.length == 0"
                >删除</el-button>
              </el-col>
              <el-col :span="17">
                <div class="pageD">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNum2"
                    :page-sizes="[12,30, 50, 100]"
                    :page-size.sync="pageSize2"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="goldSize2"
                    background
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="已处理消息" name="third" class="tab">
            <el-checkbox-group v-model="checkedAllDataRead" @change="handleCheckedCitiesChange3">
              <el-checkbox
                v-for="(item, index) in readData"
                :label="item"
                :key="index"
                class="line"
              >
                <div v-if="item.msgStatu == 0" @click="handle(item, $event)" class="divWidth">
                  <span class="smallTitle">{{item.createTime}}</span>
                  <div class="text fontBlack">
                    【系统消息】{{item.msgBody}}
                    <span class="fontRed">马上处理</span>
                  </div>
                </div>
                <div v-if="item.msgStatu == 1">
                  <span class="smallTitle">{{item.createTime}}</span>
                  <div class="text fontColor">【系统消息】{{item.msgBody}}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <el-row>
              <el-col :span="24" class="selectAll Nodata" v-if="readData.length == 0">暂无数据</el-col>
            </el-row>

            <el-row class="footer">
              <el-col :span="7" class="pageD">
                <el-checkbox v-model="checkAllRead" @change="handleCheckAllChange3">
                  <span class="selectAll">全选</span>
                </el-checkbox>
                <el-button
                  type="danger"
                  size="small"
                  @click="delRead"
                  v-if="checkedAllDataRead.length > 0"
                >删除</el-button>
                <el-button
                  type="info"
                  size="small"
                  disabled
                  v-if="checkedAllDataRead.length == 0"
                >删除</el-button>
              </el-col>
              <el-col :span="17">
                <div class="pageD">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNum3"
                    :page-sizes="[12,30, 50, 100]"
                    :page-size.sync="pageSize3"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="goldSize3"
                    background
                  ></el-pagination>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      checkedAllData: [], // 全部消息----单选的数据
      checkedAllDataUnread: [], //未读消息----单选的数据
      checkedAllDataRead: [], //已读消息----单选的数据
      checkAll: false, // 全部消息----全选按钮的状态值（true\false）
      checkAllUnread: false, // 未读消息----全选按钮的状态值（true\false）
      checkAllRead: false, // 已读消息----全选按钮的状态值（true\false）
      pageNum1: 1, //默认第一页
      pageSize1: 12, //每页显示多少条记录，默认12条
      goldSize1: 0, //金料单总数
      pageNum2: 1, //默认第一页
      pageSize2: 12, //每页显示多少条记录，默认12条
      goldSize2: 0, //金料单总数
      pageNum3: 1, //默认第一页
      pageSize3: 12, //每页显示多少条记录，默认12条
      goldSize3: 0, //金料单总数
      inforAllData: "", // 系统消息的全部数据
      unReadAllData: "", // 未读数据
      readData: "", // 已读数据
      activeName: "first", //选项卡默认第几项
      readData: "", // 总共未读消息数量
      businessReadData: "" // 业务总共未读消息数量
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.displayAllData();
    },
    // 全部数据
    displayAllData() {
      this.loading = true;
      var self = this;
      let params = {
        pageIndex: self.pageNum1,
        rows: self.pageSize1,
        msgType: "REMIND",
        msgStatu: ""
      };
      this.$axios
        .post(this.$portMain + "/msg/queryMsg", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.inforAllData = res.data.data.data;
            self.goldSize1 = res.data.data.rowSize;
            self.inforAllData.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
            self.checkedAllData = []; // 全部消息----单选的数据
            self.checkAll = false; // 全部消息----全选按钮的状态值（true\false）
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 未读数据
    getUnreadAllData(statu) {
      var self = this;
      let params = {
        pageIndex: self.pageNum2,
        rows: self.pageSize2,
        msgType: "REMIND",
        msgStatu: statu
      };
      this.$axios
        .post(this.$portMain + "/msg/queryMsg", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.unReadAllData = res.data.data.data;
            self.goldSize2 = res.data.data.rowSize;
            self.unReadAllData.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
            self.checkedAllDataUnread = []; //未读消息----单选的数据
            self.checkAllUnread = false; // 未读消息----全选按钮的状态值（true\false）
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 已读数据
    getReadAllData(statu) {
      var self = this;
      let params = {
        pageIndex: self.pageNum3,
        rows: self.pageSize3,
        msgType: "REMIND",
        msgStatu: statu
      };
      this.$axios
        .post(this.$portMain + "/msg/queryMsg", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.readData = res.data.data.data;
            self.goldSize3 = res.data.data.rowSize;
            self.readData.forEach((item, index) => {
              item.createTime = self.$api.dateGetDay(item.createTime);
            });
            self.checkedAllDataRead = []; //已读消息----单选的数据
            self.checkAllRead = false; // 已读消息----全选按钮的状态值（true\false）
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //分页事件开始
    handleSizeChange(val) {
      var self = this;
      if (this.activeName == "first") {
        self.pageSize1 = val;
        self.displayAllData();
      } else if (this.activeName == "second") {
        self.pageSize2 = val;
        this.getUnreadAllData(0);
      } else if (this.activeName == "third") {
        self.pageSize3 = val;
        this.getReadAllData(1);
      }
    },
    handleCurrentChange(val) {
      var self = this;
      if (this.activeName == "first") {
        self.pageNum1 = val;
        self.displayAllData();
      } else if (this.activeName == "second") {
        self.pageNum2 = val;
        this.getUnreadAllData(0);
      } else if (this.activeName == "third") {
        self.pageNum3 = val;
        this.getReadAllData(1);
      }
    },
    //分页事件结束
    //全部消息---全选事件
    handleCheckAllChange(val) {
      this.checkedAllData = val ? this.inforAllData : [];
    },
    //未读消息---全选事件
    handleCheckAllChange2(val) {
      this.checkedAllDataUnread = val ? this.unReadAllData : [];
    },
    //已读消息---全选事件
    handleCheckAllChange3(val) {
      this.checkedAllDataRead = val ? this.readData : [];
    },
    //全部消息---单选事件
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.inforAllData.length;
    },
    //未读消息---单选事件
    handleCheckedCitiesChange2(value) {
      let checkedCount = value.length;
      this.checkAllUnread = checkedCount === this.unReadAllData.length;
    },
    //已读消息---单选事件
    handleCheckedCitiesChange3(value) {
      let checkedCount = value.length;
      this.checkAllRead = checkedCount === this.readData.length;
    },
    del() {
      // 全部消息-------------删除
      let self = this;
      let arr = [];
      this.checkedAllData.forEach(item => {
        arr.push(item.msgId);
      });
      let params = {
        PRS: {
          msgIds: arr
        }
      };
      this.$confirm("确定要删除该信息么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.$axios
          .get(this.$portMain + "/msg/delMsgBatch", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("删除成功！");
              self.displayAllData();
              self.refresh();
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    // 删除未处理消息
    delUnread() {
      let self = this;
      let arr = [];
      this.checkedAllDataUnread.forEach(item => {
        arr.push(item.msgId);
      });
      let params = {
        PRS: {
          msgIds: arr
        }
      };
      this.$confirm("确定要删除该信息么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.$axios
          .get(this.$portMain + "/msg/delMsgBatch", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("删除成功！");
              self.getUnreadAllData(0);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    delRead() {
      // 已读消息
      let self = this;
      let arr = [];
      this.checkedAllDataRead.forEach(item => {
        arr.push(item.msgId);
      });
      let params = {
        PRS: {
          msgIds: arr
        }
      };
      this.$confirm("确定要删除该信息么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.$axios
          .get(this.$portMain + "/msg/delMsgBatch", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("删除成功！");
              self.getReadAllData(1);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
    },
    //传递未读信息数量
    refresh() {
      Promise.all([self.countFun(), self.businessUnreadCount()])
        .then(result => {
          self.$root.eventHub.$emit(
            "Business_Message_State",
            self.readData,
            self.businessReadData
          );
        })
        .catch(err => {
          self.$root.eventHub.$emit(
            "Business_Message_State",
            self.readData,
            self.businessReadData
          );
        });
    },
    handle(item, event) {
      // 马上处理
      let self = this;
      event.preventDefault();
      let params = {
        PRS: {
          msgId: item.msgId
        }
      };
      this.$axios
        .get(this.$portMain + "/msg/setRead", params)
        .then(function(res) {
          if (res.data.code == 200) {
            if (self.activeName == "first") {
              self.displayAllData();
            } else if (self.activeName == "second") {
              self.getUnreadAllData(0);
            } else if (self.activeName == "third") {
              self.getReadAllData(1);
            }
            self.refresh();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    handleClick(tab) {
      this.$root.eventHub.$emit("Message_State", "kong");
      // 选项卡
      this.checkedAllData = []; // 全部消息----单选的数据
      this.checkedAllDataUnread = []; //未读消息----单选的数据
      this.checkedAllDataRead = []; //已读消息----单选的数据
      this.checkAll = false; // 全部消息----全选按钮的状态值（true\false）
      this.checkAllUnread = false; // 未读消息----全选按钮的状态值（true\false）
      this.checkAllRead = false; // 已读消息----全选按钮的状态值（true\false）
      this.pageNum1 = 1; //默认第一页
      this.pageSize1 = 12; //每页显示多少条记录，默认12条
      this.pageNum2 = 1; //默认第一页
      this.pageSize2 = 12; //每页显示多少条记录，默认12条
      this.pageNum3 = 1; //默认第一页
      this.pageSize3 = 12; //每页显示多少条记录，默认12条
      if (tab.label == "全部消息") {
        this.displayAllData();
      } else if (tab.label == "未处理消息") {
        this.getUnreadAllData(0);
      } else if (tab.label == "已处理消息") {
        this.getReadAllData(1);
      }
    },
    countFun() {
      // 初始调用
      let self = this;
      let p1 = new Promise((resolve, reject) => {
        this.$axios.get(this.$portMain + "/msg/unreadCount").then(function(res) {
          if (res.data.code == 200) {
            self.readData = Number(res.data.data);
            resolve(self.readData);
          } else {
            self.$message.error(res.data.msg);
          }
        });
      });
      return p1;
    },
    businessUnreadCount() {
      // 业务获取未读消息呢
      let self = this;
      let params = {
        PRS: {
          msgType: "REMIND"
        }
      };
      let p2 = new Promise((resolve, reject) => {
        this.$axios
          .get(this.$portMain + "/msg/unreadCount", params)
          .then(function(res) {
            if (res.data.code == 200) {
              Number(res.data.data) == 0
                ? (self.businessReadData = "")
                : (self.businessReadData = Number(res.data.data));
              resolve(self.businessReadData);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      });
      return p2;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .title {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .tab {
    padding: 0px 2px;
    line-height: 26px;

    .tabLeft {
      color: #8A9199;
      font-size: 14px;
      margin-left: -16px;

      .text {
        color: #222426;
      }
    }

    .tabRight {
      color: #2E3033;
      font-size: 14px;
    }
  }

  .line {
    border-bottom: 1px solid rgba(207, 217, 230, 1);
    padding-bottom: 6px;
    display: block;
    margin-left: 0;
    vertical-align: top;
    margin-bottom: 5px;
    display: flex;

    .smallTitle {
      color: #8A9199;
      margin-left: 5px;
    }

    .text {
      margin-top: 5px;
    }

    .fontColor {
      color: #8A9199;
      white-space: initial;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
  }

  .footer {
    position: relative;
    left: 199;
    bottom: 0;
    width: 100%;
    height: 58px;
    border-top: 1px solid #B8C1CC;
    margin-top: 53px;
  }

  .selectAll {
    color: #8A9199;
    font-size: 14px;
  }

  .pageD {
    margin-top: 10px;
  }

  .fontBlack {
    color: #222426;
    white-space: initial;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .fontRed {
    color: #F20F34;
  }

  .Nodata {
    text-align: center;
    border-bottom: 1px solid rgba(207, 217, 230, 1);
    height: 46px;
    line-height: 46px;
  }
}
</style>

<style>
.messageWrap .el-checkbox__input {
  padding-top: 25px;
}
</style>
