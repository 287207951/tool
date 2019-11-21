<template>
  <div class="conBigDiv"  v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>饰品单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>物流</el-breadcrumb-item>
      <el-breadcrumb-item>调拨入库列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="24">
          <span class="fontStyle">操作人</span>
          <el-select
            v-model="orderTypeId"
            placeholder="请选择"
            size="small"
            style="width:110px"
            @change="searchFun"
          >
            <el-option
              v-for="item in orderTypeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span class="fontStyle">单据状态</span>
          <el-select
            v-model="statusTxt"
            placeholder="请选择"
            size="small"
            style="width:110px"
            @change="searchFun"
          >
            <el-option
              v-for="item in statusList"
              :key="item.code"
              :label="item.value"
              :value="item.code"
            ></el-option>
          </el-select>
          <span class="fontStyle">下单时间</span>
          <el-date-picker
            v-model="selectedDay"
            type="daterange"
            align="right"
            size="small"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
            style="width:300px"
            @change="searchFun"
          ></el-date-picker>
          <el-input
            placeholder="请输入单号搜索"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            style="width:220px"
            @keyup.enter.native="searchFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="24" class="titOne">
          <!-- 总计：总重量{{totalWeight}}g -->
          <!-- <span class="marginLeft20">
            总折重895.36g
          </span>-->
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="allotNumber" label="调拨单号" width="160"></el-table-column>
        <el-table-column prop="allotName" label="发起单位"></el-table-column>
        <el-table-column prop="logisticsStockNumber" label="出库单号" width="190"></el-table-column>
        <el-table-column prop="totalWeight" label="总重量(g)"></el-table-column>
        <!-- <el-table-column
          prop="totailGoldWeight"
          label="总折重(g)"
        ></el-table-column>-->
        <el-table-column prop="sum" label="总数量"></el-table-column>
        <!-- <el-table-column
          prop="totailGoldWeight"
          label="总金额"
        ></el-table-column>-->
        <el-table-column prop="remark" label="调拨原因"></el-table-column>
        <el-table-column prop="status" label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == undefined">-</span>
            <span v-if="scope.row.status == '1'" class="yellowColor">待出库</span>
            <span v-if="scope.row.status == '2'" class="blackColor">已出库</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="操作时间" width="180px"></el-table-column>
        <el-table-column prop="userName" label="操作人"></el-table-column>
        <!-- <el-table-column
          prop="totailGoldWeight"
          label="打印"
        ></el-table-column>-->
        <el-table-column prop="returnNumber" label="红冲"></el-table-column>
        <!-- <el-table-column prop="orderStatus" label="操作">
          <template slot-scope="scope">
            <span>-</span>
            <span
              v-if="scope.row.status == '1'"
              class="redColor"
              @click="stockOutFun(scope.row)"
            >出库</span>
            <span v-else>-</span>
          </template>
        </el-table-column> -->
      </el-table>
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
    </div>
    <el-dialog
      title="出库清单"
      :visible.sync="winOneTF"
      :close-on-click-modal="false"
      width="1500px">
      <span>
        <div>
          打包信息
        </div>
        <div class="baoTabOne" v-for="(ielem,indOne) in baoList" :key="indOne">
          <el-row> 
            <el-col :span="4" class="divOne">
              包号：<span class="yellowColor" v-if="ielem.newTF">新包</span><span v-else class="blackColor">{{ielem.baoNo}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              总数量：<span class="blackColor">{{ielem.sum}}</span>
            </el-col>
            <el-col :span="3" class="divOne">
              净重：
              <span v-if="ielem.newTF">
                <el-input v-model="ielem.suttle" placeholder="" size="small" class="width70"
                  @focus="focusWeightFocusTwo(ielem,indOne,'净重')"
                  @blur="focusWeightBlurTwo()"
                ></el-input>
              </span>
              <span v-else class="blackColor">{{ielem.suttle}}</span>
            </el-col>
            <el-col :span="4" class="divOne">
              毛重：
              <span v-if="ielem.newTF">
                <el-input v-model="ielem.roughWeight" placeholder="" size="small" class="width70"
                  @focus="focusWeightFocusTwo(ielem,indOne,'毛重')"
                  @blur="focusWeightBlurTwo()"
                ></el-input>
              </span>
              <span v-else class="blackColor">{{ielem.roughWeight}}</span>
            </el-col>
            <el-col :span="4" class="divOne">
              打包状态：<span class="yellowColor" v-if="ielem.newTF">待打包</span><span v-else class="blackColor">已打包</span>
            </el-col>
            <el-col :span="6" class="divOne">
              操作：<span class="yellowColor" @click="cancelBao(ielem)">取消打包</span> <span class="redColor" v-if="ielem.newTF" @click="confirmBao(ielem)">确认打包</span>
              <span class="redColor floatRight"  v-if="!ielem.newTF" @click="printBao(ielem)">打印包条码</span>
              <span v-if="ielem.skuList.length > 0" class="divTwo">
                <i class="el-icon-arrow-up" v-if="ielem.viewSuit" @click="editSuit(ielem)"></i>
                <i class="el-icon-arrow-down" v-if="!ielem.viewSuit" @click="editSuit(ielem)"></i>
              </span>
            </el-col>

            <el-col :span="24" v-if="ielem.viewSuit && ielem.skuList.length > 0" class="baoProThree">
              <el-row :class="indOne==0?'baoProTwo':'baoProThree'" v-for="(jelem,indOne) in ielem.skuList" :key="indOne">
                <el-col :span="1" class="checkboxOne">
                  &nbsp;
                </el-col>
                <el-col :span="3">
                  <img 
                    :src="jelem.img?$portImg+jelem.img:'../../../static/images/img-noimg.png'"
                    style="height:90px; width:120px;margin-top:10px"
                    @click.stop="showPic(jelem.img?$portImg+jelem.img:'../../../static/images/img-noimg.png')"
                  />
                </el-col>
                <el-col :span="20" style="line-height:36px;">
                  <el-row>
                    <el-col :span="4">
                      <span class="blackColor">{{jelem.proName}}</span>
                    </el-col>
                    <el-col :span="5">
                      入饰单号：<span class="blackColor">{{jelem.stockNumber}}</span>
                    </el-col>
                    <el-col :span="3">
                      产品成色：<span class="blackColor">{{jelem.conditi}}</span>
                    </el-col>
                    <el-col :span="4">
                      入饰数量：<span class="blackColor">{{jelem.num}}</span>
                    </el-col>
                    <el-col :span="8">
                      选择数量：
                      <span class="blackColor">
                        <span v-if="!jelem.editTF">{{jelem.editNum}}</span>
                        <el-input-number v-if="jelem.editTF" :disabled="jelem.num <= 0" :controls="false" v-model="jelem.editNum" placeholder="" size="small" class="width70":min="1"></el-input-number>
                      </span>
                    </el-col>
                  </el-row>
                  <el-row>              
                    <el-col :span="4">
                      编号：<span class="blackColor">{{jelem.proSkuNmber}}</span>
                    </el-col>
                    <el-col :span="4">
                      产品类别：<span class="blackColor">{{jelem.one}}</span>
                    </el-col>
                    <el-col :span="4">
                      生产工艺：<span class="blackColor">{{jelem.processCode}}</span>
                    </el-col>
                    <el-col :span="4">
                      库存毛重：<span class="blackColor">{{jelem.roughWeight}}g</span>
                    </el-col>
                    <el-col :span="4">
                      复核毛重：<span class="blackColor">
                      <span v-if="!jelem.editTF">{{jelem.editRoughWeight}}</span>
                      <el-input-number  v-if="jelem.editTF" :disabled="jelem.num <= 0" :controls="false" v-model="jelem.editRoughWeight" placeholder="" size="small" class="width70" :min="1"
                      ></el-input-number>g
                    </span>
                    </el-col>
                    <el-col :span="4">
                      <span class="redColor" v-if="!jelem.editTF" @click="editJelem(jelem,ielem)" v-show="ielem.newTF">编辑</span>
                      <span class="redColor" v-if="jelem.editTF" @click="editJelem(jelem,ielem)" v-show="ielem.newTF">保存</span>
                    </el-col>
                  </el-row>
                  <el-row>              
                    <el-col :span="4">
                      克重：<span class="blackColor">{{jelem.weight}}g</span>
                    </el-col>
                    <el-col :span="4">
                      产品材质：<span class="blackColor">{{jelem.goldCode}}</span>
                    </el-col>
                    <el-col :span="4">
                      库存数量：<span class="blackColor">{{jelem.sum}}</span>
                    </el-col>
                    <el-col :span="4">
                      库存净重：<span class="blackColor">{{jelem.suttle}}g</span>
                    </el-col>
                    <el-col :span="4">
                      复核净重：
                      <span class="blackColor">
                        <span v-if="!jelem.editTF">{{jelem.editSuttle}}</span>
                        <el-input-number v-if="jelem.editTF" :disabled="jelem.num <= 0" :controls="false" v-model="jelem.editSuttle" placeholder="" size="small" class="width70" :min="1"
                        ></el-input-number>g
                      </span>
                    </el-col>
                    <el-col :span="4">
                      <span class="redColor" @click="delJelem(indOne,ielem.skuList,ielem)" v-if="ielem.newTF">移出</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row>
            <el-col :span="12" v-if="orderStatus === '退饰出库'">
              <span class="fontStyle">接收单位</span>
              {{inCompanyName}}
              <!-- <el-select
                v-model="inCompanyName"
                placeholder="请选择"
                size="small"
                style="width:100px"
                @change="searchFun"
              >
                <el-option
                  v-for="item in factoryList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyName"
                ></el-option>
              </el-select>               -->
              <span class="fontStyle">退饰出库</span>
              物流中心
            </el-col>
            <el-col :span="12" v-if="orderStatus === '调拨出库'">
              <span class="fontStyle">接收单位</span>
                尚金缘金库           
              <span class="fontStyle">发出单位</span>
                物流中心
            </el-col>
            <el-col :span="12" class="txtRight">
              <el-button size='small' v-if="orderStatus === '调拨出库'" type="primary" @click="stockOutFunTwo" :disabled="disabledTF">调拨出库</el-button>
              <el-button size='small' v-if="orderStatus === '退饰出库'" type="primary" @click="returnOutFunTwo" :disabled="disabledTF">确认退饰</el-button>
            </el-col>
          </el-row>
          <el-row class="baoProOne" v-for="(ielem,indOne) in proListOne" :key="indOne">
            <el-col :span="1" class="checkboxOne">
              &nbsp;
            </el-col>
            <el-col :span="3">
              <img 
                :src="ielem.img?$portImg+ielem.img:'../../../static/images/img-noimg.png'"
                style="height:90px; width:120px;margin-top:10px"
                @click.stop="showPic(ielem.img?$portImg+ielem.img:'../../../static/images/img-noimg.png')"
              />
            </el-col>
            <el-col :span="20" style="line-height:36px;">
              <el-row>
                <el-col :span="4">
                  <span class="blackColor">{{ielem.proName}}</span>
                </el-col>
                <el-col :span="5">
                  入饰单号：<span class="blackColor">{{ielem.stockNumber}}</span>
                </el-col>
                <el-col :span="3">
                  产品成色：<span class="blackColor">{{ielem.conditi}}</span>
                </el-col>
                <el-col :span="4">
                  入饰数量：<span class="blackColor">{{ielem.num}}</span>
                </el-col>
                <el-col :span="8">
                  选择数量：<span class="blackColor"><el-input-number :disabled="ielem.num <= 0" :controls="false" v-model="ielem.editNum" placeholder="" size="small" class="width70" :min="1" :max="ielem.num"></el-input-number></span>
                </el-col>
              </el-row>
              <el-row>              
                <el-col :span="4">
                  编号：<span class="blackColor">{{ielem.proSkuNmber}}</span>
                </el-col>
                <el-col :span="4">
                  产品类别：<span class="blackColor">{{ielem.one}}</span>
                </el-col>
                <el-col :span="4">
                  生产工艺：<span class="blackColor">{{ielem.processCode}}</span>
                </el-col>
                <el-col :span="4">
                  库存毛重：<span class="blackColor">{{ielem.roughWeight}}g</span>
                </el-col>
                <el-col :span="4">
                  复核毛重：<span class="blackColor"><el-input-number :disabled="ielem.num <= 0" :controls="false" v-model="ielem.editRoughWeight" placeholder="" size="small" class="width70"
                    @focus="focusWeightFocus(ielem,indOne,'复核毛重')"
                    @blur="focusWeightBlur()"
                  ></el-input-number>g</span>
                </el-col>
                <el-col :span="4">
                  <span class="redColor" v-if="ielem.num > 0" @click="printPro(ielem)">打印条码</span>
                </el-col>
              </el-row>
              <el-row>              
                <el-col :span="4">
                  克重：<span class="blackColor">{{ielem.weight}}g</span>
                </el-col>
                <el-col :span="4">
                  产品材质：<span class="blackColor">{{ielem.goldCode}}</span>
                </el-col>
                <el-col :span="4">
                  库存数量：<span class="blackColor">{{ielem.sum}}</span>
                </el-col>
                <el-col :span="4">
                  库存净重：<span class="blackColor">{{ielem.suttle}}g</span>
                </el-col>
                <el-col :span="4">
                  复核净重：<span class="blackColor">
                  <el-input-number :disabled="ielem.num <= 0" :controls="false" v-model="ielem.editSuttle" placeholder="" size="small" class="width70"
                    @focus="focusWeightFocus(ielem,indOne,'复核净重')"
                    @blur="focusWeightBlur()"
                  ></el-input-number>g</span>
                </el-col>
                <el-col :span="4">
                  <span class="redColor" @click="addToBaoFun(ielem)" v-if="ielem.num > 0">添加到包</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      orderStatusId: "", //订单状态
      orderStatus:'',
      inputTF: true, //文件上传input
      orderStatusList: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待审核"
        },
        {
          code: "2",
          value: "已通过"
        },
        {
          code: "3",
          value: "已取消"
        },
        {
          code: "4",
          value: "未通过"
        },
        {
          code: "5",
          value: "已退货"
        }
      ],
      statusTxt:'',
      statusList: [
        {
          code: "",
          value: "全部"
        },
        {
          code: "1",
          value: "待出库"
        },
        {
          code: "2",
          value: "已出库"
        }
      ],
      orderTypeId: "全部", //订单来源
      orderTypeList: ['全部'],
      rankById: "1",
      rankByList: [
        {
          code: "1",
          value: "日期"
        },
        {
          code: "2",
          value: "重量"
        }
      ], // 排序
      tableData2: [
        {
          a: "1121",
          b: "1222"
        },
        {
          a: "1121",
          b: "1222"
        }
      ], //模拟
      tableData: [{}], // 模拟

      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      xlsLoadTF:false,//excel上传按钮加载
      totalWeight:0,//总计重量
      winOneTF:false,//出库弹窗
      baoList:[],//弹窗
      webLoadingTF:false,
      proListOne:[],
      baoList:[],
    };
  },
  created() {
    this.created_fun();
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData(1, 12);
      this.findUserNameFun();
    },
    displayAllData(num, size) {
      var self = this;
      self.webLoadingTF =true
      let params = {
        number: self.search,
        startDate: self.startTime,
        endDate: self.endTime,
        userName: self.orderTypeId != '全部'?self.orderTypeId:'',
        orderStatus: self.orderStatusId,
        // rankBy:self.rankById,
        status:self.statusTxt,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/coffersAllotLogistics/list",
        params,
        res => {
          if (res.code == 200) {
            self.webLoadingTF =false
            self.pageNum = num;
            self.pageSize = size;
            // self.firstWeight = res.data.data.firstWeight;
            // self.finalWeight = res.data.data.finalWeight;
            if(res.data.list){
              self.parageraphList = res.data.list.data;
              self.totalWeight = res.data.totalWeight;
              self.priceSum = res.data.list.rowSize;
              if(self.parageraphList.length > 0){
                self.parageraphList.forEach((item, index) => {
                  item.updateTime = self.$api.dateGetDayTime(item.updateTime);
                });
              }
            }else{
              self.parageraphList = [];
            }


          } else {
            self.$message.error(res.data.msg);
          }
        },
        err => {
           self.webLoadingTF =false
        }
      );
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      localStorage.sarkData = JSON.stringify(elem);
      this.$router.push({
        path: "allotInOrderDetail",
        query: { number: elem.logisticsStockNumber }
      });
    },
    //操作人列表
    findUserNameFun(){
      let self = this;
      let params = {
        userName: '',
      };
      this.$api.formdataPostFun(
        this.$portMain + "/coffersAllotLogistics/findUserName",
        params,
        res => {
          res.data.map((v, i) => { v || res.data.splice(i, 1) }); // 清除空值
          self.orderTypeList = res.data;
          self.orderTypeList.unshift('全部')
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },

    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData(1, this.pageSize);
    },
    handleCurrentChange(val) {
      this.displayAllData(val, this.pageSize);
    },

    //搜索
    searchFun() {
      var self = this;
      if (self.selectedDay != null) {
        this.startTime = this.$api.dateGetDay(self.selectedDay[0]);
        this.endTime = this.$api.dateGetDay(self.selectedDay[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.displayAllData(1, 12);
    },
    
    //调拨出库
    stockOutFun(elem){
      let self =  this;
      // console.log(elem)
      var params = { PRS:{number: elem.logisticsStockNumber} };
       this.$axios
        .get(self.$portMain + "/coffersAllotLogistics/number", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.orderStatus = '调拨出库'
            self.baoList=[{newTF:true,sum:0,roughWeight:0,suttle:0,baoNo:'',viewSuit:false,skuList:[]}]
            // self.DepartList = res.data.data;
            self.proListOne = res.data.data.proList
            let disabledTF = true
            self.proListOne.forEach(ielem=>{
              ielem.editNum =ielem.num
              ielem.editRoughWeight = ielem.roughWeight
              ielem.editSuttle = ielem.suttle
              if(ielem.num > 0){
                disabledTF = false
              }
            })
            self.disabledTF = disabledTF
            self.winOneTF = true;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //调拨出库按钮
    stockOutFunTwo(){
       let self =  this
      // console.log(self.inCompanyId,self.inCompanyName)
      // console.log('包的数据：')
      // console.log(self.baoList)
      // console.log('未打包产品数据:')
      // console.log(self.proListOne)
      let baoList = []
      let errorTF = false
      self.baoList.forEach(ielem=>{
        // console.log(ielem)
        if(ielem.newTF && ielem.skuList.length > 0){
          errorTF = true
          return false
        }
        if(ielem.skuList.length > 0){
          let skuList = []
          ielem.skuList.forEach(jelem=>{
             //包里的产品列表
            skuList.push({
              proName:jelem.proName,
              proSkuNmber:jelem.proSkuNmber,
              one:jelem.one,
              oneCode:jelem.oneCode,
              conditi:jelem.conditi,
              goldCode:jelem.goldCode,
              processCode:jelem.processCode,
              weight:jelem.weight,
              num:jelem.editNum,
              sum:jelem.sum,
              roughWeight:jelem.editRoughWeight,
              suttle:jelem.editSuttle,
              img:jelem.img,
              stockNumber:jelem.stockNumber
            })
          })
          baoList.push({
            packageNumber:ielem.baoNo,
            suttle:ielem.suttle,
            roughWeight:ielem.roughWeight,
            weight:ielem.suttle,
            sum:ielem.sum,
            list:skuList,
          })
        }
      })
      if(errorTF){
        self.$message.error('还有未确认打包里边还有产品，不能进行确认退饰操作！')
        return false
      }
      if(self.proListOne.length > 0){
        let noBaoList = []
        let noBaoSuttle = 0
        let noBaoRoughWeight = 0
        let noBaoSum = 0
        self.proListOne.forEach(jelem=>{
          if(!jelem.editNum || jelem.editNum === 0 || !jelem.editRoughWeight || jelem.editRoughWeight === 0 || !jelem.editSuttle || jelem.editSuttle === 0){

          }else{
            noBaoSuttle +=jelem.editSuttle;
            noBaoRoughWeight +=jelem.editRoughWeight;
            noBaoSum +=jelem.editNum;
            noBaoList.push(({
                proName:jelem.proName,
                proSkuNmber:jelem.proSkuNmber,
                one:jelem.one,
                oneCode:jelem.oneCode,
                conditi:jelem.conditi,
                goldCode:jelem.goldCode,
                processCode:jelem.processCode,
                weight:jelem.weight,
                num:jelem.editNum,
                sum:jelem.sum,
                roughWeight:jelem.editRoughWeight,
                suttle:jelem.editSuttle,
                img:jelem.img,
                stockNumber:jelem.stockNumber
              }))
          }

        });
        // console.log(noBaoList)
        baoList.push({
          packageNumber:'',
          suttle:noBaoSuttle,
          roughWeight:noBaoRoughWeight,
          sum:noBaoSum,
          list:noBaoList,
        })
        // console.log(self.proListOne)
      }
      let params = {
        sponsorDepartment:'物流中心',
        reapUnit:'尚金缘金库',
        // customerId:self.inCompanyId,
        list:baoList,
      }
      // console.log(params)
      this.$axios
        .post(self.$portMain + "/stockManagement/allotListData", params)
        .then(function(res) {
          if (res.data.code == 200) {
            // console.log(res.data.data)
            self.tableLeftData = res.data.data.retreatOrnament.list;
            self.tableRightData = res.data.data.transferSlipList;
            self.tableProData = res.data.data.retreatOrnament
            self.winOneTF = false
            self.viewBaoTFFour = true
          } else {
            self.$message.error(res.data.msg);
          }
        })
    },

    //编辑和保存
    editJelem(elem,baoElem){
      elem.editTF = !elem.editTF 
      // console.log(baoElem)
      // console.log(elem)
      this.skuListNum(baoElem)
      this.$forceUpdate()
    },
    //移出
    delJelem(index,elem,baoElem){
      this.proListOne.push(elem[index])
      elem.splice(index,1);
      this.skuListNum(baoElem)
    },
    //添加到包事件
    addToBaoFun(elem){
      let self = this 
      if(!elem.editNum || elem.editNum === 0 || !elem.editRoughWeight || elem.editRoughWeight === 0 || !elem.editSuttle || elem.editSuttle === 0){
        this.$message.error('还有未填字段，不能进行添加到包操作')
        return false
      }
      // console.log(self.baoList)
      self.baoList.forEach(ielem=>{
        if(ielem.newTF === true){
          self.baoListNew = ielem
          elem.editTF = false
          if(ielem.skuList){
            ielem.skuList.push(elem)
          }else{
            ielem.skuList = []
            ielem.skuList.push(elem)
          }
        }
        // console.log(ielem)
      })
      self.proListOne.forEach((jelem,indOne)=>{
        if(jelem.proSkuNmber === elem.proSkuNmber){
          self.proListOne.splice(indOne,1)
          return;
        }
      })
      self.skuListNum(self.baoListNew)
    },
    //空闲包计算
    skuListNum(elem){
      elem.sum = 0
      elem.roughWeight = 0
      elem.suttle = 0
      elem.skuList.forEach(ielem=>{
        elem.sum += ielem.editNum
        elem.roughWeight += ielem.editRoughWeight
        elem.suttle += ielem.editSuttle
      })
      // console.log(elem.skuList)
    },
    //确认打包
    confirmBao(elem){
      // console.log(elem)
      let self = this
      if(!elem.skuList || elem.skuList.length === 0){
        self.$message.error('此包未添加产品，请添加产品再进行确认操作！')
        return
      } 
      let typeNum = ''
      if(self.orderStatus === '调拨出库'){
        typeNum = 2
      }
      if(self.orderStatus === '退饰出库'){
        typeNum = 1
      }
      var params = { PRS:{stockNumber:elem.skuList[0].stockNumber,type:typeNum} };
      this.$axios
        .get(self.$portMain + "/stockManagement/findNumber",params)
        .then(function(res) {
          if (res.data.code == 200) {
            elem.newTF = false;
            elem.baoNo = res.data.data
            if(self.proListOne.length > 0){
              self.baoList.push({newTF:true,sum:0,roughWeight:0,suttle:0,baoNo:'',viewSuit:false,skuList:[]})
            }
            // self.viewBaoTFFour = ture;
            self.$forceUpdate();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },   
        //输入框获得焦点
    focusWeightFocus(e, ind,elem) {
      this.enterStatus = elem
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlur() {
      this.inputIndOne = "";
    },
    //输入框获得焦点
    focusWeightFocusTwo(e, ind,elem) {
      this.enterStatus = elem
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlurTwo() {
      this.inputIndOne = "";
    },     
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50)
$font-color = #999
.conBigDiv
  .yellowColor
    color #F26D0F
  .redColor
    color #F20F34
  .blackColor
    color #2E2F33
  .grayColor
    color #8a9199
  .hr
    border-top 1px solid #d9d9d9
    height 3px
    margin 12px 0 12px 0
  .searchTxt
    width 320px
  .pageD
    margin-top 20px
    text-align center
  .fontStyle
    color #8A8E99
    font-size 14px
    margin-left 31px
  .titleFont
    color #8A8E99
    font-size 14px
  .width160
    width 160px
  .creatStyle
    position relative
    .line
      width 640px
      height 1px
      background-color #E6E6E6
      position absolute
      top -33px
      left -20px
    .inputWidth240
      width 240px
    .inputWidth160
      width 160px
    .itemRight
      text-align right
    .marginBottom
      margin-bottom 32px
    .fontTStyle
      font-size 14px
      color #8A9199
  .detailStyle
    position relative
    .line
      width 640px
      height 1px
      background-color #E6E6E6
      position absolute
      top -33px
      left -20px
    .itemBottom
      margin-bottom 24px
    .titleStyle
      color #8A9199
      font-size 14px
      text-align right
      padding-right 24px
    .contentStyle
      color #2E2F33
      font-size 14px
  .promptStyle
    position relative
    .line
      width 480px
      height 1px
      background-color #E6E6E6
      position absolute
      top -33px
      left -20px
    .textAreaStyle
      width 433px
      height 120px
      resize none
      background rgba(240, 247, 255, 1)
  .baoTabOne
    background #E4EAF0
    margin 5px 0
    color #8A8E99
    .divOne
      padding 7px
    .divTwo
      text-align right
      padding-right 10px
      padding-top 7px
  .baoProFour
    border-top 1px solid #E5F1FF
    margin-top 10px
    padding 20px
    color #8A8E99
  .baoTabTwo
    background #fff
    border 1px solid #E4EAF0
    padding 10px
  .baoProOne
    border 1px solid #E5F1FF
    padding 5px
    margin-top 10px
    color #8A8E99
  .baoProTwo
    margin-top 10px
    color #8A8E99
  .baoProThree
    border-top 1px solid #E5F1FF
    margin-top 10px
    color #8A8E99
  .totalDes
    color #F20F34
    font-size 14px
    text-align right
    span
      display inline-block
      margin-right 24px
  .width70
    width 80px
  .titOne
    color #F20F34
    text-align right
    font-size 14px
  .marginLeft20
    margin-left 20px
</style>
