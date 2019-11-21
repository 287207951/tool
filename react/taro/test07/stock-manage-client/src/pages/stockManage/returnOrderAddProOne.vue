<template>
  <div class="conBigDiv">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="topnav"
    >
      <el-breadcrumb-item :to="{ path: '/' }">尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库</el-breadcrumb-item>
      <el-breadcrumb-item>收客户饰</el-breadcrumb-item>
      <el-breadcrumb-item>添加退货产品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hr" />
    <div class="info">
      <div class="info-top">
        <div class="infot-table">
          <el-row>
            <el-col :span="14">
              <span class="fontStyle">成色</span>
              <el-select
                v-model="goldCodeIdTwo"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFunTwo"
              >
                <el-option
                  v-for="item in goldCodeList"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <span class="fontStyle">分类</span>
              <el-select
                v-model="stockTypeIdTwo"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFunTwo"
              >
                <el-option
                  v-for="item in categoryNewList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <span class="fontStyle">商品搜索</span>
              <el-input
                placeholder="请输入关键字搜索"
                v-model="searchTwo"
                class="input-with-select searchTxt"
                size="small"
                style="width:220px"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchFunTwo"
                />
            </el-input>

            </el-col>

            <el-col :span="10" class="txtRight">
              <span>
                选择客户
                  <el-select v-model="companyName" filterable placeholder="请选择选择" size="small">
                    <el-option
                      v-for="item in companySear"
                      :key="item.companyId"
                      :label="item.companyName"
                      :value="item.companyId">
                    </el-option>
                  </el-select>
              </span>
              <el-button
                @click="addProFun"
                size="small"
              >添加退货产品</el-button>
              <el-button
                type="primary"
                @click="nextStepFun"
                size="small"
              >下一步</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="proList.length == 0" class="yellowColor txtCenter marginTop10">
        还没有选择产品或产品筛选结果为空，请点击
        <el-button
          @click="addProFun"
          size="small"
        >
          添加退货产品
        </el-button>
        按钮添加!
      </div>
      <div v-else>
        <el-row>
          <el-col
            :span="24"
            class="txt16"
          >
            全选
            <el-checkbox
              v-model="selectAllTF"
              @change="selectAllChange"
            >&nbsp;</el-checkbox>
          </el-col>
        </el-row>
        <el-row
          v-for="(item,ind) in proList"
          :key="ind"
          class="orderBigDiv"
        >
          <el-col
            :span="1"
            class="checkboxDiv"
          >
            <el-checkbox
              v-model="item.selectTF"
              @change="hotFixChange"
            >&nbsp;</el-checkbox>
          </el-col>
          <el-col
            :span="23"
            class="tabOne"
          >
            <div class="tabOneLeft">
              <img
                v-if="item.url"
                :src="$portImg+item.url"
                style="height:116px; width:153px;"
                @click.stop="showPic($portImg+item.url)"
              >
              <img
                v-else
                src="../../../static/images/img-noimg.png"
                style="height:116px; width:153px;"
                @click.stop="showPic(`../../../static/images/img-noimg.png`)"
              >
            </div>

            <el-row
              style="line-height:30px;"
              class="tabOneRight"
            >
              <el-col :span="24" class="txtOne">
                {{item.proName}}
              </el-col>
              <el-col
                :span="8"
                class="txtTwo"
              >
                编号：<span class="txtBlack">{{item.proNumber}}</span>
              </el-col>
              <el-col
                :span="8"
                class="txtTwo"
              >
                工费类型：
                <span class="txtBlack">
                  {{item.feeType === 1?'每克':''}}
                  {{item.feeType === 2?'每件':''}}
                </span>
              </el-col>
              <el-col
                :span="8"
                class="txtFour"
              >
                实收数量：<span class="txtBlackBold">{{item.skuNum}}</span>
              </el-col>

              <el-col
                :span="4"
                class="txtTwo"
              >
                成色：<span class="txtBlack">{{item.conditi}} </span>
              </el-col>
              <el-col
                :span="4"
                class="txtTwo"
              >
                克重(g)：<span class="txtBlack">{{item.weight}}</span>
              </el-col>  
              <el-col
                :span="8"
                class="txtTwo"
              >
                {{item.one=== '套装'?'套装工费':'基础工费'}}：
                <span class="txtBlack">
                  {{item.addWagePrice}} 
                </span>
              </el-col>              
              <el-col
                :span="6"
                class="txtFour"
              >
                实收重量(g)：<span class="txtBlackBold">{{item.skuWeight}}</span>
              </el-col>  
             <el-col
                :span="2"
                class="txtFour"
              >
                <span v-if="item.one === '套装'">
                    <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">详情<i class="el-icon-arrow-up"></i></span>
                    <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">详情<i class="el-icon-arrow-down"></i></span>
                </span>&nbsp;
              </el-col>         
              <el-col
                :span="8"
                class="txtTwo"
              >
                &nbsp;
              </el-col>
              <el-col
                :span="8"
                class="txtTwo"
              >
                附加工费：
                <span class="txtBlack">
                  {{item.feeType === 1?item.additionPrice:''}}
                  {{item.feeType === 2?item.feePrice:''}}  
                </span>
              </el-col> 
              <el-col
                :span="8"
                class="txtFour"
              >
                退工费(¥)/g：<span class="txtBlackBold">{{item.receiablePrice}}</span>
              </el-col>  
            </el-row>
          </el-col>
          <el-col
              :span="24"
              class="suitDiv" 
              v-if="item.viewSuit"
            >
              <el-row>
                <el-col span="11" class="suitSubDiv" v-for="(ielem,indTwo) in item.map.proList" :key="indTwo+''">
                  <div class="pro-item">
                    <div class="pro-imgs">
                      <img
                        :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                        width="153"
                        height="116"
                      />
                    </div>
                    <div class="pro-right">
                      <el-row>
                        <el-col
                          :span="24"
                          class="pro-tit"
                        >{{ielem.proName}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col
                          :span="24"
                          class="pro-middle"
                        >编号：{{ielem.proNum}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col
                          :span="24"
                          class="pro-middle"
                        >{{ielem.effect}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.exterior?','+ielem.exterior:''}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col
                          :span="11"
                          class="pro-bottom"
                        >克重(g): {{ielem.weight}}</el-col>
                        <el-col
                          :span="5"
                          class="pro-bottom"
                        >
                          <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>  
        </el-row>
      </div>

      <el-dialog
        :visible.sync="addProTF"
        :close-on-click-modal="false"
        width="1200px"
      >
        <span>
          <div>
            <el-row>
              <el-col :span="20">
                <span class="fontStyle">成色</span>
                <el-select
                  v-model="goldCodeId"
                  placeholder="请选择"
                  size="small"
                  style="width:160px"
                  @change="searchFun"
                >
                  <el-option
                    v-for="item in goldCodeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <span class="fontStyle">分类</span>
                <el-select
                  v-model="stockTypeId"
                  placeholder="请选择"
                  size="small"
                  style="width:160px"
                  @change="searchFun"
                >
                  <el-option
                    v-for="item in categoryNewList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label"
                  ></el-option>
                </el-select>
                <span class="fontStyle">生产工艺</span>
                <el-select
                  v-model="processCodeId"
                  placeholder="请选择"
                  size="small"
                  style="width:160px"
                  @change="searchFun"
                >
                  <el-option
                    v-for="item in processCodeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>

                <span class="fontStyle">商品搜索</span>
                <el-input
                  placeholder="请输入关键字搜索"
                  v-model="search"
                  class="input-with-select searchTxt"
                  size="small"
                  style="width:220px"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="searchFun"
                  />
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  @click="editAddPro"
                  size="small"
                >确定添加</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="addProDiv">
            <el-row
              v-for="(item,ind) in parageraphList"
              :key="ind"
              class="orderBigDiv"
            >
              <!-- <el-col
                :span="1"
                class="checkboxDiv"
              >
                <el-checkbox
                  :label="item.id"
                  v-model="item.selectTF"
                  @change="changeSelect(item)"
                >&nbsp;</el-checkbox>
              </el-col> -->
              <el-col
                :span="23"
                class="tabOne"
              >
                <div class="tabOneLeft">
                  <img
                    v-if="item.url"
                    :src="$portImg+item.url"
                    style="height:116px; width:153px;"
                    @click.stop="showPic($portImg+item.url)"
                  >
                  <img
                    v-else
                    src="../../../static/images/img-noimg.png"
                    style="height:116px; width:153px;"
                    @click.stop="showPic(`../../../static/images/img-noimg.png`)"
                  >
                </div>

                <el-row
                  style="line-height:30px;"
                  class="tabOneRight"
                >
                  <el-col :span="24" class="txtOne">
                    {{item.proName}}
                  </el-col>
                  <el-col
                    :span="12"
                    class="txtTwo"
                  >
                    编号：<span class="txtBlack">{{item.proNumber}}</span>
                  </el-col>
                  <el-col
                    :span="4"
                    class="txtTwo"
                  >
                    工费类型：
                    <span class="txtBlack">
                      {{item.feeType === 1?'每克':''}}
                      {{item.feeType === 2?'每件':''}}
                    </span>
                  </el-col>   
                  <el-col
                    :span="3"
                    class="txtFour"
                  >
                    实收数量：
                  </el-col>
                  <el-col
                    :span="5"
                    class="txtFour"
                    
                  >
                    <el-input-number v-model="item.skuNum" :min="0" placeholder="实收数量" size="small" @change="changeSelect(item)" :controls="false" class="width60"></el-input-number>
                  </el-col>                  
    
                  <el-col
                    :span="4"
                    class="txtTwo"
                  >
                    成色：<span class="txtBlack">{{item.conditi}}</span>
                  </el-col>
                  <el-col
                    :span="8"
                    class="txtTwo"
                  >
                    克重(g)：<span class="txtBlack">{{item.weight}}</span>
                  </el-col> 
                  <el-col
                    :span="4"
                    class="txtTwo"
                    style="margin-top:10px"
                  >
                    {{item.one=== '套装'?'套装工费':'基础工费'}}：
                    <span class="txtBlack">
                      {{item.addWagePrice}}
                    </span>
                  </el-col>   
                  <el-col
                    :span="3"
                    class="txtFour"
                    style="margin-top:10px"
                  >
                    实收重量(g)：
                  </el-col>   
                  <el-col
                    :span="5"
                    class="txtFour"
                    style="margin-top:10px"
                  >
                    <el-input-number v-model="item.skuWeight" :min="0" placeholder="实收重量" @change="changeSelect(item)" size="small" :controls="false" class="width60"></el-input-number>
                  </el-col>    
                  <el-col
                    :span="8"
                    class="txtTwo"
                  >
                    &nbsp;
                  </el-col>
                  <el-col
                    :span="4"
                    class="txtTwo"
                  >
                    <span v-if="item.one === '套装'">
                        <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">详情<i class="el-icon-arrow-up"></i></span>
                        <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">详情<i class="el-icon-arrow-down"></i></span>
                    </span>&nbsp;
                  </el-col>
                  <el-col
                    :span="4"
                    class="txtTwo"
                    style="margin-top:10px"
                  >
                    附加工费：
                    <span class="txtBlack">
                      {{item.feeType === 1?item.additionPrice:''}}
                      {{item.feeType === 2?item.feePrice:''}}   
                    </span>
                  </el-col>   
                  <el-col
                    :span="3"
                    class="txtFour"
                    style="margin-top:10px"
                  >
                    退工费(￥)/g：
                  </el-col>   
                  <el-col
                    :span="5"
                    class="txtFour"
                    style="margin-top:10px"
                  >
                    <el-input-number v-model="item.receiablePrice" :min="0" placeholder="实收重量" @change="changeSelect(item)" size="small" :controls="false" class="width60"></el-input-number>
                  </el-col>    
                </el-row>
              </el-col>
              <el-col
                :span="24"
                class="suitDiv" 
                v-if="item.viewSuit"
              >

                <el-row>
                  <el-col span="11" class="suitSubDiv" v-for="(ielem,indTwo) in item.map.proList" :key="indTwo+''">
                    <div class="pro-item">
                      <div class="pro-imgs">
                        <img
                          :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                          width="153"
                          height="116"
                        />
                      </div>
                      <div class="pro-right">
                        <el-row>
                          <el-col
                            :span="24"
                            class="pro-tit"
                          >{{ielem.proName}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="24"
                            class="pro-middle"
                          >编号：{{ielem.proNum}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="24"
                            class="pro-middle"
                          >{{ielem.effect}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.exterior?','+ielem.exterior:''}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="11"
                            class="pro-bottom"
                          >克重(g): {{ielem.weight}}</el-col>
                          <el-col
                            :span="5"
                            class="pro-bottom"
                          >
                            <b v-if="ielem.extendAttr && ielem.one" v-html="$api.getAttachProperty(ielem.one,ielem.extendAttr)"></b>&nbsp;
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>  
            </el-row>
            </div>
            <div class="pageD">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[12, 30, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="priceSum"
                background
              ></el-pagination>
            </div>
          
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      stepsActive: 1,
      proList: [],
      proListSave: [],
      result: {},
      orderNo: "",
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      parageraphList: [], //列表
      search: "", //搜素内容
      searchTwo: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockTypeId: "", //料类型
      stockTypeIdTwo: "全部", //料类型
      outputStatue: "", //出库类型
      addProTF: false, //添加新产品弹框
      goldCodeList: ['全部','999','9999'], //材质列表
      goldCodeId: "全部", //材质选择
      goldCodeIdTwo: "全部", //材质选择
      processCodeList: [], //生产工艺列表
      processCodeId: "全部", //生产工艺选择项
      categoryList: [], //新建托盘品类数组
      categoryNewList: [], //新建托盘品类数组(加全部)
      checkList:[],//添加产品多选框
      companySear:[],//下属客户列表
      companyName:'',//选择客户
      selectProList:[],//选择产品未提交前
      wagepriceData:{},//基础工费字段
      selectAllTF:false,//全选
    };
  },

  created() {
    this.orderNo = this.$route.query.orderNo;
    this.created_fun();
  },

  methods: {
    hotFixChange () {
      const proList = [...this.proList];
      // console.log(proList)
      let selectAllTF = true 
      proList.forEach(ielem=>{
        if(ielem.selectTF === false){
          selectAllTF = false
          return false
        }
      })
      this.selectAllTF = selectAllTF
      this.proList = proList;
      this.$forceUpdate()
    },
    created_fun() {
      // this.displayAddProData(1, 12);
      this.codeDisplay()
      //下属客户列表
      this.clientLoad()
      //查询基础工费
      this.wageprice()
    },
    //查询基础工费
    wageprice(){
      let self  = this;
       this.$axios
        .get(self.$portMain + "/stock/goldprice/order/wageprice")
        .then(function(res) {
          if (res.data.code == 200) {
            self.wagepriceData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    upAudit() {
      this.$axios
        .post(
          this.$portMain +
            "/orderManage/updataOrdersByOrderNo?orderNo=" +
            this.orderNo
        )
        .then(res => {
          if (res.data.code === 200) {
            this.result.orderStatus = 2;
            this.stepsActive = this.stepsActive + 1;
          }
        });
    },

    //下属客户列表
    clientLoad() {
      let self = this
      this.$axios.get(this.$portMain + "/client/clientListSimple").then(res => {
        let newList = [];
        res.data.data.forEach(ielem=>{
          newList.push(ielem)
        })
        self.companySear = newList
      });
    },
    backOrder() {
      this.$prompt("请输入退回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        let params = {
          PRS: {
            backRemarks: value,
            orderNo: this.orderNo
          }
        };
        this.$axios
          .get(this.$portMain + "/orderManage/backOrdersRemarks", params)
          .then(res => {
            if (res.data.code === 200) {
              this.result.orderStatus = 4;
            }
          });
      });
    },
    //添加退货单
    addProFun() {
      var self = this;
      self.addProTF = true;
      self.displayAddProData(1, 12);
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAddProData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAddProData(val, this.pageSize);
    },

    //搜索
    searchFun() {
      var self = this;
      self.displayAddProData(1, 12);
    },
    //需要退货产品筛选事件
    searchFunTwo(){
      let self = this
      // console.log(self.stockTypeIdTwo,self.goldCodeIdTwo,self.searchTwo)
      // console.log(self.proList)
      let proListSave = self.proListSave
      let newProList = []
      proListSave.forEach(ielem=>{
        if(ielem.conditi === self.goldCodeIdTwo!='全部'?self.goldCodeIdTwo:'' &&(self.stockTypeIdTwo === '全部'||self.stockTypeIdTwo === '' || ielem.one === self.stockTypeIdTwo) &&(ielem.proName.indexOf(self.searchTwo)>=0 || ielem.proNumber.indexOf(self.searchTwo)>=0)){
          newProList.push(ielem)
        }
      })
      self.proList = newProList
      // console.log(proListSave)
    },
    //下一步按扭
    nextStepFun() {
      // console.log(this.proList)
      let self = this;
      let backOrderFromsList = [];
      if(!self.companyName || self.proList.length ===0){
        self.$message.error('客户未选择或未选择产品，请选择客户和产品再进行提交!')
        return false
      }
      self.proList.forEach(ielem=>{
        if(ielem.selectTF){
          backOrderFromsList.push({
            skuNum:ielem.proNumber,
            suit:ielem.one === '套装'?2:1,
            productSum:ielem.skuNum,
            goldWeight:ielem.skuWeight,
            receiablePrice:ielem.receiablePrice,
          })
        }

      })
      if(backOrderFromsList.length === 0){
        this.$message.error('产品未选择产品，请选择产品再进行提交!')
        return false
      }
      let params = {
        customerCompanyId: self.companyName,
        backOrderFroms:backOrderFromsList
      };
      
      this.$axios
        .post(this.$portMain + "/order/sureBackOrderInfo", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success('现在进行确认页面！')
            localStorage.sarkData = JSON.stringify(res.data.data)
            setTimeout(function(){
              self.$router.push({ path: "returnOrderAddProTwo" });
            },1000)
          } else {
            self.$message.error(res.msg);
          }
        })
        
    },
    
    displayAddProData(num, size) {
      var self = this;
      self.selectProList= []
      let params = {
        PRS: {
          proName: self.search,
          one:self.stockTypeId,
          processCode:self.processCodeId,
          conditi:self.goldCodeId != '全部'?self.goldCodeId:'',
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/product/proList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              self.wagepriceData.goldPriceProps.forEach(jelem=>{
                if(item.conditi === jelem.propType.replace(/足金/g, "")){
                  item.addWagePrice = jelem.propValue
                  return
                }
              })
              // if(!item.skuNum){
              //   item.skuNum = 0
              // }
              // if(!item.skuWeight){
              //   item.skuWeight = 0
              // }
              item.receiablePrice = 0
              item.viewSuit = false;
              // let itemSelectTF = false
              // let itemData = {}
              // self.selectProList.forEach(ielem=>{
              //   if(ielem.id === item.id){
              //     itemSelectTF = true
              //     itemData = ielem
              //   }
              // })
              // if(itemSelectTF === true){
              //   item = itemData

              // }
              // item.selectTF = itemSelectTF

              item.selectTF = false
            });
            setTimeout(function(){
              self.$forceUpdate();
            },200)
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    
    codeDisplay() {
      var self = this;
      this.$publicData.categoryFun()
        .then(function(res) {
          self.categoryList = res;
          self.categoryNewList = JSON.parse(JSON.stringify(self.categoryList));
          self.categoryNewList.unshift({
            value: "全部",
            label: "",
            editedTF: false
          });
        })
        .catch(function(err) {
          self.categoryList = [
            {
              value: "全部",
              label: "",
              editedTF: false
            }
          ];
          self.$message.error(err);
        });
      this.$axios.get(this.$portMain + "/product/code", {}).then(function(res) {
        if (res.data.code == 200) {
          
          res.data.data.forEach(item => {
            //材质
            // if (item.goldCode == "产品材质") {
            //   self.goldCodeList = item.list;
            //   self.goldCodeList.unshift("全部");
            // }
            //生产工艺
            if (item.processCode == "制作工艺") {
              self.processCodeList = item.list;
              self.processCodeList.unshift("全部");
            }
          });
        } else {
          self.$message.error(res.data.msg);
        }
      });
    },
    //补货单多选按钮
    checkListFun() {
      let self = this;
      var selectIdList = [];
      self.parageraphList.forEach(item => {
        if (
          item.skuNum !== undefined && 
          item.skuWeight !== undefined && 
          item.receiablePrice !== undefined 
        ) {
          selectIdList.push(item);
        }
      });
      self.checkList = selectIdList;
      if(selectIdList.length == 0){
        self.$message.error('您还没选择产品，请重新选择产品！')
        return false
      }else{
        return true
      }
    },
    //确定添加  
    editAddPro(){
      var self = this;
      if(self.checkListFun()){
        let submitTF = false
        // console.log(self.checkList)
        self.checkList.forEach(ielem=>{
          if(!ielem.skuNum || !ielem.skuWeight ||ielem.skuNum === 0 || ielem.skuWeight===0){
            submitTF=true
          }
        })

        if(submitTF){
          self.$message.error('有产品的实收数量和实收重量未填，请重填入再点击“确定添加”！')
        }else{
          // console.log(self.proList,self.selectProList)
          // self.proList = self.selectProList.concat(self.proList)
          self.proList = self.proList.concat(self.checkList)
          self.proListSave = self.proList;
          // console.log(self.proListSave)
          self.addProTF = false
          self.selectProList = [];
        }
      }
    },
    //多选框选择
    changeSelect(elem) {
      const { skuNum, skuWeight, receiablePrice } = elem;
      let self = this;
      if(elem.skuNum){
        elem.skuNum = parseInt(elem.skuNum)
        if(elem.skuNum<0){
          elem.skuNum = 0
        }
      }
      if ( 
        skuNum !== undefined && 
        skuWeight !== undefined && 
        receiablePrice !== undefined 
      ) {
        let status = true;
        this.selectProList.map(v => v.id === elem.id && (status = false) );
        status && this.selectProList.push(elem);
      }
      else {
        const { selectProList } = this;
        selectProList.map(( v, i ) => {
          if ( v.id === elem.id ) {
            this.selectProList.splice(i, 1);
          }
        })
      }

      setTimeout(function(){
        self.$forceUpdate();
      },200);
    },
    //展开收展套装子系统
    editSuit(elem){
      elem.viewSuit = !elem.viewSuit
      this.$forceUpdate();
    },
    //全选/反选选择框
    selectAllChange(){
      let self = this
      self.proList.forEach(ielem=>{
        ielem.selectTF = self.selectAllTF
      })
      self.$forceUpdate();
    }
    
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  color #333
  padding-bottom 200px
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
  .topMenuRight
    text-align right
  .searchTxt
    flex 1
    width 100%
  .top-select
    display flex
    justify-content center
    align-items center
  .width60
    width 100px
  .info
    min-height 500px
    .info-top
      width 100%
      padding 10px 20px
      background #fff
      box-sizing border-box
      .infot-table
        .tr
          display flex
          width 100%
          border 1px solid #E9ECF5
          .th
            display flex
            align-items center
            justify-content center
            height 30px
            width 16%
            text-align center
            background #999999
            color #fff
          .td
            display flex
            justify-content center
            align-items center
            height 80px
            width 16%
            text-align center
          .handle
            display flex
            flex-direction column
            .el-button
              min-width 80px
              margin-left 0
    .info-middle
      margin 20px
      .infom-tit
        padding 0 20px
        line-height 40px
        background #fff
      .infom-info
        margin 10px
        .infom-item
          display flex
  .pro-item
    width 95%
    display flex
    align-items center
    padding 15px 20px
    background #fff
    border 1px solid #E9ECF5
  .pro-imgs
    position relative
    width 153px
    height 116px
  .proimgs-add
    position absolute
    display flex
    top -10px
    left -10px
    padding 10px
    background rgba(0, 0, 0, 0.4)
  .proimgs-add > div > img
    padding-left 10px
  .proimgs-add > div > img:nth-of-type(1)
    padding-left 0
  .pro-item > img
    width 153px
    height 116px
  .pro-right
    width 75%
    display flex
    flex-flow column
    justify-content center
    margin-left 10px
  .pro-tit
    margin 10px 0
    font-size 14px
  .pro-middle
    margin 3px 0
    font-size 12px
    color #999
  .pro-bottom
    margin 10px 0
    font-size 12px
    line-height 14px
    color #333
  .iitem-right
    min-width 0%
    flex 1
    min-height 146px
    display flex
    flex-direction column
    font-size 12px
  .order-item
    flex 1
    display flex
    justify-content space-between
    flex-direction column
    .order-tr
      flex 1
      box-sizing border-box
      padding-left 40px
      display flex
      align-items center
      height 30px
      border-bottom 1px solid #E9ECF5
      .otd
        width 200px
        text-align center
    .order-tr:nth-of-type(odd)
      background #FAFAFA
    .order-tr:nth-of-type(even)
      background #ffffff
  .order-th
    box-sizing border-box
    padding-left 40px
    display flex
    align-items center
    height 30px
    background #E9ECF5
    color #666
    .oth
      width 200px
      text-align center
  .redTxt
    color #F20F34
  .steps-list
    margin 20px
  .tabOne
    display flex
    padding 15px 15px 10px 15px
  .pageD
    text-align center
    margin-top 20px
  .tabOneLeft
    width 174px
  .tabOneRight
    width calc(100% - 174px)
  .orderBigDiv
    margin-top 10px
    min-height 126px
    border 1px solid #eee
    .orderBigDivOne
      color #333
  .suit-info
    display flex
    flex-wrap wrap
    padding 20px 50px
    .suiti-item
      width 48%
      .pro-item
        width 100%
        .pro-right
          &> p
            margin-bottom 8px
        .pro-feetype
          font-size 12px
          line-height 14px
          color #999
          span
            margin-right 20px
        .pro-weight
          font-size 12px
          line-height 14px
          color #999
          span
            margin-right 20px
  .addProDiv
    height 500px
    overflow-y auto
  .checkboxDiv
    line-height 120px
    text-align right
  .txtRight
    text-align right
  .txtRed
    color rgb(230, 14, 50)
  .txtOne
    font-size 14px
    color #333333
  .txtTwo
    font-size 14px
    color #889199
  .txtBlack
    font-size 14px
    color #222426
  .txtThree
    font-size 12px
    color #333333
  .txtFour
    font-size 14px
    color #889199
  .txtBlackBold
    font-size 14px
    color #222426
    font-weight bold
  .yellowColor
    color #F26D0F
  .marginTop10
    margin-top 10px
  .redTxtOne
    color #F20F34
    font-weight bold  
  .suitDiv
    border 1px solid #E9ECF5
    border-top 0
    background #FAFAFA
    padding 10px
    .suitSubDiv
      padding 10px
      margin 0px 10px
  .txt16
    font-size 16px
    padding 10px 0
</style>
