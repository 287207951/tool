<template>
  <div class="conBigDiv">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓储管理</el-breadcrumb-item>
      <el-breadcrumb-item>库位管理</el-breadcrumb-item>
      <el-breadcrumb-item>库位详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-loading="webLoading">
      <div class="hr" />
      <el-table :data="tableData" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="sarkName" label="货柜名称"></el-table-column>
        <el-table-column prop="sarkNum" label="货柜编号"></el-table-column>
        <el-table-column prop="depositType" label="存放品类"></el-table-column>
        <el-table-column prop="stockSize" label="库位数量（个）">
          <template slot-scope="scope">{{scope.row.sarkRow}} - {{scope.row.sarkCol}}</template>
        </el-table-column>
        <el-table-column prop="createTimeTxt" label="创建时间"></el-table-column>
        <el-table-column prop="operationName" label="操作人"></el-table-column>
      </el-table>
      <el-row class="itemFirst">
        <el-col :span="24">
          <div ref="tabOne" class="tabOneMain">
            <div class="tabOneDiv">
              <div
                v-for="item in positionData.sark"
                class="tabOne"
                :style="{'width':tabOneWidth}"
                :key="item.id"
              >
                <div>
                  <span class="tabOneTopLeft">{{item.longNum}}</span>
                  <span class="tabOneTopRight" @click="editPallet(item)" v-if="item.editTF">修改</span>
                </div>
                <div class="tabTwoMain">
                  <!-- <div
                    class="tabTwo"
                    v-for="itemOne in item.plist"
                    :style="{'width':item.tabTwoWidth,'height':item.tabTwoHeight,'lineHeight':item.tabTwoHeight}"
                    :key="itemOne.id"
                    @click="clickPallet(itemOne)"
                  >{{itemOne.shortNum}}</div>-->
                  <tabeDisplayT
                    v-if="tabeDisplayTF"
                    class="tabTwoMain"
                    :tabData="item.plist"
                    :width="item.tabTwoWidth"
                    :height="item.tabTwoHeight"
                    :lineHeight="item.tabTwoHeight"
                    @callback="editTabFun"
                  ></tabeDisplayT>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 提示 -->
    <el-dialog :visible.sync="palletType" :close-on-click-modal="false" width="834px">
      <div class="promptStyle palletStyle">
        <el-row class="palletDiv">
          <el-col :span="5">
            <img
              v-if="editSkuData.pic"
              :src="$portImg+editSkuData.pic"
              style="height:120px; width:150px;"
              @click.stop="showPic($portImg+editSkuData.pic)"
            />
            <img
              v-else
              src="/static/images/img-noimg.png"
              style="height:120px; width:150px;"
            />
          </el-col>
          <el-col :span="7" class="palletTxtName">{{editSkuData.proName}}</el-col>
          <el-col
            :span="11"
            class="palletTxtFour"
          >库位：{{editSkuNumData.longNum}}-{{editSkuNumData.shortNum}}</el-col>
          <el-col :span="5" class="palletTxtTwo">编号：{{editSkuData.proNumber}}</el-col>
          <el-col :span="5" class="palletTxtTwo">
            <span
              v-if="editSkuData.oneItemsCode != '套装' && editSkuData.goldCode"
            >材质：{{editSkuData.goldCode}}</span>&nbsp;
          </el-col>
          <el-col :span="9" class="palletTxtTwo">
            <span
              v-if="editSkuData.oneItemsCode != '套装' && editSkuData.effectCode"
            >表面工艺：{{editSkuData.effectCode}}</span>&nbsp;
          </el-col>
          <el-col :span="5" class="palletTxtTwo">产品类别：{{editSkuData.oneItemsCode}}</el-col>
          <el-col :span="5" class="palletTxtTwo">
            <span
              v-if="editSkuData.oneItemsCode != '套装' && editSkuData.processCode"
            >生产工艺：{{editSkuData.processCode}}</span>&nbsp;
          </el-col>
          <el-col :span="9" class="palletTxtTwo">
            <span
              v-if="editSkuData.oneItemsCode != '套装' && editSkuData.carCode"
            >车花：{{editSkuData.carCode}}</span>&nbsp;
          </el-col>
          <el-col :span="5" class="palletTxtThree">
            <span
              v-if="editSkuData.oneItemsCode != '套装' && editSkuData.specConditi"
            >成色：{{editSkuData.specConditi | $conditiNameFilter}}</span>
          </el-col>
          <el-col
            :span="editSkuData.oneItemsCode != '套装'?5:10"
            class="palletTxtThree"
          >克重(g)：{{editSkuData.weight}}</el-col>
          <el-col :span="9" class="palletTxtThree">
            <span v-if="editSkuData.oneItemsCode != '套装'">
              <b
                v-if="editSkuData.extendAttr && editSkuData.one"
                v-html="$api.getAttachProperty(editSkuData.one,editSkuData.extendAttr)"
              ></b>&nbsp;
            </span>
          </el-col>
          <el-col :span="6" class="palletTxtOne">库存数量(件)：{{editSkuNumData.amount}}</el-col>
          <el-col :span="6" class="palletTxtOne">最高容量(件)：{{editSkuNumData.upper}}</el-col>
          <el-col :span="6" class="palletTxtOne">最低容量(件)：{{editSkuNumData.lower}}</el-col>
          <el-col :span="6" class="palletTxtOne">
            <el-input-number v-model="palletNum" :min="0" size="mini" label="描述文字"></el-input-number>
          </el-col>
          <el-col :span="4" class="palletTxtOne">
            <el-button
              type="primary"
              @click="addReplenishCart"
              v-if="isRepCart"
              size="mini"
            >添加到补货购物车</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog
      title="修改托盘"
      :visible.sync="editPalletTf"
      :close-on-click-modal="false"
      width="600px"
    >
      <div class="promptStyle">
        <div class="line"></div>
        <div class="tabThreeMain">
          <div v-for="item in palletAllData" :key="item.id" class="tabThree">
            <div>{{item.depositType}}</div>
            <div>
              <tabeDisplay
                class="tabThreeS"
                :tabData="item.sumNum"
                :width="item.widthTxt"
                :height="item.heightTxt"
                :lineHeight="item.heightTxt"
              ></tabeDisplay>
            </div>
            <div class="tabThreeSelect">
              <el-radio v-model="palletId" :label="item.id">&nbsp;</el-radio>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPalletTf = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveEditPallet" size="small">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="addProTF" :close-on-click-modal="false" width="1200px">
      <span>
        <div>
          <el-row>
            <el-col :span="20">
              <span class="fontStyle">材质</span>
              <el-select
                v-model="goldCodeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span class="fontStyle">分类</span>
              <el-select
                v-model="stockTypeId"
                placeholder="请选择"
                size="small"
                style="width:160px"
                @change="searchFun"
              >
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in categoryNewList"
                  :key="item.label"
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
                <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>

              <span class="fontStyle">商品搜索</span>
              <el-input
                placeholder="请输入关键字搜索"
                v-model="search"
                class="input-with-select searchTxt"
                size="small"
                style="width:220px"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchFun" />
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="editAddPro" size="small">确定分配</el-button>
            </el-col>
          </el-row>
        </div>
        <div style="height: 20px"></div>
        <div class="addProDiv">
          <el-row v-for="(item,ind) in parageraphList" :key="ind" class="orderBigDiv">
            <el-col :span="1" class="checkboxDiv">
              <el-radio
                :label="item.proNumber"
                :disabled="item.existType === 1"
                v-model="selectProId"
              >&nbsp;</el-radio>
            </el-col>
            <el-col :span="23" class="tabTwo">
              <div class="noExistType" v-if="item.existType === 1">
                <div class="noExTxt">此SKU已有库位</div>
              </div>
              <div class="tabTwoLeft">
                <img
                  v-if="item.url"
                  :src="$portImg+item.url"
                  style="height:116px; width:153px;"
                  @click.stop="showPic($portImg+item.url)"
                />
                <img
                  v-else
                  src="/static/images/img-noimg.png"
                  style="height:116px; width:153px;"
                  @click.stop="showPic(`/static/images/img-noimg.png`)"
                />
              </div>

              <el-row style="line-height:30px;" class="tabTwoRight">
                <el-col :span="24">{{item.proName}}</el-col>
                <!-- <el-col
                  :span="8"
                  class="txtRed"
                >
                  库位：-
                </el-col>-->
                <el-col :span="8" class="txtTwo">编号：{{item.proNumber}}</el-col>
                <el-col :span="8" class="txtTwo">
                  <span v-if="item.goldCode">材质：{{item.goldCode}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtTwo">
                  <span v-if="item.effectCode">表面工艺：{{item.effectCode}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtTwo">
                  <span v-if="item.one">产品类别：{{item.one}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtTwo">
                  <span v-if="item.carCode">生产工艺：{{item.carCode}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtTwo">
                  <span v-if="item.carCode">车花：{{item.carCode}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtOne">
                  <span v-if="item.conditi">成色：{{item.conditi | $conditiNameFilter}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtOne">
                  <span v-if="item.weight">克重：{{item.weight}}</span>&nbsp;
                </el-col>
                <el-col :span="8" class="txtOne">
                  <b
                    v-if="item.extendAttr && item.one"
                    v-html="$api.getAttachProperty(item.one,item.extendAttr)"
                  ></b>&nbsp;
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
      <span slot="footer" class="dialog-footer">
        <!-- <el-button
          @click="addProTF = false"
          size="small"
        >取 消</el-button>-->
        <!-- <el-button
          type="primary"
          @click="addProTF = false"
          size="small"
        >确 定</el-button>-->
      </span>
    </el-dialog>
    <!-- 图片放大 -->
    <Popoverpic
      v-show="modelType"
      @callback="cancelModel"
      :imgSrc="modelImgSrc"
    ></Popoverpic>
    <!--  -->
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      isRepCart: false,
      wareId: ``, // 仓库id
      reason: "", // 红冲原因
      HCType: "", // 红冲状态
      allData: {}, //详细数据
      outputStockId: "", //发料Id
      proSizeData: {}, //大货柜
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      palletSumNum: 0,
      sarkData: {}, // 上边表格数据
      tableData: [], //上边表格数据
      positionData: {}, //插盘格子数据
      editPalletTf: false, //修改托盘弹框
      palletType: false, //托盘详情弹框
      tabOneWidth: "100%", //托盘表格宽
      palletNum: 0, //补货数量
      palletAllData: [
        { id: 1, plateCol: 1, plateRow: 2 },
        { id: 2, plateCol: 2, plateRow: 1 },
        { id: 3, plateCol: 2, plateRow: 2 },
        { id: 4, plateCol: 3, plateRow: 2 }
      ], //托盘托盘修改
      palletId: -1, //点修改后托盘格尖
      palletSelectId: -1, //选中托盘列表后修改的id
      editPalletData: {}, //选中托盘内容
      editSkuData: {}, //选中托盘sku内容
      editSkuNumData: {}, //选中托盘skuNum上限、下限、数量内容
      addProTF: false, //托盘添加Sku弹框
      priceSum: 0,
      pageSize: 0,
      pageNum: 0,
      goldCodeId: "全部",
      goldCodeList: [],
      stockTypeId: "",
      search: "",
      processCodeList: [],
      processCodeId: "全部",
      categoryNewList: [],
      parageraphList: [],
      selectProId: "",
      categoryList: [], //新建托盘品类数组
      tabeDisplayTF: true,
      webLoading: true
    };
  },
  created() {
    this.created_fun();
  },

  methods: {
    created_fun() {
      this.sarkData = JSON.parse(localStorage.sarkData);
      this.isAddcart = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "stock-out-create"
      );
      this.displayAllData();
      this.codeDisplay();
      this.isRepCart = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "order-replenish"
      );
    },
    displayAllData() {
      var self = this;
      self.tabeDisplayTF = false;
      let params = {
        id: self.sarkData.id
      };
      this.$api.formdataPostFun(
        self.$portMain + "/bizSark/get",
        params,
        res => {
          self.wareId = res.data.ware.id;
          self.webLoading = false;
          self.tableData = [self.sarkData];
          self.positionData = res.data;
          // self.tableData.forEach(ielem => {
          //   ielem.createTimeTxt = self.$api.dateGetDay(ielem.createTime);
          // });
          self.tabeDisplayTF = true;
          self.tableFun();
        },
        err => {
          self.webLoading = false;
          self.$message.error(res.msg);
        }
      );
    },

    tableFun() {
      var self = this;
      this.tabOneWidth = `calc(${((1 / this.positionData.col) * 100).toFixed(
        2
      )}% - 40px)`;
      this.positionData.sark.forEach(ielem => {
        ielem.editTF = true;
        // console.log(ielem)
        if (ielem.plist) {
          ielem.plist.forEach(jelem => {
            jelem.longNum = ielem.longNum;
            if (jelem.skuNum) {
              ielem.editTF = false;
            }
          });
          ielem.tabTwoWidth = `calc(${((1 / ielem.col) * 100).toFixed(
            2
          )}% - 3px)`;
          switch (ielem.row) {
            case 1:
              ielem.tabTwoHeight = "160px";
              break;
            case 2:
              ielem.tabTwoHeight = "80px";
              break;
            case 3:
              ielem.tabTwoHeight = "53.33px";
              break;
            case 4:
              ielem.tabTwoHeight = "40px";
              break;
            case 5:
              ielem.tabTwoHeight = "32px";
              break;
            case 6:
              ielem.tabTwoHeight = "26.66px";
              break;
          }
        }
      });

      this.palletAllData.forEach(ielem => {
        ielem.sumNum = parseInt(ielem.plateCol * ielem.plateRow);
        ielem.widthTxt = `calc(${((1 / ielem.plateCol) * 100).toFixed(
          2
        )}% - 2px)`;
        switch (ielem.plateRow) {
          case 1:
            ielem.heightTxt = "90px";
            break;
          case 2:
            ielem.heightTxt = "45px";
            break;
          case 3:
            ielem.heightTxt = "30px";
            break;
          case 4:
            ielem.heightTxt = "22.5px";
            break;
          case 5:
            ielem.heightTxt = "18px";
            break;
          case 6:
            ielem.heightTxt = "15px";
            break;
        }
      });
    },

    codeDisplay() {
      var self = this;
      let categoryListTwo = self.sarkData.depositType.split(",");
      self.categoryNewList = [];
      //
      this.$publicData
        .categoryFun()
        .then(function(res) {
          categoryListTwo.forEach(jelem => {
            res.forEach(ielem => {
              if (ielem.value === jelem) {
                self.categoryNewList.push(ielem);
              }
            });
          });
          self.stockTypeId = self.categoryNewList[0].label;
        })
        .catch(function(err) {
          self.categoryList = [];
          self.$message.error(err);
        });
      this.$axios.get(this.$portMain + "/product/code", {}).then(function(res) {
        if (res.data.code == 200) {
          res.data.data.forEach(item => {
            //材质
            if (item.goldCode == "产品材质") {
              self.goldCodeList = item.list;
              self.goldCodeList.unshift("全部");
            }
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
    //数值转字母字符
    returnTxt(elem) {
      return this.$publicData.charData[elem].valueS;
    },
    //点击托盘修改产品
    clickPallet(ielem) {
      var self = this;
      self.palletType = true;
    },
    //修改托盘里的托盘类型
    editPallet(ielem) {
      // console.log(ielem)
      var self = this;
      self.palletId = ielem.plateId;
      self.editPalletData = ielem;

      this.$api.formdataPostFun(
        self.$portMain + "/bizPlate/select",
        {},
        res => {
          self.palletAllData = res.data;
          self.editPalletTf = true;
          self.tableFun();
        }
      );
    },
    saveEditPallet() {
      var self = this;
      let params = {
        pid: self.palletId,
        id: self.editPalletData.id
      };
      this.$api.formdataPostFun(
        self.$portMain + "/bizPlate/editShape",
        params,
        res => {
          self.$message.success(res.msg);
          self.editPalletTf = false;
          self.created_fun();
        }
      );
    },
    //确定添加事件
    editAddPro() {
      var self = this;
      if (!self.selectProId) {
        self.$message.error("产品还未补选择！");
        return false;
      } else {
        let params = {
          sku: self.selectProId,
          lid: self.editSkuNumData.id
        };
        this.$api.formdataPostFun(
          this.$portMain + "/bizPlate/placeSku",
          params,
          res => {
            self.positionData.sark.forEach(ielem => {
              ielem.plist.forEach(jelem => {
                if (jelem.id === self.editSkuNumData.id) {
                  jelem.skuNum = self.selectProId;
                  //   jelem.upStore = 0;
                  jelem.backgroundColor = "#E6E6E6";
                }
              });
            });
            self.$message.success(res.msg);
            self.addProTF = false;
            // self.tabeDisplayTF = false;

            // setTimeout(function() {
            //   self.tabeDisplayTF = true;
            // }, 200);
          },
          err => {
            self.$message.error(err.msg);
          }
        );
      }
    },
    editTabFun(elem) {
      var self = this;
      if (elem.skuNum) {
        self.editSkuNumData = elem;
        self.palletNum = 0;
        let params = {
          PRS: {
            skuNum: elem.skuNum
          }
        };
        this.$axios
          .get(this.$portMain + "/product/findSku", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.editSkuData = res.data.data;
              self.editSkuData.sizeData = JSON.parse(
                self.editSkuData.extendAttr
              );
              self.editSkuData.upper = elem.upper;
              self.editSkuData.lower = elem.lower;
              self.palletType = true;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.editSkuNumData = elem;
        self.selectProId = "";
        self.addProTF = true;
        self.displayAddProData(1, 12);
      }
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
    searchFun() {
      var self = this;
      self.displayAddProData(1, 12);
    },
    displayAddProData(num, size) {
      var self = this;
      let params = {
        PRS: {
          proName: self.search,
          one: self.stockTypeId,
          processCode: self.processCodeId,
          goldCode: self.goldCodeId,
          page: num,
          rows: size,
          wareId: self.wareId
        }
      };
      this.$axios
        .get(this.$portMain + "/product/proRepertoryList", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.firstWeight = res.data.data.firstWeight;
            self.finalWeight = res.data.data.finalWeight;
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },

    //添加补货购物车
    addReplenishCart() {
      var self = this;
      if (self.palletNum != 0) {
        let params = {
          skuNum: self.editSkuData.specNumber,
          proNo: self.editSkuData.proNumber,
          sum: JSON.stringify(self.palletNum),
          suit: self.editSkuData.oneItemsCode != "套装" ? "1" : "2"
        };
        this.$api.formdataPostFun(
          self.$portMain + "/order/addReplenishCart",
          params,
          res => {
            // self.displayAllData();
            self.$message.success(res.msg);

            setTimeout(() => {
              self
                .$confirm(
                  "已添加到补货购物车成功，是否需要跳转到补货购物车?",
                  "操作成功",
                  {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "success"
                  }
                )
                .then(() => {
                  self.$router.push("repleCart");
                })
                .catch(() => {
                  self.palletType = false;
                });
            }, 100);
          }
        );
      } else {
        self.$message.error("补货数量不能为0，请重新输入！");
      }
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
        //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .itemRight {
    text-align: right;
  }

  .itemFirst {
    margin-top: 22px;
    margin-bottom: 20px;
    line-height: 32px;
    font-size: 14px;

    span:first-child {
      color: #8A9199;
    }

    span:last-child {
      color: #222426;
    }

    .noteStyle {
      display: flex;
      justify-content: flex-end;
      // margin-top 10px
    }

    .textAreaStlye {
      width: 86%;
      height: 76px;
      border-radius: 4px;
      border: 1px solid #CFD4E6;
      resize: none;
    }

    .completeDes {
      width: 82.5%;
      display: inline-block;
      text-align: left;
    }
  }

  .palletStyle {
    min-height: 240px;
  }

  .promptStyle {
    position: relative;

    .line {
      width: 600px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .textAreaStyle {
      width: 433px;
      height: 120px;
      resize: none;
      background: rgba(240, 247, 255, 1);
    }
  }

  .tabOneMain {
    min-width: 1200px;
    padding: 20px 3px;
    border: 6px solid #e6e6e6;

    .tabOneDiv {
      width: 100%;
      display: -webkit-flex; /* Safari */
      -webkit-flex-flow: row wrap; /* Safari 6.1+ */
      display: flex;
      flex-flow: row wrap;
      justify-content: center;

      .tabOne {
        padding: 15px;
        border: 1px solid #f0f0f0;
        margin-left: -1px;
        margin-top: -1px;
        min-height: 124px;

        .tabOneTopLeft {
          color: #999;
        }

        .tabOneTopRight {
          float: right;
          color: #F20F34;
        }
      }
    }
  }

  .tabTwoMain {
    width: 100px;
    max-width: 220px;
    margin: 0 auto;
    display: -webkit-flex; /* Safari */
    -webkit-flex-flow: row wrap; /* Safari 6.1+ */
    display: flex;
    flex-flow: row wrap;

    .tabTwo {
      border: 1px solid #333;
      text-align: center;
      font-size: 12px;
      min-height: 40px;
      line-height: 40px;
      margin-left: -1px;
      margin-top: -1px;
      // background #E6E6E6 100%
    }
  }

  .tabThreeMain {
    width: 100%;
    display: -webkit-flex; /* Safari */
    -webkit-flex-flow: row wrap; /* Safari 6.1+ */
    display: flex;
    flex-flow: row wrap;

    .tabThree {
      width: 45%;
      text-align: center;
      font-size: 12px;
      margin-left: 10px;
      margin-bottom: 24px;
      position: relative;
      height: 145px;

      .tabThreeSelect {
        position: absolute;
        left: 45%;
        bottom: 0;
      }

      .tabThreeS {
        width: 60px;
        margin: 0 auto;
        display: -webkit-flex; /* Safari */
        -webkit-flex-flow: row wrap; /* Safari 6.1+ */
        display: flex;
        flex-flow: row wrap;

        .tabThreeSDiv {
          border: 1px solid #333;
          margin-left: -1px;
          margin-top: -1px;
        }
      }
    }
  }

  .palletDiv {
    height: 35px;
    line-height: 35px;

    .palletTxtOne {
      font-size: 14px;
      color: #333;
      margin-top: 20px;
    }

    .palletTxtTwo {
      font-size: 12px;
      color: #999;
    }

    .palletTxtThree {
      font-size: 12px;
      color: #333;
    }

    .palletTxtFour {
      font-size: 12px;
      color: #F20F34;
    }

    .palletTxtName {
      font-size: 14px;
      color: #333;
    }
  }

  .orderBigDiv {
    padding: 20px;
    min-height: 126px;
    border-bottom: #E9ECF5 1px solid;

    .orderBigDivOne {
      color: #333;
    }
  }

  .txtOne {
    font-size: 12px;
    color: #333;
  }

  .txtTwo {
    font-size: 12px;
    color: #999;
  }

  .txtRed {
    font-size: 12px;
    color: #F20F34;
  }

  .tabTwo {
    display: flex;
  }

  .tabTwoLeft {
    width: 174px;
  }

  .tabTwoRight {
    width: calc(100% - 174px);
  }

  .txtAlginRight {
    text-algin: right;
  }
}

.addProDiv {
  max-height: 550px;
  overflow: auto;
}

.noExistType {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}

.noExTxt {
  color: #fff;
  font-size: 18px;
}
</style>
