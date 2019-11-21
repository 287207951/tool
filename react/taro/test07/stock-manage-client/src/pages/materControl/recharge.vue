<template>
  <div class="conBigDiv" ref="recharge" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="topnav">
      <el-breadcrumb-item>尚金缘内部业务管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>原料管理</el-breadcrumb-item>
      <el-breadcrumb-item>金库收料部</el-breadcrumb-item>
      <el-breadcrumb-item>收料</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="hr" />
      <el-row>
        <el-col :md="12" :lg="7" :xl="5" class="marginBottom20">
          <el-input
            placeholder="流水号/入库单号/来料单位"
            v-model="search"
            class="input-with-select searchTxt"
            size="small"
            @keyup.enter.native="queryFun"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :md="12" :lg="9" :xl="7" class="marginBottom20">
          <span class="fontStyle">时间筛选</span>
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
        </el-col>
        <el-col :md="12" :lg="6" :xl="4" class="marginBottom20">
          <span class="fontStyle">客户类型</span>
          <el-select v-model="customerType" placeholder="请选择" size="small">
            <el-option
              v-for="item in customerTypeData"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :md="12" :lg="6" :xl="4" class="marginBottom20">
          <span class="fontStyle">料种类</span>
          <el-select v-model="stockKindId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetKindData"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <span class="fontStyle">料类型</span>
          <el-select v-model="stockTypeId" placeholder="请选择" size="small">
            <el-option
              v-for="item in stockSetTypeList"
              :key="item.id"
              :label="item.material_name"
              :value="item.id"
            ></el-option>
          </el-select>-->
        </el-col>
        <el-col :md="12" :lg="6" :xl="4" class="marginBottom20">
          <span class="fontStyle">单据状态</span>
          <el-select v-model="billsStatue" placeholder="请选择" size="small">
            <el-option
              v-for="item in billsStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :md="12" :lg="6" :xl="4" class="marginBottom20">
          <span class="titleFont">入库状态</span>
          <el-select v-model="enterStatue" placeholder="请选择" size="small">
            <el-option
              v-for="item in enterStatueData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary"
            size="small"
            @click="createdFun"
            v-if="powerCreat == 'true'"
          >新建预收</el-button>
          <el-button type="danger" size="small" plain @click="queryFun">查询</el-button>
          <el-button type="danger" size="small" plain @click="resetQueryFun">重置</el-button>
        </el-col>
        <el-col :span="12" class="totalDes" v-show="false">
          <span>总计：熔前总毛重{{firstWeight}}</span>
          <span>熔后总毛重{{finalWeight}}</span>
          <span>入库总折重{{refinementWeight}}g</span>
          <span>总金额{{totalMoney}}元</span>
        </el-col>
      </el-row>
      <el-table
        :data="parageraphList"
        stripe
        :summary-method="getSummaries"
        show-summary
        sum-text="总计"
        @selection-change="handleSelectionChange"
        @row-dblclick="editGold"
        height="700"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="serial_number" label="流水号">
          <template slot-scope="scope">
            <span :class="{grayColor:scope.row.HC == 1}">{{scope.row.serial_number}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enter_code" label="入库单号" width="120">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.enter_code != '' && scope.row.enter_code != undefined"
            >{{scope.row.enter_code}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="company_name" label="收料单位">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.company_name != '' && scope.row.company_name != undefined"
            >{{scope.row.company_name}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_name" label="来料单位" width="180">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.customer_name != '' && scope.row.customer_name != undefined"
            >{{scope.row.customer_name}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_type" label="类型">
          <template slot-scope="scope">
            <!-- customerTypeData -->
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.customer_type != '' && scope.row.customer_type != undefined"
            >{{analysisCustomerType(scope.row.customer_type)}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>

          </template>
        </el-table-column>
        <el-table-column prop="stock_kind" label="料种类">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.stock_kind != '' && scope.row.stock_kind != undefined"
            >{{scope.row.stock_kind}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock_type" label="料类型">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.stock_type != '' && scope.row.stock_type != undefined"
            >{{scope.row.stock_type}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="熔前毛重(g)" prop="before_total_weight" width="100">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.before_total_weight != '' && scope.row.before_total_weight != undefined"
            >{{scope.row.before_total_weight}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="after_total_weight" label="熔后毛重(g)" width="100">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.after_total_weight != '' && scope.row.after_total_weight != undefined"
            >{{scope.row.after_total_weight}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="enter_discount_weight" label="入库折重(g)" width="100">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.enter_discount_weight != '' && scope.row.enter_discount_weight != undefined"
            >{{scope.row.enter_discount_weight}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(￥)" prop="total_money" width="100">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.total_money != '' && scope.row.total_money != undefined"
            >{{scope.row.total_money}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="入库柜" prop="enter_counter">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.enter_counter != '' && scope.row.enter_counter != undefined"
            >{{scope.row.enter_counter}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" prop="note">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              class="noteStyle"
              v-if="scope.row.note != '' && scope.row.note != undefined"
            >{{scope.row.note}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="入库状态">
          <template slot-scope="scope">
            <span v-if="scope.row.enter_statue == '1'" :class="{grayColor:scope.row.HC == 1}">预收</span>
            <span v-if="scope.row.enter_statue == '2'" :class="{grayColor:scope.row.HC == 1}">测金</span>
            <span v-if="scope.row.enter_statue == '3'" :class="{grayColor:scope.row.HC == 1}">入库</span>
            <span v-if="scope.row.enter_statue == '4'" :class="{grayColor:scope.row.HC == 1}">完成</span>
            <span v-if="scope.row.enter_statue == '5'" class="yellowColor">作废</span>
          </template>
        </el-table-column>
        <el-table-column label="性质" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.receiving_property == 'RECE_BASIC'">收客户旧料</span>
            <span v-else-if="scope.row.receiving_property == 'RECE_BUY'">购料</span>
            <span v-else-if="scope.row.receiving_property == 'RECE_BOOROW'">借料</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="update_time" width="180">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.update_time != '' && scope.row.update_time != undefined"
            >{{scope.row.update_time}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="order_uid_name">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.order_uid_name != '' && scope.row.order_uid_name != undefined"
            >{{scope.row.order_uid_name}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="打印" prop="print_count">
          <template slot-scope="scope">
            <span
              :class="{grayColor:scope.row.HC == 1}"
              v-if="scope.row.print_count > 0"
            >{{scope.row.print_count}}</span>
            <span :class="{grayColor:scope.row.HC == 1}" v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="红冲">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.HC == '0' || scope.row.HC == undefined">- -</span> -->
            <span v-if="scope.row.HC != '1' && scope.row.enter_statue != 5 && scope.row.bills_statue != 2" :class="{grayColor:scope.row.HC == 1}">红冲</span>
            <span v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column label="单据状态">
          <template slot-scope="scope">
            <span v-if="scope.row.bills_statue == undefined">- -</span>
            <span v-if="scope.row.bills_statue == '1'" class="yellowColor">待审核</span>
            <span v-if="scope.row.bills_statue == '2'" class="blackColor">已通过</span>
            <span v-if="scope.row.bills_statue == '3'" class="redColor">被驳回</span>
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
    <!-- 创建预收单 -->
    <el-dialog
      title="创建预收单"
      :visible.sync="createdPlanType"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左 -->
          <el-col :span="14" class="fontTStyle">
            <div class="marginBottom">
              <span>来料单位</span>
              <el-select
                v-model="submitCreatData.customer_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                @keydown.native="newCustomeSelect($event)"
                :loading="serachLoading"
                size="small"
                class="inputWidth240"
              >
                <el-option
                  v-for="item in customerData"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </div>
            <div class="marginBottom">
              <span>收料单位</span>
              <el-select
                v-model="submitCreatData.company_id"
                placeholder="请填写/选择单位名称"
                size="small"
                class="inputWidth240"
                disabled
              >
                <el-option
                  v-for="item in companyData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>

          <!-- 右 -->
          <el-col :span="10" class="itemRight fontTStyle">
            <div class="marginBottom">
              <span>料种类</span>
              <el-select
                v-model="submitCreatData.stock_kind_id"
                placeholder="请选择"
                size="small"
                class="inputWidth160"
                @change="selectStockSetKind"
              >
                <el-option
                  v-for="item in stockSetKindDataCreate"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>

            <div class="marginBottom">
              <span>性质</span>
              <el-select
                v-model="submitCreatData.receiving_property"
                placeholder="请选择"
                size="small"
                class="inputWidth160"
              >
                <el-option
                  v-for="item in propertyData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table ref="singleTable" :data="inputStockOrderLines" style="width: 100%">
        <el-table-column prop="number" width="100" label="盘号"></el-table-column>
        <el-table-column label="熔前毛重" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.before_weight"
              placeholder="请输入内容"
              size="small"
              @blur="checkNumberBefore(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="熔后毛重" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.after_weight"
              placeholder="请输入内容"
              size="small"
              @blur="checkNumberAfter(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <img src="../../../static/images/jiahao.png" alt @click="addItem" />
            <img src="../../../static/images/shanchu@2x.png" alt @click="delItem(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createdPlanType = false" size="small" plain>取 消</el-button>
        <el-button type="primary" @click="saveFun" size="small" plain>保 存</el-button>
        <el-button type="primary" @click="subFun" size="small" :loading="btnLoading">提交</el-button>
      </span>
    </el-dialog>
    <!-- 编辑预收单 -->
    <el-dialog
      title="编辑预收单"
      :visible.sync="editPlanType"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="creatStyle">
        <div class="line"></div>
        <el-row>
          <!-- 左 -->
          <el-col :span="14" class="fontTStyle">
            <div class="marginBottom">
              <span>来料单位</span>
              <el-select
                v-model="editData.customer_id"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                @keydown.native="customeSelect($event)"
                :loading="serachLoading"
                size="small"
                class="inputWidth240"
              >
                <el-option
                  v-for="item in customerData"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </div>
            <div class="marginBottom">
              <span>收料单位</span>
              <el-select
                v-model="editData.company_id"
                placeholder="请选择"
                size="small"
                class="inputWidth240"
                disabled
              >
                <el-option
                  v-for="item in companyData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>

          <!-- 右 -->
          <el-col :span="10" class="itemRight fontTStyle">
            <div class="marginBottom">
              <span>料种类</span>
              <el-select
                v-model="editData.stock_kind_id"
                placeholder="请选择"
                size="small"
                class="inputWidth160"
                @change="editSelectStockSetKind"
                disabled
              >
                <el-option
                  v-for="item in stockSetKindDataCreate"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="marginBottom">
              <span>性质</span>
              <el-select
                v-model="editData.receiving_property"
                placeholder="请选择"
                size="small"
                class="inputWidth160"
              >
                <el-option
                  v-for="item in propertyData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table ref="singleTable" :data="editTableData" style="width: 100%">
        <el-table-column width="100" label="盘号" prop="number"></el-table-column>
        <el-table-column label="熔前毛重" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.before_weight"
              placeholder="请输入内容"
              size="small"
              @blur="editNumberBefore(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="熔后毛重" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.after_weight"
              placeholder="请输入内容"
              size="small"
              @blur="editNumberAfter(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" header-align="center" align="center">
          <template slot-scope="scope">
            <img src="../../../static/images/jiahao.png" alt @click="editAddItem" />
            <img src="../../../static/images/shanchu@2x.png" alt @click="editDelItem(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="layer"></div> -->
      <span slot="footer" class="dialog-footer" v-if="powerCreat == 'true'">
        <el-button type="primary" @click="editPlanType = false" size="small" plain>取 消</el-button>
        <el-button
          type="primary"
          @click="editSaveFun"
          size="small"
          plain
          :loading="editBtnLoading"
        >保 存</el-button>
        <el-button type="primary" @click="editSubFun" size="small">提交</el-button>
      </span>
    </el-dialog>
    <!-- 测金详情 -->
    <el-dialog
      title="测金详情"
      :visible.sync="goldDetailType"
      width="640px"
      :close-on-click-modal="false"
    >
      <div class="detailStyle">
        <div class="line"></div>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">来料单位</el-col>
          <el-col :span="9" class="contentStyle">{{goldDetail.customer_name}}</el-col>
          <el-col :span="4" class="titleStyle">流水号</el-col>
          <el-col :span="7" class="contentStyle">{{goldDetail.serial_number}}</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">收料单位</el-col>
          <el-col :span="9" class="contentStyle">{{goldDetail.company_name}}</el-col>
          <el-col :span="4" class="titleStyle">料种类</el-col>
          <el-col :span="7" class="contentStyle">{{goldDetail.stock_kind}}</el-col>
        </el-row>
        <el-row class="itemBottom">
          <el-col :span="4" class="titleStyle">收料日期</el-col>
          <el-col
            :span="9"
            class="contentStyle"
          >{{this.$api.dateGetDayTime(goldDetail.update_time)}}</el-col>
          <el-col :span="4" class="titleStyle">性质</el-col>
          <el-col :span="7" class="contentStyle">{{goldDetail.receiving_property | filterProperty}}</el-col>
        </el-row>
      </div>
      <el-table ref="singleTable" :data="goldTableData" style="width: 100%">
        <el-table-column type="index" width="100" label="盘号"></el-table-column>
        <el-table-column prop="before_weight" label="熔前毛重" header-align="center" align="center"></el-table-column>
        <el-table-column prop="after_weight" label="熔后毛重" header-align="center" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer" v-if="powerCreat == 'true'">
        <el-button type="primary" @click="goldDetailType = false" size="small" plain>取 消</el-button>
        <el-button type="warning" @click="toVoid" size="small" :loading="voidBtnLoading">作废</el-button>
      </span>
    </el-dialog>
    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="promptType" width="480px" :close-on-click-modal="false">
      <div class="promptStyle">
        <div class="line"></div>
        <el-row>
          <el-col :span="24">
            <textarea name id style="width:433px; height:120px;resize:none" placeholder="请输入红冲的原因"></textarea>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptType = false" size="small">取 消</el-button>
        <el-button type="primary" @click="promptType = false" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--  -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      propertyData: [
        {
          //性质数据
          label: "收客户旧料",
          value: "RECE_BASIC"
        },
        {
          label: "购料",
          value: "RECE_BUY"
        },
        {
          label: "借料",
          value: "RECE_BOOROW"
        }
      ],
      powerCreat: "false", //新增按钮权限控制
      btnLoading: false, //新建按钮状态
      editBtnLoading: false, //编辑保存状态
      voidBtnLoading: false, //作废按钮状态
      loading: false,
      serachLoading: false,
      firstWeight: 0, //熔前毛重
      finalWeight: 0, //溶后毛重
      refinementWeight: 0, //入库总重
      totalMoney: 0, //总金额
      search: "", //搜素内容
      startTime: "", //开始时间
      endTime: "", //结束时间
      customerType: "", //客户类型
      stockKindId: "", //料种类
      stockTypeId: "", //料类型
      enterStatue: "", //入库类型
      billsStatue: "", //单据类型
      goldTableData: [], //测金表格数据
      goldDetail: {}, //测金数据
      editTableData: [], // 提交编辑熔前后数据
      stockSetKindData: [], //料种类下拉数据
      stockSetKindDataCreate: [], //预收料种类下拉数据
      stockSetTypeList: [], // 料类型数据
      customerData: [], //来料客户数据
      editData: {}, //提交编辑的数据
      inputStockOrderLines: [
        {
          // 提交创建熔前后数据
          number: "1",
          before_weight: "",
          after_weight: ""
        }
      ],
      customerTypeData: [],//客户类型数据
      billsStatueData: [
        {
          id: "",
          label: "全部"
        },
        {
          // 单据状态
          id: 1,
          label: "待审核"
        },
        {
          id: 2,
          label: "审核通过"
        },
        {
          id: 3,
          label: "审核驳回"
        }
      ],
      enterStatueData: [
        {
          // 入库状态数据
          id: "",
          label: "全部"
        },
        {
          id: 1,
          label: "预收"
        },
        {
          id: 2,
          label: "测金"
        },
        {
          id: 3,
          label: "入库"
        },
        {
          id: 4,
          label: "完成"
        },
        {
          id: 5,
          label: "作废"
        }
      ],
      submitCreatData: {
        // 提交创建预收单数据
        customer_id: "",
        customer_name: "",
        stock_kind_id: "",
        stock_kind: "旧料",
        company_id: 91681,
        company_name: "尚金缘",
        customer_type: "客户",
        area: "西南",
        province: "河南",
        finance_code: "02315",
        inputStockOrderLines: [],
        receiving_property: ""
      },
      stockData: [
        {
          // 料种类
          id: 21,
          name: "旧料"
        },
        {
          id: 22,
          name: "板料"
        }
      ],
      companyData: [
        {
          // 公司数据
          id: 91681,
          name: "尚金缘"
        }
      ],
      tableData: [{}], // 模拟
      promptType: false, //提示状态
      goldDetailType: false, // 测金详情状态
      editPlanType: false, // 编辑预收单
      createdPlanType: false, // 创建预收单状态
      value: "", //模拟
      options: [], //模拟
      parageraphList: [], //列表
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
      states: ["Alabama", "Alaska", "Arizona"]
    };
  },
  created() {
    this.created_fun();
    this.powerFun();
    let self = this;
    document.onkeydown = e => {
      //组合键
      let altKey = e.altKey || e.metaKey;
      let keyCode = e.keyCode || e.which || e.charCode;

      let dom = this.$refs.recharge;
      if (dom != undefined && altKey && keyCode === 78) {
        self.createdFun();
      }
    };
  },
  methods: {
    created_fun() {
      // this.$api.dateGetDay()
       this.getCustomerType();
      this.displayAllData(1, 12);
      this.findStockSetKind();
      this.findStockSetKindCreat();
      this.stockSetFun();
    },
    displayAllData(num, size) {
      this.loading = true;
      var self = this;
      let params = {
        PRS: {
          search: this.search,
          startTime: this.startTime,
          endTime: this.endTime,
          customerType: this.customerType,
          stockKindId: this.stockKindId,
          stockTypeId: this.stockTypeId,
          enterStatue: this.enterStatue,
          billsStatue: this.billsStatue,
          page: num,
          rows: size
        }
      };
      this.$axios
        .get(this.$portMain + "/stock/NinputStockLists", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.firstWeight = res.data.data.firstWeight; //熔前毛重
            self.finalWeight = res.data.data.finalWeight; //溶后毛重
            self.refinementWeight = res.data.data.refinementWeight; //入库总重
            self.totalMoney = res.data.data.totalMoney; //总金额
            self.parageraphList = res.data.data.data;
            self.priceSum = res.data.data.rowSize;
            self.parageraphList.forEach((item, index) => {
              item.update_time = self.$api.dateGetDayTime(item.update_time);
            });
          } else {
            self.$message.error(res.data.msg);
          }
          self.loading = false;
        })
        .catch(() => (self.loading = false));
    },
    //获取客户类型数据
    getCustomerType() {
      let self = this;
      let params = {};
      this.$axios
        .post(this.$portMain + "/client/clientTypeListRefined", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerTypeData = res.data.data;
            self.customerTypeData.unshift({
              value: "全部",
              key: ""
            });
          } else {
            self.customerTypeData = [];
          }
        });
    },
    analysisCustomerType(row) {
      let name = "";
      this.customerTypeData.forEach(item => {
        if (item.key == row) {
          name = item.value;
        }
      });
      if (name == "") {
        name = row;
      }
      return name;
    },
    // 选中值
    handleSelectionChange(select) {
      select.forEach(item => {});
    },
    //表格底部数据统计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "熔前毛重(g)" ||
          column.label === "熔后毛重(g)" ||
          column.label === "入库折重(g)" ||
          column.label === "金额(￥)"
        ) {
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
    // 列表详情请求
    listRequest(params) {
      this.$axios
        .get(this.$portMain + "/stock/NinputStockFrom", params)
        .then(function(res) {
          if (res.data.code == 200) {
            //return res.data.data;
            // self.editData = res.data.data;
            // self.editTableData = res.data.data.inputStockOrderLines;
            // self.editPlanType = true;
          }
        });
    },
    // 编辑单
    editGold(elem) {
      let self = this;
      let params = {
        PRS: {
          inputStockId: elem.id
        }
      };
      self.customerData = [];
      if (elem.enter_statue == 1) {
        //预收
        this.$axios
          .get(this.$portMain + "/stock/NinputStockFrom", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.editData = res.data.data;
              self.customerData = [
                {
                  companyId: self.editData.customer_id,
                  companyName: self.editData.customer_name
                }
              ];
              self.editTableData = res.data.data.inputStockOrderLines;
              self.editPlanType = true;
            }
          });
      } else if (elem.enter_statue == 2) {
        // 测金
        this.$axios
          .get(this.$portMain + "/stock/NinputStockFrom", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.goldDetail = res.data.data;
              self.goldTableData = res.data.data.inputStockOrderLines;
              self.goldDetailType = true;
            }
          });
      } else if (elem.enter_statue == 3) {
        // 入库
        this.$router.push({
          path: "warehousingDetail",
          query: { inputStockId: elem.id }
        });
      } else if (elem.enter_statue == 4) {
        // 完成
        this.$router.push({
          path: "warehousingComplete",
          query: { inputStockId: elem.id }
        });
      } else if (elem.enter_statue == 5) {
        // 作废
        this.$router.push({
          path: "warehousingComplete",
          query: { toVoidId: elem.id }
        });
      }
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
    //添加一行
    addItem() {
      //let index = this.inputStockOrderLines.length - 1;
      let num = Number(this.inputStockOrderLines[0].number) + 1;
      this.inputStockOrderLines.unshift({
        number: num,
        before_weight: "",
        after_weight: ""
      });
    },
    //编辑时添加一行
    editAddItem() {
      let num = Number(this.editTableData[0].number) + 1;
      this.editTableData.unshift({
        number: num,
        before_weight: "",
        after_weight: ""
      });
    },
    // 删除一行
    delItem(index) {
      let num = this.inputStockOrderLines.length;
      // this.inputStockOrderLines.forEach(item => {
      //   item.number = num--;
      // })
      if (num == 1) {
        this.$message.error("必须保留一条数据！");
        return;
      }
      this.inputStockOrderLines.splice(index, 1);
    },
    // 编辑时删除一行
    editDelItem(index) {
      let num = this.editTableData.length;
      // this.editTableData.forEach(item => {
      //   item.number = num--;
      // })
      if (num == 1) {
        this.$message.error("必须保留一条数据！");
        return;
      }
      this.editTableData.splice(index, 1);
    },
    // 查询事件
    queryFun() {
      this.pageNum = 1;
      this.pageSize = 12;
      this.created_fun();
    },
    resetQueryFun() {
      this.search = this.startTime = this.endTime = this.customerType = this.stockKindId = this.stockTypeId = this.enterStatue = this.billsStatue = this.selectedDay =
        "";
      this.queryFun();
    },
    // 创建预收单
    createdFun() {
      let self = this;
      this.submitCreatData.stock_kind = "旧料";
      this.btnLoading = false;
      this.stockSetKindDataCreate.forEach(item => {
        if (self.submitCreatData.stock_kind == item.material_name) {
          self.submitCreatData.stock_kind_id = item.id;
        }
      });
      this.createdPlanType = true;
      this.submitCreatData.customer_id = "";
      // this.submitCreatData.stock_kind_id = 79;
      this.inputStockOrderLines = [
        {
          number: "1",
          before_weight: "",
          after_weight: ""
        }
      ];
    },
    //输入框数字校验
    checkNumberBefore(item) {
      if (item.before_weight != undefined) {
        item.before_weight = item.before_weight.trim();
      }

      let result = isNaN(item.before_weight);
      let result2 = Number(item.before_weight) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        item.before_weight = "";
        return;
      }
      //self.submitCreatData.stock_kind
      if (this.submitCreatData.stock_kind == "板料") {
        if (item.before_weight != "") {
          item.after_weight = item.before_weight;
        }
      } else if (this.submitCreatData.stock_kind == "旧料") {
        if (item.before_weight != "" && item.after_weight != "") {
          if (Number(item.after_weight) > Number(item.before_weight)) {
            this.$message.error("熔后毛重不能大于熔前毛重!");
            item.before_weight = "";
          }
        }
      }
    },
    checkNumberAfter(item) {
      if (item.after_weight != undefined) {
        item.after_weight = item.after_weight.trim();
      }
      let result = isNaN(item.after_weight);
      let result2 = Number(item.after_weight) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        item.after_weight = "";
        return;
      }
      if (this.submitCreatData.stock_kind == "板料") {
        if (item.after_weight != "") {
          item.before_weight = item.after_weight;
        }
      } else if (this.submitCreatData.stock_kind == "旧料") {
        if (item.before_weight != "" && item.after_weight != "") {
          if (Number(item.after_weight) > Number(item.before_weight)) {
            this.$message.error("熔后毛重不能大于熔前毛重!");
            item.after_weight = "";
          }
        }
      }
    },

    //编辑输入框数字校验
    editNumberBefore(item) {
      if (item.before_weight != undefined) {
        item.before_weight = item.before_weight.trim();
      }

      let result = isNaN(item.before_weight);
      let result2 = Number(item.before_weight) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        item.before_weight = "";
        return;
      }

      if (this.editData.stock_kind == "板料") {
        if (item.before_weight != "") {
          item.after_weight = item.before_weight;
        }
      } else if (this.editData.stock_kind == "旧料") {
        if (item.before_weight != "" && item.after_weight != "") {
          if (Number(item.after_weight) > Number(item.before_weight)) {
            this.$message.error("熔后毛重不能大于熔前毛重!");
            item.before_weight = "";
          }
        }
      }
    },

    editNumberAfter(item) {
      if (item.after_weight != undefined) {
        item.after_weight = item.after_weight.trim();
      }

      let result = isNaN(item.after_weight);
      let result2 = Number(item.after_weight) < 0;
      if (result || result2) {
        this.$message.error("请输入有效数据!");
        item.after_weight = "";
        return;
      }
      if (this.editData.stock_kind == "板料") {
        if (item.after_weight != "") {
          item.before_weight = item.after_weight;
        }
      } else if (this.editData.stock_kind == "旧料") {
        if (item.before_weight != "" && item.after_weight != "") {
          if (Number(item.after_weight) > Number(item.before_weight)) {
            this.$message.error("熔后毛重不能大于熔前毛重!");
            item.after_weight = "";
          }
        }
      }
    },

    //关联料种类名
    editSelectStockSetKind() {
      let self = this;
      if (self.editData.stock_kind_id != "") {
        self.stockSetKindDataCreate.forEach(item => {
          if (item.id == self.editData.stock_kind_id) {
            self.editData.stock_kind = item.material_name;
          }
        });
      }
      this.editTableData = [];
      this.editTableData.unshift({
        number: 1,
        before_weight: "",
        after_weight: ""
      });
    },
    // 创建预收单保存
    saveFun() {
      let self = this;
      if (this.submitCreatData.customer_id == "") {
        self.$message.error("请选择来料单位！");
        return;
      }

      if (this.submitCreatData.customer_id != "") {
        this.customerData.forEach(item => {
          if (item.companyId == self.submitCreatData.customer_id) {
            self.submitCreatData.customer_name = item.companyName;
          }
        });
      }
      this.submitCreatData.inputStockOrderLines = this.inputStockOrderLines;
      this.$axios
        .post(this.$portMain + "/stock/NaddInputStock", self.submitCreatData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdPlanType = false;
              self.displayAllData(1, 15);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 编辑预收单保存
    editSaveFun() {
      let self = this;
      this.editData.inputStockOrderLines = this.editTableData;
      if (this.editData.customer_id == "") {
        self.$message.error("请选择来料单位！");
        return;
      }
      this.customerData.forEach(item => {
        if (item.companyId == self.editData.customer_id) {
          self.editData.customer_name = item.companyName;
        }
      });
      this.editBtnLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/NupdateInputStock", self.editData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.editPlanType = false;
              self.editBtnLoading = false;
              self.displayAllData(1, 15);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.editBtnLoading = false;
          }
        });
    },
    // 创建预收单提交
    subFun() {
      let self = this;
      if (this.submitCreatData.customer_id != "") {
        this.customerData.forEach(item => {
          if (item.companyId == self.submitCreatData.customer_id) {
            self.submitCreatData.customer_name = item.companyName;
          }
        });
      }
      if (this.submitCreatData.customer_id == "") {
        self.$message.error("请选择来料单位！");
        return;
      }
      if (this.submitCreatData.stock_kind_id == "") {
        self.$message.error("请选择料种类！");
        return;
      }
      let result = false;
      this.inputStockOrderLines.forEach(item => {
        if (item.after_weight == "" || item.before_weight == "") {
          result = true;
          return;
        }
      });
      if (result) {
        self.$message.error("请填写毛重数据！");
        return;
      }
      this.submitCreatData.inputStockOrderLines = this.inputStockOrderLines;
      this.btnLoading = true;
      this.$axios
        .post(this.$portMain + "/stock/NsubmitInputStock", self.submitCreatData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.createdPlanType = false;
              self.btnLoading = false;
              self.displayAllData(1, 15);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.btnLoading = false;
          }
        });
    },
    // 编辑预收单提交
    editSubFun() {
      let self = this;
      this.editData.inputStockOrderLines = this.editTableData;
      if (this.editData.customer_id == "") {
        self.$message.warning("请选择来料单位！");
        return;
      }

      this.customerData.forEach(item => {
        if (item.companyId == self.editData.customer_id) {
          self.editData.customer_name = item.companyName;
        }
      });

      let result = false;
      this.editTableData.forEach(item => {
        if (item.after_weight == "" || item.before_weight == "") {
          result = true;
          return;
        }
      });
      if (result) {
        self.$message.warning("请填写毛重数据！");
      }
      //self.editData.create_time = self.$api.dateGetDayTime(self.editData.create_time);
      delete self.editData.create_time;
      delete self.editData.update_time;
      //return
      this.$axios
        .post(this.$portMain + "/stock/NsubmitInputStock", self.editData)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.editPlanType = false;
              self.displayAllData(1, 15);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 作废
    toVoid() {
      let self = this;
      let params = {
        PRS: {
          inputStockId: self.goldDetail.id
        }
      };
      this.voidBtnLoading = true;
      this.$axios
        .get(this.$portMain + "/stock/NcancellationInputStock", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.$message.success(res.data.msg);
            setTimeout(function() {
              self.goldDetailType = false;
              self.voidBtnLoading = false;
              self.displayAllData(1, 15);
            }, 2000);
          } else {
            self.$message.error(res.data.msg);
            self.voidBtnLoading = false;
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
    // 查询金料种类
    findStockSetKind() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListesay")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindData = res.data.data;
            self.stockSetKindData.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 查询预收金料种类
    findStockSetKindCreat() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetKindListOldB")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetKindDataCreate = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //查询金料类型
    stockSetFun() {
      let self = this;
      this.$axios
        .get(this.$portMain + "/stock/stockSetTypeList")
        .then(function(res) {
          if (res.data.code == 200) {
            self.stockSetTypeList = res.data.data;
            self.stockSetTypeList.unshift({
              id: "",
              material_name: "全部"
            });
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    //来料单位
    customerDataFun() {
      let self = this;
      let params = {
        PRS: {
          companyId: self.submitCreatData.company_id,
          keyWord: ""
        }
      };
      this.$axios
        .get(this.$portMain + "/company/queryRawClients", params)
        .then(function(res) {
          if (res.data.code == 200) {
            self.customerData = res.data.data;
          } else {
            self.$message.error(res.data.msg);
          }
        });
    },
    // 下拉搜索
    remoteMethod(query) {
      let self = this;
      if (query !== "") {
        self.serachLoading = true;
        let params = {
          PRS: {
            clientScope: "",
            keyWord: query
          }
        };
        self.$axios
          .get(self.$portMain + "/client/rawClientSimple", params)
          .then(function(res) {
            if (res.data.code == 200) {
              self.customerData = res.data.data;
              self.serachLoading = false;
            } else {
              self.$message.error(res.data.msg);
            }
          });
      } else {
        self.customerData = [];
      }
    },
    //关联来料单位
    selectCustomer() {
      let self = this;
      if (this.submitCreatData.customer_id != "") {
        this.customerData.forEach(item => {
          if (item.companyId == self.submitCreatData.customer_id) {
            self.submitCreatData.customer_name = item.companyName;
          }
        });
      }
    },
    // 来料单位删除(编辑)
    customeSelect(e) {
      if (e.keyCode == 8) {
        this.editData.customer_id = "";
        this.customerData = [];
      }
    },
    // 来料单位删除(新增)
    newCustomeSelect(e) {
      if (e.keyCode == 8) {
        this.submitCreatData.customer_id = "";
        this.customerData = [];
      }
    },
    //关联料种类名
    selectStockSetKind() {
      let self = this;
      if (self.submitCreatData.stock_kind_id != "") {
        self.stockSetKindDataCreate.forEach(item => {
          if (item.id == self.submitCreatData.stock_kind_id) {
            self.submitCreatData.stock_kind = item.material_name;
          }
        });
      }
      this.inputStockOrderLines = [];
      this.inputStockOrderLines.unshift({
        number: 1,
        before_weight: "",
        after_weight: ""
      });
    },
    //权限判断
    powerFun() {
      let self = this;
      this.powerCreat = this.$api.setPowerSpot(
        self.$store.state.queryVerify,
        "stock-input-add"
      );
    }
  },
  filters: {
    filterProperty(val) {
      switch (val) {
        case "RECE_BASIC":
          return "收客户旧料";
        case "RECE_BUY":
          return "购料";
        case "RECE_BOOROW":
          return "借料";
        default:
          return "--";
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

  .marginBottom20 {
    margin-bottom: 20px;
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
    // margin-left: 31px;
  }

  .titleFont {
    color: #8A8E99;
    font-size: 14px;
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

  .noteStyle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
