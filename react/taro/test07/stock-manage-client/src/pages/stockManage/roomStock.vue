<template>
  <div class="conBigDiv" ref="repleOrder" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>展厅库存</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr"/>
      <el-row>
        <el-col :span="20">
          <span class="fontStyle">全选</span>
          <el-checkbox v-model="selectAll" @change="changeSelectAll"></el-checkbox>
          <span class="fontStyle">材质</span>
          <el-select
            v-model="goldCodeId"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="changeCode"
          >
            <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">产品类别</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:160px"
            @change="changeCode"
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
            @change="changeCode"
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
            @keyup.enter.native="changeCode"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>

        <el-col :span="4" style="text-algin:right">
          <el-button size="small" @click="allotStorage" v-if="orderTrandView">调拨出库</el-button>
          <el-button size="small" @click="editAllot" v-if="backupTF">确定调拨出库</el-button>
          <el-button
            type="primary"
            size="small"
            @click="excelInputFun"
            :loading="xlsLoadTF"
            v-if="xlsUploadTF"
          >导入EXCEL</el-button>
          <input
            type="file"
            ref="excelInput"
            accept=".xls, .xlsx"
            @change="excelFun"
            v-show="false"
            v-if="inputTF"
          >
        </el-col>
      </el-row>
      <div>
        <canvas ref="myCanvas" width="340" height="200" style="border:1px solid #d3d3d3;" v-show="false">
        </canvas>
        <img ref="myImg" width="500" height="150" v-show="false"/>
      </div>
      <!-- <div style="height:600px;overflow:auto;"> -->
        <el-row v-for="(item, ind) in stockPro" :key="ind" class="orderBigDiv">
          <el-col :span="1" style="line-height:80px;">
            <el-checkbox
              :label="item.id"
              v-model="item.selectTF"
              :disabled="item.amount<=0"
              @change="changeSelect(item)"
            >&nbsp;</el-checkbox>&nbsp;
          </el-col>
          <el-col :span="23" class="tabOne">
            <div class="tabOneLeft">
              <img
                v-if="item.url"
                :src="$portImg + item.url"
                style="height:90px; width:120px;"
                @click.stop="showPic($portImg + item.url)"
              >
              <img
                v-else
                src="../../../static/images/img-noimg.png"
                style="height:90px; width:120px;"
                @click.stop="showPic(`../../../static/images/img-noimg.png`)"
              >
            </div>

            <el-row style="line-height:31px;" class="tabOneRight">
              <el-col :span="5">{{ item.proName }}</el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.effectCode">
                  表面工艺：
                  <span class="txtTwo">{{item.effectCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne">
                <b v-if="item.carCode">
                  车花：
                  <span class="txtTwo">{{item.carCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne">
                <b v-if="item.conditi">
                  成色：
                  <span class="txtTwoBold">{{ item.conditi }}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="6" class="txtOne">
                  数量：
                  <span :class="item.amount>0?'txtTwoBold':'txtRedBold'">{{ item.amount }}</span>
              </el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.proNumber">
                  编号：
                  <span class="txtTwo">{{item.proNumber}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="9" class="txtOne">
                <b v-if="item.goldCode">
                  产品材质：
                  <span class="txtTwo">{{item.goldCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne">
                克重(g)：
                <span class="txtTwoBold">{{ item.weight }}</span>
              </el-col>
              <el-col :span="4" class="txtOne">
                净重(g)：
                <span class="txtTwoBold">{{ item.goldWeight }}</span>
              </el-col>
              <el-col :span="2" class="txtRed">
                <el-button size="small" @click="downLoadFun(item)" type="text">下载一维码</el-button>
              </el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.one">
                  类别：
                  <span class="txtTwo">{{item.one}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne">
                <b v-if="item.processCode">
                  生产工艺：
                  <span class="txtTwo">{{item.processCode}}</span>
                </b>&nbsp;
              </el-col>

              <el-col :span="8" class="txtFour">
                <span v-if="item.oneItemsCode == 'TZ'">
                  <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">
                    详情
                    <i class="el-icon-arrow-up"></i>
                  </span>
                  <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">
                    详情
                    <i class="el-icon-arrow-down"></i>
                  </span>
                </span>&nbsp;
              </el-col>

              <el-col :span="8" class="txtOne" v-if="item.sizeTF">
                <b v-if="item.extendAttr && item.one" v-html="$api.getAttachProperty(item.one,item.extendAttr)"></b>&nbsp;
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
            <div class="suitDiv" v-if="item.viewSuit">
              <!-- {{item.map.proList}} -->
              <el-row>
                <el-col
                  :span="11"
                  class="suitSubDiv"
                  v-for="(ielem, indTwo) in item.map.proList"
                  :key="indTwo + ''"
                >
                  <div class="pro-item">
                    <div class="pro-imgs">
                      <img
                        :src="
                          ielem.pic
                            ? $portImg + ielem.pic
                            : '../../../../static/images/img-noimg.png'
                        "
                        width="120"
                        height="90"
                      >
                    </div>
                    <div class="pro-right">
                      <el-row>
                        <el-col :span="24" class="pro-tit">
                          {{
                          ielem.name
                          }}
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" class="txtTwo">
                          {{ ielem.goldCode
                          }}{{ ielem.processCode ? "," + ielem.processCode : ""
                          }}{{ ielem.effect ? "," + ielem.effect : "" }}
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="txtOne">
                          克重：
                          <span class="txtTwo">{{ ielem.weight }}</span>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
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
      <!-- </div> -->
    </div>
    <el-dialog title="补货单备注" :visible.sync="backupWinTF" width="30%" :close-on-click-modal="false">
      <span>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="backupTxt"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backupWinTF = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addBackup" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
    <!--  -->
    <a ref="xlsDownloadA"></a>
    <el-dialog
      title="调拨出库详情"
      :visible.sync="addStorageTFTwo"
      width="1400px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <span>
        <div class="baoProFour">
          <el-row>
            <el-col :span="24">
              <span>接收单位：尚金缘金库</span>
              <!-- <el-select v-model="mock" filterable placeholder="请选择选择" size="small">
                <el-option
                  v-for="item in companySearTwo"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>-->
              <span style="margin:0 74px;">发起单位：尚金缘展厅</span>
              <el-button type="primary" size="small" @click="subFun">确认调拨</el-button>

              <!-- <span class="floatRight">调拨原因：
                <el-input v-model="mock" placeholder size="small" class="width240"></el-input>
              </span>-->
            </el-col>
          </el-row>
        </div>
        <div>
          <div class="baoTabOne" v-for="(ielem,indOne) in baoList" :key="indOne">
            <el-row>
              <el-col :span="4" class="divOne">
                包号：
                <span class="yellowColor" v-if="ielem.newTF">新包</span>
                <span v-else class="blackColor">{{ielem.baoNo}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                备注：
                <el-input
                  v-model="ielem.packRemarks"
                  placeholder
                  size="small"
                  class="width70"
                  v-if="ielem.newTF"
                />
                <span class="blackColor" v-else>{{ielem.packRemarks}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                总数量：
                <span class="blackColor">{{ielem.sum}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                净重：
                <!-- <span v-if="ielem.newTF">
                  <el-input
                    v-model="ielem.nowSkuGoldWeight"
                    placeholder
                    size="small"
                    class="width70"
                    @focus="focusWeightFocusTwo(ielem,indOne,'净重')"
                    @blur="focusWeightBlurTwo()"
                    disabled
                  ></el-input>
                </span> -->
                <span class="blackColor">{{$api.returnFloatNum(ielem.nowSkuGoldWeight)}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                毛重：
                <span v-if="ielem.newTF">
                  <el-input-number
                    v-model="ielem.nowSkuWeight"
                    placeholder
                    :controls="false"
                    size="small"
                    class="width70"
                    @focus="focusWeightFocusTwo(ielem,indOne,'毛重')"
                    @blur="focusWeightBlurTwo()"
                  ></el-input-number>
                </span>
                <span v-else class="blackColor">{{ielem.nowSkuWeight}}</span>
              </el-col>
              <el-col :span="3" class="divOne">
                打包状态：
                <span class="yellowColor" v-if="ielem.newTF">待打包</span>
                <span v-else class="blackColor">已打包</span>
              </el-col>
              <el-col :span="5" class="divOne">
                操作：
                <span class="redColor" v-if="ielem.newTF" @click="confirmBao(ielem)">确认打包</span>
                <span class="redColor floatRight" v-if="!ielem.newTF" @click="printBao(ielem)">打印包条码</span>
                <span v-if="ielem.skuList.length > 0" class="divTwo">
                  <i class="el-icon-arrow-up" v-if="ielem.viewSuit" @click="editSuit(ielem)"></i>
                  <i class="el-icon-arrow-down" v-if="!ielem.viewSuit" @click="editSuit(ielem)"></i>
                </span>
              </el-col>

              <el-col
                :span="24"
                v-if="ielem.viewSuit && ielem.skuList.length > 0"
                class="baoTabTwo"
              >
                <el-row
                  :class="indOne==0?'baoProTwo':'baoProThree'"
                  v-for="(jelem,indOne) in ielem.skuList"
                  :key="indOne"
                >
                  <el-col :span="1" class="checkboxOne">&nbsp;</el-col>
                  <el-col :span="3">
                    <img
                      :src="jelem.url?$portImg+jelem.url:'../../../static/images/img-noimg.png'"
                      style="height:90px; width:120px;margin-top:10px"
                      @click.stop="showPic(jelem.img?$portImg+jelem.img:'../../../static/images/img-noimg.png')"
                    >
                  </el-col>
                  <el-col :span="20" style="line-height:36px;">
                    <el-row>
                      <el-col :span="6">
                        <span class="blackColor">{{jelem.proName}}</span>
                      </el-col>
                      <el-col :span="4">
                        <span v-if="jelem.goldCode">
                          产品材质：
                          <span class="blackColor">{{jelem.goldCode}}</span>
                        </span>
                        &nbsp;
                      </el-col>
                      <el-col :span="4">
                        成色：
                        <span class="blackColor">{{jelem.conditi}}</span>
                      </el-col>
                      <el-col :span="4">
                        库存数量：
                        <span class="blackColor">{{jelem.amount}}</span>
                      </el-col>
                      <el-col :span="6">
                        选择数量：
                        <span class="blackColor">
                          <span v-if="!jelem.editTF">{{jelem.editAmount}}</span>
                          <el-input-number
                            v-if="jelem.editTF"
                            :controls="false"
                            v-model="jelem.editAmount"
                            placeholder
                            size="small"
                            class="width70"
                            :min="1"
                            @change="handSelectTwo(jelem)"
                          ></el-input-number>
                        </span>
                      </el-col>
                      <el-col :span="6">
                        编号：
                        <span class="blackColor">{{jelem.proNumber}}</span>
                      </el-col>
                      <el-col :span="4">
                        <span>{{ jelem.suit !== 2 ? '生产工艺：' : '&nbsp;' }}</span>
                        <span class="blackColor">{{jelem.processCode}}</span>
                      </el-col>
                      <el-col :span="4">
                        <b v-if="jelem.suit != 2&&jelem.carCode">
                          车花：
                          <span class="txtTwo">{{ jelem.carCode }}</span>
                        </b>&nbsp;
                      </el-col>
                      <el-col :span="4">
                        克重：
                        <span class="blackColor">{{jelem.weight}}g</span>
                      </el-col>
                      <el-col :span="4">
                        复核净重：
                        <span class="blackColor">
                          <span v-if="!jelem.editTF">{{jelem.nowSkuGoldWeight}}</span>
                          <el-input-number
                            v-if="jelem.editTF"
                            :disabled="jelem.num <= 0"
                            :controls="false"
                            v-model="jelem.nowSkuGoldWeight"
                            placeholder
                            size="small"
                            class="width70"
                            :min="1"
                            @change="handSelectTwo(jelem)"
                          ></el-input-number>g
                        </span>
                      </el-col>
                      <el-col :span="2">
                        <span
                          class="redColor"
                          v-if="!jelem.editTF"
                          @click="editJelem(jelem,ielem)"
                          v-show="ielem.newTF"
                        >编辑</span>
                        <span
                          class="redColor"
                          v-if="jelem.editTF"
                          @click="editJelem(jelem,ielem)"
                          v-show="ielem.newTF"
                        >保存</span>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        产品类别：
                        <span class="blackColor">{{jelem.one}}</span>
                      </el-col>
                      <el-col :span="8">
                        <span v-if="jelem.effectCode">
                          表面工艺：
                          <span class="blackColor">{{jelem.effectCode}}</span>
                        </span>&nbsp;
                      </el-col>
                      <el-col :span="4" class="txtOne">
                        <b v-if="jelem.extendAttr && jelem.one" v-html="$api.getAttachProperty(jelem.one,jelem.extendAttr)"></b>&nbsp;
                      </el-col>
                      <el-col :span="4" class="txtOne">
                        复核毛重：
                        <span class="blackColor">
                          <el-input-number
                            v-if="jelem.editTF && checkInputWeightTF"
                            :disabled="jelem.num <= 0"
                            :controls="false"
                            v-model="jelem.nowSkuWeight"
                            placeholder
                            size="small"
                            class="width70"
                            :min="1"
                            @change="handSelectTwo(jelem)"
                          ></el-input-number>
                          <span v-else>{{jelem.nowSkuWeight}}</span>g
                        </span>
                      </el-col>

                      <el-col :span="2">
                        <span
                          class="redColor"
                          @click="delJelem(indOne,ielem.skuList,ielem)"
                          v-if="ielem.newTF"
                        >移出</span>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div style="max-height:500px;overflow-y:auto;">
            <el-row v-for="(item, ind) in stockProNew" :key="ind" class="orderBigDiv">
              <el-col :span="24" class="tabOne">
                <div class="tabOneLeft">
                  <img
                    :src="
                      item.url
                        ? $portImg + item.url
                        : '../../../static/images/img-noimg.png'
                    "
                    style="height:90px; width:120px;"
                    @click.stop="
                      showPic(
                        item.url
                          ? $portImg + item.url
                          : '../../../static/images/img-noimg.png'
                      )
                    "
                  >
                </div>

                <el-row style="line-height:36px;" class="tabOneRight">
                  <el-col :span="6">{{ item.proName }}</el-col>
                  <el-col :span="4" class="txtOne">
                    <b v-if="item.suit != 2">
                      产品材质：
                      <span class="txtTwo">{{ item.goldCode }}</span>
                    </b>&nbsp;
                  </el-col>

                  <el-col :span="4" class="txtOne">
                    <b>
                      成色：
                      <span class="txtTwo">{{ item.conditi }}</span>
                    </b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    库存数量：
                    <span class="txtTwo">{{item.amount != undefined ? item.amount : "-"}}</span>
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    选择数量：
                    <el-input-number
                      v-model="item.editAmount"
                      size="small"
                      :controls="false"
                      :min="1"
                      class="width70"
                      :max="item.amount"
                      @change="handSelectTwo(item)"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="txtRight">
                    <img src="../../../static/images/delPng.png" @click="delSkuOne(item,ind)"/>
                  </el-col>
                  <el-col :span="6" class="txtOne">
                    编号：
                    <span class="txtTwo">{{ item.proNumber }}</span>
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    <b v-if="item.suit != 2">
                      生产工艺：
                      <span class="txtTwo">{{ item.processCode }}</span>
                    </b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    <b v-if="item.suit != 2&&item.carCode">
                      车花：
                      <span class="txtTwo">{{ item.carCode }}</span>
                    </b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    克重(g)：
                    <span class="txtTwo">{{ item.weight }}</span>
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    复核净重：
                    <el-input-number
                      v-model="item.nowSkuGoldWeight"
                      size="small"
                      :controls="false"
                      :min="0"
                      class="width70"
                      @change="handSelectTwo(item)"
                    ></el-input-number>
                  </el-col>

                  <el-col :span="2" class="txtOne">
                    <b class="redTxtOne" @click="printOne(item)">打印条码</b>
                  </el-col>
                  <el-col :span="6" class="txtOne">
                    <b v-if="item.suit != 2">
                      产品类别：
                      <span class="txtTwo">{{ item.one }}</span>
                    </b>&nbsp;
                    <span v-if="item.suit == 2">
                      <span class="redTxtOne" v-if="item.viewSuit" @click="editSuit(item)">
                        详情
                        <i class="el-icon-arrow-up"></i>
                      </span>
                      <span class="redTxtOne" v-if="!item.viewSuit" @click="editSuit(item)">
                        详情
                        <i class="el-icon-arrow-down"></i>
                      </span>
                    </span>&nbsp;
                  </el-col>
                  <el-col :span="8" class="txtOne">
                    <b v-if="item.suit != 2 &&item.effectCode">
                      表面工艺：
                      <span class="txtTwo">{{ item.effectCode }}</span>
                    </b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    <b v-if="item.extendAttr && item.one" v-html="$api.getAttachProperty(item.one,item.extendAttr)"></b>&nbsp;
                  </el-col>
                  <el-col :span="4" class="txtOne">
                    复核毛重：
                    <el-input-number
                      v-if="checkInputWeightTF"
                      v-model="item.nowSkuWeight"
                      size="small"
                      :controls="false"
                      :min="0"
                      class="width70"
                      @change="handSelectTwo(item)"
                    ></el-input-number>
                  </el-col>
                  <el-col :span="2" class="txtFour">
                    <span class="redTxtOne" @click="addBaoFun(item,ind)">添加到包</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
                <div class="suitDiv" v-if="item.viewSuit">
                  <el-row>
                    <el-col
                      :span="11"
                      class="suitSubDiv"
                      v-for="(ielem, indTwo) in item.map.proList"
                      :key="indTwo + ''"
                    >
                      <div class="pro-item">
                        <div class="pro-imgs">
                          <img
                            :src="
                              ielem.pic
                                ? $portImg + ielem.pic
                                : '../../../../static/images/img-noimg.png'
                            "
                            width="120"
                            height="90"
                          >
                        </div>
                        <div class="pro-right">
                          <el-row>
                            <el-col :span="14" class="pro-tit">
                              {{ielem.name}}
                            </el-col>
                            <el-col :span="10" class="txtOne">
                              克重：<span>{{ielem.weight}}</span>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="14" class="txtOne">
                              编号：<span>{{ielem.proNum}}</span>
                            </el-col>
                            <el-col :span="10" class="txtOne">
                              成色：<span>{{ielem.condit}}</span>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="24" class="txtOne">
                              属性：<span>{{ ielem.goldCode
                              }}{{
                              ielem.processCode ? "," + ielem.processCode : ""
                              }}{{
                              ielem.effect ? "," + ielem.effect : ""
                              }}</span>
                            </el-col>
                          </el-row>

                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      title="调拨出库详情"
      :visible.sync="addStorageTFThree"
      width="1400px"
      :close-on-click-modal="false"
    >
      <span>
        <el-row>
          <el-col :span="6">调拨单号</el-col>
          <el-col :span="6">调拨部门：尚金缘展厅</el-col>
          <el-col :span="6">接收单位：尚金缘金库</el-col>
          <el-col :span="6">
            备注：
            <el-input v-model="remark" placeholder="请输入备注" class="width200" size="small"></el-input>
          </el-col>
        </el-row>
        <el-table
          :data="proMarkData"
          border
          stripe
          style="width: 100%;margin-top:20px"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column prop="productCs" label="种类" align="center" width="110px">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.productCs" placeholder size="small"></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="marketName" label="营销品类" align="center" width="150px">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.marketName" placeholder size="small"></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderWeight" label="毛重" align="center">
            <template slot-scope="scope">
              <span>
                <el-input-number
                  :controls="false"
                  v-model="scope.row.orderWeight"
                  placeholder
                  size="small"
                  class="width70"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderGoldWeight" label="净重" align="center">
            <template slot-scope="scope">
              <span>
                <el-input-number
                  :controls="false"
                  v-model="scope.row.orderGoldWeight"
                  placeholder
                  size="small"
                  class="width70"
                  @change="changeNum(scope.row)"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="productCSum" label="成色" align="center">
            <template slot-scope="scope">
              <span>
                <el-input-number
                  :controls="false"
                  :min="0"
                  :max="1"
                  v-model="scope.row.productCSum"
                  placeholder
                  size="small"
                  class="width70"
                  @change="changeNum(scope.row)"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dipWeight" label="折重" align="center" width="110px">
            <template slot-scope="scope">
              <el-input-number
                :controls="false"
                v-model="scope.row.dipWeight"
                placeholder
                size="small"
                style="width:85px"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="singleWeight" label="单价/克" align="center">
            <template slot-scope="scope">
              <el-input-number
                :controls="false"
                v-model="scope.row.singleWeight"
                placeholder
                size="small"
                class="width70"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="orderSum" label="数量" align="center">
            <template slot-scope="scope">
              <span>
                <el-input-number
                  :controls="false"
                  v-model="scope.row.orderSum"
                  placeholder
                  size="small"
                  class="width70"
                  @change="changeNum(scope.row)"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="singleSum" label="单价/件" align="center">
            <template slot-scope="scope">
              <span>
                <el-input-number
                  :controls="false"
                  v-model="scope.row.singleSum"
                  placeholder
                  size="small"
                  class="width70"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="monery" label="金额" align="center" width="110px">
            <template slot-scope="scope">
              <span>
                <el-input-number
                  :controls="false"
                  v-model="scope.row.monery"
                  placeholder
                  size="small"
                  style="width:85px"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="productRemarks" label="备注" align="center">
            <template slot-scope="scope">
              <span>
                <el-input v-model="scope.row.productRemarks" placeholder size="small"></el-input>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="name" label="操作" align="center">
            <template slot-scope="scope">
              <span v-if="scope.$index != 0" class="yellowColor" @click="delProMarkFun(scope.row)">删除</span>
              <span v-else>-</span>
            </template>
          </el-table-column> -->
        </el-table>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit()" size="small">取消</el-button>
        <el-button type="primary" @click="submitFun()" :loading="btnLoading" size="small">提交</el-button>
      </span>
    </el-dialog>
    <!-- 打印sku开始 --> 
    <div v-show="false">
      <printTPSkuOne :billData="printData" ref="printTPTwo"></printTPSkuOne>
    </div>
    <!-- 打印sku结束 -->
    <!-- 打印包二维码开始 -->
    <div v-show="false">
      <printTPThree :billData="printBaoData" ref="printTPThree"></printTPThree>
    </div>
    <!-- 打印包二维码结束 -->
    <!-- 打印包号 -->
    <a href="ChiticData://temp" ref="comA" v-show="false">电子称读数</a>
    
  </div>
</template>
<script>

export default {
  data() {
    return {
      selectAll: false,
      loading: false,
      mock: "",
      stockProNew: [],
      editNumTF: false,
      addStorageTFTwo: false, //调拨出库弹框
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      outputStatue: "", //出库类型
      billsStatue: "", //单据类型
      stockSetKindData: [], //料种类下拉数据
      categoryList: [], //新建托盘品类数组
      categoryNewList: [], //新建托盘品类数组(加全部)
      goldCodeList: [], //材质列表
      goldCodeId: "全部", //材质选择
      processCodeList: [], //生产工艺列表
      processCodeId: "全部", //生产工艺选择项
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      stockPro: [], //列表
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      checkList: [], //选中
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      backupTF: false, //备注显示
      backupWinTF: false, //补货单添加备注
      backupId: "", //选中补货单ID
      backupTxt: "", //选中补货单的备注
      companySearTwo: [
        { companyId: "C", companyName: "尚金缘展厅" },
        { companyId: "B", companyName: "尚金缘物流" }
      ], //客户列表
      btnLoading: false, //按钮加载中
      addStorageTFThree: false, //调拨单详情弹框
      remark: "", //调拨出库备注
      baoList: [
        {
          newTF: true,
          sum: 0,
          nowSkuWeight: 0,
          nowSkuGoldWeight: 0,
          baoNo: "",
          viewSuit: false,
          skuList: [],
          packRemarks: ""
        }
      ], //包的数组
      proMarkData: [], //营销品类列表
      printData: {}, //打印sku一维码
      printBaoData: {}, //打印包条码
      xlsLoadTF: false, //excel上传按钮加载
      inputTF: true,
      xlsUploadTF: false,
      weightTF: false,
      checkInputWeightTF:true,
      orderTrandView: false
    };
  },
  created() {
    let self = this;
    this.created_fun();
    // 获取是否有一键审批权限
    this.$publicData.verifyFun("exhibit-import").then(b => {
      this.xlsUploadTF = b;
    });

    this.$publicData.checkVerify('order-trand-view')
    .then(res => {
      this.orderTrandView = res['order-trand-view'];
    });
  },
  methods: {
    changeSelectAll(b) {
      this.stockPro.map(item => item.amount > 0 && (item.selectTF = b));
    },
    created_fun() {
      var self = this;
      document.onkeydown = e => {
        let dom = self.$refs.repleOrder;
        if (dom && e.code == "F9") {
          self.comFun();
        }
      };
      this.loopInit = this.loop();
      // this.$api.dateGetDay()
      this.displayAllData(1, 12);
      this.codeDisplay();

      this.$publicData
        .categoryFun()
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
    },
    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      this.selectAll = false;
      let params = {
        proName: self.search,
        goldCode: self.goldCodeId,
        one: self.stockTypeId,
        processCode: self.processCodeId,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        self.$portMain + "/product/exhibitionHall",
        params,
        res => {
          if (res.code == 200) {
            self.pageNum = num;
            self.pageSize = size;
            self.stockPro = res.data.data;
            self.priceSum = res.data.rowSize;
            self.stockPro.forEach(item => {
              if (item.one != "套装") {
                //单品suit为1
                item.suit = 1;
              } else {
                //套装suit为2
                item.suit = 2;
                item.viewSuit = false;
              }
              item.Number = 0;
              if (item.extendAttr == "{}" || !item.extendAttr) {
                item.sizeList = {};
                item.sizeTF = false;
              } else {
                item.sizeList = JSON.parse(item.extendAttr);
                item.sizeTF = true;
              }
              item.selectTF = false;
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        },
        err => {
          self.loading = false;
        }
      );
    },
    codeDisplay() {
      var self = this;
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
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    // 编辑单
    editGold(elem) {
      this.$router.push({
        path: "repleOrderDetail",
        query: { outputStockId: elem.id }
      });
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

    //调拨出库
    allotStorage() {
      var self = this;
      let selectList = [];
      let stockProNew = [];
      // self
      //   .$confirm("确定调拨出库, 是否继续?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   })
      //   .then(() => {

      self.stockPro.forEach(ielem => {
        if (ielem.selectTF && ielem.amount > 0) {
          selectList.push(ielem);
        }
      });
      self.stockProNew = selectList;
      if(localStorage.stockAddData){
        let stockAddData = JSON.parse(localStorage.stockAddData)//浏览器缓存数据
        let roomOutData = stockAddData.roomOutData?stockAddData.roomOutData:[];
        roomOutData = roomOutData.concat(self.stockProNew)
        roomOutData = self.$api.listUniqueSpot(roomOutData)
        let skuList = []
        roomOutData.forEach(ielem=>{
          skuList.push(ielem.proNumber)
        })
        let params = {
          type: 1,
          skuList:skuList.join(',')
        };
        // this.$api.formdataPostFun(
        //   this.$portMain + "/sark/getStore",
        //   params,
        //   res => {
        //     res.data.forEach((ielem,ind)=>{
        //       roomOutData[ind].amount = ielem.amount;
        //       roomOutData[ind].editAmount = ielem.amount;
        //     })
            stockAddData.roomOutData = roomOutData
            localStorage.stockAddData = JSON.stringify(stockAddData)
            self.stockProNew = roomOutData
        //   },
        //   err => {
        //     self.$message.error(err.msg);
        //   }
        // );

      }else{
        localStorage.stockAddData = JSON.stringify({moveOutData:self.stockProNew})
      }
      

      //
      // if (self.stockProNew.length == 0) {
      //   self.$message.warning(
      //     "您还没选择产品或者产品库存数量为0，请重新选择产品！"
      //   );
      //   return;
      // } else {
        self.stockProNew.forEach(ielem => {
          ielem.editAmount = ielem.amount;
          // ielem.nowSkuWeight = ielem.weight * ielem.amount;
          // ielem.nowSkuGoldWeight = ielem.weight * ielem.amount;
          ielem.nowSkuWeight = self.$api.returnFloatNum(ielem.goldWeight);
          ielem.nowSkuGoldWeight = self.$api.returnFloatNum(ielem.goldWeight);
          // ielem.nowSkuWeight = ielem.nowSkuGoldWeight;
        });
      // }
      this.addStorageTFTwo = true;
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消调拨出库"
      //   });
      // });
    },
    //改变选择输入框
    changeSelect(ielem) {
      let self = this;
      setTimeout(function() {
        self.$forceUpdate();
      }, 200);
    },
    //补货单多选按钮
    checkListFun() {
      let self = this;
      var selectIdList = [];
      self.stockPro.forEach(item => {
        if (item.selectTF == true) {
          selectIdList.push(item);
        }
      });
      self.checkList = selectIdList;
      //
      if (selectIdList.length == 0) {
        self.$message.error("您还没选择产品，请重新选择产品！");
        return false;
      } else {
        return true;
      }
    },
    //确定调拨出库
    editAllot() {
      var self = this;
      if (self.checkListFun()) {
        let transfSkuNoteFroms = [];
        self.checkList.forEach(item => {
          // console.log(item)
          transfSkuNoteFroms.push({
            skuNum: item.proNumber,
            productRemarks: item.backup != undefined ? item.backup : "",
            productSum: 1,
            totailWeight: item.weight,
            goldWeight: item.weight
          });
        });
        let params = {
          transfSkuNoteFroms: transfSkuNoteFroms
        };
        this.$axios
          .post(this.$portMain + "/order/overTransfPutOrders", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.$message.success("调拨出库成功！");
              setTimeout(function() {
                self.$router.push("allotOrder");
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    },

    //下载一维码
    downLoadFun(elem) {
      let self = this;
      var params = {
        PRS: {
          sku: elem.proNumber
        }
      };
      this.$axios
        .get(self.$portMain + "/bizPlate/getCode", params)
        .then(function(res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              //canvs图片生成开始
              var blob = self.$api.getBlob(res.data.data);
              //一维码base64付到img里
              var imgDiv =self.$refs.myImg
              imgDiv.src= res.data.data;

              var c = self.$refs.myCanvas
              var ctx=c.getContext("2d");
              ctx.clearRect(0,0,c.width,c.height); //清空画布，防止重叠内容
              ctx.fillStyle="#FFffff";
              ctx.fillRect(0,0,340,300);
              ctx.fillStyle = "#919599";
              ctx.font="bold 16px 微软雅黑";
              ctx.fillText("款式名称:",40,50);
              ctx.fillText("SKU编号:",40,80);
              ctx.fillStyle = "#242526";
              ctx.font="bold 16px 微软雅黑";
              ctx.fillText(elem.proName,120,50);
              ctx.fillText(elem.proNumber,120,80);
              setTimeout(() => {
                ctx.drawImage(imgDiv,40,110);//一维码传入画布
                ctx.font="bold 14px 微软雅黑";
                ctx.fillText(elem.proNumber,90,173);

                var myImage = c.toDataURL("image/png");    
                var blob = self.$api.getBlob(myImage);
                self.$refs.xlsDownloadA.download = elem.proNumber;
                self.$refs.xlsDownloadA.href = URL.createObjectURL(blob);
                self.$refs.xlsDownloadA.click();
              },200)

              
            } else {
              self.$message.error(res.data.msg);
            }
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //编辑补货单的备注
    editBackup(index) {
      var self = this;
      self.backupWinTF = true;
      self.backupTxt = self.stockPro[index].backup
        ? self.stockPro[index].backup
        : "";
      self.backupId = self.stockPro[index].proNumber;
    },
    //编辑补货单的备注按钮
    addBackup() {
      var self = this;
      self.stockPro.forEach(item => {
        if (item.proNumber == self.backupId) {
          item.backup = self.backupTxt;
          self.backupWinTF = false;
        }
      });
    },
    //确定补货事件
    editReple() {
      let self = this;
      var selectIdList = [];
      self.stockPro.forEach(item => {
        if (item.selectTF == true) {
          selectIdList.push(item.id);
        }
      });
      self.checkList = selectIdList;
      //
    },
    //修改品类
    changeCode() {
      let self = this;
      self.displayAllData(1, self.pageSize);
    },
    //查看图片
    showPic(imgSrc) {
      this.modelType = true;
      this.modelImgSrc = imgSrc;
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },
    //添加到包事件
    addBaoFun(elem, index) {
      let self = this;
      if (this.weightTF) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
        return false;
      }
      let baoData = {};
      self.baoList.forEach(ielem => {
        if (ielem.newTF) {
          if (ielem.skuList) {
            ielem.skuList.push(elem);
          } else {
            ielem.skuList = [];
            ielem.skuList.push(elem);
          }
          baoData = ielem;
        }
      });
      self.stockProNew.splice(index, 1);
      self.skuListNum(baoData);
      self.$forceUpdate();
    },
    //空闲包计算
    skuListNum(elem) {
      elem.sum = 0;
      elem.nowSkuGoldWeight = 0;
      elem.nowSkuWeight = 0;
      elem.skuList.forEach(ielem => {
        // console.log(ielem)
        elem.sum += ielem.editAmount;
        elem.nowSkuGoldWeight += this.$api.returnFloatNum(
          ielem.nowSkuGoldWeight
        );
        elem.nowSkuWeight += this.$api.returnFloatNum(ielem.nowSkuWeight);
        elem.nowSkuWeight = this.$api.returnFloatNum(elem.nowSkuWeight);
        // elem.nowSkuWeight = elem.nowSkuGoldWeight;
      });
      elem.sum =this.$api.returnFloatNum(elem.sum);
      elem.nowSkuGoldWeight = this.$api.returnFloatNum(elem.nowSkuGoldWeight);
      elem.nowSkuWeight = this.$api.returnFloatNum(elem.nowSkuWeight);
      // console.log(elem.skuList)
    },

    //确认打包
    confirmBao(elem) {
      // console.log(elem)
      let self = this;
      if (!elem.skuList || elem.skuList.length === 0) {
        self.$message.error("此包未添加产品，请添加产品再进行确认操作！");
        return;
      }
      // console.log(elem)
      let receiptPackInfos = [];
      elem.skuList.forEach(ielem => {
        // console.log(ielem)
        receiptPackInfos.push({
          skuNo: ielem.proNumber,
          nowSkuSum: ielem.editAmount,
          nowSkuGoldWeight: ielem.nowSkuGoldWeight,
          nowSkuWeight: ielem.nowSkuWeight,
          suit: ielem.suit
        });
      });
      // console.log(elem.packRemarks, receiptPackInfos)
      let params = { packRemarks: elem.packRemarks, receiptPackInfos,orderPackWeight:elem.nowSkuWeight };
      this.$axios
        .post(self.$portMain + "/order/saveReceiptPackSingleInfo", params)
        .then(function(res) {
          if (res.data.code == 200) {
            elem.newTF = false;
            elem.baoNo = res.data.data;
            if (self.stockProNew.length > 0) {
              self.baoList.push({
                newTF: true,
                sum: 0,
                nowSkuWeight: 0,
                nowSkuGoldWeight: 0,
                baoNo: "",
                viewSuit: false,
                skuList: [],
                packRemarks: ""
              });
            }
            // self.viewBaoTFFour = ture;
            self.$forceUpdate();
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //确定提交
    subFun() {
      let self = this;
      self.btnLoading = true;
      //
      // this.addStorageTFTwo = true;
      //
      let baoTF = false;
      let receiptPackInfos = [];
      // console.log(self.stockProNew)
      let skuTF = true;
      self.stockProNew.forEach(jelem => {
        if (jelem.nowSkuWeight < jelem.nowSkuGoldWeight) {
          skuTF = false;
        }
        receiptPackInfos.push({
          skuNo: jelem.proNumber,
          nowSkuSum: jelem.editAmount,
          suit: jelem.suit,
          nowSkuWeight: jelem.nowSkuWeight,
          nowSkuGoldWeight: jelem.nowSkuGoldWeight
        });
        // console.log(jelem)
      });
      if (!skuTF) {
        self.$message.error("净重不能比毛重大，请重新填入！");
        return;
      }
      // console.log(self.baoList)
      self.baoList.forEach(ielem => {
        if (ielem.skuList.length > 0 && ielem.newTF === true) {
          baoTF = true;
        }
        // console.log(ielem.skuList)
        ielem.skuList.forEach(kelem => {
          receiptPackInfos.push({
            skuNo: kelem.proNumber,
            nowSkuSum: kelem.editAmount,
            suit: kelem.suit,
            nowSkuWeight: kelem.nowSkuWeight,
            nowSkuGoldWeight: kelem.nowSkuGoldWeight
          });
        });
      });
      if (baoTF) {
        self.$message.error("未确认包里还有产品，不能进行调拨！");
        return false;
      }
      let params = { receiptPackInfos };
      this.$axios
        .post(this.$portMain + "/order/selectProductMarkmerty", params)
        .then(function(res) {
          if (res.data.code == 200) {
            let tempData = res.data.data;
            // self.proMarkData = res.data.data;
            tempData.forEach(ielem => {
              ielem.productCSum = 1;
              ielem.dipWeight = self.$api.returnFloatNum(
                ielem.orderGoldWeight * ielem.productCSum
              );
            });
            self.proMarkData = tempData;
            self.btnLoading = false;
            self.addStorageTFTwo = false;
            self.addStorageTFThree = true;
            localStorage.removeItem("stockAddData");
            self.$forceUpdate();
          } else {
            self.btnLoading = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    //编辑和保存
    editJelem(elem, baoElem) {
      if (this.weightTF) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
        return false;
      }
      elem.editTF = !elem.editTF;
      // console.log(baoElem)
      // console.log(elem)
      this.skuListNum(baoElem);
      this.$forceUpdate();
    },
    //移出
    delJelem(index, elem, baoElem) {
      this.stockProNew.push(elem[index]);
      elem.splice(index, 1);
      this.skuListNum(baoElem);
    },
    //校验
    handSelectTwo(elem) {
      let self = this
      if(elem.editAmount){
        elem.editAmount = parseInt(elem.editAmount)
        if(elem.editAmount<0){
          elem.editAmount = 0
        }
        self.$forceUpdate()
      }
      if (elem.editAmount > elem.amount) {
        this.$message.error("选择的库存数量不够，请重新选择！");
        elem.editAmount = 0;
      }
      let errorStatus = false;
      
      elem.nowSkuWeight = this.$api.returnFloatNum(elem.nowSkuWeight);
      elem.nowSkuGoldWeight = this.$api.returnFloatNum(elem.nowSkuGoldWeight);
      const { nowSkuWeight, nowSkuGoldWeight } = elem;
      if(nowSkuWeight<=0){
        self.checkInputWeightTF =false
        errorStatus = false;
        elem.nowSkuWeight = nowSkuGoldWeight
        setTimeout(() => {
          self.checkInputWeightTF =true
          self.$forceUpdate()
        }, 100);
      }else if (nowSkuWeight < nowSkuGoldWeight) {
        self.checkInputWeightTF =false
        errorStatus = true;
        elem.nowSkuWeight = undefined;
        setTimeout(() => {
          self.checkInputWeightTF =true
          self.$forceUpdate()
        }, 100);
      }
      this.weightTF = errorStatus;
      if (errorStatus) {
        this.$message.warning("输入的净重不可比毛重大，请检查!");
        return;
      }
    },

    //调拨合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        // console.log(column.label)
        if (
          column.label === "折重" ||
          column.label === "数量" ||
          column.label === "金额"
        ) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return this.$api.returnFloatNum(Number(prev) + Number(curr));
                this.$forceUpdate();
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        }
      });

      return sums;
    },

    //删除营销品类
    delProMarkFun(elem) {
      let self = this;
      this.$confirm("此操作将永久删除该营销品类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let index = "";
          self.proMarkData.forEach((ielem, indOne) => {
            if (ielem.marketName === elem.marketName) {
              index = indOne;
            }
          });
          self.proMarkData.splice(index, 1);
          self.$forceUpdate();
        })
        .catch(() => {});
      // console.log(self.proMarkData)
    },
    //提交数据
    submitFun() {
      let self = this;
      // console.log(self.baoList)
      // console.log(self.stockProNew)
      let transfSkuNoteFroms = [];
      self.stockProNew.forEach(ielem => {
        transfSkuNoteFroms.push({
          skuNum: ielem.proNumber,
          productSum: ielem.editAmount,
          productRemarks: ielem.productRemarks ? ielem.productRemarks : "",
          suit: ielem.suit,
          goldWeight: ielem.nowSkuGoldWeight,
          totailWeight: ielem.nowSkuWeight
        });
      });
      let packNo = [];
      self.baoList.forEach(ielem => {
        packNo.push(ielem.baoNo);
      });

      packNo = packNo.join("-");
      let formDiv = [];
      self.proMarkData.forEach(ielem => {
        // console.log(ielem)
        formDiv.push({
          species: ielem.productCs,
          category: ielem.marketName,
          purWeight: ielem.orderWeight,
          weight: ielem.orderGoldWeight,
          purity: ielem.productCSum,
          suttleWeight: ielem.dipWeight,
          priceG: ielem.singleWeight,
          sum: ielem.orderSum,
          priceJ: ielem.singleSum,
          money: ielem.monery,
          remark: ielem.productRemarks
        });
      });
      let params = {
        sponsor: "C",
        receiverUnit: "A",
        orderRemarks: self.remark,
        transfSkuNoteFroms,
        martExter: JSON.stringify({
          name: "调拨",
          value: "展厅库存",
          tabRight: formDiv,
          orderRemarks: self.remark
        }),
        packNo
      };
      this.$axios
        .post(this.$portMain + "/order/overTransfPutOrders", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.addStorageTFThree = false;
            self.$message.success(
              "展厅调拨出库，现在正在返回展厅调拨出库列表页！"
            );
            setTimeout(function() {
              self.$router.push("allotOrderOpera");
            }, 1000);
          } else {
            self.addStorageTFThree = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    handleClose(done) {
      let self = this;
      this.$confirm("关闭窗口会将包清除掉，还确认关闭窗口？")
        .then(_ => {
          self.baoList = [
            {
              newTF: true,
              sum: 0,
              nowSkuWeight: 0,
              nowSkuGoldWeight: 0,
              baoNo: "",
              viewSuit: false,
              skuList: [],
              packRemarks: ""
            }
          ];
          done();
        })
        .catch(_ => {});
    },
    //自动算折重数量
    changeNum(elem) {
      if(elem.orderSum){
        elem.orderSum = parseInt(elem.orderSum)
        if(elem.orderSum<0){
          elem.orderSum = 0
        }
      }
      elem.dipWeight = this.$api.returnFloatNum(
        elem.orderGoldWeight * elem.productCSum
      );
      this.$forceUpdate();
    },
    //打印条码
    printOne(elem) {
      let self = this;
      this.printData = elem;
      this.$refs.printTPTwo.compPrintFun();
    },

    //打印包二维码
    printBao(elem) {
      let self = this;
      elem.customerName = "尚金缘金库";
      this.printBaoData = elem;
      this.$refs.printTPThree.compPrintFun();
    },

    //excel上传按钮
    excelInputFun() {
      // console.log(this.$refs.excelInput)
      this.$refs.excelInput.click();
    },
    //excel上传
    excelFun(e) {
      var self = this;
      self.xlsLoadTF = true;
      let params = {
        files: e.target.files[0]
      };
      this.$api.formdataPostFun(
        this.$portMain + "/order/updataExeclToOrder",
        params,
        res => {
          self.inputTF = false;
          self.$message.success(res.msg);
          setTimeout(function() {
            self.inputTF = true;
            self.xlsLoadTF = false;
            self.$router.push("allotOrderOpera");
            // self.created_fun();
          }, 1000);
        },
        err => {
          self.inputTF = false;
          self.xlsLoadTF = false;
          setTimeout(function() {
            self.inputTF = true;
          }, 1000);
          self.$message.error(err.msg);
        }
      );
    },

    //电子秤读数事件
    comFun() {
      var self = this;
      if (self.inputIndOne == "") {
        self.$message.error("实收金重没有被焦点选中！");
      }
      if (self.inputIndOne) {
        self.$refs.comA.click();
        self.loopInit();
      }
    },
    
    //改变电子称输入框数量
    changeWeight(elem){
      let self = this;
      var indexOne = self.inputIndOne - 1;
      if (self.enterStatus === "复核毛重") {
        self.proListOne[indexOne].editRoughWeight = parseFloat(elem);
      }
      if (self.enterStatus === "复核净重") {
        self.proListOne[indexOne].editSuttle = parseFloat(elem);
      }
      if (self.enterStatus === "毛重") {
        self.baoList[indexOne].roughWeight = parseFloat(elem);
      }
      if (self.enterStatus === "净重") {
        self.baoList[indexOne].suttle = parseFloat(elem);
      }
      self.$forceUpdate();
    },
    //循环读取电子称输入框数量
    loop() {
      let oldVal = "";
      let self = this;
      let count = 0;
      return () => {
        if (count >= 20) {
          count = 0;
          this.$message.info(`重量没有改变，请检查是否读称成功！`);
          return;
        }
        setTimeout(() => {
          this.$$.ajax({
            type: "get",
            async: false,
            url:"http://localhost:5000/BalanceResult/result.js?t=" + new Date().getTime(),
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "attr",
            success: function(json) {
              // console.log(json,json.weight);
              count++;
              var weightNum = json.weight?json.weight:null
              if (!oldVal) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
              if (oldVal && oldVal === weightNum) {
                self.changeWeight(weightNum);
                self.loopInit();
                return;
              }
              if (oldVal && oldVal !== weightNum) {
                oldVal = weightNum;
                count = 0;
                self.changeWeight(weightNum);
              }
            },
            error: function() {
              // alert("fail");
            }
          });

        }, 150);
      };
    },
    //输入框获得焦点
    focusWeightFocusTwo(e, ind, elem) {
      this.enterStatus = elem;
      this.inputIndOne = ind + 1;
    },
    //输入框丢去焦点
    focusWeightBlurTwo() {
      this.inputIndOne = "";
    },
    //取消
    cancelSubmit() {
      this.addStorageTFThree = false;
      this.baoList = [
        {
          newTF: true,
          sum: 0,
          nowSkuWeight: 0,
          nowSkuGoldWeight: 0,
          baoNo: "",
          viewSuit: false,
          skuList: [],
          packRemarks: ""
        }
      ];
    },
    //調拨出库删除sku
    delSkuOne(ielem,index){
      this.stockProNew.splice(index,1);
      let stockAddData = JSON.parse(localStorage.stockAddData)//浏览器缓存数据
      stockAddData.roomOutData = this.stockProNew
      localStorage.stockAddData = JSON.stringify(stockAddData)
      this.$forceUpdate()
    },
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
$base-color = rgb(230, 14, 50);
$font-color = #999;

.conBigDiv {
  .yellowColor {
    color: #F26D0F;
  }

  .redColor {
    color: #F20F34;
  }

  .blackColor {
    color: #2E2F33;
  }

  .grayColor {
    color: #8a9199;
  }

  .hr {
    border-top: 1px solid #d9d9d9;
    height: 3px;
    margin: 12px 0 12px 0;
  }

  .searchTxt {
    width: 320px;
  }

  .pageD {
    margin-top: 20px;
    text-align: center;
  }

  .fontStyle {
    color: #8A8E99;
    font-size: 14px;
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .width160 {
    width: 160px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth240 {
      width: 240px;
    }

    .inputWidth160 {
      width: 160px;
    }

    .itemRight {
      text-align: right;
    }

    .marginBottom {
      margin-bottom: 32px;
    }

    .fontTStyle {
      font-size: 14px;
      color: #8A9199;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 640px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .itemBottom {
      margin-bottom: 24px;
    }

    .titleStyle {
      color: #8A9199;
      font-size: 14px;
      text-align: right;
      padding-right: 24px;
    }

    .contentStyle {
      color: #2E2F33;
      font-size: 14px;
    }
  }

  .promptStyle {
    position: relative;

    .line {
      width: 480px;
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

  .totalDes {
    color: #F20F34;
    font-size: 14px;
    text-align: right;

    span {
      display: inline-block;
      margin-right: 24px;
    }
  }

  .orderBigDiv {
    padding: 16px 20px;
    min-height: 110px;
    border: #E5F1FF 1px solid;
    margin-top: 10px;
    color: #222426;
    font-size: 14px;

    .orderBigDivOne {
      color: #333;
    }
  }

  .width200 {
    width: 200px;
  }

  .txtOne {
    font-size: 14px;
    color: #889199;
    span{
      color:#222426;
    }
  }

  .txtTwo {
    font-size: 14px;
    color: #222426;
  }

  .txtTwoBold {
    font-size: 14px;
    color: #222426;
    font-weight: bold;
  }

  .txtRed {
    font-size: 14px;
    color: #F20F34;
  }

  .txtRedBold {
    font-size: 14px;
    color: #F20F34;
    font-weight: bold;
  }

  .tabOne {
    display: flex;
  }

  .tabOneLeft {
    width: 174px;
  }

  .tabOneRight {
    width: calc(100% - 174px);
  }

  .suitDiv {
    padding: 10px;
    border-top: 1px solid #E9ECF5;
    .suitSubDiv {
      padding: 10px;
      margin: 0px 10px;
    }
  }

  .pro-item {
    width: 98%;
    display: flex;
    align-items: center;
    line-height: 30px;

    .pro-right {
      width: 75%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-left: 10px;
    }
  }

  .redTxtOne {
    color: #F20F34;
    font-size: 14px;
    font-weight: bold;
  }

  .baoTabOne {
    background: #E4EAF0;
    margin: 5px 0;
    color: #8A8E99;

    .divOne {
      padding: 7px;
    }

    .divTwo {
      text-align: right;
      padding-right: 10px;
      padding-top: 7px;
    }
  }

  .width70 {
    width: 80px;
  }

  .baoTabTwo {
    background: #fff;
    border: 1px solid #E4EAF0;
    padding: 10px;
  }

  .baoProOne {
    border: 1px solid #E5F1FF;
    padding: 5px;
    margin-top: 10px;
    color: #8A8E99;
  }

  .baoProTwo {
    margin-top: 10px;
    color: #8A8E99;
  }

  .baoProThree {
    border-top: 1px solid #E5F1FF;
    margin-top: 10px;
    color: #8A8E99;
  }

  .baoProFour {
    padding: 10px;
    color: #8A8E99;
  }
}
</style>
