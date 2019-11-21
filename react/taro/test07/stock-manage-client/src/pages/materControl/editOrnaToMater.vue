<template> 
    <div class="conBigDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
            <el-breadcrumb-item >尚金缘内部业务管理系统</el-breadcrumb-item>
            <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            <el-breadcrumb-item>料转饰</el-breadcrumb-item>
        </el-breadcrumb>
        <div> 
        <div class="hr"/>
        <div>
          <el-row>
            <el-col :span="8">
              <el-button type="primary" icon="el-icon-plus" size="small">创建</el-button>
              <el-button type="primary" icon="el-icon-sort" size="small">确认</el-button>
            </el-col>
            <el-col :span="16">
            </el-col>
          </el-row>
        </div>
        <div id="centerGoldList">
          <el-row>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  选择料
                </div>
                <div class="flexRightDiv">
                  <el-select v-model="value" placeholder="请选择" size="small">
                    <el-option
                      size="small"
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="flexLeftDiv">
                  备注
                </div>
                <div class="flexRightDiv">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="backup">
                  </el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  单据编号
                </div>
                <div class="flexRightDiv">
                  {{goldListId}}
                </div>
                <div class="flexLeftDiv">
                  转入库存仓
                </div>
                <div class="flexRightDiv">
                  <el-select v-model="value" placeholder="请选择" size="small">
                    <el-option
                      size="small"
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flexDiv">
                <div class="flexLeftDiv">
                  制单人
                </div>
                <div class="flexRightDiv">
                  {{weight}}
                </div>
                <div class="flexLeftDiv">
                  创建时间
                </div>
                <div class="flexRightDiv">
                  {{weight}}
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="flexSaveBtn">
                <el-button type="primary" icon="el-icon-refresh" size="small" @click="saveGold">保存</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <hr/>

        <div id="goldListTab">
          <el-button type="primary" class="createGoldBtn" plain size="small" @click="createGoldTF = true">创建新金料单</el-button>
          <el-dialog title="创建新金料单" :visible.sync="createGoldTF" :close-on-click-modal="false">
            <div class="createGold">
              <el-row>
                <el-col :span="4">
                  金料名称
                </el-col>
                <el-col :span="16">
                  <el-input v-model="input" placeholder="请输入内容"></el-input>
                </el-col>
              </el-row>  
              <el-row>   
                <el-col :span="4">
                  测后净重
                </el-col>
                <el-col :span="16">
                  <el-input v-model="input" placeholder="请输入内容"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  实测成色平均值
                </el-col>
                <el-col :span="16">
                  <el-input v-model="input" placeholder="请输入内容"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  实测成色列表
                </el-col>
                <el-col :span="16">
                  <el-input v-model="input" placeholder="请输入内容"></el-input>
                </el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="createGoldTF = false" size="small" >取 消</el-button>
              <el-button type="primary" @click="createGoldTF = false" size="small">确 定</el-button>
            </div>
          </el-dialog>
          <el-table
            :data="tableData6"
            show-summary
            style="width: 100%">
            <el-table-column
              type="index"
              label="序"
              header-align='center'
              align='center'
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              header-align='center'
              align='center'
              label="产品图片">
            </el-table-column>
            <el-table-column
              prop="amount1"
              sortable
              header-align='center'
              align='center'
              label="产品名称">
            </el-table-column>
            <el-table-column
              prop="amount2"
              sortable
              header-align='center'
              align='center'
              label="规格参数">
            </el-table-column>
            <el-table-column
              prop="amount3"
              sortable
              header-align='center'
              align='center'
              label="外观状态">
            </el-table-column>
            <el-table-column
              prop="amount3"
              sortable
              header-align='center'
              align='center'
              label="净重">
            </el-table-column>
            <el-table-column
              prop="amount3"
              sortable
              header-align='center'
              align='center'
              label="成色">
            </el-table-column>
            <el-table-column
              prop="amount3"
              sortable
              header-align='center'
              align='center'
              label="件数">
            </el-table-column>
            <el-table-column
              prop="amount3"
              sortable
              header-align='center'
              align='center'
              label="仓储位">
            </el-table-column>
            <el-table-column
              prop="amount3"
              sortable
              header-align='center'
              align='center'
              label="备注">
            </el-table-column>
            <el-table-column
              prop="backup"
              sortable
              header-align='center'
              label="备注">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="delMaterDeiFun(scope.row)"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
            
          </el-table>
        </div>
	    </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      goldListId:'',//金料单编号
      createGoldTF:false,//创建新金料单新窗口
      options: [
        {
          value: "深圳市金大隆珠宝首饰有限公司第一分厂",
          label: "深圳市金大隆珠宝首饰有限公司第一分厂"
        },
        {
          value: "深圳市金饰世家珠宝有限公司",
          label: "深圳市金饰世家珠宝有限公司"
        }
      ],
      value: "深圳市金大隆珠宝首饰有限公司第一分厂",
      weight: "105",//净重
      backup: "备注",//备注
      tableData6: [{//金料表单
          id: '12987122',
          name: '足金料（杂料）',
          amount1: '7.42',
          amount2: '99.4',
          amount3: '99.8，99.0',
          backup:'备注1'
        }, {
          id: '12987123',
          name: '足金料（杂料）',
          amount1: '7.42',
          amount2: '99.4',
          amount3: '99.8，99.0',
          backup:'备注2'
        }, {
          id: '12987124',
          name: '足金料（杂料）',
          amount1: '7.42',
          amount2: '1.9',
          amount3: '99.8，99.0',
          backup:'备注3'
        }, {
          id: '12987125',
          name: '足金料（杂料）',
          amount1: '7.42',
          amount2: '99.4',
          amount3: '99.8，99.0',
          backup:'备注4'
        }, {
          id: '12987126',
          name: '足金料（杂料）',
          amount1: '7.42',
          amount2: '99.4',
          amount3: '99.8，99.0',
          backup:'备注5'
        }],
        input: '',//创建新金料单数据
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      var self = this
      self.goldListId = window.location.hash.split("goldId=")[1]
    },
    saveGold(){
      var self = this
      self.$router.push('checkMaterToOrna')
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
</style>