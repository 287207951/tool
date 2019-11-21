<template>
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>存欠表详细查看</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
        <div class="hr"/>

        <div id="goldListTab">
          <el-table
            :data="orderLineData"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序"
              header-align='center'
              align='center'
              width="50">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="交易时间">
            </el-table-column>
            <el-table-column
              prop="order_uid_name"
              sortable
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="order_code"
              sortable
              label="关联表单">
            </el-table-column>
            <el-table-column
              prop="material_weight"
              sortable
              label="本期料">
            </el-table-column>
            <el-table-column
              prop="material_account"
              sortable
              label="本期款">
            </el-table-column>
            <el-table-column
              prop="balance_material"
              sortable
              label="当前料">
            </el-table-column>
            <el-table-column
              prop="balance_account"
              sortable
              label="当前款">
            </el-table-column>
            <el-table-column
              prop="interest"
              sortable
              label="利息">
            </el-table-column>
            <!-- <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="!readTF" @click="delMaterDeiFun(scope.row)"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column> -->
            
          </el-table>
       
        </div>
	    </div>
    </div>
</template>
<script>
const $portMain = "http://192.168.21.122:9091";
export default {
  data() {
    return {
      goldListId: "", //收料单编号
      createGoldTF: false, //创建新收料单新窗口
      readTF: true, //查看只读属性
      orderAllData: {},
      orderLineData: [], //收料单明细数组
      accountTypeList: [
        {
          value: "0",
          label: "转存"
        },
        {
          value: "1",
          label: "结价"
        }
      ],
      weight: "暂无", //暂时数据
      note: "备注", //备注
      input: "", //创建新收料单数据
      createDeiVisTf: false, //创建新金料类型弹出框
      selectProList: [
        {
          //选择流程下拉框
          id: 1,
          value: "免检"
        },
        {
          id: 2,
          value: "先收后验"
        },
        {
          id: 3,
          value: "先验后收"
        }
      ],
      isDiscountlist: [
        {
          //选择流程下拉框
          id: "0",
          value: "否"
        },
        {
          id: "1",
          value: "是"
        }
      ],
      selectProId: 1, //选择流程默认“免检”
      newSelectProData: {} //创建新的金料类型数据
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this;
      self.goldListId = window.location.hash.split("goldId=")[1];
      if (window.location.hash.split("view").length != -1) {
        self.readTF = true;
      }
      self.goldListId = window.location.hash.split("=")[1];

      if (self.goldListId == "createData") {
        //创建新收料单数据
        self.orderAllData = {
          id: "",
          order_code: "",
          gross_weight: "",
          net_weight: "",
          partner_id: "",
          partner_name: "",
          receive_material_order_id: "",
          receive_material_order_code: "",
          order_state: "",
          order_uid: 1,
          order_uid_name: "",
          note: "",
          check_material_order_line: "",
          is_active: "",
          order_line: []
        };
        self.readTF = false;
        return;
      }

      if (window.location.hash.indexOf("editId=") >= 0) {
        //收料单号判断
        self.readTF = false;
      }
      let params = {
        PRS: {
          orderId: self.goldListId
        }
      };
      this.$axios
        .get($portMain + "/stock/account/order/form", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderAllData = res.data.data;
            self.order_state = parseInt(res.data.data.order_state);
            self.orderLineData = res.data.data.order_line;
            for(var i=0;i<self.orderLineData.length;i++){
              self.orderLineData[i].create_time = self.$api.dateGetDay(self.orderLineData[i].create_time)
            }
          } else {
            self.$message.error(res.data.msg);
          }
        })
    },
    
    //删除收料单明细
    delMaterDeiFun(elem) {
      var self = this;
      this.$confirm("确认将此明细单删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            PRS: {
              orderId: elem.id
            }
          };
          this.$axios
            .get(
              $portMain +
                "/stock/receivematerial/orderline/delete",
              params
            )
            .then(function(res) {
              if (res.data.code == 200) {
                self.$message("删除成功,正在刷新页面中");
                setTimeout(function() {
                  self.created_fun();
                }, 1000);
              } else {
                self.$message.error(res.data.msg);
              }
            });
        });
    },
    
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
        // text-align right
      .flexRightDiv
        width 50%
        margin-top 10px
        height 30px
        padding 15px 0 0 0
  .createGold
    line-height 50px
  .createGoldBtn
    margin 20px 0 10px 0
  .DeiVisDiv
    line-height 50px
</style>