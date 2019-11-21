<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            <el-breadcrumb-item>金料库存列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>
        <div>
          <el-row>
            <el-col :span="16">
              <el-button type="primary" size="small" @click="slicingTF">切割金料</el-button>
              <el-dialog
                title="切割金料"
                :visible.sync="slicingVisTf"
                :close-on-click-modal="false"
                width="500px">
                <div class="slicingDiv">
                  <el-row>
                    <el-col :span="12">总净总{{goldAllData.net_weight}}克</el-col>
                    <el-col :span="12">
                      <el-select v-model="slicingNum" placeholder="请选择" size="small">
                        <el-option
                          v-for="item in slicingNumList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12" v-for="item in slicingNum" :key="item">
                      <el-input v-model="slicingSelectedList[item-1]" placeholder="请输入切割重量" size="small" class="width90"></el-input>
                    </el-col>
                  </el-row>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="slicingVisTf = false" size="small">取 消</el-button>
                  <el-button type="primary" @click="slicingFun" size="small">确 定</el-button>
                </span>
              </el-dialog>

            </el-col>
            <el-col :span="8" class="textCenter">
              <el-steps :space="200" :active="levelNum" finish-status="success" size="small">
                <el-step v-for="(item,index) in levelList" :key="index" :title="item"></el-step>
              </el-steps>
            </el-col>
          </el-row>
        </div>
        <div id="centerGoldList">
          <el-row>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  金料编号
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.material_code}}
                </div>
                <div class="flexLeftDiv">
                  金料名称
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.material_name}}
                </div>
                <div class="flexLeftDiv">
                  金料类型ID
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.material_id}}
                </div>
                <div class="flexLeftDiv">
                  流程类型
                </div>
                <div class="flexRightDiv">
                  <span v-if="goldAllData.flow_type == '1'">先验后收</span>
                  <span v-else-if="goldAllData.flow_type == '2'">先收后验</span>
                  <span v-else-if="goldAllData.flow_type == '3'">免检</span>
                </div>
                <div class="flexLeftDiv">
                  净重
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.net_weight}}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  成色
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.quality}}
                </div>
                <div class="flexLeftDiv">
                  是否验料
                </div>
                <div class="flexRightDiv">
                  <span v-if="goldAllData.is_check == '0'">否</span>
                  <span v-else-if="goldAllData.is_check == '1'">是</span>
                </div>
                <div class="flexLeftDiv">
                  库存状态
                </div>
                <div class="flexRightDiv">
                  <span v-if="goldAllData.stock_state == '1'">在途</span>
                  <span v-else-if="goldAllData.stock_state == '2'">已入库</span>
                </div>
                <div class="flexLeftDiv">
                  收料单ID
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.receive_material_id}}
                </div>
                <div class="flexLeftDiv">
                  创建时间
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.create_time}}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  修改时间
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.update_time}}
                </div>
                <div class="flexLeftDiv">
                  制单人ID
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.order_uid}}
                </div>
                <div class="flexLeftDiv">
                  制单人名称
                </div>
                <div class="flexRightDiv">
                  {{goldAllData.order_uid_name}}
                </div>
                <div class="flexLeftDiv">
                  是否存活
                </div>
                <div class="flexRightDiv">
                  <span v-if="goldAllData.is_active == '1'">正常状态</span>
                  <span v-else-if="goldAllData.is_active == '0'">删除状态</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      goldListId: "", //金料单编号
      levelList: [], //进度列表
      levelNum: 0, //进度数字
      readTf: true, //只读属性
      goldAllData: {}, //库存金料数据
      slicingVisTf: false, //切割彈出框
      slicingNum: 2, //切割分数
      slicingNumList: [2, 3, 4, 5, 6, 7, 8, 9], //切割分数切换
      slicingSelectedList: [] //切割分块数组
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.goldListId = window.location.hash.split("=")[1];
      let params = {
        PRS: {
          orderId: self.goldListId
        }
      };
      this.$axios
        .get(
          this.$portMain + "/stock/materialstock/order/form",
          params
        )
        .then(function(res) {
          if (res.data.code == 200) {
            self.goldAllData = res.data.data;
            self.goldAllData.create_time = self.$api.dateGetDay(
              self.goldAllData.create_time
            );
            self.goldAllData.update_time = self.$api.dateGetDay(
              self.goldAllData.update_time
            );
            if (self.goldAllData.flow_type) {
              switch (self.goldAllData.flow_type) {
                case "1":
                  self.levelList = ["创建", "已验", "已收"];
                  self.levelNum = 3;
                  break;
                case "2":
                  self.levelList = ["创建", "已收", "已验"];
                  if (self.goldAllData.is_check == "0") {
                    self.levelNum = 2;
                  } else if (self.goldAllData.is_check == "1") {
                    self.levelNum = 3;
                  }
                  break;
                case "3":
                  self.levelList = ["创建", "已收"];
                  self.levelNum = 2;
                  break;
              }
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    saveGold() {
      var self = this;
      self.$router.push("checkGoldStock");
    },
    //切割彈出框
    slicingTF() {
      var self = this;
      self.slicingVisTf = true;
    },
    //切割彈出框
    slicingFun() {
      var self = this;
      let sumSlicing = 0;
      for (var i = 0; i < self.slicingSelectedList.length; i++) {
        sumSlicing += parseInt(self.slicingSelectedList[i]);
      }
      if (sumSlicing != self.goldAllData.net_weight) {
        self.$message.error("输入切割总重量要等于总净重,请重新输入！");
      } else {
        let params = {
          PRS: {
            id: self.goldAllData.id,
            netWeights: self.slicingSelectedList
          }
        };
        this.$axios
          .get(this.$portBYB + "SegmentationExtract/Segmentation", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("申请切割成功，现在正在返回库位列表页！");
              setTimeout(function() {
                self.$router.push('checkGoldWare')
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .title
    border-bottom 1px solid #d9d9d9
    padding-bottom 10px
    margin-bottom 10px
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .redfont
    margin-bottom 15px
    padding-left 10px
    border-left 3px solid #e60e32
    font-size 15px
  .red_font
    color $base-color
  #centerGoldList
    .flexSaveBtn
      margin-top 50px
      text-align right
      padding-right 50px
    .flexDiv
      display flex
      flex-flow row wrap
      .flexLeftDiv
        width 30%
        margin-top 10px
        height 30px
        padding 15px 15px 0px 0px
        color #8A9199
        font-size 14px
      .flexRightDiv
        width 50%
        margin-top 10px
        height 30px
        padding 15px 0 0 0
        color #2E3033
        font-size 14px
  .createGold
    line-height 50px
  .createGoldBtn
    margin 20px 0 10px 0
  .slicingDiv
    line-height 40px
  .width90
    width 90%
</style>