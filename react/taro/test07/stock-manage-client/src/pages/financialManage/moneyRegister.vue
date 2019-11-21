<template>
  <div class="conBigDiv" ref="moneyRegister" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>出纳</el-breadcrumb-item>
      <el-breadcrumb-item>来款登记</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="系统单号/来款客户/来款账号/认款单号"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span class="fontStyle">到账时间</span>
          <el-date-picker
            v-model="selectedDay"
            @change="selectDayFun"
            type="daterange"
            align="right"
            unlink-panels
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$publicData.pickerOptions2"
          ></el-date-picker>
          <span class="fontStyle">支付方式</span>
          <el-select v-model="account_type" placeholder="请选择" size="small">
            <el-option
              v-for="item in accountTypeData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="fontStyle">收款银行</span>
          <el-select v-model="receive_account" placeholder="请选择" size="small">
            <el-option
              v-for="item in pageFandBankfanceData"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <span class="fontStyle">认款状态</span>
          <el-select v-model="account_state" placeholder="请选择" size="small">
            <el-option
              v-for="item in accountStateData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top:20px; margin-bottom:20px">
        <el-col :span="24">
          <span class="titleFont">是否红冲</span>
          <el-select v-model="HC" placeholder="请选择" size="small">
            <el-option v-for="item in HCData" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="small" @click="createdFun" v-if="addAllotTF">新增来款</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
        <el-col :span="12" class="totalDes">
          <span>总计：来款总金额￥{{moneyDisNum}}</span>
        </el-col>
      </el-row>
      <el-table
        :data="allData"
        stripe
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="order_code" label="系统单号" width="150"></el-table-column>
        <el-table-column prop="account_partner" label="来款客户" width="120"></el-table-column>
        <el-table-column prop="payment_account" label="来款账号" width="140"></el-table-column>
        <el-table-column prop="payment_money" label="来款金额(￥)" width="120">
          <template slot-scope="scope">
            <span>{{$api.returnFloat(scope.row.payment_money)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.account_type == '1'">现金</span>
            <span v-if="scope.row.account_type == '2'">转账</span>
            <span v-if="scope.row.account_type == '3'">支付宝</span>
            <span v-if="scope.row.account_type == '4'">微信</span>
            <span v-if="scope.row.account_type == '5'">调整款</span>
            <span v-if="scope.row.account_type == '6'">刷卡</span>
          </template>
        </el-table-column>
        <el-table-column prop="receive_account" label="收款银行"></el-table-column>
        <el-table-column label="认款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.account_state == '0'" class="blackColor">----</span>
            <span v-if="scope.row.account_state == '1'" class="yellowColor">待认款</span>
            <span v-if="scope.row.account_state == '2'" class="blackColor">已认款</span>
            <span v-if="scope.row.account_state == '3'" class="yellowColor">待确定</span>
            <span v-if="scope.row.account_state == '4'" class="redColor">作废</span>
          </template>
        </el-table-column>
        <el-table-column prop="confirm_uid_name" label="认款人"></el-table-column>
        <el-table-column prop="confirm_code" label="认款单号" width="150"></el-table-column>
        <el-table-column prop="pay_time" label="到账时间" width="160"></el-table-column>
        <el-table-column prop="note" label="来款备注"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="order_uid_name" label="记录人"></el-table-column>
        <el-table-column prop label="红冲">
          <template slot-scope="scope">
            <span v-if="scope.row.HC == '0'" class="fontColor2">- -</span>
            <span v-if="scope.row.HC == '1'" class="fontColor2">已红冲</span>
          </template>
        </el-table-column>
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
    <!-- 新建来款单 -->
    <el-dialog
      title="新建来款单"
      :visible.sync="createdMoneyType"
      width="840px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左 -->
          <el-col :span="12" class="fontTStyle">
            <div class="marginBottom">
              <span>支付类型</span>
              <el-select
                v-model="submitData.account_type"
                placeholder="请选择"
                size="small"
                class="inputWidth280"
                @change="selectAccount"
              >
                <el-option
                  v-for="item in newCreateAccountTypeData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom" v-show="submitData.account_type == 2">
              <span>来款账号</span>
              <el-input
                v-model="submitData.payment_account"
                size="small"
                class="inputWidth280"
                placeholder="请填写来款的账户名称"
              ></el-input>
              <!-- <span class="redColor">*</span> -->
            </div>
            <div
              class="marginBottom"
              v-show="submitData.account_type == 2 || submitData.account_type == 1 || submitData.account_type == 5 || submitData.account_type == 3 || submitData.account_type == 4 || submitData.account_type == 6"
            >
              <span>来款金额</span>
              <el-input
                v-model="submitData.payment_money"
                size="small"
                class="inputWidth280"
                placeholder="请填写来款金额"
                @blur="moneyCheck"
              ></el-input>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom" v-show="submitData.account_type == 2">
              <span>来款银行</span>
              <el-input
                v-model="submitData.account_bank"
                size="small"
                class="inputWidth280"
                placeholder="请填写收款账户名称"
              ></el-input>
              <!-- <span class="redColor">*</span> -->
            </div>
            <!-- <div
              class="marginBottom"
              v-show="submitData.account_type == 2 || submitData.account_type == 3 || submitData.account_type == 4 || submitData.account_type == 6"
            >
              <span>来款账户</span>
              <el-input
                v-model="submitData.payment_account_name"
                size="small"
                class="inputWidth280"
                placeholder="请填写来款的账户名称"
              ></el-input>
            </div>-->
            <div class="marginBottom">
              <span style="width: 56px;display:inline-block;text-align: right;">备注</span>
              <el-input
                v-model="submitData.note"
                size="small"
                class="inputWidth280"
                placeholder="请填写备注信息"
              ></el-input>
            </div>
          </el-col>

          <!-- 右 -->
          <el-col :span="12" class="itemRight fontTStyle">
            <div
              class="marginBottom paddingLeft"
              v-show="submitData.account_type == 2 || submitData.account_type == 1 || submitData.account_type == 5 || submitData.account_type == 3 || submitData.account_type == 4 || submitData.account_type == 6"
            >
              <span>来款客户</span>
              <el-select
                v-model="submitData.account_partner_id"
                filterable
                remote
                reserve-keyword
                placeholder="请填写来款客户"
                :remote-method="remoteMethod"
                :loading="searchLoading"
                size="small"
                @keydown.native="customeSelect($event)"
                class="inputWidth280"
              >
                <el-option
                  v-for="item in customerData"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </div>
            <div class="marginBottom paddingLeft" v-show="submitData.account_type == 2">
              <span>来款性质</span>
              <el-select
                v-model="submitData.pay_type"
                placeholder="请选择"
                size="small"
                class="inputWidth280"
              >
                <el-option
                  v-for="item in payTypeData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="marginBottom" v-show="submitData.account_type == 2">
              <span class>到账时间</span>
              <!--  v-model="submitData.pay_time" -->
              <el-date-picker
                v-model="submitData.pay_time"
                type="datetime"
                placeholder="选择日期时间"
                size="small"
                class="inputWidth280"
                @change="selectDate"
                :picker-options="$publicData.pickerOptions1"
              ></el-date-picker>
              <span class="redColor">*</span>
            </div>
            <div class="marginBottom">
              <span>收款银行</span>
              <el-select
                v-model="submitData.receive_account"
                placeholder="请选择"
                size="small"
                class="inputWidth280"
              >
                <el-option
                  v-for="item in fandBankfanceData"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <span class="redColor">*</span>
            </div>
            <!-- <div
              class="marginBottom paddingLeft"
              v-show="submitData.account_type == 2 || submitData.account_type == 3 || submitData.account_type == 4 || submitData.account_type == 6"
            >
              <span>备注</span>
              <el-input
                v-model="submitData.note"
                size="small"
                class="inputWidth280"
                placeholder="请填写备注信息"
              ></el-input>
            </div>-->
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="createdMoneyType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmFun" size="small" :loading="btnLoading">确定</el-button>
      </span>
    </el-dialog>
    <!-- 来款单详情 -->
    <el-dialog
      title="来款单详情"
      :visible.sync="moneyDetailType"
      width="840px"
      :close-on-click-modal="false"
    >
      <div class="detailStyle">
        <div class="line"></div>
        <div class="aboveWrap" v-show="recognition.length != 0 ">
          <div class="leftWrap">
            <img :src="$portImg + detailImg" style="cursor: pointer;" @click="showPic" />
          </div>
          <div class="rightWrap" v-show="false">
            <el-button
              icon="el-icon-arrow-left"
              size="mini"
              @click="prevFun"
              :disabled="disablePrev"
            ></el-button>
            {{detailCurrent}}/{{recognition.length}}
            <el-button
              icon="el-icon-arrow-right"
              size="mini"
              @click="nextFun"
              :disabled="disableNext"
            ></el-button>
          </div>
        </div>
        <el-row class="itemBottom">
          <el-col :span="3" class="titleStyle">系统单号</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.order_code != '' && detailData.order_code != undefined"
          >{{detailData.order_code}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          <el-col :span="3" class="titleStyle">来款客户</el-col>
          <el-col
            :span="9"
            class="contentStyle"
            v-if="detailData.account_partner != '' && detailData.account_partner != undefined"
          >{{detailData.account_partner}}</el-col>
          <el-col :span="9" class="contentStyle" v-else>- -</el-col>
        </el-row>

        <!-- 转账 -->
        <span v-if="detailData.account_type == '2'">
          <el-row class="itemBottom">
            <el-col :span="3" class="titleStyle">来款账号</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.payment_account != '' && detailData.payment_account != undefined"
            >{{detailData.payment_account}}</el-col>

            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            <el-col :span="3" class="titleStyle">来款性质</el-col>
            <el-col :span="9" class="contentStyle" v-if="detailData.pay_type == 1">公对公</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.pay_type == 2">私对公</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>
          <el-row class="itemBottom">
            <el-col :span="3" class="titleStyle">支付方式</el-col>
            <el-col :span="9" class="contentStyle" v-if="detailData.account_type == 1">现金</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 2">转账</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 3">支付宝</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 4">微信</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 5">调整款</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 6">刷卡</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            <el-col :span="3" class="titleStyle">认款人</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailconfirm_uid_name != ''"
            >{{detailconfirm_uid_name}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>
          <el-row class="itemBottom">
            <el-col :span="3" class="titleStyle">来款金额</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.payment_money != '' && detailData.payment_money != undefined"
            >{{detailData.payment_money}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            <el-col :span="3" class="titleStyle">到账时间</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.pay_time != '' && detailData.pay_time != undefined"
            >{{detailData.pay_time}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>
          <el-row class="itemBottom">
            <el-col :span="3" class="titleStyle">来款银行</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.account_bank != '' && detailData.account_bank != undefined"
            >{{detailData.account_bank}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            <el-col :span="3" class="titleStyle">收款银行</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.receive_account != '' && detailData.receive_account != undefined"
            >{{detailData.receive_account}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>
          <el-row class="itemBottom">
            <!-- <el-col :span="3" class="titleStyle">来款户名</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.payment_account_name != '' && detailData.payment_account_name != undefined"
            >{{detailData.payment_account_name}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>-->
            <el-col :span="3" class="titleStyle">备注信息</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.note != '' && detailData.note != undefined"
            >{{detailData.note}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>
        </span>

        <span v-else>
          <el-row class="itemBottom">
            <el-col :span="3" class="titleStyle">来款金额</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.payment_money != '' && detailData.payment_money != undefined"
            >{{detailData.payment_money}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            <el-col :span="3" class="titleStyle">收款银行</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.receive_account != '' && detailData.receive_account != undefined"
            >{{detailData.receive_account}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>

          <span
            v-if="detailData.account_type == '3' || detailData.account_type == '4' || detailData.account_type == '6'"
          >
            <!-- <el-row class="itemBottom">
              <el-col :span="3" class="titleStyle">来款户名</el-col>
              <el-col
                :span="9"
                class="contentStyle"
                v-if="detailData.payment_account_name != '' && detailData.payment_account_name != undefined"
              >{{detailData.payment_account_name}}</el-col>
              <el-col :span="9" class="contentStyle" v-else>- -</el-col>
              <el-col :span="3" class="titleStyle">备注信息</el-col>
              <el-col
                :span="9"
                class="contentStyle"
                v-if="detailData.note != '' && detailData.note != undefined"
              >{{detailData.note}}</el-col>
              <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            </el-row>-->
            <el-row class="itemBottom">
              <el-col :span="3" class="titleStyle">支付方式</el-col>
              <el-col :span="9" class="contentStyle" v-if="detailData.account_type == 1">现金</el-col>
              <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 2">转账</el-col>
              <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 3">支付宝</el-col>
              <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 4">微信</el-col>
              <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 5">调整款</el-col>
              <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 6">刷卡</el-col>
              <el-col :span="9" class="contentStyle" v-else>- -</el-col>
              <el-col :span="3" class="titleStyle">备注信息</el-col>
              <el-col
                :span="9"
                class="contentStyle"
                v-if="detailData.note != '' && detailData.note != undefined"
              >{{detailData.note}}</el-col>
              <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            </el-row>
          </span>

          <el-row
            class="itemBottom"
            v-if="detailData.account_type == '1' || detailData.account_type == '5'"
          >
            <el-col :span="3" class="titleStyle">支付方式</el-col>
            <el-col :span="9" class="contentStyle" v-if="detailData.account_type == 1">现金</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 2">转账</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 3">支付宝</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 4">微信</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 5">调整款</el-col>
            <el-col :span="9" class="contentStyle" v-else-if="detailData.account_type == 6">刷卡</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
            <el-col :span="3" class="titleStyle">备注信息</el-col>
            <el-col
              :span="9"
              class="contentStyle"
              v-if="detailData.note != '' && detailData.note != undefined"
            >{{detailData.note}}</el-col>
            <el-col :span="9" class="contentStyle" v-else>- -</el-col>
          </el-row>
        </span>
      </div>
      <!-- <div class="layer"></div> -->
      <!-- <span slot="footer" class="dialog-footer" v-show="detailData.account_state != 5 && detailData.HC != 1">
          <el-button size="small" type="primary" plain @click="moneyDetailType = false">取 消</el-button>
          <el-button type="primary" @click="rejectFun" plain size="small"  v-if="detailData.account_state == 3">驳回</el-button>
          <el-button type="primary" @click="confirm" size="small"  v-if="detailData.account_state == 3">确定</el-button>
          <el-button type="warning" @click="toVoid" size="small"  v-if="detailData.account_state == 3 || detailData.account_state == 1">作废</el-button>
          <el-button type="primary" @click="redflushFun" size="small" v-if="detailData.account_state == 0 || detailData.account_state == 2">红冲</el-button>
      </span>-->
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" plain @click="moneyDetailType = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
          size="small"
          v-if="detailData.account_state == 3"
        >确定</el-button>
        <el-button
          type="warning"
          @click="toVoid"
          size="small"
          v-if="detailData.account_state == 1"
        >作废</el-button>
        <!--  v-if="(detailData.account_state == 0 || showHC == 3) && detailData.HC == 0" -->
        <el-button
          type="primary"
          @click="redflushFun"
          size="small"
          v-if="detailData.account_state ==2  && detailData.HC == 0 && showHC != 'HC'"
        >红冲</el-button>
      </span>
    </el-dialog>
    <!-- 红冲提示 -->
    <el-dialog title="提示" :visible.sync="HCpromptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入红冲的原因" v-model="HCnote"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="HCpromptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="ConfirmRedflush" size="small" :loading="btnHCLoading">确定</el-button>
      </span>
    </el-dialog>
    <!-- 驳回提示 -->
    <el-dialog title="提示" :visible.sync="backPromptType" width="480px">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id class="textAreaStyle" placeholder="请输入驳回的原因" v-model="approval_note"></textarea>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="backPromptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirmRejectFun" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <!-- 图片放大 -->
    <Popoverpic v-show="modelType" @callback="cancelModel" :imgSrc="modelImgSrc"></Popoverpic>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num3: "",
      btnLoading: false, //新建按钮状态
      btnHCLoading: false, //红冲按钮
      loading: false,
      searchLoading: false,
      modelType: false, //弹框显示状态
      modelImgSrc: "", //弹框图片路径

      showHC: "", //order_code状态是显示红冲
      disablePrev: true, //左禁用状态
      disableNext: false, //右禁用状态
      recognition: [], //已经被认款的集合
      detailCurrent: "", //详情当前页
      detailImg: "", //详情显示图片
      detailconfirm_uid_name: "", //详情认款人
      customerData: [], //来料客户数据
      fandBankfanceData: [], //银行数据
      pageFandBankfanceData: [], //银行数据
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      HC: "", //红冲
      account_type: "", //支付方式
      account_state: "", //认款状态
      receive_account: "全部", //收款银行
      HCpromptType: false, // 红冲提示状态
      backPromptType: false, //驳回提示状态
      HCnote: "", //红冲原因
      approval_note: "", //驳回原因
      HCData: [
        {
          //红冲数据
          id: "",
          label: "全部"
        },
        {
          id: 0,
          label: "否"
        },
        {
          id: 1,
          label: "是"
        }
      ],
      detailData: {}, //详情数据
      submitData: {
        //新增来款的数据
        account_type: 2,
        payment_account: "",
        payment_money: "",
        account_bank: "",
        // payment_account_name: "",
        account_partner_id: "",
        pay_type: "",
        pay_time: new Date(),
        receive_account: "",
        note: ""
      },
      payTypeData: [
        {
          //来款性质
          id: 1,
          label: "公对公"
        },
        {
          id: 2,
          label: "私对公"
        }
      ],
      accountStateData: [
        {
          // 认款状态数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "待认款"
        },
        {
          id: 2,
          label: "已认款 "
        },
        {
          id: 3,
          label: "待确定 "
        },
        {
          id: 4,
          label: "作废"
        }
      ],
      accountTypeData: [
        {
          //支付类型数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "现金 "
        },
        {
          id: 2,
          label: "转账 "
        },
        {
          id: 3,
          label: "支付宝 "
        },
        {
          id: 4,
          label: "微信 "
        },
        {
          id: 5,
          label: "调整款 "
        },
        {
          id: 6,
          label: "刷卡"
        }
      ],
      newCreateAccountTypeData: [
        {
          //新建来款单支付类型数据
          id: 1,
          label: "现金"
        },
        {
          id: 2,
          label: "转账"
        },
        {
          id: 3,
          label: "支付宝"
        },
        {
          id: 4,
          label: "微信"
        },
        {
          id: 5,
          label: "调整款"
        },
        {
          id: 6,
          label: "刷卡"
        }
      ],
      moneyDetailType: false, // 来款单详情
      createdMoneyType: false, // 新建来款状态
      value: "", //模拟
      options: [], //模拟
      allData: [], //列表

      dialogTableVisible: false, //金料单弹出框
      selectedDay: "", //日期选择属性
      searchTxt: "", //搜索字段
      pageNum: 1, //默认第一页
      pageSize: 12, //每页显示条目个数
      priceSum: 0, //总条目数
      options4: [],
      value9: [],
      list: [],
      loading: false,
      moneyDisNum: 0,
      addAllotTF: false //新增调拨按钮显示权限
    };
  },
  created() {
    this.created_fun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;
      let dom = this.$refs.moneyRegister;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }

      if (this.createdMoneyType == true && altKey && keyCode === 83) {
        self.confirmFun();
      }
    };
    this.addAllotTF = this.$api.setPowerSpotThree(
        sessionStorage.verify,
        "come-account-add"
    );
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
      this.displayAllData();
      this.fandBankfance();
    },
    displayAllData() {
      this.loading = true;
      var self = this;
      let brank = "";
      if (self.receive_account == "全部") {
        brank = "";
      } else {
        brank = self.receive_account;
      }
      let params = {
        PRS: {
          search: self.search,
          startTime: self.startTime,
          endTime: self.endTime,
          HC: self.HC,
          account_type: self.account_type,
          account_state: self.account_state,
          company_bank: brank,
          simple: "",
          page: self.pageNum,
          rows: self.pageSize
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/comeAccountOrderlist", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.moneyDisNum = res.data.data.totalMoney;
            self.allData = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.allData.forEach((item, index) => {
              item.pay_time != ""
                ? (item.pay_time = self.$api.dateGetDayTime(item.pay_time))
                : "";
              item.create_time != ""
                ? (item.create_time = self.$api.dateGetDayTime(
                    item.create_time
                  ))
                : "";
              if (item.account_state == 3 && item.account_partner == "") {
                // item.comeAccountOrderLines[0].account_partner && item.account_partner = item.comeAccountOrderLines[0].account_partner;
                item.comeAccountOrderLines[0].account_partner &&
                  (item.account_partner =
                    item.comeAccountOrderLines[0].account_partner);
              }
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.label === "来款金额(￥)") {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                let res = (Number(prev) + Number(curr)).toFixed(2);
                return res;
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
    // 编辑单
    editGold(elem) {
      let self = this;
      this.moneyDetailType = true;
      this.disablePrev = true;
      this.disableNext = false;
      this.showHC = "";
      this.detailData = elem;
      this.recognition = elem.comeAccountOrderLines;
      if (this.recognition.length != 0) {
        this.detailCurrent = 1; //详情当前页
        this.detailImg = this.recognition[0].proof_url; //详情显示图片
        this.detailconfirm_uid_name = this.recognition[0].confirm_uid_name; //详情认款人
        // this.showHC = this.recognition[0].account_line_statu; //详情认款状态
      }
      if (this.detailData.order_code != undefined) {
        this.showHC = this.detailData.order_code.slice(0, 2);
      }

      if (this.recognition.length == 1) {
        this.disablePrev = true;
        this.disableNext = true;
      }
    },
    //向上
    prevFun() {
      if (this.detailCurrent > 1) {
        this.detailCurrent -= 1;
        this.disableNext = false;
      } else if (this.detailCurrent <= 1) {
        this.detailCurrent = 1;
        this.disablePrev = true;
      }
      let index = this.detailCurrent - 1;
      this.detailImg = this.recognition[index].proof_url; //详情显示图片
      this.detailconfirm_uid_name = this.recognition[index].confirm_uid_name; //详情认款人
      // this.showHC = this.recognition[index].account_line_statu; //详情认款状态
    },
    //向下
    nextFun() {
      if (this.detailCurrent < this.recognition.length) {
        this.detailCurrent += 1;
        this.disablePrev = false;
      } else if (this.detailCurrent >= this.recognition.length) {
        this.detailCurrent = this.recognition.length;
        this.disableNext = true;
      }

      let index = this.detailCurrent - 1;
      this.detailImg = this.recognition[index].proof_url; //详情显示图片
      this.detailconfirm_uid_name = this.recognition[index].confirm_uid_name; //详情认款人
      // this.showHC = this.recognition[index].account_line_statu; //详情认款状态
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.displayAllData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.displayAllData();
    },
    // 新增来款
    createdFun() {
      this.btnLoading = false;
      this.createdMoneyType = true;
      this.submitData.account_type = 2;
      this.submitData.payment_account = "";
      this.submitData.payment_money = "";
      this.submitData.account_bank = "";
      // this.submitData.payment_account_name = "";
      this.submitData.account_partner_id = "";
      this.submitData.pay_type = "";
      this.submitData.pay_time = new Date();
      this.submitData.receive_account = "";
      this.submitData.note = "";
    },
    // 选择日期
    selectDate(item) {
      //
      // this.submitData.pay_time = this.$api.dateGetDayTime(item)
    },
    // 选择支付方式
    selectAccount() {
      this.submitData.payment_account = "";
      this.submitData.payment_money = "";
      this.submitData.account_bank = "";
      // this.submitData.payment_account_name = "";
      this.submitData.account_partner_id = "";
      this.submitData.pay_type = "";
      this.submitData.pay_time = "";
      this.submitData.receive_account = "";
      this.submitData.note = "";
      this.customerData = [];
    },
    // 确定
    confirmFun() {
      let self = this;
      // this.submitData.account_partner = '衢州市周福生珠宝有限公司';
      // this.submitData.account_partner_id = '96511';
      if (this.submitData.note != undefined) {
        this.submitData.note = this.submitData.note.trim();
      }
      if (this.submitData.payment_account != undefined) {
        this.submitData.payment_account = this.submitData.payment_account.trim();
      }

      // if (this.submitData.payment_account_name != undefined) {
      //   this.submitData.payment_account_name = this.submitData.payment_account_name.trim();
      // }

      if (this.submitData.payment_money != undefined) {
        this.submitData.payment_money = this.submitData.payment_money.trim();
      }
      if (this.submitData.payment_money == "") {
        self.$message.error("请填写来款金额！");
        return;
      }

      if (this.submitData.account_type == 2) {
        if (
          this.submitData.pay_time == null ||
          this.submitData.pay_time == ""
        ) {
          this.$message.error("请填写到账时间！");
          return;
        }
      }

      if (this.submitData.receive_account == "") {
        self.$message.error("请选择收款银行！");
        return;
      }

      this.customerData.forEach(item => {
        if (self.submitData.account_partner_id == item.companyId) {
          self.submitData.account_partner = item.companyName;
        }
      });

      if (self.submitData.account_partner_id == "") {
        self.submitData.account_partner = "";
      }
      self.btnLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/createComeAccountOrder", self.submitData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdMoneyType = false;
              self.btnLoading = false;
              self.displayAllData();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnLoading = false;
          }
        });
    },
    // 作废
    toVoid() {
      let self = this;
      let params = {
        PRS: {
          comeAccountOrderId: self.detailData.id
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/abolishComeAccountOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.moneyDetailType = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //红冲
    redflushFun() {
      this.HCpromptType = true;
      this.btnHCLoading = false;
      this.HCnote = "";
    },
    //确定红冲
    ConfirmRedflush() {
      let self = this;
      let params = {
        PRS: {
          comeAccountOrderId: self.detailData.id,
          reason: self.HCnote != undefined ? self.HCnote.trim() : ""
        }
      };
      this.btnHCLoading = true;
      this.$axios
        .get(this.$portMain + "/stock/HCComeAccountOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.moneyDetailType = false;
              self.HCpromptType = false;
              self.btnHCLoading = false;
              self.created_fun();
            }, 2000);
          } else {
            self.btnHCLoading = false;
            self.$message.error(res.data.msg);
          }
        });
    },
    // 确定来款
    confirm() {
      let self = this;
      let index = this.detailCurrent - 1;
      let params = {
        PRS: {
          comeAccountOrderId: self.detailData.id,
          orderLine_id: self.recognition[index].line_id
        }
      };

      this.$axios
        .get(this.$portMain + "/stock/passComeAccountOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.moneyDetailType = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //驳回
    rejectFun() {
      this.backPromptType = true;
      this.approval_note = "";
    },
    // 驳回
    confirmRejectFun() {
      let self = this;
      let params = {
        PRS: {
          comeAccountOrderId: self.detailData.id,
          account_state: self.detailData.account_state,
          approval_note:
            self.approval_note != undefined ? self.approval_note.trim() : ""
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/rejectComeAccountOrder", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.moneyDetailType = false;
              self.backPromptType = false;
              self.created_fun();
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
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
    //查询
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    // 重置
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.account_type = this.account_state = this.HC = this.company_bank =
        "";
      this.receive_account = "全部";
      this.selectedDay = "";
      this.queryFun();
    },
    //收款银行
    fandBankfance() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/fandBankfance")
        .then(function(res) {
          if (res.data.code == 200) {
            self.fandBankfanceData = res.data.data;
            self.pageFandBankfanceData = [...res.data.data];
            self.pageFandBankfanceData.unshift("全部");
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.searchLoading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        this.$axios
          .get(this.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.searchLoading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.submitData.account_partner_id = "";
        self.customerData = [];
      }
    },
    // 来料客户删除
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.submitData.account_partner_id = "";
        this.customerData = [];
      }
    },
    //查看图片
    showPic() {
      let imgUrl = this.$portImg + this.detailImg;
      if (imgUrl != "") {
        this.modelType = true;
        this.modelImgSrc = imgUrl;
      }
    },
    //关闭弹框
    cancelModel(e) {
      this.modelType = e;
    },
    //金额数字校验
    moneyCheck() {
      if (this.submitData.payment_money != undefined) {
        this.submitData.payment_money = this.submitData.payment_money.trim();
      }

      let result = isNaN(this.submitData.payment_money);
      let result2 = Number(this.submitData.payment_money) < 0;
      if (result || result2) {
        this.$message.error("请输入正确金额！");
        this.submitData.payment_money = "";
      }
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
    margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
  }

  .creatStyle {
    position: relative;

    .line {
      width: 840px;
      height: 1px;
      background-color: #E6E6E6;
      position: absolute;
      top: -33px;
      left: -20px;
    }

    .inputWidth280 {
      width: 280px;
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

    .paddingLeft {
      padding-right: 14px;
    }
  }

  .detailStyle {
    position: relative;

    .line {
      width: 840px;
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

  .aboveWrap {
    display: flex;
    margin-bottom: 2px;

    .leftWrap {
      flex: 1;

      img {
        width: 100px;
        height: 75px;
        background: #CFD9E6;
        margin-left: 21px;
      }
    }

    .rightWrap {
      flex: 1;
      text-align: right;

      .Arrow {
        width: 20px;
        height: 20px;
        border: 1px solid #DADFE6;
        cursor: pointer;
        line-height: 20px;
        text-align: center;
      }
    }
  }
}
</style>
