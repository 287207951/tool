<template>
  <div class="conBigDiv" v-loading="webLoadingTF">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库库存</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入关键字搜索"
            v-model="search"
            class="input-with-select searchTxt fontStyle width256"
            size="small"
            @keyup.enter.native="changeCode"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">材质</span>
          <el-select
            v-model="goldCodeId"
            placeholder="请选择"
            size="small"
            style="width:120px"
            @change="changeCode"
          >
            <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <span class="fontStyle">产品类别</span>
          <el-select
            v-model="stockTypeId"
            placeholder="请选择"
            size="small"
            style="width:120px"
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
            style="width:120px"
            @change="changeCode"
          >
            <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <!-- <span class="fontStyle">工厂</span>
          <el-select
            v-model="customerName"
            filterable
            placeholder="接收客户"
            size="small"
            @change="changeCode"
            v-if="customerType != ''"
          >
            <el-option
              v-for="item in customerList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>-->
          <span class="fontStyle">货柜</span>
          <el-select
            v-model="sarkName"
            filterable
            placeholder="接收客户"
            size="small"
            @change="changeCode"
            v-if="customerType != ''"
          >
            <el-option
              v-for="item in sarkList"
              :key="item.sarkNum"
              :label="item.sarkName"
              :value="item.sarkNum"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="24" class="marginTop10">
          <el-button
            size="small"
            @click="addStorage"
            v-if="backupTF == false"
            v-show="orderTrandFactory"
            :loading="btnLoading"
            type="primary"
          >新建出库</el-button>
          <el-button
            size="small"
            @click="allotStorage"
            v-if="backupTF == false"
            v-show="orderTrandOut"
            :loading="btnLoading"
            type="danger"
            plain
          >调拨出库</el-button>
          <!-- <el-button size="small" @click="addReple" v-if="backupTF == false" type="danger" plain>添加补货单</el-button> -->
          <el-button
            size="small"
            @click="addProFun"
            v-if="backupTF == false"
            v-show="orderReplenish"
            type="danger"
            plain
          >添加补货单</el-button>
          <el-button
            size="small"
            @click="editAllot"
            v-if="backupTF && editNumTF ==false"
            :loading="btnLoading"
          >确定调拨出库</el-button>
          <el-button size="small" @click="editReple" v-if="editNumTF" :loading="btnLoading">确定添加补货单</el-button>
          <!-- <el-select v-model="turnTxt" style="width:100px;" size="small" @change="changeCode">
            <el-option
              v-for="item in turnList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
        </el-col>
        <el-col :span="24" class="marginTop10">
          <el-checkbox v-model="selectAll" @change="changeSelectAll">全选</el-checkbox>
        </el-col>
      </el-row>
      <div v-if="!backupTF">
        <el-row v-for="(item,ind) in stockPro" :key="ind" class="orderBigDiv">
          <el-col :span="1" style="line-height:80px;">
            <el-checkbox
              :label="item.proNumber"
              v-model="item.selectTF"
              @change="changeSelect(item)"
              :disabled="item.amount == 0"
            >&nbsp;</el-checkbox>
          </el-col>
          <el-col :span="23" class="tabOne">
            <div class="tabOneLeft">
              <img
                :src="item.url?$portImg+item.url:'../../../static/images/img-noimg.png'"
                style="height:90px; width:120px;"
                @click.stop="showPic(item.url?$portImg+item.url:'../../../static/images/img-noimg.png')"
              />
            </div>

            <el-row style="line-height:30px;" class="tabOneRight">
              <el-col :span="5">{{item.proName}}</el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.suit != 2">
                  产品材质：
                  <span class="txtTwo">{{item.goldCode}}</span>
                </b>&nbsp;
              </el-col>

              <el-col :span="5" class="txtOne">
                库位：
                <span class="txtTwoBold">{{item.storePos != undefined?item.storePos:'暂无'}}</span>
              </el-col>
              <el-col :span="5" class="txtOne">
                成色：
                <span class="txtTwoBold">{{item.conditi}}</span>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne" v-if="item.amount != undefined">
                可用库存：
                <b :class="item.amount>0?'txtTwoBold':'txtFive'">{{item.amount}}</b>
              </el-col>
              <el-col :span="5" class="txtOne">
                编号：
                <span class="txtTwo">{{item.proNumber}}</span>
              </el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.suit != 2">
                  生产工艺：
                  <span class="txtTwo">{{item.processCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="5" class="txtOne">
                工厂：
                <span class="txtTwo">{{item.factoryName}}</span>
              </el-col>
              <el-col :span="5" class="txtOne">
                克重(g)：
                <span class="txtTwoBold">{{item.weight}}</span>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne" v-if="item.amount != undefined">
                已锁库存：
                <b :class="item.lockAmount > 0?'txtThreeRed':'txtFive'">{{item.lockAmount}}</b>
              </el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.suit != 2">
                  类别：
                  <span class="txtTwo">{{item.one}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.suit != 2">
                  表面工艺：
                  <span class="txtTwo">{{item.effectCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="5" class="txtOne">
                <b v-if="item.suit != 2 && item.carCode!=''">
                  车花：
                  <span class="txtTwo">{{item.carCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="5" class="txtOne">
                <b
                  v-if="item.extendAttr && item.one"
                  v-html="$api.getAttachProperty(item.one,item.extendAttr)"
                ></b>
                <!-- 套装详情 -->
                <b v-if="item.suit == 2">
                  <b class="redTxtOne" @click="editSuit(item)">
                    套装详情
                    <i :class="item.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                  </b>
                </b>

                <!-- 附加属性 -->
                <span v-if="item.sizeList">
                  <!-- 戒指 -->
                  <span v-if="item.sizeList.ringHand">圈口: {{item.sizeList.ringHand}}</span>
                  <span v-if="item.sizeList.openType">开口类型: {{item.sizeList.openType}}</span>

                  <!-- 手镯 -->
                  <span v-if="item.sizeList.diameterLength">圈口: {{item.sizeList.diameterLength}}</span>
                  <span
                    v-if="item.sizeList.diameterLengthStart"
                  >圈口起: {{item.sizeList.diameterLengthStart}}</span>
                  <span
                    v-if="item.sizeList.diameterLengthEnd"
                  >圈口止: {{item.sizeList.diameterLengthEnd}}</span>
                  <span v-if="item.sizeList.diameterWidth">内径宽: {{item.sizeList.diameterWidth}}</span>
                  <span
                    v-if="item.sizeList.diameterWidthStart"
                  >内径宽起: {{item.sizeList.diameterWidthStart}}</span>
                  <span
                    v-if="item.sizeList.diameterWidthEnd"
                  >内径宽止: {{item.sizeList.diameterWidthEnd}}</span>
                  <span v-if="item.sizeList.faceWidth">面宽: {{item.sizeList.faceWidth}}</span>
                  <span v-if="item.sizeList.faceWidthStart">面宽起: {{item.sizeList.faceWidthStart}}</span>
                  <span v-if="item.sizeList.faceWidthEnd">面宽止: {{item.sizeList.faceWidthEnd}}</span>
                  <span v-if="item.sizeList.openType">开口类型: {{item.sizeList.openType}}</span>

                  <!-- 吊坠 -->
                  <span v-if="item.sizeList.height">高: {{item.sizeList.height}}</span>
                  <span v-if="item.sizeList.heightStart">高起: {{item.sizeList.heightStart}}</span>
                  <span v-if="item.sizeList.heightEnd">高止: {{item.sizeList.heightEnd}}</span>
                  <!-- 金条 -->
                  <span v-if="item.sizeList.m1">长: {{item.sizeList.m1}}</span>
                  <span v-if="item.sizeList.m2">宽: {{item.sizeList.m2}}</span>
                  <span v-if="item.sizeList.m3">高: {{item.sizeList.m3}}</span>
                </span>
                &nbsp;
              </el-col>

              <el-col :span="4" class="txtOne">
                净重(g)：
                <b
                  v-if="item.amount != 0 || item.lockAmount != 0"
                  :class="item.goldWeight > 0?'txtThree':'txtThreeRed'"
                >{{item.goldWeight}}g</b>
                <b v-else class="txtFive">
                  0g
                  <b v-if="item.goldWeight != 0" class="txt12px">
                    （克重差异：
                    <b class="txtThreeRed txt12px">{{item.goldWeight}}g</b>)
                  </b>
                </b>
              </el-col>
              <!-- <el-col :span="4" class="txtRed">
                <el-button
                  :type="item.backup && item.backup!=''?'success':''"
                  size="small"
                  v-if="backupTF"
                  @click="editBackup(ind)"
                >{{item.backup && item.backup!=''?'查看备注':'+备注'}}</el-button>
                <span v-else>&nbsp;</span>
              </el-col>
              <el-col :span="4" v-if="editNumTF">
                <el-input-number
                  v-model="item.Number"
                  size="small"
                  :min="0"
                  @change="handSelect(item)"
                ></el-input-number>
              </el-col>-->
            </el-row>
          </el-col>
          <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
            <div class="suitDiv" v-if="item.viewSuit">
              <!-- {{item.map.proList}} -->
              <el-row>
                <el-col
                  :span="12"
                  class="suitSubDiv"
                  v-for="(ielem,indTwo) in item.map.proList"
                  :key="indTwo+''"
                >
                  <div class="pro-item">
                    <div class="pro-imgs">
                      <img
                        :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                        width="120"
                        height="90"
                      />
                    </div>
                    <div class="pro-right">
                      <el-row>
                        <el-col :span="14" class="pro-tit">{{ielem.name}}</el-col>
                        <el-col :span="10" class="txtOne">
                          克重：
                          <span class="txtTwo">{{ielem.weight}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14" class="txtOne">
                          编号：
                          <span class="txtTwo">{{ielem.proNum}}</span>
                        </el-col>
                        <el-col :span="10" class="txtOne">
                          成色：
                          <span class="txtTwo">{{ielem.condit}}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="14" class="txtOne">
                          属性：
                          <span
                            class="txtTwo"
                          >{{ielem.goldCode}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.effect?','+ielem.effect:''}}</span>
                        </el-col>
                        <el-col :span="10" class="txtOne">
                          <span
                            v-if="ielem.oneName && ielem.extend"
                            v-html="$api.getAttachProperty(ielem.oneName,ielem.extend)"
                          ></span>
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
      <div v-else>
        <el-row v-for="(item,ind) in stockProNew" :key="ind" class="orderBigDiv">
          <el-col :span="1" style="line-height:120px;"></el-col>
          <el-col :span="23" class="tabOne">
            <div class="tabOneLeft">
              <img
                :src="item.url?$portImg+item.url:'../../../static/images/img-noimg.png'"
                style="height:90px; width:120px;"
                @click.stop="showPic(item.url?$portImg+item.url:'../../../static/images/img-noimg.png')"
              />
            </div>

            <el-row style="line-height:30px;" class="tabOneRight">
              <el-col :span="5">{{item.proName}}</el-col>

              <el-col :span="15" class="txtOne">
                库位：
                <span class="txtTwo">{{item.storePos != undefined?item.storePos:'暂无'}}</span>
              </el-col>
              <el-col :span="4" class="txtOne">
                <el-button
                  :type="item.backup && item.backup!=''?'success':''"
                  size="small"
                  v-if="backupTF"
                  @click="editBackup(ind)"
                >{{item.backup && item.backup!=''?'查看备注':'+备注'}}</el-button>
                <span v-else>&nbsp;</span>
              </el-col>
              <el-col :span="5" class="txtOne">
                编号：
                <span class="txtTwo">{{item.proNumber}}</span>
              </el-col>
              <el-col :span="4" class="txtOne">
                <span v-if="item.suit != 2">
                  材质：
                  <span class="txtTwo">{{item.goldCode}}</span>
                </span>&nbsp;
              </el-col>
              <el-col :span="15" class="txtOne">
                <span v-if="item.suit != 2">
                  表面工艺：
                  <span class="txtTwo">{{item.effectCode}}</span>
                </span>&nbsp;
              </el-col>
              <el-col :span="5" class="txtOne">
                <span v-if="item.suit != 2">
                  产品类别：
                  <span class="txtTwo">{{item.one}}</span>
                </span>&nbsp;
              </el-col>
              <el-col :span="4" class="txtOne">
                <span v-if="item.suit != 2">
                  生产工艺：
                  <span class="txtTwo">{{item.processCode}}</span>
                </span>&nbsp;
              </el-col>
              <el-col :span="10" class="txtOne">
                <span v-if="item.suit != 2 && item.carCode!=''">
                  车花：
                  <span class="txtTwo">{{item.carCode}}</span>
                </span>&nbsp;
              </el-col>

              <!-- <el-col
                :span="4"
                class="txtThree"
              >净重(g)：{{item.goldWeight}}</el-col>-->
              <el-col :span="5" class="txtFour">
                <span
                  v-if="item.one && item.extendAttr"
                  v-html="$api.getAttachProperty(item.oneName,item.extend)"
                ></span>
                <span v-if="item.suit == 2">
                  <b class="redTxtOne" @click="editSuit(item)">
                    套装详情
                    <i :class="item.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                  </b>
                </span>&nbsp;
              </el-col>
              <el-col :span="5" class="txtOne">
                <span>
                  成色：
                  <span class="txtTwo">{{item.conditi}}</span>
                </span>&nbsp;
              </el-col>
              <el-col :span="6" class="txtOne">
                <span v-if="item.suit != 2">
                  克重(g)：
                  <span class="txtTwo">{{item.weight}}</span>
                </span>&nbsp;
              </el-col>
              <el-col :span="7" class="txtOne">
                <span v-if="item.sizeList">
                  <!-- 戒指 -->
                  <span v-if="item.sizeList.ringHand">圈口: {{item.sizeList.ringHand}}</span>
                  <span v-if="item.sizeList.openType">开口类型: {{item.sizeList.openType}}</span>

                  <!-- 手镯 -->
                  <span v-if="item.sizeList.diameterLength">圈口: {{item.sizeList.diameterLength}}</span>
                  <span
                    v-if="item.sizeList.diameterLengthStart"
                  >圈口起: {{item.sizeList.diameterLengthStart}}</span>
                  <span
                    v-if="item.sizeList.diameterLengthEnd"
                  >圈口止: {{item.sizeList.diameterLengthEnd}}</span>
                  <span v-if="item.sizeList.diameterWidth">内径宽: {{item.sizeList.diameterWidth}}</span>
                  <span
                    v-if="item.sizeList.diameterWidthStart"
                  >内径宽起: {{item.sizeList.diameterWidthStart}}</span>
                  <span
                    v-if="item.sizeList.diameterWidthEnd"
                  >内径宽止: {{item.sizeList.diameterWidthEnd}}</span>
                  <span v-if="item.sizeList.faceWidth">面宽: {{item.sizeList.faceWidth}}</span>
                  <span v-if="item.sizeList.faceWidthStart">面宽起: {{item.sizeList.faceWidthStart}}</span>
                  <span v-if="item.sizeList.faceWidthEnd">面宽止: {{item.sizeList.faceWidthEnd}}</span>
                  <span v-if="item.sizeList.openType">开口类型: {{item.sizeList.openType}}</span>

                  <!-- 吊坠 -->
                  <span v-if="item.sizeList.height">高: {{item.sizeList.height}}</span>
                  <span v-if="item.sizeList.heightStart">高起: {{item.sizeList.heightStart}}</span>
                  <span v-if="item.sizeList.heightEnd">高止: {{item.sizeList.heightEnd}}</span>
                  <!-- 金条 -->
                  <span v-if="item.sizeList.m1">长: {{item.sizeList.m1}}</span>
                  <span v-if="item.sizeList.m2">宽: {{item.sizeList.m2}}</span>
                  <span v-if="item.sizeList.m3">高: {{item.sizeList.m3}}</span>
                </span>
                &nbsp;
              </el-col>

              <!-- <el-col
                :span="3"
                :class="item.amount>item.lowerLimit?'txtThree':'txtFour'"
                v-if="item.amount != undefined"
              >数量：{{item.amount}}</el-col>
              <el-col
                :span="3"
                class="txtThree"
                v-else
              >数量：--</el-col>-->
              <el-col :span="4" v-if="editNumTF">
                <el-input-number
                  v-model="item.Number"
                  size="small"
                  :min="0"
                  @change="handSelect(item)"
                  :disabled="item.type === 2"
                ></el-input-number>
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
                  v-for="(ielem,indTwo) in item.map.proList"
                  :key="indTwo+''"
                >
                  <div class="pro-item">
                    <div class="pro-imgs">
                      <img
                        :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                        width="120"
                        height="90"
                      />
                    </div>
                    <div class="pro-right">
                      <el-row>
                        <el-col :span="24" class="pro-tit">{{ielem.name}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col
                          :span="24"
                          class="txtOne"
                        >{{ielem.goldCode}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.effect?','+ielem.effect:''}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8" class="txtOne">
                          克重：
                          <span class="txtTwo">{{ielem.weight}}</span>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="1" v-if="item.suit == 2" v-show="item.viewSuit">&nbsp;</el-col>
          <el-col :span="23" v-if="item.suit == 2" v-show="item.viewSuit">
            <b
              v-if="item.extendAttr && item.one"
              v-html="$api.getAttachProperty(item.one,item.extendAttr)"
            ></b>&nbsp;
          </el-col>
        </el-row>
      </div>
      <div class="pageD" v-if="!backupTF">
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
    <el-dialog title="产品备注" :visible.sync="backupWinTF" :close-on-click-modal="false" width="30%">
      <span>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="backupTxt"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backupWinTF = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addBackup" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建出库详情"
      :visible.sync="addStorageTF"
      :close-on-click-modal="false"
      width="1400px"
    >
      <span>
        <div class="baoProFour">
          <el-row>
            <el-col :span="24">
              <span class="txtRed">当前已选:{{storageNum?storageNum:0}}件</span>
              <span class="left20">
                客户类型：
                <el-select
                  v-model="customerType"
                  filterable
                  placeholder="请选择"
                  size="small"
                  style="width:120px"
                >
                  <el-option
                    v-for="item in customerTypeList"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </span>
              <span class="left20" v-if="customerType ===2">
                客户名称：
                <el-select
                  v-model="companyName"
                  filterable
                  placeholder="请选择客户"
                  size="small"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in companySear"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </span>
              <span class="left20">发起单位：尚金缘金库</span>
              <el-button
                type="primary"
                @click="confirmStorage"
                size="small"
                :loading="btnLoading"
              >确认出库</el-button>
              <span class="floatRight">
                出库原因：
                <el-input v-model="mock" placeholder size="small" style="width:200px"></el-input>
              </span>
            </el-col>
          </el-row>
        </div>
        <div style="max-height:600px;overflow-y:auto;">
          <el-row v-for="(item,ind) in checkList" :key="ind" class="orderBigDiv">
            <el-col :span="24" class="tabOne">
              <div class="tabOneLeft">
                <img
                  :src="item.url?$portImg+item.url:'../../../static/images/img-noimg.png'"
                  style="height:90px; width:120px;"
                  @click.stop="showPic(item.url?$portImg+item.url:'../../../static/images/img-noimg.png')"
                />
              </div>

              <el-row style="line-height:30px;" class="tabOneRight">
                <el-col :span="6">{{item.proName}}</el-col>
                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2">
                    产品类别：
                    <span class="txtTwo">{{item.one}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="3" class="txtOne">
                  产品成色：
                  <span class="txtTwo">{{item.conditi}}</span>
                </el-col>
                <el-col :span="4" class="txtOne">
                  库位：
                  <span class="txtTwo">{{item.storePos != undefined?item.storePos:'暂无'}}</span>
                </el-col>
                <el-col :span="6" class="txtOne">
                  库存数量：
                  <span class="txtTwo">{{item.amount != undefined?item.amount:'-'}}</span>
                </el-col>
                <el-col :span="1" class="txtRight">
                  <img src="../../../static/images/delPng.png" @click="delSku(item,ind)" />
                </el-col>
                <el-col :span="6" class="txtOne">
                  编号：
                  <span class="txtTwo">{{item.proNumber}}</span>
                </el-col>
                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2">
                    产品材质：
                    <span class="txtTwo">{{item.goldCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="7" class="txtOne">
                  <b v-if="item.suit != 2">
                    表面工艺：
                    <span class="txtTwo">{{item.effectCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="7" class="txtOne">
                  选择数量：
                  <el-input-number
                    v-model="item.editAmount"
                    :max="item.amount"
                    size="small"
                    :controls="false"
                    :min="0"
                    @change="handSelect(item)"
                  ></el-input-number>
                </el-col>
                <el-col :span="6" class="txtOne">
                  <b v-if="item.suit != 2">
                    克重(g)：
                    <span class="txtTwo">{{item.weight}}</span>
                  </b>&nbsp;
                </el-col>

                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2">
                    生产工艺：
                    <span class="txtTwo">{{item.processCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="3" class="txtOne">
                  <b v-if="item.suit != 2 && item.carCode!=''">
                    车花：
                    <span class="txtTwo">{{item.carCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="4" class="txtFour">
                  <span v-if="item.suit == 2">
                    <b class="redTxtOne" @click="editSuit(item)">
                      套装详情
                      <i :class="item.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                    </b>
                  </span>&nbsp;
                </el-col>

                <el-col :span="7" class="txtOne">
                  选择克重(g)：
                  <span
                    class="txtTwo"
                  >{{item.weightNew?$api.returnFloatNum(item.weightNew):0}}</span>
                </el-col>
                <!-- 
                <el-col :span="7" class="txtOne">
                  <b v-if="item.extendAttr && item.one" v-html="$api.getAttachProperty(item.one,item.extendAttr)"></b>
                  &nbsp;
                </el-col>
                <el-col :span="4" v-if="editNumTF">
                  <el-input-number
                    v-model="item.Number"
                    size="small"
                    :min="0"
                    @change="handSelect(item)"
                  ></el-input-number>
                </el-col>-->
              </el-row>
            </el-col>
            <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
              <div class="suitDiv" v-if="item.viewSuit">
                <el-row>
                  <el-col
                    :span="11"
                    class="suitSubDiv"
                    v-for="(ielem,indTwo) in item.map.proList"
                    :key="indTwo+''"
                  >
                    <div class="pro-item">
                      <div class="pro-imgs">
                        <img
                          :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                          width="120"
                          height="90"
                        />
                      </div>
                      <div class="pro-right">
                        <el-row>
                          <el-col :span="24" class="pro-tit">{{ielem.name}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="24"
                            class="txtOne"
                          >{{ielem.goldCode}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.effect?','+ielem.effect:''}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8" class="txtOne">
                            克重：
                            <span class="txtTwo">{{ielem.weight}}</span>
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
      </span>
    </el-dialog>
    <el-dialog
      title="调拨出库详情"
      :visible.sync="addStorageTFTwo"
      :close-on-click-modal="false"
      width="1200px"
    >
      <span>
        <div class="baoProFour">
          <el-row>
            <el-col :span="4" class="txtRed">当前已选:{{storageNum?storageNum:0}}件</el-col>
            <el-col :span="20">
              接收单位：
              <el-select v-model="companyNameTwo" filterable placeholder="请选择选择" size="small">
                <el-option
                  v-for="item in companySearTwo"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>发起单位：尚金缘金库
              <el-button
                type="primary"
                @click="confirmStorageTwo"
                size="small"
                :loading="btnLoading"
              >确认调拨</el-button>
              <span class="floatRight">
                调拨原因：
                <el-input v-model="mockTwo" placeholder size="small" class="width240"></el-input>
              </span>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-row v-for="(item,ind) in stockProNew" :key="ind" class="orderBigDiv">
            <el-col :span="24" class="tabOne">
              <div class="tabOneLeft">
                <img
                  :src="item.url?$portImg+item.url:'../../../static/images/img-noimg.png'"
                  style="height:90px; width:120px;"
                  @click.stop="showPic(item.url?$portImg+item.url:'../../../static/images/img-noimg.png')"
                />
              </div>

              <el-row style="line-height:30px;" class="tabOneRight">
                <el-col :span="5">{{item.proName}}</el-col>
                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2">
                    产品类别：
                    <span class="txtTwo">{{item.one}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="4" class="txtOne">
                  成色：
                  <span class="txtTwo">{{item.conditi}}</span>
                </el-col>
                <el-col :span="4" class="txtOne">
                  库位：
                  <span class="txtTwo">{{item.storePos != undefined?item.storePos:'暂无'}}</span>
                </el-col>
                <el-col :span="6" class="txtOne">
                  库存数量：
                  <span class="txtTwo">{{item.amount != undefined?item.amount:'-'}}</span>
                </el-col>
                <el-col :span="1" class="txtRight">
                  <img src="../../../static/images/delPng.png" @click="delSkuOne(item,ind)" />
                </el-col>
                <el-col :span="5" class="txtOne">
                  编号：
                  <span class="txtTwo">{{item.proNumber}}</span>
                </el-col>
                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2">
                    产品材质：
                    <span class="txtTwo">{{item.goldCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="8" class="txtOne">
                  <b v-if="item.suit != 2">
                    表面工艺：
                    <span class="txtTwo">{{item.effectCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="7" class="txtOne">
                  选择数量：
                  <el-input-number
                    v-model="item.editAmount"
                    :max="item.amount"
                    size="small"
                    :controls="false"
                    :min="0"
                    @change="handSelectTwo(item)"
                  ></el-input-number>
                </el-col>
                <el-col :span="5" class="txtOne">
                  <b v-if="item.suit != 2">
                    克重(g)：
                    <span class="txtTwo">{{item.weight}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2">
                    生产工艺：
                    <span class="txtTwo">{{item.processCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="4" class="txtOne">
                  <b v-if="item.suit != 2 && item.carCode!=''">
                    车花：
                    <span class="txtTwo">{{item.carCode}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="4" class="txtFour">
                  <span v-if="item.suit == 2">
                    <b class="redTxtOne" @click="editSuit(item)">
                      套装详情
                      <i :class="item.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                    </b>
                  </span>&nbsp;
                </el-col>
                <el-col :span="5" class="txtOne">
                  选择克重(g)：
                  <span
                    class="txtTwo"
                  >{{item.weightNew?$api.returnFloatNum(item.weightNew):0}}</span>
                </el-col>

                <!-- <el-col :span="7" class="txtOne">
                  <b v-if="item.extendAttr && item.one" v-html="$api.getAttachProperty(item.one,item.extendAttr)"></b>
                  &nbsp;
                </el-col>
                <el-col :span="4" v-if="editNumTF">
                  <el-input-number
                    v-model="item.Number"
                    size="small"
                    :min="0"
                    @change="handSelect(item)"
                  ></el-input-number>
                </el-col>-->
              </el-row>
            </el-col>
            <el-col :span="24" v-if="item.suit == 2" v-show="item.viewSuit">
              <div class="suitDiv" v-if="item.viewSuit">
                <el-row>
                  <el-col
                    :span="11"
                    class="suitSubDiv"
                    v-for="(ielem,indTwo) in item.map.proList"
                    :key="indTwo+''"
                  >
                    <div class="pro-item">
                      <div class="pro-imgs">
                        <img
                          :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                          width="120"
                          height="90"
                        />
                      </div>
                      <div class="pro-right">
                        <el-row>
                          <el-col :span="24" class="pro-tit">{{ielem.name}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col
                            :span="24"
                            class="txtOne"
                          >{{ielem.goldCode}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.effect?','+ielem.effect:''}}</el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="8" class="txtOne">
                            克重：
                            <span class="txtTwo">{{ielem.weight}}</span>
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
      </span>
    </el-dialog>
    <!-- 添加补货单弹窗start -->
    <el-dialog :visible.sync="addProTF" title="新增补货" width="1400px" :close-on-click-modal="false">
      <span>
        <div>
          <el-row>
            <el-col :span="20">
              <el-input
                placeholder="请输入关键字搜索"
                v-model="searchOne"
                class="input-with-select searchTxt"
                size="small"
                style="width:220px"
                @keyup.enter.native="searchAddProFun"
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <span>材质</span>
              <el-select
                v-model="goldCodeId"
                placeholder="请选择"
                size="small"
                style="width:100px"
                @change="searchAddProFun"
              >
                <el-option v-for="item in goldCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span>分类</span>
              <el-select
                v-model="stockTypeId"
                placeholder="请选择"
                size="small"
                style="width:100px"
                @change="searchAddProFun"
              >
                <el-option
                  v-for="item in categoryNewList"
                  :key="item.label"
                  :label="item.value"
                  :value="item.label"
                ></el-option>
              </el-select>
              <span>生产工艺</span>
              <el-select
                v-model="processCodeId"
                placeholder="请选择"
                size="small"
                style="width:100px"
                @change="searchAddProFun"
              >
                <el-option v-for="item in processCodeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <span>生产工厂</span>
              <el-select
                v-model="factory"
                placeholder="请选择"
                size="small"
                style="width:100px"
                @change="searchAddProFun"
              >
                <el-option
                  v-for="item in factoryList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="addProRepair" size="small">添加补货</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="addProDiv">
          <el-row v-for="(item, ind) in parageraphListModal" :key="ind" class="orderBigDiv">
            <!-- <el-col
            :span="1"
            class="checkboxDiv"
          >
            <el-radio
              :label="item.proNumber"
              v-model="selectProId"
            >&nbsp;</el-radio>
            </el-col>-->
            <el-col :span="23" class="tabTwo">
              <div class="tabTwoLeft">
                <img
                  :src="item.url?$portImg + item.url:'/static/images/img-noimg.png'"
                  style="height:90px; width:120px;"
                />
              </div>

              <el-row style="line-height:30px;" class="tabOneRight">
                <el-col :span="6">{{item.proName}}</el-col>
                <el-col :span="6" class="txtOne">
                  <b v-if="item.suit != 2">
                    类别：
                    <span class="txtTwo">{{item.one}}</span>
                  </b>&nbsp;
                </el-col>
                <el-col :span="6" class="txtOne">
                  成色：
                  <span class="txtTwoBold">{{item.conditi}}</span>&nbsp;
                </el-col>
                <el-col :span="6" class="txtOne" v-if="item.amount != undefined">
                  可用库存：
                  <span
                    :class="item.amount>item.lowerLimit?'txtThree':'txtThreeRed'"
                  >{{item.amount}}</span>
                </el-col>
                <el-col :span="6" class="txtOne">
                  编号：
                  <span class="txtTwo">{{item.proNumber}}</span>
                </el-col>
                <el-col :span="6" class="txtOne">
                  工厂：
                  <span class="txtTwo">{{item.factoryName}}</span>
                </el-col>
                <el-col :span="6" class="txtOne">
                  克重(g)：
                  <span class="txtTwoBold">{{item.weight}}</span>&nbsp;
                </el-col>
                <el-col :span="6" class="txtOne">
                  <!-- <b v-if="item.suit != 2">
                  生产工艺：
                  <span class="txtTwo">{{item.processCode}}</span>
                  </b>&nbsp;-->
                  补货数量：
                  <el-input-number
                    style="align-self: flex-end; width:60px"
                    v-model="item.productSum"
                    :controls="false"
                    size="mini"
                    :min="0"
                    @change="handSelect(item)"
                  ></el-input-number>
                </el-col>
                <el-col :span="6" class="txtOne" v-if="item.one != '套装'">
                  属性：
                  <span
                    class="txtTwo"
                  >{{item.goldCode}}{{item.processCode?','+item.processCode:''}}{{item.effect?','+item.effect:''}}</span>

                  <!-- <span class="txtTwoBold">{{item.storePos != undefined?item.storePos:'暂无'}}</span> -->
                </el-col>
                <el-col :span="6" class="txtOne">
                  <b v-if="item.one == '套装'">
                    <b class="redTxtOne" @click="editSuit(item)">
                      套装详情
                      <i :class="item.viewSuit?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                    </b>
                  </b>
                  &nbsp;
                </el-col>

                <el-col :span="6" class="txtOne" v-if="item.amount != undefined">
                  <!-- 已锁库存：
                  <span :class="item.lockAmount > 0?'txtThree':'txtThreeRed'">{{item.lockAmount}}</span>-->
                </el-col>

                <!-- <el-col :span="6" class="txtOne">
                <b v-if="item.suit != 2">
                  表面工艺：
                  <span class="txtTwo">{{item.effectCode}}</span>
                </b>&nbsp;
              </el-col>
              <el-col :span="6" class="txtOne">
                <b v-if="item.suit != 2 && item.carCode!=''">
                  车花：
                  <span class="txtTwo">{{item.carCode}}</span>
                </b>&nbsp;
                </el-col>-->
                <el-col :span="6" class="txtOne">
                  <!-- {{item}} -->
                  <b
                    v-if="item.extendAttr && item.one"
                    v-html="$api.getAttachProperty(item.one,item.extendAttr)"
                  ></b>
                  &nbsp;
                  <!-- 套装详情 -->
                </el-col>

                <!-- <el-col :span="6" class="txtOne">
                净重(g)：
                <span :class="item.goldWeight > 0?'txtThree':'txtThreeRed'">{{item.goldWeight}}</span>
                </el-col>-->
              </el-row>
            </el-col>
            <el-col :span="24" v-if="item.one == '套装'" v-show="item.viewSuit">
              <div class="suitDiv" v-if="item.viewSuit">
                <el-row>
                  <el-col
                    :span="11"
                    class="suitSubDiv"
                    v-for="(ielem,indTwo) in item.map.proList"
                    :key="indTwo+''"
                  >
                    <div class="pro-item">
                      <div class="pro-imgs">
                        <img
                          :src="ielem.pic?$portImg+ielem.pic:'../../../../static/images/img-noimg.png'"
                          width="120"
                          height="90"
                        />
                      </div>
                      <div class="pro-right">
                        <el-row>
                          <el-col :span="14" class="pro-tit">{{ielem.proName}}</el-col>
                          <el-col :span="10" class="txtOne">
                            克重：
                            <span class="txtTwo">{{ielem.weight}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="14" class="txtOne">
                            编号：
                            <span class="txtTwo">{{ielem.factoryNumber}}</span>
                          </el-col>
                          <el-col :span="10" class="txtOne">
                            成色：
                            <span class="txtTwo">{{ielem.condit}}</span>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="14" class="txtOne">
                            属性：
                            <span>{{ielem.goldCode}}{{ielem.processCode?','+ielem.processCode:''}}{{ielem.effect?','+ielem.effect:''}}</span>
                          </el-col>
                          <el-col :span="10" class="txtOne">
                            <b
                              v-if="ielem.oneName && ielem.extend"
                              v-html="$api.getAttachProperty(ielem.oneName,ielem.extend)"
                            ></b>
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

        <div class="pageD">
          <el-pagination
            @size-change="handleSizeChangeAdd"
            @current-change="handleCurrentChangeAdd"
            :current-page="pageNumModal"
            :page-sizes="[12, 30, 50, 100]"
            :page-size="pageSizeModal"
            layout="total, sizes, prev, pager, next, jumper"
            :total="priceSumModal"
            background
          ></el-pagination>
        </div>
      </span>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 添加补货单弹窗end -->
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstWeight: 0, //出库总毛重
      finalWeight: 0, //出库总折重
      turnList: [
        {
          value: "",
          label: "默认"
        },
        {
          value: "1",
          label: "升序"
        },
        {
          value: "2",
          label: "降序"
        }
      ],
      factoryName: "", //工厂名称
      factoryList: ["全部", "内厂", "外厂"],
      turnTxt: "",
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
      effectCodeList: [], //表面工艺列表
      effectCodeId: "全部", //表面工艺选择项
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      stockPro: [], //列表
      stockProNew: [], //确认表格会
      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      checkList: [], //选中
      modelImgSrc: "", //图片放大地址
      modelType: false, //图片放大弹窗
      backupTF: false, //备注显示
      editNumTF: false, //添加补货单数量编辑
      backupWinTF: false, //补货单添加备注
      backupId: "", //选中补货单ID
      backupTxt: "", //选中补货单的备注
      webLoadingTF: false, //页面加载中
      addStorageTF: false, //新建调拨弹框
      addStorageTFTwo: false, //调拨出库弹框
      mock: "", //新建调拨备注
      mockTwo: "", //调拨出库备注
      stockProTwo: [], //选择调拨出库
      companyName: "", //客户名称、
      companySear: [], //客户列表
      companyNameTwo: "C", //接收单位、
      companySearTwo: [
        { companyId: "C", companyName: "尚金缘展厅" },
        { companyId: "B", companyName: "尚金缘物流" }
      ], //客户列表
      customerType: 1, //客戶类型
      customerTypeList: [
        { companyId: 1, companyName: "工厂" }
        // {companyId:2,companyName:'客户'}
      ], //客戶类型
      storageNum: 0, //选择产品数量
      btnLoading: false, //按钮加载中
      customerName: "", //工厂选择
      customerList: [], //工厂列表
      sarkName: "", //货柜选择
      sarkList: [], //货柜列表
      selectAll: false,
      addProTF: false,
      searchOne: "", //
      factory: "", // 选择工厂
      factoryList: [], // 工厂列表
      parageraphListModal: [], //列表
      pageNumModal: 1,
      pageSizeModal: 12,
      priceSumModal: 0,
      orderTrandOut: false,
      orderTrandFactory: false,
      orderReplenish: false
    };
  },
  created() {
    this.created_fun();

    this.$publicData
      .checkVerify([
        "order-trand-factory",
        "order-replenish",
        "order-trand-out"
      ])
      .then(res => {
        this.orderTrandOut = res["order-trand-out"];
        this.orderTrandFactory = res["order-trand-factory"];
        this.orderReplenish = res["order-replenish"];
      });
  },
  methods: {
    created_fun() {
      var self = this;
      // this.$api.dateGetDay()
      this.displayAllData(1, 12);
      this.codeDisplay();
      //下属客户列表
      // self.clientLoad();
      //工厂列表读取
      // self.factoryLoad();
      //货柜列表读取
      self.sarkLoad();
      this.getFactoryList();

      this.$publicData
        .categoryFun()
        .then(res => {
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
      var self = this;
      self.selectAll = false;
      self.webLoadingTF = false;
      let params = {
        proName: self.search,
        goldCode: self.goldCodeId,
        one: self.stockTypeId,
        processCode: self.processCodeId,
        storageLocation: self.sarkName,
        factoryId: self.customerName,
        page: num,
        rows: size,
        order: self.turnTxt
      };
      this.$api.formdataPostFun(
        self.$portMain + "/product/cashCommodity",
        params,
        res => {
          if (res.code == 200) {
            self.webLoadingTF = false;
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
                item.sizeData = {};
                item.sizeTF = false;
              } else {
                item.sizeData = JSON.parse(item.extendAttr);
                item.sizeTF = true;
              }
              item.selectTF = false;
            });
            // self.$forceUpdate()
          } else {
            self.webLoadingTF = false;
            self.$message.error(res.data.msg);
          }
        },
        err => {
          self.webLoadingTF = false;
          self.$message.error(err.data.msg);
        }
      );
    },
    //改变选择输入框
    changeSelect(ielem) {
      let self = this;
      setTimeout(function() {
        self.$forceUpdate();
      }, 200);
    },
    changeSelectAll(b) {
      this.stockPro.map(item => {
        if (item.amount != 0) {
          item.selectTF = b;
        }
      });
    },
    //新建出库
    addStorage() {
      let self = this;
      // if (self.checkListFunTwo()) {
      self.checkListFunTwo();
      setTimeout(() => {
        self.checkList.forEach(ielem => {
          ielem.editAmount = ielem.amount;
        });
        self.storageNumFun();
        self.addStorageTF = true;
      }, 100);

      // }
    },
    addProFun() {
      this.addProTF = true;
      this.displayAddProData(1, 12);
    },

    displayAddProData(num, size) {
      var self = this;
      let params = {
        proName: self.searchOne,
        one: self.stockTypeId,
        processCode: self.processCodeId === "全部" ? "" : self.processCodeId,
        goldCode: self.goldCodeId === "全部" ? "" : self.goldCodeId,
        effectCode: self.effectCodeId === "全部" ? "" : self.effectCodeId,
        factoryId: self.factory,
        page: num,
        rows: size
      };
      this.$api.formdataPostFun(
        this.$portMain + "/product/cashCommodity",
        // this.$portMain + "/product/proReplenishment",
        // this.$portMain + "/product/proList",
        params,
        res => {
          self.pageNumModal = num;
          self.pageSizeModal = size;
          self.firstWeight = res.data.firstWeight;
          self.finalWeight = res.data.finalWeight;
          self.parageraphListModal = res.data.data;
          self.priceSumModal = res.data.rowSize;
          self.parageraphListModal.forEach((item, index) => {
            item.productSum = 0;
            if (item.one === "套装") {
              item.viewSuit = false;
            }
            item.update_time = self.$api.dateGetDayTime(item.update_time);
            item.sizeData = item.extendAttr && JSON.parse(item.extendAttr);
          });
        },
        err => {
          self.$message.error(err.msg);
        }
      );
    },
    //分页事件开始
    handleSizeChangeAdd(val) {
      this.pageSizeModal = val;
      this.pageNum = 1;
      this.displayAddProData(1, this.pageSizeModal);
    },
    handleCurrentChangeAdd(val) {
      this.displayAddProData(val, this.pageSizeModal);
    },
    //新建出库中确认出库
    confirmStorage() {
      let self = this;
      self.btnLoading = true;
      let transfSkuNoteFroms = [];
      self.checkList.forEach(ielem => {
        if (ielem.editAmount > 0) {
          transfSkuNoteFroms.push({
            skuNum: ielem.proNumber,
            suit: ielem.suit,
            productSum: ielem.editAmount
          });
        }
      });
      if (transfSkuNoteFroms.length === 0) {
        self.btnLoading = false;
        self.$message.error(
          "产品出库全设为零或未选产品，无法进行调拨出库,请修改后提交！"
        );
        return false;
      }
      let params = {
        sponsor: "A",
        receiverUnit: "D",
        orderRemarks: self.mock,
        transfSkuNoteFroms
      };

      this.$axios
        .post(this.$portMain + "/order/factoryTransfOutOrders", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success("新增出库成功，正在跳转到出工厂饰申请列表！");
            localStorage.removeItem("stockAddData");
            setTimeout(function() {
              self.btnLoading = false;
              self.$router.push("outFactoryDecoOpera");
            }, 1000);
          } else {
            self.btnLoading = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    //新建出库多选按钮
    checkListFunTwo() {
      let self = this;
      var selectIdList = [];
      self.stockPro.forEach(item => {
        if (item.selectTF == true && item.amount > 0) {
          item.weightNew = item.goldWeight;
          selectIdList.push(item);
        }
      });
      if (localStorage.stockAddData) {
        let stockAddData = JSON.parse(localStorage.stockAddData); //浏览器缓存数据
        let addOutData = stockAddData.addOutData ? stockAddData.addOutData : [];
        addOutData = addOutData.concat(selectIdList);
        addOutData = self.$api.listUniqueSpot(addOutData);
        let skuList = [];
        addOutData.forEach(ielem => {
          skuList.push(ielem.proNumber);
        });
        let params = {
          type: 3,
          skuList: skuList.join(",")
        };
        // this.$api.formdataPostFun(
        //   this.$portMain + "/sark/getStore",
        //   params,
        //   res => {
        //     res.data.forEach((ielem,ind)=>{
        //       addOutData[ind].amount = ielem.amount;
        //       addOutData[ind].editAmount = ielem.amount;
        //     })
        stockAddData.addOutData = addOutData;
        localStorage.stockAddData = JSON.stringify(stockAddData);
        selectIdList = addOutData;
        self.checkList = selectIdList;
        //   },
        //   err => {
        //     self.$message.error(err.msg);
        //   }
        // );
      } else {
        self.checkList = selectIdList;
        localStorage.stockAddData = JSON.stringify({
          addOutData: selectIdList
        });
      }
      // self.$nextTick(()=>{

      // if (selectIdList.length == 0) {
      //   self.$message.error("还未选择库存产品或库存数量为0，请重新选择！");
      //   return false;
      // } else {
      //   return true;
      // }
      // })
    },
    //新建调拨数量事件
    storageNumFun() {
      this.storageNum = 0;
      this.checkList.forEach(item => {
        this.storageNum += item.editAmount;
      });
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
            //生产工艺
            if (item.effectCode == "表面工艺") {
              self.effectCodeList = item.list;
              self.effectCodeList.unshift("全部");
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

    // 获取工厂列表
    getFactoryList() {
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", {
          PRS: { keyWord: "" }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.factoryList = res.data.data;
            this.factoryList.unshift({ companyId: "", companyName: "全部" });
          } else {
            this.$message.error(res.data.msg);
          }
        });
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
    //分配到托盘格
    allotPallet() {
      var self = this;
      self
        .$confirm("确定分配到托盘格, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.$message({
            type: "success",
            message: "确定分配到托盘格"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消分配到托盘格"
          });
        });
    },

    //调拨出库
    allotStorage() {
      var self = this;
      self.stockProNew = [];
      self.stockPro.forEach(ielem => {
        if (ielem.selectTF) {
          if (ielem.amount >= 1) {
            ielem.editAmount = ielem.amount;
            ielem.weightNew = ielem.goldWeight;
            self.stockProNew.push(ielem);
          }
        }
      });

      if (localStorage.stockAddData) {
        let stockAddData = JSON.parse(localStorage.stockAddData); //浏览器缓存数据
        let moveOutData = stockAddData.moveOutData
          ? stockAddData.moveOutData
          : [];
        moveOutData = moveOutData.concat(self.stockProNew);
        moveOutData = self.$api.listUniqueSpot(moveOutData);
        let skuList = [];
        moveOutData.forEach(ielem => {
          skuList.push(ielem.proNumber);
        });
        let params = {
          type: 3,
          skuList: skuList.join(",")
        };
        stockAddData.moveOutData = moveOutData;
        localStorage.stockAddData = JSON.stringify(stockAddData);
        self.stockProNew = moveOutData;
      } else {
        localStorage.stockAddData = JSON.stringify({
          moveOutData: self.stockProNew
        });
      }
      self.storageNumFunTwo();
      self.addStorageTFTwo = true;
    },
    //新建调拨数量事件
    storageNumFunTwo() {
      this.storageNum = 0;
      this.stockProNew.forEach(item => {
        this.storageNum += item.editAmount;
      });
    },
    //调拨出库中确认出库
    confirmStorageTwo() {
      let self = this;
      self.btnLoading = true;
      if (self.checkListFunThree()) {
        let transfSkuNoteFroms = [];
        self.stockProNew.forEach(item => {
          if (item.editAmount != 0) {
            transfSkuNoteFroms.push({
              skuNum: item.proNumber,
              productSum: item.editAmount,
              suit: item.suit
            });
          }
        });
        if (transfSkuNoteFroms.length === 0) {
          self.btnLoading = false;
          self.$message.error(
            "调拨产品全设为零或未选产品，无法进行调拨出库,请修改后提交！"
          );
          return false;
        }
        let params = {
          sponsor: "A",
          receiverUnit: self.companyNameTwo,
          transfSkuNoteFroms: transfSkuNoteFroms,
          orderRemarks: self.mockTwo
        };
        this.$axios
          .post(this.$portMain + "/order/goldTransfOutOrders", params)
          .then(res => {
            if (res.data.code == 200) {
              self.$message.success("调拨出库成功！");
              localStorage.removeItem("stockAddData");
              setTimeout(function() {
                self.btnLoading = false;
                self.$router.push("allotOrderExchOpera");
              }, 1000);
            } else {
              self.btnLoading = false;
              self.$message.error(res.data.msg);
            }
          });
      }
    },
    //确认调拨
    checkListFunThree() {
      let self = this;
      var selectIdList = [];
      self.stockProNew.forEach(item => {
        if (item.selectTF == true) {
          selectIdList.push(item);
        }
      });
      self.stockProNew = selectIdList;
      //
      if (selectIdList.length == 0) {
        self.$message.error("还未选择库存产品或库存数量为0，请重新选择！");
        return false;
      } else {
        return true;
      }
    },
    handSelectTwo(ielem) {
      if (ielem.editAmount) {
        ielem.editAmount = parseInt(ielem.editAmount);
        if (ielem.editAmount < 0) {
          ielem.editAmount = 0;
        }
      }
      ielem.weightNew = ielem.editAmount * ielem.weight;
      this.storageNumFunTwo();
      this.$forceUpdate();
    },
    //添加补货单
    addReple() {
      var self = this;
      self.stockProNew = [];
      self.stockPro.forEach(ielem => {
        if (ielem.selectTF) {
          self.stockProNew.push(ielem);
        }
      });
      if (self.stockProNew.length == 0) {
        self.$message.error("还未选择库存产品，请重新选择！");
        return;
      }
      self
        .$confirm("确定添加补货单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          self.backupTF = true;
          self.editNumTF = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消添加补货单"
          });
        });
    },
    //编辑补货单的备注
    editBackup(index) {
      var self = this;
      self.backupWinTF = true;
      self.backupTxt = self.stockProNew[index].backup
        ? self.stockProNew[index].backup
        : "";
      self.backupId = self.stockProNew[index].proNumber;
      self.$forceUpdate();
    },
    //编辑补货单的备注按钮
    addBackup() {
      var self = this;
      self.stockProNew.forEach(item => {
        if (item.proNumber == self.backupId) {
          item.backup = self.backupTxt;
          self.backupWinTF = false;
        }
      });
      self.$forceUpdate();
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
          transfSkuNoteFroms.push({
            skuNum: item.proNumber,
            productRemarks: item.backup != undefined ? item.backup : "",
            productSum: 1,
            totailWeight: item.weight,
            goldWeight: item.weight
          });
        });
        let params = { transfSkuNoteFroms: transfSkuNoteFroms };
        this.$axios
          .post(this.$portMain + "/order/overTransfOutOrders", params)
          .then(res => {
            if (res.data.code == 200) {
              self.$message.success("调拨出库成功！");
              setTimeout(function() {
                self.$router.push("allotOrderOpera");
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    },
    //确定添加补货单
    editReple() {
      var self = this;
      if (self.checkListFun()) {
        let transfSkuNoteFroms = [];
        self.checkList.forEach(item => {
          if (item.Number > 0) {
            transfSkuNoteFroms.push({
              skuNum: item.proNumber,
              productRemarks: item.backup != undefined ? item.backup : "",
              productSum: item.Number,
              totailWeight: item.goldWeight,
              goldWeight: item.goldWeight,
              suit: item.one != "套装" ? 1 : 2
            });
          }
        });
        let params = { transfSkuNoteFroms: transfSkuNoteFroms, method: 1 };
        this.$axios
          .post(this.$portMain + "/order/sureReplenishOrders", params)
          .then(res => {
            if (res.data.code == 200) {
              localStorage.sarkData = JSON.stringify(res.data.data);
              // self.$message.success("调拨出库成功！");
              setTimeout(function() {
                self.$router.push("spotStockDetail");
              }, 1000);
            } else {
              self.$message.error(res.data.msg);
            }
          });
      }
    },
    //下属客户列表
    clientLoad() {
      let self = this;
      this.$axios.get(this.$portMain + "/client/clientListSimple").then(res => {
        let newList = [];
        res.data.data.forEach(ielem => {
          newList.push(ielem);
        });
        self.companySear = newList;
      });
    },
    //工厂列表搜索
    factoryLoad() {
      let self = this;
      var params = { PRS: { keyWord: "" } };
      this.$axios
        .get(this.$portMain + "/supplier/supplierListSimple", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerList = res.data.data;
            self.customerList.unshift({ companyId: "", companyName: "全部" });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //货柜列表搜索
    sarkLoad() {
      let self = this;
      let params = {
        search: "",
        page: 1,
        rows: 1000
      };
      this.$api.formdataPostFun(self.$portMain + "/sark/list", params, res => {
        self.sarkList = res.data.data;
        self.sarkList.unshift({ sarkNum: "", sarkName: "全部" });
      });
    },
    handSelect(item) {
      //校验数量不能为负数和小数
      if (item.editAmount) {
        item.editAmount = parseInt(item.editAmount);
        if (item.editAmount < 0) {
          item.editAmount = 0;
        }
      }
      //补货校验数量不能为负数和小数
      if (item.productSum) {
        item.productSum = parseInt(item.productSum);
        if (item.productSum < 0) {
          item.productSum = 0;
        }
      }
      item.weightNew = item.editAmount * item.weight;
      this.storageNumFun();
      this.$forceUpdate();
    },
    //展开收展套装子系统
    editSuit(elem) {
      elem.viewSuit = !elem.viewSuit;
      this.$forceUpdate();
    },

    addProRepair() {
      this.$confirm("是否加入补货购物车?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.editAddPro();
        })
        .catch(() => {});
    },

    //确定补货事件 todo
    editAddPro() {
      const self = this;
      const { parageraphListModal } = this;
      let params = {},
        relCartFroms = [];
      parageraphListModal.forEach(item => {
        if (item.one === "套装") {
          item.suit = 2;
        }
        if (item.one !== "套装") {
          item.suit = 1;
        }
      });
      relCartFroms = parageraphListModal
        .filter(item => item.productSum > 0)
        .map(item => {
          return {
            skuNum: item.proNumber,
            sum: item.productSum,
            suit: item.suit
          };
        });
      params = Object.assign({}, { relCartFroms: relCartFroms });
      //
      this.$axios
        .post(this.$portMain + "/order/addReplenishCartList", params)
        .then(res => {
          if (res.data.code == 200) {
            // self.displayAllData(1, this.pageSize)
            self.$message.success("添加到补货购物车成功！");
            self.addProTF = false;
            setTimeout(function() {
              self.$router.push("repleCart");
            }, 1000);
          }
        });
    },
    //搜索
    searchAddProFun() {
      this.displayAddProData(1, 12);
    },
    //新建出库刪除sku
    delSku(ielem, index) {
      this.checkList.splice(index, 1);
      let stockAddData = JSON.parse(localStorage.stockAddData); //浏览器缓存数据
      stockAddData.addOutData = this.checkList;
      localStorage.stockAddData = JSON.stringify(stockAddData);
      this.storageNumFun();
      this.$forceUpdate();
    },
    //調拨出库删除sku
    delSkuOne(ielem, index) {
      this.stockProNew.splice(index, 1);
      let stockAddData = JSON.parse(localStorage.stockAddData); //浏览器缓存数据
      stockAddData.moveOutData = this.stockProNew;
      localStorage.stockAddData = JSON.stringify(stockAddData);
      this.storageNumFunTwo();
      this.$forceUpdate();
    }
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
    margin-left: 20px;
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
    padding: 13px;
    min-height: 80px;
    border: #E5F1FF 1px solid;
    margin: 20px 8px;
    color: #222426;
    font-size: 14px;

    .orderBigDivOne {
      color: #333;
    }
  }

  .txtOne {
    font-size: 14px;
    color: #889199;

    span {
      color: #222426;
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

  .txtThree {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }

  .txtThreeRed {
    font-size: 14px;
    color: $base-color;
    font-weight: bold;
  }

  .txtFour {
    font-size: 14px;
    color: #F20F34;
    font-weight: bold;
  }

  .txtFive {
    font-size: 14px;
    color: #919599;
    font-weight: bold;
  }

  .txtRed {
    color: #F20F34;
  }

  .tabOne {
    display: flex;
  }

  .tabOneLeft {
    width: 140px;
  }

  .tabOneRight {
    width: calc(100% - 140px);
  }

  .paddingRight30 {
    padding-right: 30px;
    margin-top: 10px;
  }

  .marginTop10 {
    margin-top: 10px;
    padding-left: 20px;
  }

  .suitDiv {
    padding-bottom: 10px;
    border-top: 1px solid #DADFE6;
    margin-top: 10px;

    .suitSubDiv {
      margin: 10px 0px;
    }
  }

  .pro-item {
    display: flex;
    align-items: center;
    background: #fff;
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
    font-weight: bold;
  }

  .width240 {
    width: 240px;
  }

  .floatRight {
    float: right;
  }

  .left20 {
    margin-left: 20px;
  }

  .tabTwo {
    display: flex;
  }

  .tabTwoLeft {
    width: 174px;
  }

  .tabTwoRight {
    width: calc(100% - 174px);
    margin-left: 20px;
  }

  .txtAlginRight {
    text-algin: right;
  }

  .txt12px {
    font-size: 12px;
  }
}
</style>
