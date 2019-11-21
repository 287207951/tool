<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>到店统计</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <div>
        <el-row>
          <el-col :span="24">
            <el-input
              @keyup.enter.native="searchFun"
              @blur="searchFun"
              placeholder="请输入关键字搜索"
              style="width:265px"
              size="small"
              v-model="searchTxt"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <span class="topTitle">客户类型</span>
            <el-select v-model="statu" placeholder="请选择" size="small" @change="searchFun">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="topTitle">客户类型</span>
            <el-date-picker
              v-model="selectedDay"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectDayFun"
            ></el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table :data="userData" @row-dblclick="showDetail" style="width: 100%;margin-top:30px">
          <el-table-column prop label="头像">
            <template slot-scope="scope">
              <img src="../../../static/images/img-noimg.png" alt class="headImage">
            </template>
          </el-table-column>
          <el-table-column prop="username" label="到店人"></el-table-column>
          <el-table-column prop="concat" label="类型"></el-table-column>
          <el-table-column prop="telephone" label="性别"></el-table-column>
          <el-table-column prop="mail" label="年龄"></el-table-column>
          <el-table-column prop="phone" label="Face ID"></el-table-column>
          <el-table-column prop="roleName" label="到店时间"></el-table-column>
          <el-table-column prop="deptName" label="离店时间"></el-table-column>
        </el-table>
      </div>
      <div class="pageD">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-sizes="[12, 30, 50, 100]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="customerSize"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 详情 -->
    <el-dialog title="提示" :visible.sync="promptType" width="640px" :close-on-click-modal="false">
      <div class="dialogStyle">
        <div class="line"></div>
        <div class="contentStyle">
          <img src="../../../static/images/img-noimg.png" alt>
          <div class="rightWrap">
            <div class="item">
              <span class="leftTitle">到店人</span>
              <span>赵晓晓</span>
            </div>

            <div class="item">
              <span class="leftTitle">类型</span>
              <span>大客户</span>
            </div>

            <div class="item">
              <span class="leftTitle">性别</span>
              <span>女</span>
            </div>

            <div class="item">
              <span class="leftTitle">年龄</span>
              <span>26</span>
            </div>

            <div class="item">
              <span class="leftTitle">Face ID</span>
              <span>FI236546</span>
            </div>

            <div class="item">
              <span class="leftTitle">到店时间</span>
              <span>2018-11-27 10:32:25</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small" type="primary" plain>关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      promptType: false, //模板状态
      selectedDay: "", //日期选择属性
      startTime: "",
      endTime: "",
      searchTxt: "", // 查询条件
      options: [
        {
          value: "E",
          label: "启用"
        },
        {
          value: "D",
          label: "禁用"
        }
      ],
      statu: "",
      multipleSelection: [], //选择多选择框数据
      delBtnTF: false, //删除按钮显示/隐藏默认隐藏
      userData: [], //员工数据列表
      customerSize: 0, //客户数据记录
      pageSize: 12, //每页显示客户记录数
      pageNum: 1 //分页页码默认为1
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      this.userViewFun();
    },
    //查询所有职员信息(列表数据)
    userViewFun() {
      var self = this;
      let params = {
        page: self.pageNum,
        rows: self.pageSize,
        keyWord: self.searchTxt,
        statu: self.statu
      };
      this.$api.formdataPostFun(
        self.$portMain + "/account/sub",
        params,
        res => {
          if (res.code == 200) {
            if (res.data.data != undefined) {
              self.userData = res.data.data;
              self.customerSize = res.data.rowSize;
            } else {
              self.userData = [];
              self.customerSize = 0;
            }
          } else {
            self.$message.error(res.msg);
          }
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //创建新员工
    createUserFun() {
      this.$router.push("/Index/userManageCreate");
    },
    handleSizeChange(val) {
      this.pageNum = 1; //默认第一页
      this.pageSize = val; //改变每页显示多少条记录
      this.userViewFun();
    },
    handleCurrentChange(val) {
      this.pageNum = val; //默认第一页
      this.userViewFun();
    },
    // 按条件筛选
    searchFun() {
      this.pageNum = 1; //默认第一页
      this.pageSize = 12; //改变每页显示多少条记录
      this.userViewFun();
    },
    // 选择时间
    selectDayFun() {
      let self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDayTime(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDayTime(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },
    showDetail() {
      this.promptType = true;
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

  .redfont {
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 3px solid #e60e32;
    font-size: 15px;
  }

  .red_font {
    color: $base-color;
  }

  .topBtn {
    text-align: right;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .topTitle {
    color: #8A9199;
    font-size: 12px;
    margin-left: 24px;
  }

  .headImage {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #CFD9E5;
  }

  .dialogStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .contentStyle {
      display: flex;

      img {
        width: 200px;
        height: 200px;
      }

      .rightWrap {
        margin-left: 49px;

        .leftTitle {
          color: #8A9199;
          font-size: 14px;
          display: inline-block;
          width: 56px;
          margin-right: 40px;
        }

        .item {
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>